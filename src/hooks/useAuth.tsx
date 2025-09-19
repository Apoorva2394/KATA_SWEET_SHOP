import { createContext, useContext, useEffect, useState } from 'react'
import { User, Session } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'

interface AuthContextType {
  user: User | null
  session: Session | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<any>
  signUp: (email: string, password: string, fullName: string) => Promise<any>
  signOut: () => Promise<void>
  resendConfirmation: (email: string) => Promise<any>
  isAdmin: boolean
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  loading: true,
  signIn: async () => {},
  signUp: async () => {},
  signOut: async () => {},
  resendConfirmation: async () => {},
  isAdmin: false,
})

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setUser(session?.user ?? null)
      setLoading(false)
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setSession(session)
      setUser(session?.user ?? null)
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  useEffect(() => {
    const ensureProfileAndCheckAdmin = async () => {
      if (!user) {
        setIsAdmin(false)
        return
      }

      // Try to get existing profile
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('id,is_admin')
        .eq('id', user.id)
        .single()

      if (error && error.code === 'PGRST116') {
        // No profile row exists; create one so admin flag can be managed
        await supabase.from('profiles').insert({
          id: user.id,
          email: user.email ?? '',
          full_name: user.user_metadata?.full_name || null,
          is_admin: false,
        })
        setIsAdmin(false)
        return
      }

      setIsAdmin(!!profile?.is_admin)
    }

    ensureProfileAndCheckAdmin()
  }, [user])

  const signIn = async (email: string, password: string) => {
    return await supabase.auth.signInWithPassword({ email, password })
  }

  const signUp = async (email: string, password: string, fullName: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    })

    if (!error && data.user) {
      // Create profile
      await supabase
        .from('profiles')
        .insert({
          id: data.user.id,
          email,
          full_name: fullName,
          is_admin: false,
        })
    }

    return { data, error }
  }

  const signOut = async () => {
    await supabase.auth.signOut()
  }

  const resendConfirmation = async (email: string) => {
    return await supabase.auth.resend({
      type: 'signup',
      email: email,
    })
  }

  const value = {
    user,
    session,
    loading,
    signIn,
    signUp,
    signOut,
    resendConfirmation,
    isAdmin,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

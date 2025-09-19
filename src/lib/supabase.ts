import { createClient } from '@supabase/supabase-js'

// Prefer environment variables so different deployments work without code changes
const supabaseUrl = (import.meta as any).env?.VITE_SUPABASE_URL as string
const supabaseAnonKey = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY as string

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Database = {
  public: {
    Tables: {
      products: {
        Row: {
          id: string
          name: string
          category: string
          price: number
          image: string
          rating: number
          in_stock: number
          description: string
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          category: string
          price: number
          image: string
          rating?: number
          in_stock: number
          description: string
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          category?: string
          price?: number
          image?: string
          rating?: number
          in_stock?: number
          description?: string
          created_at?: string
        }
      }
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          avatar_url: string | null
          is_admin: boolean
          created_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          avatar_url?: string | null
          is_admin?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          avatar_url?: string | null
          is_admin?: boolean
          created_at?: string
        }
      }
    }
  }
}
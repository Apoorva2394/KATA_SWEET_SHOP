import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { useAuth } from './useAuth'
import { useToast } from './use-toast'

interface CartItem {
  id: string
  name: string
  price: number
  image: string
  quantity: number
  category: string
}

interface CartContextType {
  cart: CartItem[]
  cartCount: number
  cartTotal: number
  isCartOpen: boolean
  addToCart: (product: Omit<CartItem, 'quantity'>) => void
  removeFromCart: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  clearCart: () => void
  openCart: () => void
  closeCart: () => void
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export const useCart = () => {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>([])
  const [isCartOpen, setIsCartOpen] = useState(false)
  const { user } = useAuth()
  const { toast } = useToast()

  // Load cart from localStorage on mount
  useEffect(() => {
    if (user) {
      const savedCart = localStorage.getItem(`cart_${user.id}`)
      if (savedCart) {
        try {
          setCart(JSON.parse(savedCart))
        } catch (error) {
          console.error('Error loading cart:', error)
        }
      }
    } else {
      setCart([])
    }
  }, [user])

  // Save cart to localStorage when cart changes
  useEffect(() => {
    if (user && cart.length > 0) {
      localStorage.setItem(`cart_${user.id}`, JSON.stringify(cart))
    } else if (user && cart.length === 0) {
      localStorage.removeItem(`cart_${user.id}`)
    }
  }, [cart, user])

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0)
  const cartTotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0)

  const addToCart = (product: Omit<CartItem, 'quantity'>) => {
    if (!user) {
      toast({
        title: "Please sign in",
        description: "You need to sign in to add items to your cart.",
        variant: "destructive",
      })
      return
    }

    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === product.id)

      if (existingItem) {
        // Increase quantity if item already exists
        return prevCart.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      } else {
        // Add new item
        return [...prevCart, { ...product, quantity: 1 }]
      }
    })

    toast({
      title: "Added to cart!",
      description: `${product.name} has been added to your cart.`,
    })
  }

  const removeFromCart = (id: string) => {
    setCart(prevCart => prevCart.filter(item => item.id !== id))

    toast({
      title: "Removed from cart",
      description: "Item has been removed from your cart.",
    })
  }

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id)
      return
    }

    setCart(prevCart =>
      prevCart.map(item =>
        item.id === id ? { ...item, quantity } : item
      )
    )
  }

  const clearCart = () => {
    setCart([])
    toast({
      title: "Cart cleared",
      description: "All items have been removed from your cart.",
    })
  }

  const openCart = () => setIsCartOpen(true)
  const closeCart = () => setIsCartOpen(false)

  const value = {
    cart,
    cartCount,
    cartTotal,
    isCartOpen,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    openCart,
    closeCart,
  }

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  )
}
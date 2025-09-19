import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useToast } from '@/hooks/use-toast'

export interface Product {
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

export const useProducts = () => {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()

  const fetchProducts = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error

      setProducts(data || [])
    } catch (err: any) {
      setError(err.message)
      toast({
        title: "Error loading products",
        description: err.message,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const addProduct = async (product: Omit<Product, 'id' | 'created_at'>) => {
    try {
      const { error } = await supabase
        .from('products')
        .insert([product])

      if (error) throw error

      toast({
        title: "Product added successfully!",
        description: `${product.name} has been added to the catalog.`,
      })

      fetchProducts() // Refresh the list
    } catch (err: any) {
      toast({
        title: "Error adding product",
        description: err.message,
        variant: "destructive",
      })
    }
  }

  const updateProduct = async (id: string, updates: Partial<Product>) => {
    try {
      const { error } = await supabase
        .from('products')
        .update(updates)
        .eq('id', id)

      if (error) throw error

      toast({
        title: "Product updated successfully!",
      })

      fetchProducts() // Refresh the list
    } catch (err: any) {
      toast({
        title: "Error updating product",
        description: err.message,
        variant: "destructive",
      })
    }
  }

  const deleteProduct = async (id: string) => {
    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id)

      if (error) throw error

      toast({
        title: "Product deleted successfully!",
      })

      fetchProducts() // Refresh the list
    } catch (err: any) {
      toast({
        title: "Error deleting product",
        description: err.message,
        variant: "destructive",
      })
    }
  }

  const purchaseProduct = async (id: string, quantity: number = 1) => {
    try {
      const product = products.find(p => p.id === id)
      if (!product) throw new Error('Product not found')
      
      if (product.in_stock < quantity) {
        throw new Error('Not enough stock available')
      }

      const { error } = await supabase
        .from('products')
        .update({ in_stock: product.in_stock - quantity })
        .eq('id', id)

      if (error) throw error

      toast({
        title: "Purchase successful!",
        description: `You've purchased ${quantity} ${product.name}(s).`,
      })

      fetchProducts() // Refresh the list
    } catch (err: any) {
      toast({
        title: "Purchase failed",
        description: err.message,
        variant: "destructive",
      })
    }
  }

  useEffect(() => {
    fetchProducts()
  }, [])

  return {
    products,
    loading,
    error,
    fetchProducts,
    addProduct,
    updateProduct,
    deleteProduct,
    purchaseProduct,
  }
}
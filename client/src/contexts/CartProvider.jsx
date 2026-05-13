import { useCallback, useEffect, useMemo, useState } from 'react'
import { AUTH_LOGOUT_EVENT } from '@/constants/storageKeys.js'
import { useAuth } from '@/hooks/useAuth.js'
import * as cartService from '@/services/cartService.js'
import { CartContext } from '@/contexts/cart-context.js'

export function CartProvider({ children }) {
  const { isAuthenticated, bootstrapped } = useAuth()
  const [cart, setCart] = useState(null)
  const [loading, setLoading] = useState(false)
  const [mutating, setMutating] = useState(false)

  const refreshCart = useCallback(async () => {
    if (!isAuthenticated) {
      setCart(null)
      return null
    }
    setLoading(true)
    try {
      const next = await cartService.fetchCart()
      setCart(next)
      return next
    } catch {
      setCart(null)
      return null
    } finally {
      setLoading(false)
    }
  }, [isAuthenticated])

  useEffect(() => {
    if (!bootstrapped) return undefined
    const handle = window.setTimeout(() => {
      void refreshCart()
    }, 0)
    return () => window.clearTimeout(handle)
  }, [bootstrapped, isAuthenticated, refreshCart])

  useEffect(() => {
    function onLogout() {
      setCart(null)
    }
    window.addEventListener(AUTH_LOGOUT_EVENT, onLogout)
    return () => window.removeEventListener(AUTH_LOGOUT_EVENT, onLogout)
  }, [])

  const addToCart = useCallback(
    async ({ productId, quantity = 1 }) => {
      setMutating(true)
      try {
        const next = await cartService.addToCartRequest({ productId, quantity })
        setCart(next)
        return next
      } finally {
        setMutating(false)
      }
    },
    [],
  )

  const updateQuantity = useCallback(async (itemId, quantity) => {
    setMutating(true)
    try {
      const next = await cartService.updateCartItemRequest(itemId, quantity)
      setCart(next)
      return next
    } finally {
      setMutating(false)
    }
  }, [])

  const removeItem = useCallback(async (itemId) => {
    setMutating(true)
    try {
      const next = await cartService.removeCartItemRequest(itemId)
      setCart(next)
      return next
    } finally {
      setMutating(false)
    }
  }, [])

  const clearCart = useCallback(async () => {
    setMutating(true)
    try {
      const next = await cartService.clearCartRequest()
      setCart(next)
      return next
    } finally {
      setMutating(false)
    }
  }, [])

  const value = useMemo(
    () => ({
      cart,
      loading,
      mutating,
      itemCount: cart?.itemCount ?? 0,
      refreshCart,
      addToCart,
      updateQuantity,
      removeItem,
      clearCart,
    }),
    [cart, loading, mutating, refreshCart, addToCart, updateQuantity, removeItem, clearCart],
  )

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

import { useCallback, useEffect, useMemo, useState } from 'react'
import { AUTH_LOGOUT_EVENT } from '@/constants/storageKeys.js'
import { useAuth } from '@/hooks/useAuth.js'
import * as wishlistService from '@/services/wishlistService.js'
import { WishlistContext } from '@/contexts/wishlist-context.js'

export function WishlistProvider({ children }) {
  const { isAuthenticated, bootstrapped } = useAuth()
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(false)
  const [mutating, setMutating] = useState(false)

  const refreshWishlist = useCallback(async () => {
    if (!isAuthenticated) {
      setProducts([])
      return []
    }
    setLoading(true)
    try {
      const next = await wishlistService.fetchWishlist()
      setProducts(next)
      return next
    } catch {
      setProducts([])
      return []
    } finally {
      setLoading(false)
    }
  }, [isAuthenticated])

  useEffect(() => {
    if (!bootstrapped) return undefined
    const handle = window.setTimeout(() => {
      void refreshWishlist()
    }, 0)
    return () => window.clearTimeout(handle)
  }, [bootstrapped, isAuthenticated, refreshWishlist])

  useEffect(() => {
    function onLogout() {
      setProducts([])
    }
    window.addEventListener(AUTH_LOGOUT_EVENT, onLogout)
    return () => window.removeEventListener(AUTH_LOGOUT_EVENT, onLogout)
  }, [])

  const addProduct = useCallback(async (productId) => {
    setMutating(true)
    try {
      const next = await wishlistService.addToWishlistRequest(productId)
      setProducts(next)
      return next
    } finally {
      setMutating(false)
    }
  }, [])

  const removeProduct = useCallback(async (productId) => {
    setMutating(true)
    try {
      const next = await wishlistService.removeFromWishlistRequest(productId)
      setProducts(next)
      return next
    } finally {
      setMutating(false)
    }
  }, [])

  const toggleWishlist = useCallback(
    async (productId) => {
      const exists = products.some((p) => p.id === productId)
      if (exists) return removeProduct(productId)
      return addProduct(productId)
    },
    [products, addProduct, removeProduct],
  )

  const isInWishlist = useCallback(
    (productId) => products.some((p) => p.id === productId),
    [products],
  )

  const value = useMemo(
    () => ({
      products,
      loading,
      mutating,
      refreshWishlist,
      addProduct,
      removeProduct,
      toggleWishlist,
      isInWishlist,
    }),
    [products, loading, mutating, refreshWishlist, addProduct, removeProduct, toggleWishlist, isInWishlist],
  )

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>
}

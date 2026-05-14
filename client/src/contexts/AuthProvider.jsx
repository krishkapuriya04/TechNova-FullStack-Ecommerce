import { useCallback, useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { ROUTES } from '@/constants/routes.js'
import { AUTH_LOGOUT_EVENT, STORAGE_KEYS } from '@/constants/storageKeys.js'
import * as authService from '@/services/authService.js'
import { getErrorMessage } from '@/utils/apiError.js'
import { AuthContext } from '@/contexts/auth-context.js'

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [bootstrapped, setBootstrapped] = useState(false)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    function handleForcedLogout() {
      setUser(null)
    }
    window.addEventListener(AUTH_LOGOUT_EVENT, handleForcedLogout)
    return () => window.removeEventListener(AUTH_LOGOUT_EVENT, handleForcedLogout)
  }, [])

  useEffect(() => {
    let active = true

    async function bootstrap() {
      const token = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN)
      const cached = localStorage.getItem(STORAGE_KEYS.AUTH_USER)

      if (cached) {
        try {
          setUser(JSON.parse(cached))
        } catch {
          localStorage.removeItem(STORAGE_KEYS.AUTH_USER)
        }
      }

      if (!token) {
        if (active) setBootstrapped(true)
        return
      }

      try {
        const { user: fresh } = await authService.fetchCurrentUser()
        if (!active) return
        setUser(fresh)
        localStorage.setItem(STORAGE_KEYS.AUTH_USER, JSON.stringify(fresh))
      } catch {
        if (!active) return
        localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN)
        localStorage.removeItem(STORAGE_KEYS.AUTH_USER)
        setUser(null)
      } finally {
        if (active) setBootstrapped(true)
      }
    }

    bootstrap()
    return () => {
      active = false
    }
  }, [])

  const persistSession = useCallback((session) => {
    localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, session.accessToken)
    localStorage.setItem(STORAGE_KEYS.AUTH_USER, JSON.stringify(session.user))
    setUser(session.user)
  }, [])

  const login = useCallback(
    async (payload, options = {}) => {
      setLoading(true)
      try {
        const session = await authService.login(payload)
        persistSession(session)
        toast.success('Welcome back!')
        navigate(options.redirectTo ?? ROUTES.HOME, { replace: true })
        return session
      } catch (err) {
        toast.error(getErrorMessage(err, 'Unable to sign in'))
        throw err
      } finally {
        setLoading(false)
      }
    },
    [navigate, persistSession],
  )

  const register = useCallback(
    async (payload, options = {}) => {
      setLoading(true)
      try {
        const session = await authService.register(payload)
        persistSession(session)
        toast.success('Account created!')
        navigate(options.redirectTo ?? ROUTES.HOME, { replace: true })
        return session
      } catch (err) {
        toast.error(getErrorMessage(err, 'Unable to create account'))
        throw err
      } finally {
        setLoading(false)
      }
    },
    [navigate, persistSession],
  )

  const logout = useCallback(() => {
    localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN)
    localStorage.removeItem(STORAGE_KEYS.AUTH_USER)
    setUser(null)
    toast.success('Signed out')
    navigate(ROUTES.HOME, { replace: true })
  }, [navigate])

  const updateProfile = useCallback(async (payload) => {
    setLoading(true)
    try {
      const fresh = await authService.updateProfileRequest(payload)
      setUser(fresh)
      localStorage.setItem(STORAGE_KEYS.AUTH_USER, JSON.stringify(fresh))
      toast.success('Profile saved')
      return fresh
    } catch (err) {
      toast.error(getErrorMessage(err, 'Unable to update profile'))
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      bootstrapped,
      loading,
      login,
      register,
      logout,
      updateProfile,
    }),
    [user, bootstrapped, loading, login, register, logout, updateProfile],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

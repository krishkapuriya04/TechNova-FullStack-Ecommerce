import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { ROUTES } from '@/constants/routes.js'
import { useAuth } from '@/hooks/useAuth.js'
import { PageLoader } from '@/components/ui/PageLoader.jsx'

export function ProtectedRoute() {
  const { isAuthenticated, bootstrapped } = useAuth()
  const location = useLocation()

  if (!bootstrapped) {
    return <PageLoader label="Checking your session…" />
  }

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.AUTH_LOGIN} replace state={{ from: location }} />
  }

  return <Outlet />
}

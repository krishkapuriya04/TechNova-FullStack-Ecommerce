import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { ROUTES } from '@/constants/routes.js'
import { useAuth } from '@/hooks/useAuth.js'
import { PageLoader } from '@/components/ui/PageLoader.jsx'

export function AdminRoute() {
  const { isAuthenticated, bootstrapped, user } = useAuth()
  const location = useLocation()

  if (!bootstrapped) {
    return <PageLoader label="Verifying access…" />
  }

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.AUTH_LOGIN} replace state={{ from: location }} />
  }

  if (user?.role !== 'admin') {
    return <Navigate to={ROUTES.HOME} replace />
  }

  return <Outlet />
}

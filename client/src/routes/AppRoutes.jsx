import { Route, Routes } from 'react-router-dom'
import { MainLayout } from '@/layouts/MainLayout.jsx'
import { HomePage } from '@/pages/home/HomePage.jsx'
import { NotFoundPage } from '@/pages/notFound/NotFoundPage.jsx'
import { PlaceholderPage } from '@/pages/PlaceholderPage.jsx'
import { ROUTES } from '@/constants/routes.js'

export function AppRoutes() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path={ROUTES.HOME} element={<HomePage />} />
        <Route path={ROUTES.SHOP} element={<PlaceholderPage />} />
        <Route path={ROUTES.CART} element={<PlaceholderPage />} />
        <Route path={ROUTES.WISHLIST} element={<PlaceholderPage />} />
        <Route path={ROUTES.ORDERS} element={<PlaceholderPage />} />
        <Route path={ROUTES.ADMIN} element={<PlaceholderPage />} />
        <Route path={ROUTES.AUTH_LOGIN} element={<PlaceholderPage />} />
        <Route path={ROUTES.AUTH_REGISTER} element={<PlaceholderPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  )
}

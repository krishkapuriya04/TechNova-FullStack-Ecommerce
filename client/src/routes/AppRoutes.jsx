import { Route, Routes } from 'react-router-dom'
import { MainLayout } from '@/layouts/MainLayout.jsx'
import { AuthLayout } from '@/layouts/AuthLayout.jsx'
import { HomePage } from '@/pages/home/HomePage.jsx'
import { NotFoundPage } from '@/pages/notFound/NotFoundPage.jsx'
import { PlaceholderPage } from '@/pages/PlaceholderPage.jsx'
import { LoginPage } from '@/pages/auth/LoginPage.jsx'
import { RegisterPage } from '@/pages/auth/RegisterPage.jsx'
import { ShopPage } from '@/pages/shop/ShopPage.jsx'
import { ProductDetailsPage } from '@/pages/shop/ProductDetailsPage.jsx'
import { WishlistPage } from '@/pages/wishlist/WishlistPage.jsx'
import { OrdersPage } from '@/pages/orders/OrdersPage.jsx'
import { CheckoutPage } from '@/pages/checkout/CheckoutPage.jsx'
import { ProfilePage } from '@/pages/profile/ProfilePage.jsx'
import { ProtectedRoute } from '@/components/routing/ProtectedRoute.jsx'
import { ROUTES } from '@/constants/routes.js'

export function AppRoutes() {
  return (
    <Routes>
      <Route element={<AuthLayout />}>
        <Route path={ROUTES.AUTH_LOGIN} element={<LoginPage />} />
        <Route path={ROUTES.AUTH_REGISTER} element={<RegisterPage />} />
      </Route>

      <Route element={<MainLayout />}>
        <Route path={ROUTES.HOME} element={<HomePage />} />
        <Route path={ROUTES.SHOP} element={<ShopPage />} />
        <Route path={ROUTES.PRODUCT} element={<ProductDetailsPage />} />
        <Route path={ROUTES.CART} element={<PlaceholderPage />} />

        <Route element={<ProtectedRoute />}>
          <Route path={ROUTES.WISHLIST} element={<WishlistPage />} />
          <Route path={ROUTES.ORDERS} element={<OrdersPage />} />
          <Route path={ROUTES.CHECKOUT} element={<CheckoutPage />} />
          <Route path={ROUTES.PROFILE} element={<ProfilePage />} />
        </Route>

        <Route path={ROUTES.ADMIN} element={<PlaceholderPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  )
}

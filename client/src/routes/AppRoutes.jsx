import { lazy, Suspense } from 'react'
import { Route, Routes } from 'react-router-dom'
import { MainLayout } from '@/layouts/MainLayout.jsx'
import { AuthLayout } from '@/layouts/AuthLayout.jsx'
import { AdminLayout } from '@/layouts/AdminLayout.jsx'
import { ProtectedRoute } from '@/components/routing/ProtectedRoute.jsx'
import { AdminRoute } from '@/components/routing/AdminRoute.jsx'
import { PageLoader } from '@/components/ui/PageLoader.jsx'
import { ROUTES } from '@/constants/routes.js'

const HomePage = lazy(() => import('@/pages/home/HomePage.jsx').then((m) => ({ default: m.HomePage })))
const NotFoundPage = lazy(() => import('@/pages/notFound/NotFoundPage.jsx').then((m) => ({ default: m.NotFoundPage })))
const LoginPage = lazy(() => import('@/pages/auth/LoginPage.jsx').then((m) => ({ default: m.LoginPage })))
const RegisterPage = lazy(() => import('@/pages/auth/RegisterPage.jsx').then((m) => ({ default: m.RegisterPage })))
const ShopPage = lazy(() => import('@/pages/shop/ShopPage.jsx').then((m) => ({ default: m.ShopPage })))
const ProductDetailsPage = lazy(() =>
  import('@/pages/shop/ProductDetailsPage.jsx').then((m) => ({ default: m.ProductDetailsPage })),
)
const WishlistPage = lazy(() => import('@/pages/wishlist/WishlistPage.jsx').then((m) => ({ default: m.WishlistPage })))
const OrdersPage = lazy(() => import('@/pages/orders/OrdersPage.jsx').then((m) => ({ default: m.OrdersPage })))
const OrderDetailPage = lazy(() =>
  import('@/pages/orders/OrderDetailPage.jsx').then((m) => ({ default: m.OrderDetailPage })),
)
const CheckoutPage = lazy(() => import('@/pages/checkout/CheckoutPage.jsx').then((m) => ({ default: m.CheckoutPage })))
const CheckoutSuccessPage = lazy(() =>
  import('@/pages/checkout/CheckoutSuccessPage.jsx').then((m) => ({ default: m.CheckoutSuccessPage })),
)
const CartPage = lazy(() => import('@/pages/cart/CartPage.jsx').then((m) => ({ default: m.CartPage })))
const ProfilePage = lazy(() => import('@/pages/profile/ProfilePage.jsx').then((m) => ({ default: m.ProfilePage })))
const AdminDashboardPage = lazy(() =>
  import('@/pages/admin/AdminDashboardPage.jsx').then((m) => ({ default: m.AdminDashboardPage })),
)
const AdminProductsPage = lazy(() =>
  import('@/pages/admin/AdminProductsPage.jsx').then((m) => ({ default: m.AdminProductsPage })),
)
const AdminOrdersPage = lazy(() =>
  import('@/pages/admin/AdminOrdersPage.jsx').then((m) => ({ default: m.AdminOrdersPage })),
)
const AdminUsersPage = lazy(() =>
  import('@/pages/admin/AdminUsersPage.jsx').then((m) => ({ default: m.AdminUsersPage })),
)
const AdminAnalyticsPage = lazy(() =>
  import('@/pages/admin/AdminAnalyticsPage.jsx').then((m) => ({ default: m.AdminAnalyticsPage })),
)
const AdminSettingsPage = lazy(() =>
  import('@/pages/admin/AdminSettingsPage.jsx').then((m) => ({ default: m.AdminSettingsPage })),
)

const routeFallback = <PageLoader label="Loading view…" />

export function AppRoutes() {
  return (
    <Suspense fallback={routeFallback}>
      <Routes>
        <Route element={<AuthLayout />}>
          <Route path={ROUTES.AUTH_LOGIN} element={<LoginPage />} />
          <Route path={ROUTES.AUTH_REGISTER} element={<RegisterPage />} />
        </Route>

        <Route path={ROUTES.ADMIN} element={<AdminRoute />}>
          <Route element={<AdminLayout />}>
            <Route index element={<AdminDashboardPage />} />
            <Route path="products" element={<AdminProductsPage />} />
            <Route path="orders" element={<AdminOrdersPage />} />
            <Route path="users" element={<AdminUsersPage />} />
            <Route path="analytics" element={<AdminAnalyticsPage />} />
            <Route path="settings" element={<AdminSettingsPage />} />
          </Route>
        </Route>

        <Route element={<MainLayout />}>
          <Route path={ROUTES.HOME} element={<HomePage />} />
          <Route path={ROUTES.SHOP} element={<ShopPage />} />
          <Route path={ROUTES.PRODUCT} element={<ProductDetailsPage />} />

          <Route element={<ProtectedRoute />}>
            <Route path={ROUTES.CART} element={<CartPage />} />
            <Route path={ROUTES.WISHLIST} element={<WishlistPage />} />
            <Route path={ROUTES.ORDERS} element={<OrdersPage />} />
            <Route path={ROUTES.ORDER_DETAIL} element={<OrderDetailPage />} />
            <Route path={ROUTES.CHECKOUT} element={<CheckoutPage />} />
            <Route path={ROUTES.CHECKOUT_SUCCESS} element={<CheckoutSuccessPage />} />
            <Route path={ROUTES.PROFILE} element={<ProfilePage />} />
          </Route>

          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </Suspense>
  )
}

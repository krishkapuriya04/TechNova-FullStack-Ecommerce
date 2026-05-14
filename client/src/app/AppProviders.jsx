import { Toaster } from 'react-hot-toast'
import { BrowserRouter } from 'react-router-dom'
import { Helmet, HelmetProvider } from 'react-helmet-async'
import { AuthProvider } from '@/contexts/AuthProvider.jsx'
import { CartProvider } from '@/contexts/CartProvider.jsx'
import { WishlistProvider } from '@/contexts/WishlistProvider.jsx'
import { NotificationProvider } from '@/contexts/NotificationProvider.jsx'
import { env } from '@/config/env.js'
import { SEO_DEFAULTS } from '@/constants/seoDefaults.js'
import { ScrollToTop } from '@/components/routing/ScrollToTop.jsx'

export function AppProviders({ children }) {
  return (
    <HelmetProvider>
      <Helmet titleTemplate={`%s · ${env.siteName}`} defaultTitle={env.siteName}>
        <meta name="description" content={SEO_DEFAULTS.description} />
      </Helmet>
      <BrowserRouter>
        <NotificationProvider>
          <ScrollToTop />
          <AuthProvider>
            <CartProvider>
              <WishlistProvider>
                {children}
                <Toaster
                  position="top-right"
                  toastOptions={{
                    className:
                      'bg-white text-zinc-900 dark:bg-tn-900 dark:text-zinc-100 border border-zinc-200 dark:border-white/10 text-sm',
                  }}
                />
              </WishlistProvider>
            </CartProvider>
          </AuthProvider>
        </NotificationProvider>
      </BrowserRouter>
    </HelmetProvider>
  )
}

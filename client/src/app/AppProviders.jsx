import { Toaster } from 'react-hot-toast'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from '@/contexts/AuthProvider.jsx'
import { CartProvider } from '@/contexts/CartProvider.jsx'
import { WishlistProvider } from '@/contexts/WishlistProvider.jsx'

export function AppProviders({ children }) {
  return (
    <BrowserRouter>
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
    </BrowserRouter>
  )
}

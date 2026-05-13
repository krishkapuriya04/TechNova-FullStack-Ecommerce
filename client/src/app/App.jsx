import { ErrorBoundary } from '@/components/routing/ErrorBoundary.jsx'
import { AppProviders } from '@/app/AppProviders.jsx'
import { AppRoutes } from '@/routes/AppRoutes.jsx'

export default function App() {
  return (
    <ErrorBoundary>
      <AppProviders>
        <AppRoutes />
      </AppProviders>
    </ErrorBoundary>
  )
}

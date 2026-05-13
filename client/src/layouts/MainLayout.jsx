import { Outlet } from 'react-router-dom'
import { Footer } from '@/components/layout/Footer.jsx'
import { Navbar } from '@/components/layout/Navbar.jsx'

export function MainLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-zinc-50 dark:bg-tn-void">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}

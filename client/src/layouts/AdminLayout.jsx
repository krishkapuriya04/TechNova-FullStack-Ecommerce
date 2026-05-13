import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { AdminSidebar, AdminMobileSidebar } from '@/components/admin/AdminSidebar.jsx'
import { AdminTopbar } from '@/components/admin/AdminTopbar.jsx'

export function AdminLayout() {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <div className="min-h-screen bg-gradient-to-br from-tn-void via-zinc-950 to-black text-zinc-100">
      <AdminMobileSidebar open={mobileOpen} onClose={() => setMobileOpen(false)} />
      <div className="flex min-h-screen">
        <AdminSidebar />
        <div className="flex min-h-screen min-w-0 flex-1 flex-col">
          <AdminTopbar onMenu={() => setMobileOpen(true)} />
          <main className="flex-1 overflow-x-auto px-4 pb-12 pt-5 sm:px-6 lg:px-10">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  )
}

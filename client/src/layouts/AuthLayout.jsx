import { Outlet } from 'react-router-dom'

export function AuthLayout() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-zinc-50 dark:bg-tn-void">
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <div className="absolute -left-32 top-0 h-96 w-96 rounded-full bg-indigo-600/25 blur-[140px]" />
        <div className="absolute bottom-0 right-0 h-[28rem] w-[28rem] rounded-full bg-violet-600/20 blur-[150px]" />
      </div>
      <div className="relative mx-auto flex min-h-screen max-w-lg items-center px-4 py-12 sm:px-6">
        <Outlet />
      </div>
    </div>
  )
}

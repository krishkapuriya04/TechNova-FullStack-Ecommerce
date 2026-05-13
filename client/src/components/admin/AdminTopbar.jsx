import { IconMenu } from '@/components/ui/IconSymbols.jsx'
import { ThemeToggle } from '@/components/layout/ThemeToggle.jsx'

export function AdminTopbar({ onMenu }) {
  return (
    <header className="sticky top-0 z-40 flex h-14 items-center justify-between gap-4 border-b border-white/10 bg-tn-950/60 px-4 backdrop-blur-xl sm:px-6 lg:px-8">
      <div className="flex items-center gap-3">
        <button
          type="button"
          className="inline-flex h-10 w-10 items-center justify-center rounded-tn border border-white/10 text-white transition hover:bg-white/5 lg:hidden"
          aria-label="Open admin menu"
          onClick={onMenu}
        >
          <IconMenu className="h-5 w-5" />
        </button>
        <p className="text-sm font-semibold text-zinc-200">Control center</p>
      </div>
      <ThemeToggle />
    </header>
  )
}

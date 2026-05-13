import { PrimaryButton } from '@/components/ui/PrimaryButton.jsx'
import { SecondaryButton } from '@/components/ui/SecondaryButton.jsx'
import { ROUTES } from '@/constants/routes.js'

export function EmptyWishlistState() {
  return (
    <div className="flex flex-col items-center justify-center rounded-tn-2xl border border-dashed border-zinc-300/80 bg-white/60 px-8 py-16 text-center dark:border-white/15 dark:bg-tn-900/50">
      <p className="text-lg font-semibold text-zinc-900 dark:text-white">No saved items yet</p>
      <p className="mt-2 max-w-md text-sm text-zinc-600 dark:text-zinc-400">
        Tap the heart on any product to keep it here — perfect for shortlists before you buy.
      </p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <PrimaryButton to={ROUTES.SHOP} className="justify-center">
          Browse shop
        </PrimaryButton>
        <SecondaryButton to={ROUTES.CART}>View cart</SecondaryButton>
      </div>
    </div>
  )
}

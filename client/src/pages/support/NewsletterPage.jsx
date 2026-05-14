import { useState } from 'react'
import toast from 'react-hot-toast'
import { SectionTitle } from '@/components/ui/SectionTitle.jsx'
import { PrimaryButton } from '@/components/ui/PrimaryButton.jsx'

export function NewsletterPage() {
  const [email, setEmail] = useState('')

  function submit(e) {
    e.preventDefault()
    if (!email.trim()) {
      toast.error('Enter an email')
      return
    }
    toast.success('Thanks — ESP integration ships in the next platform milestone.')
    setEmail('')
  }

  return (
    <div className="tn-container tn-section-y max-w-xl">
      <SectionTitle
        eyebrow="Stay current"
        title="Newsletter"
        subtitle="Product drops, coupon drops, and ops notices — backend capture is stubbed for now."
      />
      <form onSubmit={submit} className="mt-10 space-y-4 rounded-tn-2xl border border-zinc-200/80 bg-white/90 p-6 dark:border-white/10 dark:bg-tn-900/80">
        <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-200">
          Email
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-2 w-full rounded-tn border border-zinc-200 px-3 py-2 text-sm dark:border-white/10 dark:bg-tn-900"
            placeholder="you@company.com"
          />
        </label>
        <PrimaryButton type="submit" className="w-full justify-center sm:w-auto">
          Notify me
        </PrimaryButton>
        <p className="text-xs text-zinc-500">No spam — double opt-in will be enforced when the provider is connected.</p>
      </form>
    </div>
  )
}

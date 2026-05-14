import { useCallback, useEffect, useMemo, useState } from 'react'
import toast from 'react-hot-toast'
import { PrimaryButton } from '@/components/ui/PrimaryButton.jsx'
import { SecondaryButton } from '@/components/ui/SecondaryButton.jsx'
import { RatingStars } from '@/components/ui/RatingStars.jsx'
import { useAuth } from '@/hooks/useAuth.js'
import * as reviewService from '@/services/reviewService.js'
import { getErrorMessage } from '@/utils/apiError.js'

function RatingBreakdown({ breakdown, total }) {
  const b = breakdown ?? { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
  const max = Math.max(1, ...[1, 2, 3, 4, 5].map((k) => b[k] ?? 0))
  return (
    <div className="space-y-2">
      {[5, 4, 3, 2, 1].map((star) => {
        const count = b[star] ?? 0
        const pct = total > 0 ? Math.round((count / total) * 100) : 0
        const w = total > 0 ? Math.max(6, (count / max) * 100) : 0
        return (
          <div key={star} className="flex items-center gap-2 text-xs">
            <span className="w-8 tabular-nums text-zinc-500">{star}★</span>
            <div className="h-2 flex-1 overflow-hidden rounded-full bg-zinc-200 dark:bg-white/10">
              <div className="h-full rounded-full bg-sky-500" style={{ width: `${w}%` }} />
            </div>
            <span className="w-10 text-right tabular-nums text-zinc-600 dark:text-zinc-300">{pct}%</span>
          </div>
        )
      })}
    </div>
  )
}

export function ProductReviewsSection({ productId, ratingSummary, onReviewsChanged }) {
  const { isAuthenticated, user } = useAuth()
  const [loading, setLoading] = useState(true)
  const [reviews, setReviews] = useState([])
  const [breakdown, setBreakdown] = useState(null)
  const [rating, setRating] = useState(5)
  const [title, setTitle] = useState('')
  const [comment, setComment] = useState('')
  const [busy, setBusy] = useState(false)

  const load = useCallback(async () => {
    if (!productId) return
    setLoading(true)
    try {
      const payload = await reviewService.fetchProductReviews(productId)
      setReviews(payload.reviews ?? [])
      setBreakdown(payload.breakdown ?? null)
    } catch (err) {
      toast.error(getErrorMessage(err, 'Could not load reviews'))
    } finally {
      setLoading(false)
    }
  }, [productId])

  useEffect(() => {
    const h = window.setTimeout(() => {
      void load()
    }, 0)
    return () => window.clearTimeout(h)
  }, [load])

  const totalFromBreakdown = useMemo(() => {
    if (!breakdown) return ratingSummary?.count ?? 0
    return [1, 2, 3, 4, 5].reduce((s, k) => s + (breakdown[k] ?? 0), 0)
  }, [breakdown, ratingSummary?.count])

  const myReview = useMemo(() => reviews.find((r) => r.user?.id === user?.id), [reviews, user?.id])

  useEffect(() => {
    const h = window.setTimeout(() => {
      if (myReview) {
        setRating(myReview.rating)
        setTitle(myReview.title ?? '')
        setComment(myReview.comment ?? '')
      } else {
        setRating(5)
        setTitle('')
        setComment('')
      }
    }, 0)
    return () => window.clearTimeout(h)
  }, [myReview])

  async function submitReview(e) {
    e.preventDefault()
    if (!isAuthenticated) {
      toast.error('Sign in to leave a review')
      return
    }
    setBusy(true)
    try {
      if (myReview) {
        await reviewService.updateReviewRequest(myReview.id, { rating, title, comment })
        toast.success('Review updated')
      } else {
        await reviewService.createReviewRequest({ productId, rating, title, comment })
        toast.success('Thanks for your review')
      }
      setTitle('')
      setComment('')
      await load()
      onReviewsChanged?.()
    } catch (err) {
      toast.error(getErrorMessage(err, 'Could not save review'))
    } finally {
      setBusy(false)
    }
  }

  async function removeMine() {
    if (!myReview) return
    setBusy(true)
    try {
      await reviewService.deleteReviewRequest(myReview.id)
      toast.success('Review removed')
      await load()
      onReviewsChanged?.()
    } catch (err) {
      toast.error(getErrorMessage(err, 'Could not delete'))
    } finally {
      setBusy(false)
    }
  }

  return (
    <section className="rounded-tn-2xl border border-zinc-200/80 bg-white/90 p-6 shadow-sm dark:border-white/10 dark:bg-tn-900/85">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-white">Ratings & reviews</h2>
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">Verified purchase voices — one review per account.</p>
        </div>
        <RatingStars value={ratingSummary?.average ?? 0} reviewCount={ratingSummary?.count ?? 0} />
      </div>

      <div className="mt-6 grid gap-8 lg:grid-cols-[220px_minmax(0,1fr)]">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">Rating breakdown</p>
          <div className="mt-3">
            <RatingBreakdown breakdown={breakdown} total={totalFromBreakdown} />
          </div>
        </div>
        <div className="space-y-6">
          {isAuthenticated ? (
            <form onSubmit={submitReview} className="rounded-tn-xl border border-zinc-200/80 bg-zinc-50/60 p-4 dark:border-white/10 dark:bg-white/5">
              <p className="text-sm font-semibold text-zinc-900 dark:text-white">{myReview ? 'Edit your review' : 'Write a review'}</p>
              <label className="mt-3 block text-xs font-medium text-zinc-500">
                Rating
                <select
                  value={rating}
                  onChange={(e) => setRating(Number(e.target.value))}
                  className="mt-1 w-full rounded-tn border border-zinc-200 bg-white px-3 py-2 text-sm dark:border-white/10 dark:bg-tn-900"
                >
                  {[5, 4, 3, 2, 1].map((n) => (
                    <option key={n} value={n}>
                      {n} stars
                    </option>
                  ))}
                </select>
              </label>
              <label className="mt-3 block text-xs font-medium text-zinc-500">
                Title (optional)
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="mt-1 w-full rounded-tn border border-zinc-200 bg-white px-3 py-2 text-sm dark:border-white/10 dark:bg-tn-900"
                  maxLength={120}
                />
              </label>
              <label className="mt-3 block text-xs font-medium text-zinc-500">
                Comment
                <textarea
                  required
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="mt-1 min-h-[96px] w-full rounded-tn border border-zinc-200 bg-white px-3 py-2 text-sm dark:border-white/10 dark:bg-tn-900"
                  maxLength={2000}
                  placeholder="What stood out? Shipping, quality, support…"
                />
              </label>
              <div className="mt-3 flex flex-wrap gap-2">
                <PrimaryButton type="submit" disabled={busy}>
                  {busy ? 'Saving…' : myReview ? 'Update review' : 'Post review'}
                </PrimaryButton>
                {myReview ? (
                  <SecondaryButton type="button" disabled={busy} onClick={removeMine}>
                    Delete my review
                  </SecondaryButton>
                ) : null}
              </div>
            </form>
          ) : (
            <p className="text-sm text-zinc-600 dark:text-zinc-400">Sign in to rate this product and share feedback.</p>
          )}

          <div>
            <p className="text-sm font-semibold text-zinc-900 dark:text-white">Community comments</p>
            {loading ? (
              <p className="mt-3 text-sm text-zinc-500">Loading reviews…</p>
            ) : reviews.length === 0 ? (
              <p className="mt-3 text-sm text-zinc-500">No reviews yet — be the first to share your experience.</p>
            ) : (
              <ul className="mt-4 space-y-4">
                {reviews.map((r) => (
                  <li key={r.id} className="rounded-tn border border-zinc-100 bg-white/80 p-4 dark:border-white/5 dark:bg-white/5">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <p className="text-sm font-semibold text-zinc-900 dark:text-white">{r.user?.name ?? 'Member'}</p>
                      <span className="text-xs font-medium text-amber-700 dark:text-amber-300">{r.rating}★</span>
                    </div>
                    {r.title ? <p className="mt-1 text-sm font-medium text-zinc-800 dark:text-zinc-200">{r.title}</p> : null}
                    <p className="mt-2 text-sm leading-relaxed text-zinc-600 dark:text-zinc-300">{r.comment}</p>
                    <p className="mt-2 text-[11px] text-zinc-400">{new Date(r.createdAt).toLocaleString()}</p>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

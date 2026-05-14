import { Component } from 'react'
import { PrimaryButton } from '@/components/ui/PrimaryButton.jsx'

export class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 bg-zinc-50 px-6 py-16 text-center dark:bg-tn-void">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-600 dark:text-sky-300">
            Something went wrong
          </p>
          <h1 className="text-2xl font-semibold text-zinc-900 dark:text-white">We could not load this view</h1>
          <p className="max-w-md text-sm text-zinc-600 dark:text-zinc-400">
            Try refreshing the page. If you were checking out, your cart is still on the server when you are signed in.
          </p>
          <PrimaryButton type="button" onClick={() => window.location.assign('/')}>
            Go home
          </PrimaryButton>
        </div>
      )
    }

    return this.props.children
  }
}

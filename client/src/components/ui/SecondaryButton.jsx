import { Link } from 'react-router-dom'

const sizeStyles = {
  md: 'rounded-full px-6 py-2.5 text-sm font-semibold tracking-wide',
  sm: 'rounded-full px-4 py-2 text-xs font-semibold tracking-wide',
}

export function SecondaryButton({
  children,
  to,
  className = '',
  size = 'md',
  type = 'button',
  ...rest
}) {
  const base = [
    'inline-flex items-center justify-center gap-2 border',
    'border-zinc-200/90 bg-white/80 text-zinc-900 shadow-sm backdrop-blur-md',
    'dark:border-white/[0.12] dark:bg-white/[0.04] dark:text-zinc-100',
    'tn-transition-base hover:border-teal-400/45 hover:bg-white hover:shadow-md',
    'dark:hover:border-teal-400/35 dark:hover:bg-white/[0.07]',
    'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-400/80',
    'active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50',
    sizeStyles[size],
    className,
  ].join(' ')

  if (to) {
    return (
      <Link to={to} className={base} {...rest}>
        {children}
      </Link>
    )
  }

  return (
    <button type={type} className={base} {...rest}>
      {children}
    </button>
  )
}

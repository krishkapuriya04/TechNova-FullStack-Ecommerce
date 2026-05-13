import { Link } from 'react-router-dom'

const sizeStyles = {
  md: 'rounded-tn px-5 py-2.5 text-sm font-semibold',
  sm: 'rounded-tn-sm px-4 py-2 text-xs font-semibold',
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
    'border-zinc-200 bg-white/90 text-zinc-900 shadow-sm',
    'dark:border-white/10 dark:bg-tn-850/80 dark:text-zinc-100',
    'tn-transition-base hover:border-indigo-300/60 hover:bg-zinc-50 dark:hover:border-indigo-400/40 dark:hover:bg-tn-800/90',
    'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-400',
    'active:scale-[0.98]',
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

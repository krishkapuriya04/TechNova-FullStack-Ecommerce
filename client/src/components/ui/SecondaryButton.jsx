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
    'border-zinc-200 bg-white/95 text-zinc-900 shadow-sm',
    'dark:border-white/12 dark:bg-tn-850/85 dark:text-zinc-100',
    'tn-transition-base hover:border-sky-300/70 hover:bg-zinc-50 hover:shadow-md',
    'dark:hover:border-sky-500/35 dark:hover:bg-tn-800/95',
    'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-400',
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

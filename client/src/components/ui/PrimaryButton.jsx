import { Link } from 'react-router-dom'

const sizeStyles = {
  md: 'rounded-full px-6 py-2.5 text-sm font-semibold tracking-wide',
  sm: 'rounded-full px-4 py-2 text-xs font-semibold tracking-wide',
}

export function PrimaryButton({
  children,
  to,
  className = '',
  size = 'md',
  type = 'button',
  ...rest
}) {
  const base = [
    'inline-flex items-center justify-center gap-2',
    'bg-gradient-to-r from-teal-600 via-teal-500 to-cyan-500 text-white shadow-lg shadow-teal-900/20',
    'tn-transition-base hover:brightness-[1.06] hover:shadow-xl hover:shadow-teal-900/25',
    'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-400',
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

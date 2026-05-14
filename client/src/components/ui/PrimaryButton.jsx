import { Link } from 'react-router-dom'

const sizeStyles = {
  md: 'rounded-tn px-5 py-2.5 text-sm font-semibold',
  sm: 'rounded-tn-sm px-4 py-2 text-xs font-semibold',
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
    'bg-sky-600 text-white shadow-md shadow-sky-900/20',
    'tn-transition-base hover:bg-sky-500 hover:shadow-lg hover:shadow-sky-900/25',
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

export function ShippingAddressForm({ value, errors, disabled, onChange }) {
  function field(name, label, props = {}) {
    const err = errors[name]
    return (
      <div>
        <label className="text-xs font-semibold text-zinc-600 dark:text-zinc-300" htmlFor={name}>
          {label}
        </label>
        <input
          id={name}
          name={name}
          disabled={disabled}
          value={value[name] ?? ''}
          onChange={(e) => onChange(name, e.target.value)}
          className="mt-2 w-full rounded-tn border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-900 outline-none ring-indigo-500/30 focus:border-indigo-400 focus:ring-2 disabled:opacity-60 dark:border-white/10 dark:bg-tn-950 dark:text-zinc-100"
          {...props}
        />
        {err ? <p className="mt-1 text-xs text-red-600 dark:text-red-400">{err}</p> : null}
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {field('fullName', 'Full name', { autoComplete: 'name' })}
      {field('line1', 'Address line 1', { autoComplete: 'address-line1' })}
      {field('line2', 'Address line 2 (optional)', { autoComplete: 'address-line2' })}
      <div className="grid gap-4 sm:grid-cols-2">
        {field('city', 'City', { autoComplete: 'address-level2' })}
        {field('postalCode', 'Postal code', { autoComplete: 'postal-code' })}
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        {field('country', 'Country', { autoComplete: 'country-name' })}
        {field('phone', 'Phone', { type: 'tel', autoComplete: 'tel' })}
      </div>
    </div>
  )
}

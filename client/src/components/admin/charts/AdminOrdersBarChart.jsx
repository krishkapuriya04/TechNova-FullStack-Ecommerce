import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts'

export function AdminOrdersBarChart({ data }) {
  return (
    <div className="h-64 w-full min-h-[14rem]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#3f3f46" opacity={0.6} />
          <XAxis dataKey="label" tick={{ fill: '#a1a1aa', fontSize: 11 }} tickLine={false} />
          <YAxis tick={{ fill: '#a1a1aa', fontSize: 11 }} tickLine={false} />
          <Tooltip
            contentStyle={{
              background: '#18181b',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '0.5rem',
              fontSize: '12px',
            }}
          />
          <Bar dataKey="orders" name="Orders" fill="#34d399" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts'

export function AdminRevenueChart({ data }) {
  return (
    <div className="h-64 w-full min-h-[14rem]">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
          <defs>
            <linearGradient id="adminRev" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#818cf8" stopOpacity={0.45} />
              <stop offset="95%" stopColor="#818cf8" stopOpacity={0} />
            </linearGradient>
          </defs>
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
            labelStyle={{ color: '#e4e4e7' }}
          />
          <Area
            type="monotone"
            dataKey="revenue"
            name="Revenue"
            stroke="#a5b4fc"
            strokeWidth={2}
            fillOpacity={1}
            fill="url(#adminRev)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}

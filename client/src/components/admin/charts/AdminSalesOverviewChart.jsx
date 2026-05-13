import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts'

export function AdminSalesOverviewChart({ data }) {
  return (
    <div className="h-72 w-full min-h-[16rem]">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#3f3f46" opacity={0.6} />
          <XAxis dataKey="key" tick={{ fill: '#a1a1aa', fontSize: 10 }} tickLine={false} />
          <YAxis yAxisId="left" tick={{ fill: '#a1a1aa', fontSize: 11 }} tickLine={false} />
          <YAxis yAxisId="right" orientation="right" tick={{ fill: '#a1a1aa', fontSize: 11 }} tickLine={false} />
          <Tooltip
            contentStyle={{
              background: '#18181b',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '0.5rem',
              fontSize: '12px',
            }}
          />
          <Line
            yAxisId="left"
            type="monotone"
            dataKey="revenue"
            name="Revenue"
            stroke="#c4b5fd"
            strokeWidth={2}
            dot={false}
          />
          <Line
            yAxisId="right"
            type="monotone"
            dataKey="orders"
            name="Orders"
            stroke="#38bdf8"
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

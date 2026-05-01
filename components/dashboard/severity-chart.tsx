'use client'

import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts'

interface SeverityChartProps {
  data?: Record<string, number> // ✅ make optional to prevent crash
}

const COLORS: Record<string, string> = {
  'Safe': '#10b981',
  'Low Risk': '#eab308',
  'Moderate Risk': '#f97316',
  'High Risk': '#ef4444',
}

export default function SeverityChart({ data }: SeverityChartProps) {

  // ✅ SAFETY CHECK (prevents Object.entries crash)
  if (!data || Object.keys(data).length === 0) {
    return (
      <div className="w-full h-80 flex items-center justify-center text-gray-400">
        No data available
      </div>
    )
  }

  const chartData = Object.entries(data).map(([name, value]) => ({
    name,
    value,
  }))

  return (
    <div className="w-full h-80">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, value }) => `${name}: ${value}`}
            outerRadius={120}
            fill="#8884d8"
            dataKey="value"
          >
            {chartData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[entry.name] || '#6b7280'}
              />
            ))}
          </Pie>

          <Tooltip
            contentStyle={{
              backgroundColor: '#1e293b',
              border: '1px solid #475569',
              borderRadius: '0.5rem',
              color: '#f1f5f9',
            }}
          />

          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}
import { useContext, useMemo } from 'react'
import { motion } from 'framer-motion'
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

import { FinanceContext } from '../context/FinanceContext'
import { formatINR } from '../utils/currencyFormatter'

const PIE_COLORS = ['#3b82f6', '#6366f1', '#14b8a6', '#a855f7', '#f97316', '#06b6d4']

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload || payload.length === 0) return null

  return (
    <div className="chart-tooltip">
      {label ? <p className="tooltip-label">{label}</p> : null}
      {payload.map((entry) => (
        <p key={entry.dataKey} className="tooltip-row">
          <span>{entry.name}:</span>
          <strong>{formatINR(entry.value)}</strong>
        </p>
      ))}
    </div>
  )
}

export default function Analytics() {
  const { transactions } = useContext(FinanceContext)

  const spendingByCategory = useMemo(() => {
    const expenseMap = transactions
      .filter((tx) => tx.type === 'expense')
      .reduce((acc, tx) => {
        const category = tx.category || 'Other'
        acc[category] = (acc[category] || 0) + Number(tx.amount || 0)
        return acc
      }, {})

    return Object.entries(expenseMap).map(([name, value]) => ({ name, value }))
  }, [transactions])

  const incomeVsExpense = useMemo(() => {
    const income = transactions
      .filter((tx) => tx.type === 'income')
      .reduce((sum, tx) => sum + Number(tx.amount || 0), 0)

    const expense = transactions
      .filter((tx) => tx.type === 'expense')
      .reduce((sum, tx) => sum + Number(tx.amount || 0), 0)

    return [{ name: 'Overview', Income: income, Expenses: expense }]
  }, [transactions])

  const monthlyTrend = useMemo(() => {
    const map = transactions
      .filter((tx) => tx.type === 'expense')
      .reduce((acc, tx) => {
        const date = new Date(tx.date)
        if (Number.isNaN(date.getTime())) return acc
        const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
        acc[key] = (acc[key] || 0) + Number(tx.amount || 0)
        return acc
      }, {})

    return Object.entries(map)
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([month, amount]) => ({ month, amount }))
  }, [transactions])

  return (
    <div className="page">
      <h1>Analytics</h1>
      <p>Track your spending patterns and monthly trends.</p>

      <div className="charts-grid">
        <motion.div whileHover={{ y: -4 }} className="chart-card">
          <h2>Spending by Category</h2>
          {spendingByCategory.length === 0 ? (
            <p className="empty-state">Add expense transactions to view this chart.</p>
          ) : (
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie
                  data={spendingByCategory}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={90}
                >
                  {spendingByCategory.map((entry, index) => (
                    <Cell key={entry.name} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          )}
        </motion.div>

        <motion.div whileHover={{ y: -4 }} className="chart-card">
          <h2>Income vs Expenses</h2>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={incomeVsExpense} margin={{ top: 12, right: 12, left: 8, bottom: 8 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Bar dataKey="Income" fill="#16a34a" radius={[8, 8, 0, 0]} />
              <Bar dataKey="Expenses" fill="#ef4444" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div whileHover={{ y: -4 }} className="chart-card chart-card-wide">
          <h2>Monthly Spending Trend</h2>
          {monthlyTrend.length === 0 ? (
            <p className="empty-state">Add dated expense transactions to view this chart.</p>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyTrend} margin={{ top: 12, right: 12, left: 8, bottom: 8 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip content={<CustomTooltip />} />
                <Line
                  type="monotone"
                  dataKey="amount"
                  name="Monthly Expenses"
                  stroke="#6366f1"
                  strokeWidth={3}
                  dot={{ r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </motion.div>
      </div>
    </div>
  )
}


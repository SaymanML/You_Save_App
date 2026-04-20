import { useContext, useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'

import { FinanceContext } from '../context/FinanceContext'
import { fetchUsdInrRate } from '../services/api'
import { formatINR } from '../utils/currencyFormatter'

export default function Dashboard() {
  const { transactions } = useContext(FinanceContext)
  const [fxRate, setFxRate] = useState(null)
  const [loadingRate, setLoadingRate] = useState(true)
  const [rateError, setRateError] = useState('')

  useEffect(() => {
    async function loadRate() {
      try {
        setLoadingRate(true)
        setRateError('')
        const rate = await fetchUsdInrRate()
        setFxRate(rate)
      } catch {
        setRateError('Could not fetch current exchange rate.')
      } finally {
        setLoadingRate(false)
      }
    }

    loadRate()
  }, [])

  const stats = useMemo(() => {
    const totalIncome = transactions
      .filter((tx) => tx.type === 'income')
      .reduce((sum, tx) => sum + Number(tx.amount || 0), 0)

    const totalExpenses = transactions
      .filter((tx) => tx.type === 'expense')
      .reduce((sum, tx) => sum + Number(tx.amount || 0), 0)

    const totalBalance = totalIncome - totalExpenses

    const expenseByCategory = transactions
      .filter((tx) => tx.type === 'expense')
      .reduce((acc, tx) => {
        const key = tx.category || 'Other'
        acc[key] = (acc[key] || 0) + Number(tx.amount || 0)
        return acc
      }, {})

    const topCategoryEntry = Object.entries(expenseByCategory).sort(
      (a, b) => b[1] - a[1],
    )[0]

    return {
      totalIncome,
      totalExpenses,
      totalBalance,
      topCategory: topCategoryEntry ? topCategoryEntry[0] : 'N/A',
      topCategoryAmount: topCategoryEntry ? topCategoryEntry[1] : 0,
    }
  }, [transactions])

  return (
    <div className="page">
      <h1>Dashboard</h1>
      <p>Your financial overview at a glance.</p>

      <div className="stats-grid">
        <motion.div whileHover={{ y: -4, scale: 1.01 }} className="stat-card">
          <span className="stat-label">Total Balance</span>
          <strong className="stat-value">{formatINR(stats.totalBalance)}</strong>
        </motion.div>

        <motion.div whileHover={{ y: -4, scale: 1.01 }} className="stat-card">
          <span className="stat-label">Total Income</span>
          <strong className="stat-value income">{formatINR(stats.totalIncome)}</strong>
        </motion.div>

        <motion.div whileHover={{ y: -4, scale: 1.01 }} className="stat-card">
          <span className="stat-label">Total Expenses</span>
          <strong className="stat-value expense">{formatINR(stats.totalExpenses)}</strong>
        </motion.div>
      </div>

      <div className="dashboard-grid">
        <motion.div whileHover={{ y: -4 }} className="insight-card">
          <h2>Top Spending Category</h2>
          <p className="highlight-value">{stats.topCategory}</p>
          <p>Spent: {formatINR(stats.topCategoryAmount)}</p>
        </motion.div>

        <motion.div whileHover={{ y: -4 }} className="insight-card">
          <h2>Currency Widget</h2>
          {loadingRate ? <p>Loading USD to INR rate...</p> : null}
          {rateError ? <p className="error-text">{rateError}</p> : null}
          {!loadingRate && !rateError && fxRate ? (
            <>
              <p className="highlight-value">1 USD = {fxRate.inrPerUsd.toFixed(2)} INR</p>
              <p>1 INR = {fxRate.usdPerInr.toFixed(4)} USD</p>
            </>
          ) : null}
        </motion.div>
      </div>
    </div>
  )
}


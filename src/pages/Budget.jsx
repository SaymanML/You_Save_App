import { useContext, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { toast } from 'react-toastify'

import { FinanceContext } from '../context/FinanceContext'
import { formatINR } from '../utils/currencyFormatter'

function getProgressClass(percent) {
  if (percent > 100) return 'progress-red'
  if (percent > 80) return 'progress-orange'
  if (percent >= 50) return 'progress-yellow'
  return 'progress-green'
}

export default function Budget() {
  const { budget, updateBudget, transactions } = useContext(FinanceContext)
  const [inputBudget, setInputBudget] = useState(String(budget || ''))

  const spent = useMemo(
    () =>
      transactions
        .filter((tx) => tx.type === 'expense')
        .reduce((sum, tx) => sum + Number(tx.amount || 0), 0),
    [transactions],
  )

  const percentage = budget > 0 ? (spent / budget) * 100 : 0
  const remaining = Math.max(Number(budget || 0) - spent, 0)

  function handleSaveBudget() {
    updateBudget(inputBudget)
    toast.success('Monthly budget updated')
  }

  return (
    <div className="page">
      <h1>Budget</h1>
      <p>Set your monthly budget and track your spending progress.</p>

      <div className="budget-input-row">
        <div className="form-field budget-input-group">
          <label htmlFor="monthlyBudget">Set Monthly Budget</label>
          <input
            id="monthlyBudget"
            type="number"
            min="0"
            step="0.01"
            value={inputBudget}
            onChange={(e) => setInputBudget(e.target.value)}
            placeholder="Enter amount in INR"
          />
        </div>
        <motion.button
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.97 }}
          className="budget-save-btn"
          type="button"
          onClick={handleSaveBudget}
        >
          Save Budget
        </motion.button>
      </div>

      <div className="budget-progress-wrap">
        <div className="budget-progress-header">
          <span>Budget Usage</span>
          <strong>{percentage.toFixed(1)}%</strong>
        </div>
        <div className="budget-progress-track">
          <div
            className={`budget-progress-fill ${getProgressClass(percentage)}`}
            style={{ width: `${Math.min(percentage, 100)}%` }}
          />
        </div>
      </div>

      <div className="budget-stats-grid">
        <motion.div whileHover={{ y: -3 }} className="budget-stat-card">
          <span>Total Spent</span>
          <strong className="expense">{formatINR(spent)}</strong>
        </motion.div>
        <motion.div whileHover={{ y: -3 }} className="budget-stat-card">
          <span>Remaining</span>
          <strong>{formatINR(remaining)}</strong>
        </motion.div>
        <motion.div whileHover={{ y: -3 }} className="budget-stat-card">
          <span>Budget Limit</span>
          <strong>{formatINR(budget || 0)}</strong>
        </motion.div>
      </div>
    </div>
  )
}


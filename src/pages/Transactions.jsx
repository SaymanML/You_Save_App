import { useContext, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { FinanceContext } from '../context/FinanceContext'
import { formatINR } from '../utils/currencyFormatter'

const ALL_CATEGORIES = [
  'Food',
  'Travel',
  'Rent',
  'Shopping',
  'Entertainment',
  'Health',
  'Utilities',
  'Subscriptions',
  'Salary',
  'Freelance',
  'Gift',
  'Other',
]

export default function Transactions() {
  const { transactions, deleteTransaction } = useContext(FinanceContext)
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [sortBy, setSortBy] = useState('date-newest')

  const visibleTransactions = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase()

    let filtered = [...transactions]

    if (normalizedSearch) {
      filtered = filtered.filter((tx) => {
        const title = String(tx.title || '').toLowerCase()
        const notes = String(tx.notes || '').toLowerCase()
        return title.includes(normalizedSearch) || notes.includes(normalizedSearch)
      })
    }

    if (categoryFilter !== 'all') {
      filtered = filtered.filter((tx) => tx.category === categoryFilter)
    }

    filtered.sort((a, b) => {
      if (sortBy === 'date-oldest') {
        return new Date(a.date) - new Date(b.date)
      }
      if (sortBy === 'amount-high') {
        return Number(b.amount || 0) - Number(a.amount || 0)
      }
      if (sortBy === 'amount-low') {
        return Number(a.amount || 0) - Number(b.amount || 0)
      }
      return new Date(b.date) - new Date(a.date)
    })

    return filtered
  }, [transactions, searchTerm, categoryFilter, sortBy])

  return (
    <div className="page">
      <h1>Transactions</h1>
      <p>Track your income and expenses here.</p>

      <div className="filters">
        <div className="form-field">
          <label htmlFor="search">Search</label>
          <input
            id="search"
            type="text"
            placeholder="Search by title or notes"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="form-field">
          <label htmlFor="filterCategory">Filter by Category</label>
          <select
            id="filterCategory"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            <option value="all">All Categories</option>
            {ALL_CATEGORIES.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        <div className="form-field">
          <label htmlFor="sortBy">Sort</label>
          <select id="sortBy" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="date-newest">Date: Newest First</option>
            <option value="date-oldest">Date: Oldest First</option>
            <option value="amount-high">Amount: High to Low</option>
            <option value="amount-low">Amount: Low to High</option>
          </select>
        </div>
      </div>

      {visibleTransactions.length === 0 ? (
        <div className="empty-state-card">
          <div className="empty-illustration" aria-hidden="true">
            📭
          </div>
          <h3>No data found</h3>
          <p className="empty-state">Try adding a transaction or adjusting your filters.</p>
        </div>
      ) : (
        <div className="table-wrap">
          <table className="transactions-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Category</th>
                <th>Amount</th>
                <th>Date</th>
                <th>Type</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {visibleTransactions.map((tx) => (
                <tr key={tx.id}>
                  <td>
                    <span>{tx.title}</span>
                    {tx.recurring ? (
                      <span className="recurring-badge" title="Recurring transaction">
                        🔄 Recurring
                      </span>
                    ) : null}
                  </td>
                  <td>{tx.category}</td>
                  <td className={tx.type === 'income' ? 'amount-income' : 'amount-expense'}>
                    {formatINR(tx.amount)}
                  </td>
                  <td>{tx.date}</td>
                  <td>{tx.type}</td>
                  <td>
                    <motion.button
                      whileHover={{ y: -1 }}
                      whileTap={{ scale: 0.96 }}
                      className="delete-btn"
                      type="button"
                      onClick={() => deleteTransaction(tx.id)}
                    >
                      Delete
                    </motion.button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}


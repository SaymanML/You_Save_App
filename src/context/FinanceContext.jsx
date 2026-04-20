import { createContext, useEffect, useMemo, useState } from 'react'

const STORAGE_KEYS = {
  transactions: 'finance.transactions',
  budget: 'finance.budget',
}

function safeJsonParse(value, fallback) {
  try {
    return JSON.parse(value)
  } catch {
    return fallback
  }
}

function getInitialTransactions() {
  const raw = localStorage.getItem(STORAGE_KEYS.transactions)
  const parsed = raw ? safeJsonParse(raw, []) : []
  return Array.isArray(parsed) ? parsed : []
}

function getInitialBudget() {
  const raw = localStorage.getItem(STORAGE_KEYS.budget)
  const parsed = raw ? safeJsonParse(raw, 0) : 0
  const num = Number(parsed)
  return Number.isFinite(num) ? num : 0
}

function createId() {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID()
  }
  return String(Date.now())
}

function normalizeTransaction(input) {
  const tx = input || {}
  return {
    id: tx.id || createId(),
    title: String(tx.title || ''),
    amount: Number(tx.amount || 0),
    category: String(tx.category || ''),
    type: tx.type === 'income' ? 'income' : 'expense',
    date: String(tx.date || new Date().toISOString().slice(0, 10)),
    notes: String(tx.notes || ''),
    recurring: Boolean(tx.recurring),
  }
}

export const FinanceContext = createContext(null)

export function FinanceProvider({ children }) {
  const [transactions, setTransactions] = useState(getInitialTransactions)
  const [budget, setBudget] = useState(getInitialBudget)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.transactions, JSON.stringify(transactions))
  }, [transactions])

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.budget, JSON.stringify(budget))
  }, [budget])

  function addTransaction(transaction) {
    const normalized = normalizeTransaction(transaction)
    setTransactions((prev) => [normalized, ...prev])
    return normalized.id
  }

  function deleteTransaction(id) {
    setTransactions((prev) => prev.filter((tx) => tx.id !== id))
  }

  function updateTransaction(id, updates) {
    setTransactions((prev) =>
      prev.map((tx) => {
        if (tx.id !== id) return tx
        return normalizeTransaction({ ...tx, ...updates, id: tx.id })
      }),
    )
  }

  function updateBudget(nextBudget) {
    const num = Number(nextBudget)
    setBudget(Number.isFinite(num) ? num : 0)
  }

  const value = useMemo(
    () => ({
      transactions,
      budget,
      addTransaction,
      deleteTransaction,
      updateTransaction,
      updateBudget,
    }),
    [transactions, budget],
  )

  return <FinanceContext.Provider value={value}>{children}</FinanceContext.Provider>
}


import './App.css'
import { Link, Navigate, Route, Routes } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ToastContainer } from 'react-toastify'

import Analytics from './pages/Analytics'
import AddTransaction from './pages/AddTransaction'
import Budget from './pages/Budget'
import Dashboard from './pages/Dashboard'
import Transactions from './pages/Transactions'

const MotionLink = motion(Link)

function App() {
  return (
    <div className="app">
      <div className="bg-blob bg-blob-one" />
      <div className="bg-blob bg-blob-two" />
      <div className="bg-blob bg-blob-three" />

      <header className="header">
        <div className="container header-row">
          <div className="brand">Personal Finance App</div>
          <nav className="nav">
            <MotionLink whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.98 }} to="/dashboard">
              Dashboard
            </MotionLink>
            <MotionLink
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.98 }}
              to="/transactions"
            >
              Transactions
            </MotionLink>
            <MotionLink
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.98 }}
              to="/transactions/new"
            >
              Add New
            </MotionLink>
            <MotionLink whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.98 }} to="/budget">
              Budget
            </MotionLink>
            <MotionLink whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.98 }} to="/analytics">
              Analytics
            </MotionLink>
          </nav>
        </div>
      </header>

      <main className="container main">
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/transactions" element={<Transactions />} />
          <Route path="/transactions/new" element={<AddTransaction />} />
          <Route path="/budget" element={<Budget />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </main>
      <ToastContainer position="top-right" autoClose={2000} />
    </div>
  )
}

export default App

import { useContext } from 'react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { motion } from 'framer-motion'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'

import { FinanceContext } from '../context/FinanceContext'
import { formatINR } from '../utils/currencyFormatter'

const EXPENSE_CATEGORIES = [
  'Food',
  'Travel',
  'Rent',
  'Shopping',
  'Entertainment',
  'Health',
  'Utilities',
  'Subscriptions',
]
const INCOME_CATEGORIES = ['Salary', 'Freelance', 'Gift', 'Other']

const schema = yup.object({
  title: yup.string().trim().required('Title is required'),
  amount: yup
    .number()
    .typeError('Amount must be a number')
    .positive('Amount must be greater than 0')
    .required('Amount is required'),
  category: yup.string().required('Category is required'),
  type: yup.string().oneOf(['income', 'expense']).required('Type is required'),
  date: yup.string().required('Date is required'),
  notes: yup.string().max(200, 'Notes should be 200 characters or less'),
  recurring: yup.boolean().default(false),
})

export default function AddTransaction() {
  const navigate = useNavigate()
  const { addTransaction } = useContext(FinanceContext)

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      title: '',
      amount: '',
      category: '',
      type: 'expense',
      date: new Date().toISOString().slice(0, 10),
      notes: '',
      recurring: false,
    },
  })

  const selectedType = watch('type')
  const amountValue = watch('amount')
  const categoryOptions =
    selectedType === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES

  function onSubmit(values) {
    addTransaction(values)
    toast.success('Transaction added successfully')
    reset()
    navigate('/transactions')
  }

  return (
    <div className="page">
      <h1>Add New Transaction</h1>
      <p>Fill in the details below.</p>

      <form className="form-grid" onSubmit={handleSubmit(onSubmit)}>
        <div className="form-field">
          <label htmlFor="title">Title</label>
          <input id="title" type="text" {...register('title')} />
          {errors.title ? <span className="error">{errors.title.message}</span> : null}
        </div>

        <div className="form-field">
          <label htmlFor="amount">Amount</label>
          <input id="amount" type="number" step="0.01" {...register('amount')} />
          {errors.amount ? <span className="error">{errors.amount.message}</span> : null}
          <small className="hint">Preview: {formatINR(amountValue || 0)}</small>
        </div>

        <div className="form-field">
          <label htmlFor="category">Category</label>
          <select id="category" {...register('category')}>
            <option value="">Select category</option>
            {categoryOptions.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
          {errors.category ? <span className="error">{errors.category.message}</span> : null}
        </div>

        <div className="form-field">
          <label htmlFor="type">Type</label>
          <select
            id="type"
            {...register('type', {
              onChange: () => setValue('category', ''),
            })}
          >
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
          {errors.type ? <span className="error">{errors.type.message}</span> : null}
        </div>

        <div className="form-field">
          <label htmlFor="date">Date</label>
          <input id="date" type="date" {...register('date')} />
          {errors.date ? <span className="error">{errors.date.message}</span> : null}
        </div>

        <div className="form-field form-field-full">
          <label htmlFor="notes">Notes</label>
          <textarea id="notes" rows="3" {...register('notes')} />
          {errors.notes ? <span className="error">{errors.notes.message}</span> : null}
        </div>

        <div className="form-checkbox form-field-full">
          <input id="recurring" type="checkbox" {...register('recurring')} />
          <label htmlFor="recurring">Recurring transaction</label>
        </div>

        <div className="form-actions form-field-full">
          <motion.button
            whileHover={{ y: -2, scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Saving...' : 'Add Transaction'}
          </motion.button>
        </div>
      </form>
    </div>
  )
}


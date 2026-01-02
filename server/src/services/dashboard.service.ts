import Income from '../models/income.model'
import Expense from '../models/expense.model'
import { DashboardData, TransactionItem } from '../types/dashboard.types'

export const getDashboardData = async (userId: string): Promise<DashboardData> => {
  const now = new Date()
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
  const sixtyDaysAgo = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000)

  // Fetch all incomes and expenses for the user
  const [allIncomes, allExpenses] = await Promise.all([
    Income.find({ userId }),
    Expense.find({ userId })
  ])

  // Calculate total income and expense
  const totalIncome = allIncomes.reduce((sum, income) => sum + income.amount, 0)
  const totalExpense = allExpenses.reduce((sum, expense) => sum + expense.amount, 0)
  const totalBalance = totalIncome - totalExpense

  // Get income transactions in last 60 days
  const last60DaysIncomes = allIncomes.filter(
    (income) => new Date(income.date) >= sixtyDaysAgo
  )
  const last60DaysIncomeTotal = last60DaysIncomes.reduce(
    (sum, income) => sum + income.amount,
    0
  )
  const last60DaysIncomeTransactions: TransactionItem[] = last60DaysIncomes
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .map((income) => ({
      id: income._id.toString(),
      type: 'income' as const,
      icon: income.icon,
      source: income.source,
      amount: income.amount,
      date: income.date
    }))

  // Get expense transactions in last 30 days
  const last30DaysExpenses = allExpenses.filter(
    (expense) => new Date(expense.date) >= thirtyDaysAgo
  )
  const last30DaysExpenseTotal = last30DaysExpenses.reduce(
    (sum, expense) => sum + expense.amount,
    0
  )
  const last30DaysExpenseTransactions: TransactionItem[] = last30DaysExpenses
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .map((expense) => ({
      id: expense._id.toString(),
      type: 'expense' as const,
      icon: expense.icon,
      category: expense.category,
      amount: expense.amount,
      date: expense.date
    }))

  // Get last 5 transactions (income + expense) sorted by date
  const allTransactions: TransactionItem[] = [
    ...allIncomes.map((income) => ({
      id: income._id.toString(),
      type: 'income' as const,
      icon: income.icon,
      source: income.source,
      amount: income.amount,
      date: income.date
    })),
    ...allExpenses.map((expense) => ({
      id: expense._id.toString(),
      type: 'expense' as const,
      icon: expense.icon,
      category: expense.category,
      amount: expense.amount,
      date: expense.date
    }))
  ]

  const recentTransactions = allTransactions
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5)

  return {
    totalBalance,
    totalIncome,
    totalExpense,
    last30DaysExpenses: {
      total: last30DaysExpenseTotal,
      transactions: last30DaysExpenseTransactions
    },
    last60DaysIncome: {
      total: last60DaysIncomeTotal,
      transactions: last60DaysIncomeTransactions
    },
    recentTransactions
  }
}

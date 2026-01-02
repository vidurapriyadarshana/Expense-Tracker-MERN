export interface TransactionItem {
  id: string
  type: 'income' | 'expense'
  icon: string
  source?: string
  category?: string
  amount: number
  date: Date
}

export interface Last30DaysExpenses {
  total: number
  transactions: TransactionItem[]
}

export interface Last60DaysIncome {
  total: number
  transactions: TransactionItem[]
}

export interface DashboardData {
  totalBalance: number
  totalIncome: number
  totalExpense: number
  last30DaysExpenses: Last30DaysExpenses
  last60DaysIncome: Last60DaysIncome
  recentTransactions: TransactionItem[]
}

export interface DashboardResponse {
  success: boolean
  message: string
  data?: DashboardData
}

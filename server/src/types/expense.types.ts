export interface CreateExpenseDto {
  icon: string
  category: string
  amount: number
  date: Date
}

export interface ExpenseResponse {
  success: boolean
  message: string
  data?: {
    expense?: {
      id: string
      userId: string
      icon: string
      category: string
      amount: number
      date: Date
    }
    expenses?: {
      id: string
      userId: string
      icon: string
      category: string
      amount: number
      date: Date
    }[]
  }
}

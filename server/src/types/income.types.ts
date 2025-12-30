import { IIncome } from '../models/income.model'

export interface CreateIncomeDto {
  icon: string
  source: string
  amount: number
  date: Date
}

export interface IncomeResponse {
  success: boolean
  message: string
  data?: {
    income?: {
      id: string
      userId: string
      icon: string
      source: string
      amount: number
      date: Date
    }
    incomes?: {
      id: string
      userId: string
      icon: string
      source: string
      amount: number
      date: Date
    }[]
  }
}

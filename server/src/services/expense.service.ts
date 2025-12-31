import ExcelJS from 'exceljs'
import Expense, { IExpense } from '../models/expense.model'
import { CreateExpenseDto } from '../types/expense.types'

export const createExpense = async (userId: string, data: CreateExpenseDto): Promise<IExpense> => {
  const { icon, category, amount, date } = data

  const expense = await Expense.create({
    userId,
    icon,
    category,
    amount,
    date
  })

  return expense
}

export const getAllExpenses = async (userId: string): Promise<IExpense[]> => {
  const expenses = await Expense.find({ userId }).sort({ date: -1 })
  return expenses
}

export const deleteExpense = async (userId: string, expenseId: string): Promise<IExpense | null> => {
  const expense = await Expense.findOneAndDelete({ _id: expenseId, userId })
  return expense
}

export const generateExpenseExcel = async (userId: string): Promise<ExcelJS.Buffer> => {
  const expenses = await Expense.find({ userId }).sort({ date: -1 })

  const workbook = new ExcelJS.Workbook()
  const worksheet = workbook.addWorksheet('Expenses')

  // Define columns
  worksheet.columns = [
    { header: 'Category', key: 'category', width: 20 },
    { header: 'Amount', key: 'amount', width: 15 },
    { header: 'Date', key: 'date', width: 15 },
    { header: 'Icon', key: 'icon', width: 15 }
  ]

  // Style header row
  worksheet.getRow(1).font = { bold: true }
  worksheet.getRow(1).fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FFE0E0E0' }
  }

  // Add data rows
  expenses.forEach((expense) => {
    worksheet.addRow({
      category: expense.category,
      amount: expense.amount,
      date: new Date(expense.date).toLocaleDateString(),
      icon: expense.icon
    })
  })

  const buffer = await workbook.xlsx.writeBuffer()
  return buffer
}

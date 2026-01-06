import PDFDocument from 'pdfkit'
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

export const generateExpensePDF = async (userId: string): Promise<Buffer> => {
  const expenses = await Expense.find({ userId }).sort({ date: -1 })

  return new Promise((resolve, reject) => {
    const doc = new PDFDocument()
    const chunks: Buffer[] = []

    doc.on('data', (chunk: Buffer) => chunks.push(chunk))
    doc.on('end', () => resolve(Buffer.concat(chunks)))
    doc.on('error', (err: Error) => reject(err))

    doc.fontSize(20).text('Expense Report', { align: 'center' })
    doc.moveDown()

    expenses.forEach((expense) => {
      doc.fontSize(12).text(`Category: ${expense.category}`)
      doc.text(`Amount: ${expense.amount}`)
      doc.text(`Date: ${new Date(expense.date).toLocaleDateString()}`)
      doc.text(`Icon: ${expense.icon}`)
      doc.moveDown()
    })

    doc.end()
  })
}

import PDFDocument from 'pdfkit'
import Income, { IIncome } from '../models/income.model'
import { CreateIncomeDto } from '../types/income.types'

export const createIncome = async (userId: string, data: CreateIncomeDto): Promise<IIncome> => {
  const { icon, source, amount, date } = data

  const income = await Income.create({
    userId,
    icon,
    source,
    amount,
    date
  })

  return income
}

export const getAllIncomes = async (userId: string): Promise<IIncome[]> => {
  const incomes = await Income.find({ userId }).sort({ date: -1 })
  return incomes
}

export const deleteIncome = async (userId: string, incomeId: string): Promise<IIncome | null> => {
  const income = await Income.findOneAndDelete({ _id: incomeId, userId })
  return income
}

export const generateIncomePDF = async (userId: string): Promise<Buffer> => {
  const incomes = await Income.find({ userId }).sort({ date: -1 })

  return new Promise((resolve, reject) => {
    const doc = new PDFDocument()
    const chunks: Buffer[] = []

    doc.on('data', (chunk: Buffer) => chunks.push(chunk))
    doc.on('end', () => resolve(Buffer.concat(chunks)))
    doc.on('error', (err: Error) => reject(err))

    doc.fontSize(20).text('Income Report', { align: 'center' })
    doc.moveDown()

    incomes.forEach((income) => {
      doc.fontSize(12).text(`Source: ${income.source}`)
      doc.text(`Amount: ${income.amount}`)
      doc.text(`Date: ${new Date(income.date).toLocaleDateString()}`)
      doc.text(`Icon: ${income.icon}`)
      doc.moveDown()
    })

    doc.end()
  })
}

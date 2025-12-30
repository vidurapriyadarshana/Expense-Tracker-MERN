import ExcelJS from 'exceljs'
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

export const generateExcel = async (userId: string): Promise<ExcelJS.Buffer> => {
  const incomes = await Income.find({ userId }).sort({ date: -1 })

  const workbook = new ExcelJS.Workbook()
  const worksheet = workbook.addWorksheet('Incomes')

  // Define columns
  worksheet.columns = [
    { header: 'Source', key: 'source', width: 20 },
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
  incomes.forEach((income) => {
    worksheet.addRow({
      source: income.source,
      amount: income.amount,
      date: new Date(income.date).toLocaleDateString(),
      icon: income.icon
    })
  })

  const buffer = await workbook.xlsx.writeBuffer()
  return buffer
}

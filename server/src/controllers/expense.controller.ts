import { Response } from 'express'
import { createExpense, getAllExpenses, deleteExpense, generateExpenseExcel } from '../services/expense.service'
import { AuthRequest } from '../types/auth.types'
import { ExpenseResponse } from '../types/expense.types'
import logger from '../configurations/logger.config'

/**
 * @swagger
 * /api/expense:
 *   post:
 *     summary: Create a new expense
 *     tags: [Expense]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - icon
 *               - category
 *               - amount
 *               - date
 *             properties:
 *               icon:
 *                 type: string
 *                 example: 🍔
 *               category:
 *                 type: string
 *                 example: Food
 *               amount:
 *                 type: number
 *                 example: 50
 *               date:
 *                 type: string
 *                 format: date
 *                 example: 2025-12-30
 *     responses:
 *       201:
 *         description: Expense created successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 */
export const addExpense = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'Unauthorized'
      } as ExpenseResponse)
      return
    }

    const { icon, category, amount, date } = req.body

    if (!icon || !category || !amount || !date) {
      res.status(400).json({
        success: false,
        message: 'Please provide icon, category, amount and date'
      } as ExpenseResponse)
      return
    }

    const expense = await createExpense(req.user._id.toString(), { icon, category, amount, date })

    res.status(201).json({
      success: true,
      message: 'Expense created successfully',
      data: {
        expense: {
          id: expense._id.toString(),
          userId: expense.userId.toString(),
          icon: expense.icon,
          category: expense.category,
          amount: expense.amount,
          date: expense.date
        }
      }
    } as ExpenseResponse)
  } catch (error) {
    logger.error(`Create expense error: ${error}`)
    res.status(400).json({
      success: false,
      message: error instanceof Error ? error.message : 'Failed to create expense'
    } as ExpenseResponse)
  }
}

/**
 * @swagger
 * /api/expense/all:
 *   get:
 *     summary: Get all expenses for the authenticated user
 *     tags: [Expense]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Expenses retrieved successfully
 *       401:
 *         description: Unauthorized
 */
export const getExpenses = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'Unauthorized'
      } as ExpenseResponse)
      return
    }

    const expenses = await getAllExpenses(req.user._id.toString())

    res.status(200).json({
      success: true,
      message: 'Expenses retrieved successfully',
      data: {
        expenses: expenses.map((expense) => ({
          id: expense._id.toString(),
          userId: expense.userId.toString(),
          icon: expense.icon,
          category: expense.category,
          amount: expense.amount,
          date: expense.date
        }))
      }
    } as ExpenseResponse)
  } catch (error) {
    logger.error(`Get expenses error: ${error}`)
    res.status(400).json({
      success: false,
      message: error instanceof Error ? error.message : 'Failed to get expenses'
    } as ExpenseResponse)
  }
}

/**
 * @swagger
 * /api/expense/{id}:
 *   delete:
 *     summary: Delete an expense by ID
 *     tags: [Expense]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Expense ID
 *     responses:
 *       200:
 *         description: Expense deleted successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Expense not found
 */
export const removeExpense = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'Unauthorized'
      } as ExpenseResponse)
      return
    }

    const { id } = req.params

    const expense = await deleteExpense(req.user._id.toString(), id)

    if (!expense) {
      res.status(404).json({
        success: false,
        message: 'Expense not found'
      } as ExpenseResponse)
      return
    }

    res.status(200).json({
      success: true,
      message: 'Expense deleted successfully'
    } as ExpenseResponse)
  } catch (error) {
    logger.error(`Delete expense error: ${error}`)
    res.status(400).json({
      success: false,
      message: error instanceof Error ? error.message : 'Failed to delete expense'
    } as ExpenseResponse)
  }
}

/**
 * @swagger
 * /api/expense/downloadExcel:
 *   get:
 *     summary: Download expenses as Excel file
 *     tags: [Expense]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Excel file downloaded successfully
 *         content:
 *           application/vnd.openxmlformats-officedocument.spreadsheetml.sheet:
 *             schema:
 *               type: string
 *               format: binary
 *       401:
 *         description: Unauthorized
 */
export const downloadExpenseExcel = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'Unauthorized'
      } as ExpenseResponse)
      return
    }

    const buffer = await generateExpenseExcel(req.user._id.toString())

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
    res.setHeader('Content-Disposition', 'attachment; filename=expenses.xlsx')
    res.send(buffer)
  } catch (error) {
    logger.error(`Download Excel error: ${error}`)
    res.status(400).json({
      success: false,
      message: error instanceof Error ? error.message : 'Failed to download Excel'
    } as ExpenseResponse)
  }
}

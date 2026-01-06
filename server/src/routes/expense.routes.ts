import { Router } from 'express'
import { addExpense, getExpenses, removeExpense, downloadExpensePDF } from '../controllers/expense.controller'
import { authenticate } from '../middlewares/auth.middleware'

const router = Router()

/**
 * @swagger
 * tags:
 *   name: Expense
 *   description: Expense management endpoints
 */

// POST /api/expense - Create new expense
router.post('/', authenticate, addExpense)

// GET /api/expense/all - Get all expenses
router.get('/all', authenticate, getExpenses)

// GET /api/expense/downloadPdf - Download expenses as PDF
router.get('/downloadPdf', authenticate, downloadExpensePDF)

// DELETE /api/expense/:id - Delete expense by ID
router.delete('/:id', authenticate, removeExpense)

export default router

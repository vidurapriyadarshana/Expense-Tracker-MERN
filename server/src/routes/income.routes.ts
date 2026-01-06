import { Router } from 'express'
import { addIncome, getIncomes, removeIncome, downloadIncomePDF } from '../controllers/income.controller'
import { authenticate } from '../middlewares/auth.middleware'

const router = Router()

/**
 * @swagger
 * tags:
 *   name: Income
 *   description: Income management endpoints
 */

// POST /api/income - Create new income
router.post('/', authenticate, addIncome)

// GET /api/income/all - Get all incomes
router.get('/all', authenticate, getIncomes)

// GET /api/income/downloadPdf - Download incomes as PDF
router.get('/downloadPdf', authenticate, downloadIncomePDF)

// DELETE /api/income/:id - Delete income by ID
router.delete('/:id', authenticate, removeIncome)

export default router

import { Router } from 'express'
import { addIncome, getIncomes, removeIncome, downloadExcel } from '../controllers/income.controller'
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

// GET /api/income/downloadExcel - Download incomes as Excel
router.get('/downloadExcel', authenticate, downloadExcel)

// DELETE /api/income/:id - Delete income by ID
router.delete('/:id', authenticate, removeIncome)

export default router

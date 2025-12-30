import { Response } from 'express'
import { createIncome, getAllIncomes, deleteIncome, generateExcel } from '../services/income.service'
import { AuthRequest } from '../types/auth.types'
import { IncomeResponse } from '../types/income.types'
import logger from '../configurations/logger.config'

/**
 * @swagger
 * /api/income:
 *   post:
 *     summary: Create a new income
 *     tags: [Income]
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
 *               - source
 *               - amount
 *               - date
 *             properties:
 *               icon:
 *                 type: string
 *                 example: 💰
 *               source:
 *                 type: string
 *                 example: Salary
 *               amount:
 *                 type: number
 *                 example: 5000
 *               date:
 *                 type: string
 *                 format: date
 *                 example: 2025-12-30
 *     responses:
 *       201:
 *         description: Income created successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 */
export const addIncome = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'Unauthorized'
      } as IncomeResponse)
      return
    }

    const { icon, source, amount, date } = req.body

    if (!icon || !source || !amount || !date) {
      res.status(400).json({
        success: false,
        message: 'Please provide icon, source, amount and date'
      } as IncomeResponse)
      return
    }

    const income = await createIncome(req.user._id.toString(), { icon, source, amount, date })

    res.status(201).json({
      success: true,
      message: 'Income created successfully',
      data: {
        income: {
          id: income._id.toString(),
          userId: income.userId.toString(),
          icon: income.icon,
          source: income.source,
          amount: income.amount,
          date: income.date
        }
      }
    } as IncomeResponse)
  } catch (error) {
    logger.error(`Create income error: ${error}`)
    res.status(400).json({
      success: false,
      message: error instanceof Error ? error.message : 'Failed to create income'
    } as IncomeResponse)
  }
}

/**
 * @swagger
 * /api/income/all:
 *   get:
 *     summary: Get all incomes for the authenticated user
 *     tags: [Income]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Incomes retrieved successfully
 *       401:
 *         description: Unauthorized
 */
export const getIncomes = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'Unauthorized'
      } as IncomeResponse)
      return
    }

    const incomes = await getAllIncomes(req.user._id.toString())

    res.status(200).json({
      success: true,
      message: 'Incomes retrieved successfully',
      data: {
        incomes: incomes.map((income) => ({
          id: income._id.toString(),
          userId: income.userId.toString(),
          icon: income.icon,
          source: income.source,
          amount: income.amount,
          date: income.date
        }))
      }
    } as IncomeResponse)
  } catch (error) {
    logger.error(`Get incomes error: ${error}`)
    res.status(400).json({
      success: false,
      message: error instanceof Error ? error.message : 'Failed to get incomes'
    } as IncomeResponse)
  }
}

/**
 * @swagger
 * /api/income/{id}:
 *   delete:
 *     summary: Delete an income by ID
 *     tags: [Income]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Income ID
 *     responses:
 *       200:
 *         description: Income deleted successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Income not found
 */
export const removeIncome = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'Unauthorized'
      } as IncomeResponse)
      return
    }

    const { id } = req.params

    const income = await deleteIncome(req.user._id.toString(), id)

    if (!income) {
      res.status(404).json({
        success: false,
        message: 'Income not found'
      } as IncomeResponse)
      return
    }

    res.status(200).json({
      success: true,
      message: 'Income deleted successfully'
    } as IncomeResponse)
  } catch (error) {
    logger.error(`Delete income error: ${error}`)
    res.status(400).json({
      success: false,
      message: error instanceof Error ? error.message : 'Failed to delete income'
    } as IncomeResponse)
  }
}

/**
 * @swagger
 * /api/income/downloadExcel:
 *   get:
 *     summary: Download incomes as Excel file
 *     tags: [Income]
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
export const downloadExcel = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'Unauthorized'
      } as IncomeResponse)
      return
    }

    const buffer = await generateExcel(req.user._id.toString())

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
    res.setHeader('Content-Disposition', 'attachment; filename=incomes.xlsx')
    res.send(buffer)
  } catch (error) {
    logger.error(`Download Excel error: ${error}`)
    res.status(400).json({
      success: false,
      message: error instanceof Error ? error.message : 'Failed to download Excel'
    } as IncomeResponse)
  }
}

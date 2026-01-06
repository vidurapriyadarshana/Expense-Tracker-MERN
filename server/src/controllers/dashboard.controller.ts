import { Request, Response } from 'express'
import { getDashboardData } from '../services/dashboard.service'
import { DashboardResponse } from '../types/dashboard.types'
import logger from '../configurations/logger.config'

/**
 * @swagger
 * /api/dashboard:
 *   get:
 *     summary: Get dashboard data
 *     description: Returns total balance, income, expenses, last 30 days expenses, last 60 days income, and recent transactions
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dashboard data retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Dashboard data retrieved successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     totalBalance:
 *                       type: number
 *                       example: 4500
 *                     totalIncome:
 *                       type: number
 *                       example: 5000
 *                     totalExpense:
 *                       type: number
 *                       example: 500
 *                     last30DaysExpenses:
 *                       type: object
 *                       properties:
 *                         total:
 *                           type: number
 *                           example: 300
 *                         transactions:
 *                           type: array
 *                           items:
 *                             type: object
 *                             properties:
 *                               id:
 *                                 type: string
 *                               type:
 *                                 type: string
 *                                 example: expense
 *                               icon:
 *                                 type: string
 *                               category:
 *                                 type: string
 *                               amount:
 *                                 type: number
 *                               date:
 *                                 type: string
 *                                 format: date
 *                     last60DaysIncome:
 *                       type: object
 *                       properties:
 *                         total:
 *                           type: number
 *                           example: 5000
 *                         transactions:
 *                           type: array
 *                           items:
 *                             type: object
 *                             properties:
 *                               id:
 *                                 type: string
 *                               type:
 *                                 type: string
 *                                 example: income
 *                               icon:
 *                                 type: string
 *                               source:
 *                                 type: string
 *                               amount:
 *                                 type: number
 *                               date:
 *                                 type: string
 *                                 format: date
 *                     recentTransactions:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: string
 *                           type:
 *                             type: string
 *                           icon:
 *                             type: string
 *                           source:
 *                             type: string
 *                           category:
 *                             type: string
 *                           amount:
 *                             type: number
 *                           date:
 *                             type: string
 *                             format: date
 *       401:
 *         description: Unauthorized
 */
export const getDashboard = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'Unauthorized'
      } as DashboardResponse)
      return
    }

    const dashboardData = await getDashboardData(req.user._id.toString())

    res.status(200).json({
      success: true,
      message: 'Dashboard data retrieved successfully',
      data: dashboardData
    } as DashboardResponse)
  } catch (error) {
    logger.error(`Dashboard error: ${error}`)
    res.status(400).json({
      success: false,
      message: error instanceof Error ? error.message : 'Failed to get dashboard data'
    } as DashboardResponse)
  }
}

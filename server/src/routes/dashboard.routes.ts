import { Router } from 'express'
import { getDashboard } from '../controllers/dashboard.controller'
import { authenticate } from '../middlewares/auth.middleware'

const router = Router()

/**
 * @swagger
 * tags:
 *   name: Dashboard
 *   description: Dashboard endpoints
 */

// GET /api/dashboard - Get dashboard data
router.get('/', authenticate, getDashboard)

export default router

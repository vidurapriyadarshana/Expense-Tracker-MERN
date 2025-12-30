import { Router } from 'express'
import { register, login, profile } from '../controllers/auth.controller'
import { authenticate } from '../middlewares/auth.middleware'

const router = Router()

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication endpoints
 */

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */

// POST /api/auth/register
router.post('/register', register)

// POST /api/auth/login
router.post('/login', login)

// GET /api/auth/profile (protected)
router.get('/profile', authenticate, profile)

export default router

import { Router } from 'express'
import { register, login, profile, googleAuth, googleCallback, refreshToken, logout } from '../controllers/auth.controller'
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

// POST /api/auth/refresh-token
router.post('/refresh-token', refreshToken)

// POST /api/auth/logout
router.post('/logout', logout)

/**
 * @swagger
 * /api/auth/google:
 *   get:
 *     summary: Initiate Google OAuth login
 *     tags: [Auth]
 *     description: Redirects to Google for authentication
 *     responses:
 *       302:
 *         description: Redirect to Google OAuth
 */
router.get('/google', googleAuth)

/**
 * @swagger
 * /api/auth/google/callback:
 *   get:
 *     summary: Google OAuth callback
 *     tags: [Auth]
 *     description: Handles Google OAuth callback and returns JWT token
 *     responses:
 *       302:
 *         description: Redirects to frontend with token
 *       401:
 *         description: Authentication failed
 */
router.get('/google/callback', googleCallback)

export default router

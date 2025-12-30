import { Request, Response } from 'express'
import { registerUser, loginUser, getUserProfile } from '../services/auth.service'
import { AuthRequest, AuthResponse } from '../types/auth.types'
import logger from '../configurations/logger.config'

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - fullName
 *               - email
 *               - password
 *             properties:
 *               fullName:
 *                 type: string
 *                 example: John Doe
 *               email:
 *                 type: string
 *                 example: john@example.com
 *               password:
 *                 type: string
 *                 example: password123
 *               profileUrl:
 *                 type: string
 *                 example: https://example.com/profile.jpg
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Bad request
 */
export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { fullName, email, password, profileUrl } = req.body

    if (!fullName || !email || !password) {
      res.status(400).json({
        success: false,
        message: 'Please provide fullName, email and password'
      } as AuthResponse)
      return
    }

    const { user, token } = await registerUser({ fullName, email, password, profileUrl })

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        user: {
          id: user._id.toString(),
          fullName: user.fullName,
          email: user.email,
          profileUrl: user.profileUrl
        },
        token
      }
    } as AuthResponse)
  } catch (error) {
    logger.error(`Registration error: ${error}`)
    res.status(400).json({
      success: false,
      message: error instanceof Error ? error.message : 'Registration failed'
    } as AuthResponse)
  }
}

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: john@example.com
 *               password:
 *                 type: string
 *                 example: password123
 *     responses:
 *       200:
 *         description: Login successful
 *       401:
 *         description: Invalid credentials
 */
export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      res.status(400).json({
        success: false,
        message: 'Please provide email and password'
      } as AuthResponse)
      return
    }

    const { user, token } = await loginUser({ email, password })

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        user: {
          id: user._id.toString(),
          fullName: user.fullName,
          email: user.email,
          profileUrl: user.profileUrl
        },
        token
      }
    } as AuthResponse)
  } catch (error) {
    logger.error(`Login error: ${error}`)
    res.status(401).json({
      success: false,
      message: error instanceof Error ? error.message : 'Login failed'
    } as AuthResponse)
  }
}

/**
 * @swagger
 * /api/auth/profile:
 *   get:
 *     summary: Get user profile
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile retrieved successfully
 *       401:
 *         description: Unauthorized
 */
export const profile = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'Unauthorized'
      } as AuthResponse)
      return
    }

    const user = await getUserProfile(req.user._id.toString())

    res.status(200).json({
      success: true,
      message: 'Profile retrieved successfully',
      data: {
        user: {
          id: user._id.toString(),
          fullName: user.fullName,
          email: user.email,
          profileUrl: user.profileUrl
        }
      }
    } as AuthResponse)
  } catch (error) {
    logger.error(`Profile error: ${error}`)
    res.status(400).json({
      success: false,
      message: error instanceof Error ? error.message : 'Failed to get profile'
    } as AuthResponse)
  }
}

import { Request, Response, NextFunction } from 'express'
import { registerUser, loginUser, getUserProfile, generateToken } from '../services/auth.service'
import { AuthResponse } from '../types/auth.types'
import logger from '../configurations/logger.config'
import passport from '../configurations/passport.config'
import { IUser } from '../models/user.model'
import env from '../configurations/env.config'

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
export const profile = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = req.user as IUser | undefined
    if (!user) {
      res.status(401).json({
        success: false,
        message: 'Unauthorized'
      } as AuthResponse)
      return
    }

    const userProfile = await getUserProfile(user._id.toString())

    res.status(200).json({
      success: true,
      message: 'Profile retrieved successfully',
      data: {
        user: {
          id: userProfile._id.toString(),
          fullName: userProfile.fullName,
          email: userProfile.email,
          profileUrl: userProfile.profileUrl
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

/**
 * @swagger
 * /api/auth/google:
 *   get:
 *     summary: Initiate Google OAuth login
 *     tags: [Auth]
 *     description: Redirects to Google for authentication. The frontend only needs to call this endpoint.
 *     responses:
 *       302:
 *         description: Redirect to Google OAuth consent screen
 */
export const googleAuth = (req: Request, res: Response, next: NextFunction): void => {
  passport.authenticate('google', {
    scope: ['profile', 'email'],
    session: false
  })(req, res, next)
}

/**
 * @swagger
 * /api/auth/google/callback:
 *   get:
 *     summary: Google OAuth callback
 *     tags: [Auth]
 *     description: Handles the callback from Google OAuth and redirects to frontend with JWT token
 *     responses:
 *       302:
 *         description: Redirects to frontend with token in URL query parameter
 *       401:
 *         description: Authentication failed
 */
export const googleCallback = (req: Request, res: Response, next: NextFunction): void => {
  passport.authenticate('google', { session: false }, (err: Error | null, user: IUser | false) => {
    if (err) {
      logger.error(`Google OAuth error: ${err.message}`)
      return res.redirect(`${env.CLIENT_URL}/login?error=${encodeURIComponent(err.message)}`)
    }

    if (!user) {
      logger.error('Google OAuth: No user returned')
      return res.redirect(`${env.CLIENT_URL}/login?error=${encodeURIComponent('Authentication failed')}`)
    }

    // Generate JWT token
    const token = generateToken(user)

    // Redirect to frontend with token
    res.redirect(`${env.CLIENT_URL}/auth/google/callback?token=${token}`)
  })(req, res, next)
}

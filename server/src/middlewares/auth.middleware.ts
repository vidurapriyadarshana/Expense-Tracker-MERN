import { Response, NextFunction } from 'express'
import { verifyToken } from '../services/auth.service'
import User from '../models/user.model'
import { AuthRequest } from '../types/auth.types'
import logger from '../configurations/logger.config'

export const authenticate = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({
        success: false,
        message: 'Access denied. No token provided'
      })
      return
    }

    const token = authHeader.split(' ')[1]

    // Verify token
    const decoded = verifyToken(token)

    // Get user from database
    const user = await User.findById(decoded.userId)
    if (!user) {
      res.status(401).json({
        success: false,
        message: 'User not found'
      })
      return
    }

    // Attach user to request
    req.user = user
    next()
  } catch (error) {
    logger.error(`Authentication error: ${error}`)
    res.status(401).json({
      success: false,
      message: error instanceof Error ? error.message : 'Authentication failed'
    })
  }
}

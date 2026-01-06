import { Request } from 'express'
import { IUser } from '../models/user.model'

// Extend Express Request interface globally
declare global {
  namespace Express {
    interface User extends IUser {}
  }
}

export interface RegisterDto {
  fullName: string
  email: string
  password: string
  profileUrl?: string
}

export interface LoginDto {
  email: string
  password: string
}

export interface AuthResponse {
  success: boolean
  message: string
  data?: {
    user: {
      id: string
      fullName: string
      email: string
      profileUrl: string
    }
    token?: string
  }
}

export interface JwtPayload {
  userId: string
  email: string
}

export interface AuthRequest extends Request {
  user?: IUser
}

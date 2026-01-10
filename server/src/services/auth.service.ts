import jwt, { SignOptions } from 'jsonwebtoken'
import User, { IUser } from '../models/user.model'
import env from '../configurations/env.config'
import { RegisterDto, LoginDto, JwtPayload } from '../types/auth.types'

export const generateAccessToken = (user: IUser): string => {
  const payload: JwtPayload = {
    userId: user._id.toString(),
    email: user.email
  }

  const options: SignOptions = {
    expiresIn: '15m'
  }

  return jwt.sign(payload, env.JWT_SECRET, options)
}

export const generateRefreshToken = (user: IUser): string => {
  const payload: JwtPayload = {
    userId: user._id.toString(),
    email: user.email
  }

  const options: SignOptions = {
    expiresIn: '7d'
  }

  return jwt.sign(payload, env.JWT_SECRET, options)
}

export const registerUser = async (data: RegisterDto): Promise<{ user: IUser; accessToken: string; refreshToken: string }> => {
  const { fullName, email, password, profileUrl } = data

  // Check if user already exists
  const existingUser = await User.findOne({ email })
  if (existingUser) {
    throw new Error('User with this email already exists')
  }

  // Create new user
  const user = await User.create({
    fullName,
    email,
    password,
    profileUrl: profileUrl || ''
  })

  // Generate tokens
  const accessToken = generateAccessToken(user)
  const refreshToken = generateRefreshToken(user)

  // Save refresh token to user
  user.refreshTokens = [refreshToken]
  await user.save()

  return { user, accessToken, refreshToken }
}

export const loginUser = async (data: LoginDto): Promise<{ user: IUser; accessToken: string; refreshToken: string }> => {
  const { email, password } = data

  // Find user and include password field
  const user = await User.findOne({ email }).select('+password')
  if (!user) {
    throw new Error('Invalid email or password')
  }

  // Check password
  const isPasswordValid = await user.comparePassword(password)
  if (!isPasswordValid) {
    throw new Error('Invalid email or password')
  }

  // Generate tokens
  // Generate tokens
  const accessToken = generateAccessToken(user)
  const refreshToken = generateRefreshToken(user)

  // Manage refresh tokens (max 5)
  let refreshTokens = user.refreshTokens || []
  refreshTokens.push(refreshToken)

  if (refreshTokens.length > 5) {
    // Remove oldest tokens to keep only last 5
    refreshTokens = refreshTokens.slice(-5)
  }

  user.refreshTokens = refreshTokens
  await user.save()

  return { user, accessToken, refreshToken }
}

export const revokeRefreshToken = async (userId: string, token: string): Promise<void> => {
  const user = await User.findById(userId)
  if (!user) return

  const originalLength = user.refreshTokens ? user.refreshTokens.length : 0
  user.refreshTokens = user.refreshTokens.filter(t => t !== token)

  if (user.refreshTokens.length !== originalLength) {
    await user.save()
  }
}

export const verifyRefreshTokenInDb = async (token: string): Promise<IUser> => {
  const decoded = verifyToken(token)
  const user = await getUserProfile(decoded.userId)

  if (!user.refreshTokens || !user.refreshTokens.includes(token)) {
    throw new Error('Invalid or revoked refresh token')
  }

  return user
}

export const getUserProfile = async (userId: string): Promise<IUser> => {
  const user = await User.findById(userId)
  if (!user) {
    throw new Error('User not found')
  }

  return user
}

export const verifyToken = (token: string): JwtPayload => {
  try {
    const decoded = jwt.verify(token, env.JWT_SECRET) as JwtPayload
    return decoded
  } catch (error) {
    throw new Error('Invalid or expired token')
  }
}

import jwt, { SignOptions } from 'jsonwebtoken'
import User, { IUser } from '../models/user.model'
import env from '../configurations/env.config'
import { RegisterDto, LoginDto, JwtPayload } from '../types/auth.types'

const generateToken = (user: IUser): string => {
  const payload: JwtPayload = {
    userId: user._id.toString(),
    email: user.email
  }

  const options: SignOptions = {
    expiresIn: env.JWT_EXPIRES_IN as jwt.SignOptions['expiresIn']
  }

  return jwt.sign(payload, env.JWT_SECRET, options)
}

export const registerUser = async (data: RegisterDto): Promise<{ user: IUser; token: string }> => {
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

  // Generate token
  const token = generateToken(user)

  return { user, token }
}

export const loginUser = async (data: LoginDto): Promise<{ user: IUser; token: string }> => {
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

  // Generate token
  const token = generateToken(user)

  return { user, token }
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

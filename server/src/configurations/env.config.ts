import dotenv from 'dotenv'
import path from 'path'
import { EnvConfig } from '../types/env.types'

// Load environment variables from .env file
dotenv.config({ path: path.resolve(process.cwd(), '.env') })

const env: EnvConfig = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: parseInt(process.env.PORT || '3000', 10),
  MONGO_URI: process.env.MONGO_URI || '',
  JWT_SECRET: process.env.JWT_SECRET || 'your-secret-key-change-in-production',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
  CLIENT_URL: process.env.CLIENT_URL || 'http://localhost:5173'
}

export default env

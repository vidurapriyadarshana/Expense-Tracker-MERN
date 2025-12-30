import swaggerJsdoc from 'swagger-jsdoc'
import { SwaggerOptions } from '../types/swagger.types'
import env from './env.config'

const swaggerOptions: SwaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Expense Tracker API',
      version: '1.0.0',
      description: 'API documentation for Expense Tracker application',
      contact: {
        name: 'API Support'
      }
    },
    servers: [
      {
        url: `http://localhost:${env.PORT}`,
        description: 'Development server'
      }
    ]
  },
  apis: ['./src/**/*.ts']
}

const swaggerSpec = swaggerJsdoc(swaggerOptions)

export default swaggerSpec

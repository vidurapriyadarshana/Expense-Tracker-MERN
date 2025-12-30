import express, { Application } from 'express'
import cors from 'cors'
import * as swaggerUi from 'swagger-ui-express'
import morganMiddleware from './configurations/morgan.config'
import swaggerSpec from './configurations/swagger.config'
import authRoutes from './routes/auth.routes'

const app: Application = express()

// Middleware
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(morganMiddleware)

// Swagger Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))

// Routes
app.use('/api/auth', authRoutes)

/**
 * @swagger
 * /health:
 *   get:
 *     summary: Health check endpoint
 *     description: Returns the health status of the server
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: Server is healthy
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: ok
 *                 timestamp:
 *                   type: string
 *                   example: 2025-12-30T17:00:00.000Z
 */
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString()
  })
})

export default app

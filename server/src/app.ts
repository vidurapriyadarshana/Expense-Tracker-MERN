import express, { Application } from 'express'
import * as swaggerUi from 'swagger-ui-express'
import morganMiddleware from './configurations/morgan.config'
import swaggerSpec from './configurations/swagger.config'

const app: Application = express()

// Middleware
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(morganMiddleware)

// Swagger Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))

// Routes
/**
 * @swagger
 * /:
 *   get:
 *     summary: Welcome endpoint
 *     description: Returns a welcome message
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example: Hello World!
 */
app.get('/', (req, res) => {
  res.send('Hello World!')
})

export default app

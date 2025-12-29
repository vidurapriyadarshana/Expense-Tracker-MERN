import express, { Application } from 'express'
import morganMiddleware from './configurations/morgan.config'

const app: Application = express()

// Middleware
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(morganMiddleware)

// Routes
app.get('/', (req, res) => {
  res.send('Hello World!')
})

export default app

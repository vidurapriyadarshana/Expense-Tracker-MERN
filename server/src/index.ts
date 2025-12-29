import env from './configurations/env.config'
import app from './app'
import logger from './configurations/logger.config'

app.listen(env.PORT, () => {
  logger.info(`Server is running on port ${env.PORT} in ${env.NODE_ENV} mode`)
})

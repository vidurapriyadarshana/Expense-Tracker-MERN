export interface SwaggerOptions {
  definition: {
    openapi: string
    info: {
      title: string
      version: string
      description: string
      contact?: {
        name?: string
        email?: string
        url?: string
      }
    }
    servers: Array<{
      url: string
      description: string
    }>
  }
  apis: string[]
}

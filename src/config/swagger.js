import swaggerJsdoc from 'swagger-jsdoc'

export const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'RM Studio API',
      version: '1.0.0',
      description: 'API de Agendamento do Salão'
    },
    servers: [
      {
        url: 'http://localhost:3001'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      }
    },
    security: [{ bearerAuth: [] }]
  },

  apis: ['./src/routes/*.js']
}

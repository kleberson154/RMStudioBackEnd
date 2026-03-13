import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'
import dotenv from 'dotenv'

import authRoutes from './routes/auth.routes.js'
import appointmentRoutes from './routes/appointment.routes.js'
import dateRoutes from './routes/date.routes.js'
import serviceRoutes from './routes/service.routes.js'

dotenv.config()

const app = express()

//Swagger
import swaggerUi from 'swagger-ui-express'
import swaggerJsdoc from 'swagger-jsdoc'
import { swaggerOptions } from './config/swagger.js'

const specs = swaggerJsdoc(swaggerOptions)
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs))

app.use(
  cors({
    origin: ['https://rmstudio.vercel.app', 'https://rmstudioadmin.vercel.app']
  })
)
app.use(express.json())

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB Conectado!'))
  .catch(err => console.error('Erro ao conectar ao MongoDB:', err))

app.use('/auth', authRoutes)
app.use('/agendamentos', appointmentRoutes)
app.use('/datas', dateRoutes)
app.use('/servicos', serviceRoutes)

app.listen(3000, () => {
  console.log('API rodando na porta 3000')
})

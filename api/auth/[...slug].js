// Serverless function para rotas de autenticação no Vercel
import express from 'express'
import cors from 'cors'
import authRoutes from '../../server/routes/auth.js'

const app = express()

app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  credentials: true
}))
app.use(express.json())

app.use('/', authRoutes)

// Export para Vercel serverless functions
export default app


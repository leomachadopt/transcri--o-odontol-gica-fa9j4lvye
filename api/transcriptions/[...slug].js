// Serverless function para rotas de transcrições no Vercel
import express from 'express'
import cors from 'cors'
import transcriptionRoutes from '../../server/routes/transcriptions.js'

const app = express()

app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  credentials: true
}))
app.use(express.json())

app.use('/', transcriptionRoutes)

// Export para Vercel serverless functions
export default app


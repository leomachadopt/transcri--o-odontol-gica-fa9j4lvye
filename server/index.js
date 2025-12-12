import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import authRoutes from './routes/auth.js'
import transcriptionRoutes from './routes/transcriptions.js'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3001

// Middlewares
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}))
app.use(express.json())

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Servidor rodando' })
})

// Rotas
app.use('/api/auth', authRoutes)
app.use('/api/transcriptions', transcriptionRoutes)

// Rota 404
app.use((req, res) => {
  res.status(404).json({ error: 'Rota não encontrada' })
})

// Error handler
app.use((err, req, res, next) => {
  console.error('Erro não tratado:', err)
  res.status(500).json({ error: 'Erro interno do servidor' })
})

app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`)
  console.log(`📡 API disponível em http://localhost:${PORT}`)
})


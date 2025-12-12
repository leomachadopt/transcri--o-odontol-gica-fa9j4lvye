// Handler para listar e criar transcrições
import jwt from 'jsonwebtoken'
import pool from '../../server/config/db.js'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production'

function authenticateToken(req) {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]

  if (!token) {
    throw new Error('Token de acesso não fornecido')
  }

  try {
    return jwt.verify(token, JWT_SECRET)
  } catch (err) {
    throw new Error('Token inválido ou expirado')
  }
}

export default async function handler(req, res) {
  // Habilitar CORS
  res.setHeader('Access-Control-Allow-Origin', process.env.FRONTEND_URL || '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  res.setHeader('Access-Control-Allow-Credentials', 'true')

  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  try {
    const user = authenticateToken(req)

    // GET - Listar todas as transcrições
    if (req.method === 'GET') {
      const result = await pool.query(
        `SELECT id, user_id as "userId", text, timestamp, created_at, updated_at
         FROM transcriptions 
         WHERE user_id = $1 
         ORDER BY timestamp DESC`,
        [user.id]
      )

      return res.json({
        transcriptions: result.rows.map(row => ({
          id: row.id,
          userId: row.userId,
          text: row.text,
          timestamp: Number(row.timestamp),
        })),
      })
    }

    // POST - Criar nova transcrição
    if (req.method === 'POST') {
      const { text, timestamp } = req.body

      if (!text || text.trim() === '') {
        return res.status(400).json({ error: 'O texto da transcrição é obrigatório' })
      }

      if (!timestamp) {
        return res.status(400).json({ error: 'O timestamp é obrigatório' })
      }

      const result = await pool.query(
        `INSERT INTO transcriptions (user_id, text, timestamp)
         VALUES ($1, $2, $3)
         RETURNING id, user_id as "userId", text, timestamp`,
        [user.id, text.trim(), timestamp]
      )

      const row = result.rows[0]
      return res.status(201).json({
        id: row.id,
        userId: row.userId,
        text: row.text,
        timestamp: Number(row.timestamp),
      })
    }

    return res.status(405).json({ error: 'Método não permitido' })
  } catch (error) {
    if (error.message === 'Token de acesso não fornecido') {
      return res.status(401).json({ error: error.message })
    }
    if (error.message === 'Token inválido ou expirado') {
      return res.status(403).json({ error: error.message })
    }
    console.error('Erro:', error)
    return res.status(500).json({ error: 'Erro interno do servidor' })
  }
}


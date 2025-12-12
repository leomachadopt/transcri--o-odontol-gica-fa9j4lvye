// Handler para operações em uma transcrição específica
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
  res.setHeader('Access-Control-Allow-Methods', 'GET, PUT, DELETE, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  res.setHeader('Access-Control-Allow-Credentials', 'true')

  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  const { id } = req.query

  try {
    const user = authenticateToken(req)

    // GET - Buscar transcrição específica
    if (req.method === 'GET') {
      const result = await pool.query(
        `SELECT id, user_id as "userId", text, timestamp, created_at, updated_at
         FROM transcriptions 
         WHERE id = $1 AND user_id = $2`,
        [id, user.id]
      )

      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Transcrição não encontrada' })
      }

      const row = result.rows[0]
      return res.json({
        id: row.id,
        userId: row.userId,
        text: row.text,
        timestamp: Number(row.timestamp),
      })
    }

    // PUT - Atualizar transcrição
    if (req.method === 'PUT') {
      const { text } = req.body

      if (!text || text.trim() === '') {
        return res.status(400).json({ error: 'O texto da transcrição é obrigatório' })
      }

      // Verificar se a transcrição existe e pertence ao usuário
      const checkResult = await pool.query(
        'SELECT id FROM transcriptions WHERE id = $1 AND user_id = $2',
        [id, user.id]
      )

      if (checkResult.rows.length === 0) {
        return res.status(404).json({ error: 'Transcrição não encontrada' })
      }

      // Atualizar
      const result = await pool.query(
        `UPDATE transcriptions 
         SET text = $1, updated_at = CURRENT_TIMESTAMP
         WHERE id = $2 AND user_id = $3
         RETURNING id, user_id as "userId", text, timestamp`,
        [text.trim(), id, user.id]
      )

      const row = result.rows[0]
      return res.json({
        id: row.id,
        userId: row.userId,
        text: row.text,
        timestamp: Number(row.timestamp),
      })
    }

    // DELETE - Deletar transcrição
    if (req.method === 'DELETE') {
      // Verificar se a transcrição existe e pertence ao usuário
      const checkResult = await pool.query(
        'SELECT id FROM transcriptions WHERE id = $1 AND user_id = $2',
        [id, user.id]
      )

      if (checkResult.rows.length === 0) {
        return res.status(404).json({ error: 'Transcrição não encontrada' })
      }

      // Deletar
      await pool.query(
        'DELETE FROM transcriptions WHERE id = $1 AND user_id = $2',
        [id, user.id]
      )

      return res.json({ message: 'Transcrição excluída com sucesso' })
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


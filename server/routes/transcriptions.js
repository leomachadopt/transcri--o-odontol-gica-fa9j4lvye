import express from 'express'
import pool from '../config/db.js'
import { authenticateToken } from '../middleware/auth.js'

const router = express.Router()

// Todas as rotas requerem autenticação
router.use(authenticateToken)

// Listar todas as transcrições do usuário
router.get('/', async (req, res) => {
  try {
    const userId = req.user.id

    const result = await pool.query(
      `SELECT id, user_id as "userId", text, timestamp, created_at, updated_at
       FROM transcriptions 
       WHERE user_id = $1 
       ORDER BY timestamp DESC`,
      [userId]
    )

    res.json({
      transcriptions: result.rows.map(row => ({
        id: row.id,
        userId: row.userId,
        text: row.text,
        timestamp: Number(row.timestamp),
      })),
    })
  } catch (error) {
    console.error('Erro ao buscar transcrições:', error)
    res.status(500).json({ error: 'Erro interno do servidor' })
  }
})

// Buscar uma transcrição específica
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params
    const userId = req.user.id

    const result = await pool.query(
      `SELECT id, user_id as "userId", text, timestamp, created_at, updated_at
       FROM transcriptions 
       WHERE id = $1 AND user_id = $2`,
      [id, userId]
    )

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Transcrição não encontrada' })
    }

    const row = result.rows[0]
    res.json({
      id: row.id,
      userId: row.userId,
      text: row.text,
      timestamp: Number(row.timestamp),
    })
  } catch (error) {
    console.error('Erro ao buscar transcrição:', error)
    res.status(500).json({ error: 'Erro interno do servidor' })
  }
})

// Criar nova transcrição
router.post('/', async (req, res) => {
  try {
    const { text, timestamp } = req.body
    const userId = req.user.id

    // Validação
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
      [userId, text.trim(), timestamp]
    )

    const row = result.rows[0]
    res.status(201).json({
      id: row.id,
      userId: row.userId,
      text: row.text,
      timestamp: Number(row.timestamp),
    })
  } catch (error) {
    console.error('Erro ao criar transcrição:', error)
    res.status(500).json({ error: 'Erro interno do servidor' })
  }
})

// Atualizar transcrição
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params
    const { text } = req.body
    const userId = req.user.id

    // Validação
    if (!text || text.trim() === '') {
      return res.status(400).json({ error: 'O texto da transcrição é obrigatório' })
    }

    // Verificar se a transcrição existe e pertence ao usuário
    const checkResult = await pool.query(
      'SELECT id FROM transcriptions WHERE id = $1 AND user_id = $2',
      [id, userId]
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
      [text.trim(), id, userId]
    )

    const row = result.rows[0]
    res.json({
      id: row.id,
      userId: row.userId,
      text: row.text,
      timestamp: Number(row.timestamp),
    })
  } catch (error) {
    console.error('Erro ao atualizar transcrição:', error)
    res.status(500).json({ error: 'Erro interno do servidor' })
  }
})

// Deletar transcrição
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params
    const userId = req.user.id

    // Verificar se a transcrição existe e pertence ao usuário
    const checkResult = await pool.query(
      'SELECT id FROM transcriptions WHERE id = $1 AND user_id = $2',
      [id, userId]
    )

    if (checkResult.rows.length === 0) {
      return res.status(404).json({ error: 'Transcrição não encontrada' })
    }

    // Deletar
    await pool.query(
      'DELETE FROM transcriptions WHERE id = $1 AND user_id = $2',
      [id, userId]
    )

    res.json({ message: 'Transcrição excluída com sucesso' })
  } catch (error) {
    console.error('Erro ao deletar transcrição:', error)
    res.status(500).json({ error: 'Erro interno do servidor' })
  }
})

export default router


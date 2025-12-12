// Handler para operações em um usuário específico (apenas admin)
import jwt from 'jsonwebtoken'
import pool from '../../../../server/config/db.js'
import bcrypt from 'bcryptjs'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production'

async function authenticateAdmin(req) {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]

  if (!token) {
    throw new Error('Token de acesso não fornecido')
  }

  const decoded = jwt.verify(token, JWT_SECRET)

  // Verificar se o usuário é admin
  const result = await pool.query(
    'SELECT id, email, role FROM users WHERE id = $1',
    [decoded.id]
  )

  if (result.rows.length === 0) {
    throw new Error('Usuário não encontrado')
  }

  const user = result.rows[0]
  
  if (user.role !== 'admin') {
    throw new Error('Acesso negado. Apenas administradores podem acessar esta rota.')
  }

  return decoded
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
    await authenticateAdmin(req)

    // GET - Buscar usuário específico
    if (req.method === 'GET') {
      const result = await pool.query(
        'SELECT id, name, email, role, created_at, updated_at FROM users WHERE id = $1',
        [id]
      )

      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Usuário não encontrado' })
      }

      return res.json({ user: result.rows[0] })
    }

    // PUT - Atualizar usuário
    if (req.method === 'PUT') {
      const { name, email, password, role } = req.body

      // Verificar se o usuário existe
      const checkResult = await pool.query(
        'SELECT id FROM users WHERE id = $1',
        [id]
      )

      if (checkResult.rows.length === 0) {
        return res.status(404).json({ error: 'Usuário não encontrado' })
      }

      // Preparar campos para atualização
      const updates = []
      const values = []
      let paramCount = 1

      if (name) {
        updates.push(`name = $${paramCount++}`)
        values.push(name)
      }

      if (email) {
        // Verificar se o email já está em uso por outro usuário
        const emailCheck = await pool.query(
          'SELECT id FROM users WHERE email = $1 AND id != $2',
          [email, id]
        )
        if (emailCheck.rows.length > 0) {
          return res.status(409).json({ error: 'Este email já está em uso por outro usuário' })
        }
        updates.push(`email = $${paramCount++}`)
        values.push(email)
      }

      if (password) {
        if (password.length < 6) {
          return res.status(400).json({ error: 'A senha deve ter pelo menos 6 caracteres' })
        }
        const salt = await bcrypt.genSalt(10)
        const passwordHash = await bcrypt.hash(password, salt)
        updates.push(`password_hash = $${paramCount++}`)
        values.push(passwordHash)
      }

      if (role) {
        if (!['user', 'admin'].includes(role)) {
          return res.status(400).json({ error: 'Role inválido. Use "user" ou "admin"' })
        }
        updates.push(`role = $${paramCount++}`)
        values.push(role)
      }

      if (updates.length === 0) {
        return res.status(400).json({ error: 'Nenhum campo para atualizar' })
      }

      values.push(id)
      const query = `UPDATE users SET ${updates.join(', ')}, updated_at = CURRENT_TIMESTAMP WHERE id = $${paramCount} RETURNING id, name, email, role, created_at, updated_at`

      const result = await pool.query(query, values)

      return res.json({
        message: 'Usuário atualizado com sucesso',
        user: result.rows[0]
      })
    }

    // DELETE - Deletar usuário
    if (req.method === 'DELETE') {
      // Verificar se o usuário existe
      const checkResult = await pool.query(
        'SELECT id FROM users WHERE id = $1',
        [id]
      )

      if (checkResult.rows.length === 0) {
        return res.status(404).json({ error: 'Usuário não encontrado' })
      }

      // Não permitir deletar a si mesmo
      const adminUser = await authenticateAdmin(req)
      if (adminUser.id === id) {
        return res.status(400).json({ error: 'Você não pode deletar sua própria conta' })
      }

      // Deletar usuário (cascade deleta transcrições)
      await pool.query('DELETE FROM users WHERE id = $1', [id])

      return res.json({ message: 'Usuário excluído com sucesso' })
    }

    return res.status(405).json({ error: 'Método não permitido' })
  } catch (error) {
    if (error.message === 'Token de acesso não fornecido') {
      return res.status(401).json({ error: error.message })
    }
    if (error.message.includes('Acesso negado') || error.message === 'Token inválido ou expirado') {
      return res.status(403).json({ error: error.message })
    }
    console.error('Erro:', error)
    return res.status(500).json({ error: 'Erro interno do servidor' })
  }
}


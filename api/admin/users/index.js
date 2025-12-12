// Handler para listar todos os usuários (apenas admin)
import jwt from 'jsonwebtoken'
import pool from '../../../server/config/db.js'

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
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  res.setHeader('Access-Control-Allow-Credentials', 'true')

  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  try {
    await authenticateAdmin(req)

    // GET - Listar todos os usuários
    if (req.method === 'GET') {
      const { search, page = 1, limit = 20 } = req.query
      const offset = (page - 1) * limit

      let query = 'SELECT id, name, email, role, created_at, updated_at FROM users'
      const params = []
      
      if (search) {
        query += ' WHERE name ILIKE $1 OR email ILIKE $1'
        params.push(`%${search}%`)
      }
      
      query += ' ORDER BY created_at DESC LIMIT $' + (params.length + 1) + ' OFFSET $' + (params.length + 2)
      params.push(limit, offset)

      const result = await pool.query(query, params)
      
      // Contar total
      let countQuery = 'SELECT COUNT(*) FROM users'
      if (search) {
        countQuery += ' WHERE name ILIKE $1 OR email ILIKE $1'
      }
      const countResult = await pool.query(countQuery, search ? [`%${search}%`] : [])
      const total = parseInt(countResult.rows[0].count)

      return res.json({
        users: result.rows,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          totalPages: Math.ceil(total / limit)
        }
      })
    }

    // POST - Criar novo usuário
    if (req.method === 'POST') {
      const { name, email, password, role = 'user' } = req.body

      if (!name || !email || !password) {
        return res.status(400).json({ error: 'Nome, email e senha são obrigatórios' })
      }

      if (password.length < 6) {
        return res.status(400).json({ error: 'A senha deve ter pelo menos 6 caracteres' })
      }

      if (role && !['user', 'admin'].includes(role)) {
        return res.status(400).json({ error: 'Role inválido. Use "user" ou "admin"' })
      }

      // Verificar se o email já existe
      const existingUser = await pool.query(
        'SELECT id FROM users WHERE email = $1',
        [email]
      )

      if (existingUser.rows.length > 0) {
        return res.status(409).json({ error: 'Este email já está cadastrado' })
      }

      // Hash da senha
      const bcrypt = (await import('bcryptjs')).default
      const salt = await bcrypt.genSalt(10)
      const passwordHash = await bcrypt.hash(password, salt)

      // Inserir usuário
      const result = await pool.query(
        'INSERT INTO users (name, email, password_hash, role) VALUES ($1, $2, $3, $4) RETURNING id, name, email, role, created_at',
        [name, email, passwordHash, role]
      )

      const user = result.rows[0]
      // Não retornar password_hash
      delete user.password_hash

      return res.status(201).json({
        message: 'Usuário criado com sucesso',
        user
      })
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


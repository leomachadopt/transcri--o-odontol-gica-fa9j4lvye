// Handler para registro de usuário
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import pool from '../../server/config/db.js'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production'

export default async function handler(req, res) {
  // Habilitar CORS
  res.setHeader('Access-Control-Allow-Origin', process.env.FRONTEND_URL || '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  res.setHeader('Access-Control-Allow-Credentials', 'true')

  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' })
  }

  try {
    const { name, email, password } = req.body

    // Validação
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Todos os campos são obrigatórios' })
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'A senha deve ter pelo menos 6 caracteres' })
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
    const salt = await bcrypt.genSalt(10)
    const passwordHash = await bcrypt.hash(password, salt)

    // Inserir usuário
    const result = await pool.query(
      'INSERT INTO users (name, email, password_hash) VALUES ($1, $2, $3) RETURNING id, name, email, created_at',
      [name, email, passwordHash]
    )

    const user = result.rows[0]

    // Gerar token JWT
    const token = jwt.sign(
      { id: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: '7d' }
    )

    res.status(201).json({
      message: 'Conta criada com sucesso',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
      token,
    })
  } catch (error) {
    console.error('Erro no registro:', error)
    
    // Mensagens de erro mais específicas
    if (error.message && error.message.includes('relation') && error.message.includes('does not exist')) {
      return res.status(500).json({ 
        error: 'Tabelas do banco de dados não foram criadas. Execute a migração primeiro.',
        hint: 'Acesse /api/migrate para criar as tabelas'
      })
    }
    
    if (error.message && error.message.includes('connection')) {
      return res.status(500).json({ 
        error: 'Erro de conexão com o banco de dados. Verifique a DATABASE_URL.',
        details: error.message
      })
    }
    
    res.status(500).json({ 
      error: 'Erro interno do servidor',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    })
  }
}


// Endpoint para executar migração do banco de dados
import pool from '../server/config/db.js'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export default async function handler(req, res) {
  // Habilitar CORS
  res.setHeader('Access-Control-Allow-Origin', process.env.FRONTEND_URL || '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  // Proteção básica - apenas POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' })
  }

  try {
    console.log('🔄 Iniciando migração do banco de dados...')

    // Ler o arquivo SQL
    const sqlPath = path.join(__dirname, '../server/scripts/schema.sql')
    
    if (!fs.existsSync(sqlPath)) {
      return res.status(500).json({ 
        error: `Arquivo SQL não encontrado: ${sqlPath}` 
      })
    }

    const sql = fs.readFileSync(sqlPath, 'utf8')

    // Executar o SQL
    await pool.query(sql)
    
    console.log('✅ Migração concluída com sucesso!')
    
    res.status(200).json({ 
      message: 'Migração concluída com sucesso!',
      status: 'ok'
    })
  } catch (error) {
    console.error('❌ Erro na migração:', error)
    
    // Se a tabela já existe, não é um erro crítico
    if (error.message && error.message.includes('already exists')) {
      return res.status(200).json({ 
        message: 'Tabelas já existem no banco de dados',
        status: 'ok'
      })
    }
    
    res.status(500).json({ 
      error: 'Erro na migração',
      details: error.message 
    })
  }
}


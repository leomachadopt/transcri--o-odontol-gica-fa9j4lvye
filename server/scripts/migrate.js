import pool from '../config/db.js'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

async function migrate() {
  try {
    console.log('🔄 Iniciando migração do banco de dados...')

    // Ler o arquivo SQL
    const sqlPath = path.join(__dirname, 'schema.sql')
    
    if (!fs.existsSync(sqlPath)) {
      console.error(`❌ Arquivo SQL não encontrado: ${sqlPath}`)
      process.exit(1)
    }

    const sql = fs.readFileSync(sqlPath, 'utf8')

    // Executar o SQL
    await pool.query(sql)
    
    console.log('✅ Migração concluída com sucesso!')
    await pool.end()
    process.exit(0)
  } catch (error) {
    console.error('❌ Erro na migração:', error)
    await pool.end()
    process.exit(1)
  }
}

migrate()


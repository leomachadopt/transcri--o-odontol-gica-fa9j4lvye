import pg from 'pg'
import dotenv from 'dotenv'

dotenv.config()

const { Pool } = pg

// Parse da string de conexão do Neon
const connectionString = process.env.DATABASE_URL || 
  'postgresql://neondb_owner:npg_sMujr92NShOR@ep-bitter-cell-abimf2cn-pooler.eu-west-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require'

export const pool = new Pool({
  connectionString,
  ssl: {
    rejectUnauthorized: false
  }
})

// Testar conexão
pool.on('connect', () => {
  console.log('✅ Conectado ao banco de dados Neon')
})

pool.on('error', (err) => {
  console.error('❌ Erro inesperado no pool de conexões:', err)
  process.exit(-1)
})

export default pool


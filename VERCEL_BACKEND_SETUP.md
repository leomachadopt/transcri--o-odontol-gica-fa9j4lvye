# Configuração do Backend no Vercel

## ✅ Backend no Mesmo Projeto (Configurado)

O backend está configurado para rodar como serverless functions no Vercel através da pasta `api/`.

### Configuração de Variáveis de Ambiente no Vercel

No painel do Vercel, configure as seguintes variáveis de ambiente:

#### Para o Frontend:
- **Nome:** `VITE_API_URL`
- **Valor:** `https://transcri-o-odontol-gica-fa9j4lvye.vercel.app/api`
- **Ambiente:** Production, Preview, Development

#### Para o Backend (Serverless Functions):
- **Nome:** `DATABASE_URL`
- **Valor:** `postgresql://neondb_owner:npg_sMujr92NShOR@ep-bitter-cell-abimf2cn-pooler.eu-west-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require`
- **Ambiente:** Production, Preview, Development

- **Nome:** `JWT_SECRET`
- **Valor:** (gere uma chave secreta forte, ex: `openssl rand -base64 32`)
- **Ambiente:** Production, Preview, Development

- **Nome:** `FRONTEND_URL`
- **Valor:** `https://transcri-o-odontol-gica-fa9j4lvye.vercel.app`
- **Ambiente:** Production, Preview, Development

### Como Funciona

1. O Vercel detecta automaticamente a pasta `api/` e cria serverless functions
2. As rotas `/api/*` são redirecionadas para a função serverless
3. O frontend em `/` serve os arquivos estáticos do build

### Estrutura de URLs

- **Frontend:** `https://transcri-o-odontol-gica-fa9j4lvye.vercel.app/`
- **API:** `https://transcri-o-odontol-gica-fa9j4lvye.vercel.app/api/auth/...`
- **API:** `https://transcri-o-odontol-gica-fa9j4lvye.vercel.app/api/transcriptions/...`

## Opção 2: Backend em Projeto Separado

Se preferir separar frontend e backend:

### 1. Criar Novo Projeto no Vercel para o Backend

1. Crie um novo repositório/projeto no Vercel
2. Configure as variáveis de ambiente do backend
3. Deploy do backend

### 2. Configurar Frontend

No projeto do frontend, configure:

- **Nome:** `VITE_API_URL`
- **Valor:** `https://seu-backend.vercel.app/api`
- **Ambiente:** Production, Preview, Development

## Verificação

Após o deploy, teste:

1. **Health Check:**
   ```
   https://transcri-o-odontol-gica-fa9j4lvye.vercel.app/api/health
   ```
   Deve retornar: `{"status":"ok","message":"Servidor rodando"}`

2. **Teste de Registro:**
   - Acesse o frontend
   - Tente criar uma conta
   - Verifique se funciona

## Migração do Banco de Dados

⚠️ **Importante:** Execute a migração do banco de dados antes de usar:

```bash
npm run db:migrate
```

Ou execute o SQL manualmente no console do Neon.

## Troubleshooting

### Erro: "Cannot find module"
- Verifique se todas as dependências estão em `package.json`
- O Vercel instala automaticamente, mas pode precisar de rebuild

### Erro: "Database connection failed"
- Verifique se `DATABASE_URL` está configurada corretamente
- Verifique se o banco Neon está ativo
- Verifique se a string de conexão está completa

### Erro: CORS
- Verifique se `FRONTEND_URL` está configurada corretamente
- Deve ser a URL completa do frontend (com https://)


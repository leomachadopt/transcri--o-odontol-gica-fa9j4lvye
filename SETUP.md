# Guia de Configuração - Sistema de Transcrição Odontológica

## Passo a Passo para Configuração Inicial

### 1. Instalar Dependências

```bash
npm install
# ou
pnpm install
```

### 2. Configurar Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto com o seguinte conteúdo:

```env
# Database - String de conexão do Neon
DATABASE_URL=postgresql://neondb_owner:npg_sMujr92NShOR@ep-bitter-cell-abimf2cn-pooler.eu-west-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require

# JWT Secret (altere em produção!)
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Server
PORT=3001

# Frontend URL (para CORS)
FRONTEND_URL=http://localhost:5173
```

**Nota:** A string de conexão do Neon já está configurada acima. Se você quiser usar um banco diferente, substitua a `DATABASE_URL`.

### 3. Criar Tabelas no Banco de Dados

Execute o script de migração para criar todas as tabelas:

```bash
npm run db:migrate
```

Você deve ver a mensagem:
```
🔄 Iniciando migração do banco de dados...
✅ Migração concluída com sucesso!
```

### 4. Iniciar o Servidor Backend

Em um terminal, execute:

```bash
npm run server:dev
```

Você deve ver:
```
🚀 Servidor rodando na porta 3001
📡 API disponível em http://localhost:3001
✅ Conectado ao banco de dados Neon
```

### 5. Iniciar o Frontend

Em outro terminal, execute:

```bash
npm start
```

O frontend estará disponível em `http://localhost:5173`

### 6. Testar o Sistema

1. Acesse `http://localhost:5173`
2. Crie uma nova conta
3. Faça login
4. Teste a funcionalidade de transcrição

## Estrutura do Banco de Dados

### Tabela: users
- `id` (UUID) - Identificador único
- `name` (VARCHAR) - Nome do usuário
- `email` (VARCHAR) - Email (único)
- `password_hash` (VARCHAR) - Hash da senha
- `created_at` (TIMESTAMP) - Data de criação
- `updated_at` (TIMESTAMP) - Data de atualização

### Tabela: transcriptions
- `id` (UUID) - Identificador único
- `user_id` (UUID) - Referência ao usuário (FK)
- `text` (TEXT) - Texto da transcrição
- `timestamp` (BIGINT) - Timestamp da transcrição
- `created_at` (TIMESTAMP) - Data de criação
- `updated_at` (TIMESTAMP) - Data de atualização

## Troubleshooting

### Erro de Conexão com o Banco
- Verifique se a string de conexão no `.env` está correta
- Verifique se o banco Neon está ativo
- Verifique sua conexão com a internet

### Erro "Tabela não existe"
- Execute `npm run db:migrate` novamente
- Verifique se há erros no console durante a migração

### Erro CORS
- Verifique se `FRONTEND_URL` no `.env` corresponde à URL do frontend
- Verifique se o backend está rodando na porta correta (3001)

### Token Inválido
- Limpe o `localStorage` do navegador
- Faça login novamente
- Verifique se o `JWT_SECRET` está configurado corretamente


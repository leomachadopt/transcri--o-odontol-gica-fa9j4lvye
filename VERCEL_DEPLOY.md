# Guia de Deploy no Vercel

## Configuração do Frontend

### 1. Configurar Variáveis de Ambiente no Vercel

No painel do Vercel, vá em **Settings > Environment Variables** e adicione:

```
VITE_API_URL=https://seu-backend-url.vercel.app/api
```

**Importante:** Se você ainda não fez deploy do backend, você precisará:
1. Fazer deploy do backend separadamente (em outro projeto Vercel ou em outro serviço)
2. Ou usar um serviço como Railway, Render, ou Fly.io para o backend

### 2. Configurações do Projeto

O arquivo `vercel.json` já está configurado com:
- Framework: Vite
- Output Directory: `dist`
- Build Command: `npm run build`

### 3. Deploy

O Vercel detectará automaticamente que é um projeto Vite e usará as configurações do `vercel.json`.

## Problemas Comuns e Soluções

### Erro: "Failed to resolve import zod/v4/core"

✅ **Resolvido:** O projeto agora usa o Vite padrão ao invés do rolldown-vite experimental.

### Erro: "API URL not found"

**Solução:** Configure a variável de ambiente `VITE_API_URL` no Vercel apontando para a URL do seu backend.

### Erro: CORS

**Solução:** Certifique-se de que o backend está configurado para aceitar requisições do domínio do Vercel. No arquivo `.env` do backend, configure:

```
FRONTEND_URL=https://seu-projeto.vercel.app
```

## Deploy do Backend no Vercel (Opcional)

Se você quiser fazer deploy do backend também no Vercel, você precisará:

1. Criar um projeto separado no Vercel para o backend
2. Configurar as variáveis de ambiente do backend:
   - `DATABASE_URL`
   - `JWT_SECRET`
   - `PORT` (opcional, Vercel define automaticamente)
   - `FRONTEND_URL`

3. Configurar o `vercel.json` do backend:

```json
{
  "version": 2,
  "builds": [
    {
      "src": "server/index.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "server/index.js"
    }
  ]
}
```

**Nota:** O backend precisa ser configurado como serverless functions no Vercel.

## Alternativa: Deploy do Backend em Outro Serviço

Recomendamos usar serviços como:
- **Railway** - Fácil configuração, suporta PostgreSQL
- **Render** - Gratuito com limitações
- **Fly.io** - Boa performance
- **Heroku** - Tradicional mas pago

Qualquer um desses serviços pode rodar o backend Node.js/Express normalmente.


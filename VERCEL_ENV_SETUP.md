# Configuração de Variáveis de Ambiente no Vercel

## ⚠️ IMPORTANTE: Sem Espaços Após o `=`

**ERRADO:**
```
DATABASE_URL= postgresql://...
JWT_SECRET= 3a53bf564f4cedff1790350a86ea1f84
```

**CORRETO:**
```
DATABASE_URL=postgresql://...
JWT_SECRET=3a53bf564f4cedff1790350a86ea1f84
```

## Variáveis de Ambiente Corretas

### 1. DATABASE_URL
```
postgresql://neondb_owner:npg_sMujr92NShOR@ep-bitter-cell-abimf2cn-pooler.eu-west-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require
```

### 2. JWT_SECRET
```
3a53bf564f4cedff1790350a86ea1f84
```
*(Ou gere uma nova chave mais forte)*

### 3. FRONTEND_URL
```
https://transcri-o-odontol-gica-fa9j4lvye.vercel.app
```
**Sem barra no final!**

### 4. VITE_API_URL
```
https://transcri-o-odontol-gica-fa9j4lvye.vercel.app/api
```

## Como Configurar no Vercel

1. Acesse: https://vercel.com/dashboard
2. Selecione seu projeto
3. Vá em **Settings** > **Environment Variables**
4. Para cada variável:
   - Clique em **Add New**
   - **Key:** Nome da variável (ex: `DATABASE_URL`)
   - **Value:** Cole o valor (SEM espaços antes ou depois)
   - **Environments:** Marque todas (Production, Preview, Development)
   - Clique em **Save**

## Após Configurar

1. **Faça um novo deploy** (as variáveis só são aplicadas em novos deploys)
2. **Execute a migração do banco:**
   - Acesse: `https://transcri-o-odontol-gica-fa9j4lvye.vercel.app/api/migrate`
   - Ou use POST request para criar as tabelas

## Verificar se Está Funcionando

1. **Health Check:**
   ```
   GET https://transcri-o-odontol-gica-fa9j4lvye.vercel.app/api/health
   ```
   Deve retornar: `{"status":"ok","message":"Servidor rodando"}`

2. **Teste de Migração:**
   ```
   POST https://transcri-o-odontol-gica-fa9j4lvye.vercel.app/api/migrate
   ```
   Deve retornar: `{"message":"Migração concluída com sucesso!","status":"ok"}`

3. **Teste de Registro:**
   - Acesse o frontend
   - Tente criar uma conta
   - Verifique o console do navegador para erros específicos

## Troubleshooting

### Erro: "Tabelas do banco de dados não foram criadas"
**Solução:** Execute a migração acessando `/api/migrate`

### Erro: "Erro de conexão com o banco de dados"
**Solução:** 
- Verifique se `DATABASE_URL` está correta (sem espaços)
- Verifique se o banco Neon está ativo
- Verifique se a string de conexão está completa

### Erro: 405 Method Not Allowed
**Solução:** 
- Verifique se fez deploy das últimas mudanças
- Limpe o cache do navegador
- Verifique se a URL está correta

### Erro: CORS
**Solução:**
- Verifique se `FRONTEND_URL` está configurada corretamente
- Deve ser exatamente: `https://transcri-o-odontol-gica-fa9j4lvye.vercel.app` (sem barra final)


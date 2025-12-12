# Guia de Solução de Problemas

## Problema: "Este email já está cadastrado" ao criar primeira conta

### Causa
Este erro geralmente ocorre quando:
1. O backend não está rodando ou não está acessível
2. A variável de ambiente `VITE_API_URL` não está configurada corretamente
3. Há um erro de conexão (CORS, rede, etc.)

### Solução

#### 1. Verificar se o backend está rodando

**Localmente:**
```bash
# Terminal 1 - Backend
npm run server:dev
```

Você deve ver:
```
🚀 Servidor rodando na porta 3001
📡 API disponível em http://localhost:3001
✅ Conectado ao banco de dados Neon
```

**No Vercel (produção):**
- Verifique se o backend foi feito deploy
- Verifique a URL do backend no painel do Vercel

#### 2. Configurar variável de ambiente no Vercel

No painel do Vercel:
1. Vá em **Settings > Environment Variables**
2. Adicione:
   - **Nome:** `VITE_API_URL`
   - **Valor:** URL do seu backend (ex: `https://seu-backend.vercel.app/api`)
3. Faça um novo deploy

#### 3. Verificar mensagens de erro

Agora o sistema mostra mensagens mais específicas:
- **"Servidor não disponível"** = Backend não está rodando ou URL incorreta
- **"Este email já está cadastrado"** = Email realmente já existe no banco
- **"Não foi possível conectar ao servidor"** = Problema de rede/CORS

#### 4. Limpar dados antigos (se necessário)

Se você quer limpar o banco de dados para começar do zero:

```sql
-- Conecte ao banco Neon e execute:
DELETE FROM transcriptions;
DELETE FROM users;
```

Ou use o console do Neon para executar essas queries.

## Problema: Erro de CORS no console

### Causa
O script do Skip estava sendo carregado e causando erros de CORS.

### Solução
✅ **Já corrigido!** O script do Skip foi removido do `index.html`.

Se ainda aparecer o erro, limpe o cache do navegador (Ctrl+Shift+R ou Cmd+Shift+R).

## Problema: Backend não conecta ao banco

### Verificar conexão

1. Verifique o arquivo `.env`:
```env
DATABASE_URL=postgresql://neondb_owner:npg_sMujr92NShOR@ep-bitter-cell-abimf2cn-pooler.eu-west-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require
```

2. Teste a conexão:
```bash
npm run db:migrate
```

Se funcionar, você verá:
```
🔄 Iniciando migração do banco de dados...
✅ Migração concluída com sucesso!
```

## Verificar se tudo está funcionando

### Teste completo:

1. **Backend rodando:**
   ```bash
   npm run server:dev
   ```

2. **Frontend rodando:**
   ```bash
   npm start
   ```

3. **Teste de registro:**
   - Acesse `http://localhost:5173`
   - Tente criar uma conta
   - Se der erro, verifique a mensagem específica no toast

4. **Verificar no console do navegador:**
   - Abra DevTools (F12)
   - Vá na aba Network
   - Tente criar conta novamente
   - Veja se a requisição para `/api/auth/register` está sendo feita
   - Verifique o status da resposta

## Mensagens de erro comuns

| Mensagem | Significado | Solução |
|----------|------------|---------|
| "Servidor não disponível" | Backend não está rodando | Inicie o backend |
| "Este email já está cadastrado" | Email existe no banco | Use outro email ou limpe o banco |
| "Não foi possível conectar ao servidor" | Problema de rede/CORS | Verifique URL da API e CORS do backend |
| "Endpoint não encontrado" | URL da API incorreta | Verifique `VITE_API_URL` |
| "Não autorizado" | Token inválido/expirado | Faça login novamente |

## Próximos passos

Se o problema persistir:
1. Verifique os logs do backend no terminal
2. Verifique os logs do frontend no console do navegador
3. Verifique a aba Network no DevTools para ver as requisições HTTP
4. Verifique se o banco de dados Neon está ativo


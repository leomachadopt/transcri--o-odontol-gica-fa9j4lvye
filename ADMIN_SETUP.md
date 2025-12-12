# Configuração do Sistema de Administração

## Passo 1: Executar Migração do Banco de Dados

Execute o SQL para adicionar o campo `role` na tabela `users`:

```sql
-- Adicionar campo role na tabela users
ALTER TABLE users ADD COLUMN IF NOT EXISTS role VARCHAR(20) DEFAULT 'user' CHECK (role IN ('user', 'admin'));

-- Criar índice para role
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);

-- Atualizar usuários existentes para ter role 'user' (se não tiver)
UPDATE users SET role = 'user' WHERE role IS NULL;
```

**Ou execute via API:**
```
POST https://transcri-o-odontol-gica-fa9j4lvye.vercel.app/api/migrate
```

## Passo 2: Tornar um Usuário Administrador

Você precisa atualizar manualmente um usuário no banco de dados para ter role 'admin':

### Opção A: Via Console do Neon

1. Acesse o console do Neon
2. Execute:
```sql
UPDATE users SET role = 'admin' WHERE email = 'seu-email@exemplo.com';
```

### Opção B: Via API (após ter um admin)

Se você já tiver um admin, pode usar a interface web em `/admin` para promover outros usuários.

## Passo 3: Acessar a Interface de Administração

1. Faça login com uma conta de administrador
2. Acesse: `https://transcri-o-odontol-gica-fa9j4lvye.vercel.app/admin`
3. Você verá o menu "Admin" no header

## Funcionalidades Disponíveis

### ✅ Listar Usuários
- Visualizar todos os usuários do sistema
- Buscar por nome ou email
- Paginação (20 usuários por página)

### ✅ Criar Usuário
- Nome completo
- Email
- Senha
- Perfil (Usuário ou Administrador)

### ✅ Editar Usuário
- Atualizar nome
- Atualizar email
- Alterar senha (opcional)
- Alterar perfil

### ✅ Excluir Usuário
- Exclui o usuário e todas as suas transcrições
- Não permite excluir a própria conta

## Segurança

- ✅ Apenas usuários com `role = 'admin'` podem acessar `/admin`
- ✅ Todas as rotas de admin verificam autenticação e permissão
- ✅ Senhas são hasheadas com bcrypt
- ✅ Tokens JWT são validados em cada requisição

## Estrutura de Rotas

- `GET /api/admin/users` - Listar usuários
- `POST /api/admin/users` - Criar usuário
- `GET /api/admin/users/:id` - Buscar usuário
- `PUT /api/admin/users/:id` - Atualizar usuário
- `DELETE /api/admin/users/:id` - Excluir usuário

## Notas Importantes

1. **Primeiro Admin:** Você precisa criar o primeiro admin manualmente no banco de dados
2. **Proteção:** Não é possível excluir sua própria conta
3. **Cascata:** Ao excluir um usuário, todas as transcrições são excluídas automaticamente
4. **Validação:** Emails devem ser únicos no sistema


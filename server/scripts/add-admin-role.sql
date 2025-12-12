-- Adicionar campo role na tabela users
ALTER TABLE users ADD COLUMN IF NOT EXISTS role VARCHAR(20) DEFAULT 'user' CHECK (role IN ('user', 'admin'));

-- Criar índice para role
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);

-- Atualizar usuários existentes para ter role 'user' (se não tiver)
UPDATE users SET role = 'user' WHERE role IS NULL;


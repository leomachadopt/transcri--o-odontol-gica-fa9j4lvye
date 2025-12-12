# Sistema de Transcrição Odontológica

Sistema completo de transcrição de áudio com autenticação e armazenamento em banco de dados PostgreSQL (Neon).

## 🚀 Stack Tecnológica

### Frontend
- **React 19** - Biblioteca JavaScript para construção de interfaces
- **Vite** - Build tool extremamente rápida
- **TypeScript** - Superset tipado do JavaScript
- **Shadcn UI** - Componentes reutilizáveis e acessíveis
- **Tailwind CSS** - Framework CSS utility-first
- **React Router** - Roteamento para aplicações React
- **React Hook Form** - Gerenciamento de formulários performático
- **Zod** - Validação de schemas TypeScript-first
- **Zustand** - Gerenciamento de estado

### Backend
- **Node.js** - Runtime JavaScript
- **Express** - Framework web para Node.js
- **PostgreSQL** - Banco de dados relacional (Neon)
- **bcryptjs** - Hash de senhas
- **jsonwebtoken** - Autenticação JWT
- **pg** - Cliente PostgreSQL para Node.js

## 📋 Pré-requisitos

- Node.js 18+
- npm ou pnpm
- Conta no Neon (banco de dados PostgreSQL) ou PostgreSQL local

## 🔧 Instalação

```bash
# Instalar dependências
npm install
# ou
pnpm install
```

## ⚙️ Configuração

### 1. Configurar Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis:

```env
# Database
DATABASE_URL=postgresql://usuario:senha@host:porta/database?sslmode=require

# JWT Secret (altere em produção!)
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Server
PORT=3001

# Frontend URL (para CORS)
FRONTEND_URL=http://localhost:5173
```

**Nota:** O arquivo `.env` já está configurado com a string de conexão do Neon fornecida.

### 2. Criar Tabelas no Banco de Dados

Execute o script de migração para criar todas as tabelas necessárias:

```bash
npm run db:migrate
```

Este comando criará as seguintes tabelas:
- `users` - Armazena informações dos usuários
- `transcriptions` - Armazena as transcrições de áudio

## 💻 Scripts Disponíveis

### Desenvolvimento

```bash
# Iniciar servidor frontend (Vite)
npm start
# ou
npm run dev

# Iniciar servidor backend (Express)
npm run server
# ou em modo watch (reload automático)
npm run server:dev
```

**Importante:** Você precisa executar o frontend e o backend simultaneamente em terminais separados:

1. Terminal 1 - Backend:
```bash
npm run server:dev
```

2. Terminal 2 - Frontend:
```bash
npm start
```

O frontend estará disponível em [http://localhost:5173](http://localhost:5173) e o backend em [http://localhost:3001](http://localhost:3001).

### Banco de Dados

```bash
# Executar migração (criar tabelas)
npm run db:migrate
```

### Build

```bash
# Build para produção
npm run build

# Build para desenvolvimento
npm run build:dev
```

Gera os arquivos otimizados para produção na pasta `dist/`.

### Preview

```bash
# Visualizar build de produção localmente
npm run preview
```

Permite visualizar a build de produção localmente antes do deploy.

### Linting e Formatação

```bash
# Executar linter
npm run lint

# Executar linter e corrigir problemas automaticamente
npm run lint:fix

# Formatar código com Prettier
npm run format
```

## 📁 Estrutura do Projeto

```
.
├── src/                      # Código fonte do frontend
│   ├── components/          # Componentes React
│   │   ├── auth/           # Componentes de autenticação
│   │   └── ui/             # Componentes UI (Shadcn)
│   ├── pages/              # Páginas da aplicação
│   ├── stores/             # Stores Zustand
│   ├── lib/                # Utilitários e API client
│   └── hooks/              # React hooks customizados
├── server/                  # Código fonte do backend
│   ├── config/             # Configurações (banco de dados)
│   ├── routes/             # Rotas da API
│   │   ├── auth.js        # Rotas de autenticação
│   │   └── transcriptions.js # Rotas de transcrições
│   ├── middleware/         # Middlewares (autenticação)
│   ├── scripts/            # Scripts utilitários
│   │   ├── migrate.js     # Script de migração
│   │   └── schema.sql      # Schema do banco de dados
│   └── index.js            # Servidor Express principal
├── public/                  # Arquivos estáticos
├── dist/                    # Build de produção (gerado)
├── node_modules/            # Dependências (gerado)
├── .env                     # Variáveis de ambiente (não versionado)
└── package.json            # Configurações e dependências
```

## 🎨 Componentes UI

Este template inclui uma biblioteca completa de componentes Shadcn UI baseados em Radix UI:

- Accordion
- Alert Dialog
- Avatar
- Button
- Checkbox
- Dialog
- Dropdown Menu
- Form
- Input
- Label
- Select
- Switch
- Tabs
- Toast
- Tooltip
- E muito mais...

## 📝 Ferramentas de Qualidade de Código

- **TypeScript**: Tipagem estática
- **ESLint**: Análise de código estático
- **Oxlint**: Linter extremamente rápido
- **Prettier**: Formatação automática de código

## 🔄 Workflow de Desenvolvimento

1. Instale as dependências: `npm install`
2. Configure o arquivo `.env` com suas credenciais do banco de dados
3. Execute a migração: `npm run db:migrate`
4. Inicie o servidor backend: `npm run server:dev` (Terminal 1)
5. Inicie o servidor frontend: `npm start` (Terminal 2)
6. Faça suas alterações
7. Verifique o código: `npm run lint`
8. Formate o código: `npm run format`
9. Crie a build: `npm run build`
10. Visualize a build: `npm run preview`

## 🔐 Sistema de Autenticação

O sistema utiliza JWT (JSON Web Tokens) para autenticação:
- Tokens são armazenados no `localStorage` do navegador
- Tokens expiram em 7 dias
- Senhas são hasheadas com bcrypt antes de serem armazenadas
- Todas as rotas de transcrições requerem autenticação

## 📊 API Endpoints

### Autenticação
- `POST /api/auth/register` - Registrar novo usuário
- `POST /api/auth/login` - Fazer login
- `GET /api/auth/me` - Verificar token e obter dados do usuário

### Transcrições
- `GET /api/transcriptions` - Listar todas as transcrições do usuário
- `GET /api/transcriptions/:id` - Obter transcrição específica
- `POST /api/transcriptions` - Criar nova transcrição
- `PUT /api/transcriptions/:id` - Atualizar transcrição
- `DELETE /api/transcriptions/:id` - Deletar transcrição

Todas as rotas de transcrições requerem autenticação via header `Authorization: Bearer <token>`.

## 📦 Build e Deploy

Para criar uma build otimizada para produção:

```bash
npm run build
```

Os arquivos otimizados serão gerados na pasta `dist/` e estarão prontos para deploy.

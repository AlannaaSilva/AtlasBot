# AtlasBot

O AtlasBot é um assistente corporativo inteligente que utiliza **RAG (Retrieval-Augmented Generation)** para responder perguntas baseadas em documentos internos da empresa. Combina busca vetorial semântica com geração de linguagem natural para oferecer respostas contextualizadas.

## Estrutura do Projeto

```
AtlasBot/
├── back/   # API Node.js + Express + TypeScript
└── front/  # SPA React + Vite + TypeScript
```

## Como Iniciar

### 1. Backend

```bash
cd back
npm install
npm run dev        # Sobe o servidor em localhost:3001
```

### 2. Frontend

```bash
cd front
yarn install
yarn dev           # Sobe o app em localhost:8080
```

### 3. Indexar os documentos (primeira execução)

Antes de usar o chat, é necessário indexar a base de conhecimento no Supabase:

```bash
cd back
npm run ingest
```

Isso gera embeddings para cada chunk de documento e os armazena na tabela `documents` do Supabase.

---

## Variáveis de Ambiente

Crie um arquivo `.env` dentro de `/back` com as seguintes chaves:

```env
PORT=3001
JWT_SECRET=seu_secret_jwt

SUPABASE_URL=sua_url_do_supabase
SUPABASE_PUBLISHABLE_KEY=sua_chave_anon
SUPABASE_SECRET_KEY=sua_chave_service_role

OPENAI_API_KEY=sua_chave_da_openai

DEMO_EMAIL=demo@suaempresa.com
DEMO_PASSWORD=sua_senha_demo
```

> Nunca commite o arquivo `.env`. Ele já está incluído no `.gitignore`.

---

## Funcionalidades

- **RAG**: Respostas geradas com base em contexto real extraído dos documentos internos
- **Busca vetorial semântica**: Embeddings via OpenAI (`text-embedding-3-small`) armazenados no Supabase
- **Reranking RRF**: Reciprocal Rank Fusion para melhorar a relevância dos resultados
- **Histórico de conversa**: Contexto mantido por sessão via tabela `conversations` no Supabase
- **Autenticação JWT**: Rotas protegidas com tokens de acesso
- **Interface moderna**: Chat com suporte a Markdown, animações e painel de fontes consultadas

## Categorias de Documentos

A base de conhecimento cobre as seguintes categorias da Techsfera Soluções S.A.:

| Categoria | Descrição |
|-----------|-----------|
| `rh` | Férias, benefícios, controle de ponto |
| `ti` | Suporte, senhas, equipamentos |
| `onboarding` | Integração, Buddy Program |
| `processos` | Reembolso, compras, viagens |
| `seguranca` | Política de segurança da informação |
| `lgpd` | Privacidade e proteção de dados |
| `etica` | Código de conduta |
| `treinamento` | Trilhas e desenvolvimento de carreira |
| `empresa` | Informações gerais corporativas |

## Tecnologias

**Frontend:** React 18, Vite, TypeScript, Tailwind CSS, shadcn/ui, Framer Motion, React Query

**Backend:** Node.js, Express 5, TypeScript, Supabase, OpenAI API (via fetch), JWT, ts-node-dev

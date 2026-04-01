# ⚡ AtlasBot — Assistente de Conhecimento Corporativo

Sistema de perguntas e respostas sobre documentação interna corporativa, construído com arquitetura **RAG (Retrieval-Augmented Generation)**, autenticação JWT, busca semântica vetorial e interface React moderna.

> Desenvolvido como trabalho de conclusão de curso (TCC).

---

## Arquitetura

```
┌─────────────────┐     JWT      ┌──────────────────────────────────────┐
│   React (Vite)  │ ──────────── │         Node.js / Express            │
│   shadcn/ui     │   REST API   │                                      │
│   Tailwind CSS  │ ──────────── │  ┌────────────┐  ┌───────────────┐  │
└─────────────────┘              │  │ RAG Service│  │ Auth / JWT    │  │
                                 │  └─────┬──────┘  └───────────────┘  │
                                 └────────┼─────────────────────────────┘
                                          │
                        ┌─────────────────┼──────────────────┐
                        │                 │                  │
                   ┌────▼─────┐   ┌───────▼──────┐   ┌──────▼──────┐
                   │ Supabase │   │   OpenAI     │   │  Supabase   │
                   │ pgvector │   │ Embeddings + │   │Conversations│
                   │  (busca) │   │  GPT-4o-mini │   │ (histórico) │
                   └──────────┘   └──────────────┘   └─────────────┘
```

---

## Estrutura do Projeto

```
AtlasBot/
├── front/                        # Interface React
│   └── src/
│       ├── components/           # ChatSidebar, MessageBubble, ChatInput, etc.
│       ├── hooks/use-chat.ts     # Lógica de chat e chamadas ao backend
│       ├── pages/                # Index (chat) e Login
│       ├── lib/knowledgeBase.ts  # Tipos e categorias
│       └── constants/chat.ts     # Labels, queries de exemplo, stages
│
└── back/                         # API Node.js
    └── src/
        ├── routes/               # auth.ts, chat.ts
        ├── middleware/auth.ts    # Validação JWT
        ├── services/
        │   ├── ragService.ts     # Pipeline RAG + RRF
        │   └── embeddingService.ts
        ├── data/knowledgeBase.ts # Documentos fictícios da Techsfera S.A.
        ├── config/supabase.ts
        └── scripts/
            ├── ingest.ts         # Indexação dos documentos no Supabase
            └── evaluate.ts       # Script de avaliação experimental
```

---

## Funcionalidades

- Autenticação com JWT — login, logout e redirecionamento automático ao expirar o token
- Busca semântica sobre base de documentos internos via embeddings
- Reranking por **Reciprocal Rank Fusion (RRF)**
- Filtragem por categoria (RH, TI, Onboarding, Processos, Segurança, LGPD, Ética, Treinamento, Empresa)
- Histórico de conversas persistido por sessão no Supabase
- Exibição das fontes consultadas em cada resposta
- Interface responsiva com feedback visual das etapas do pipeline (busca → recuperação → geração)
- Tom humanizado: respostas amigáveis para saudações, agradecimentos e ausência de resultados
- Aviso ao usuário quando o filtro de categoria está ativo e não há resultados na categoria selecionada

---

## Pipeline RAG

```
Documento → chunking (≈150 tokens) → embedding (512 dim) → Supabase pgvector
                                                                    │
Pergunta  → embedding ──────────────────── match_documents (cosine similarity)
                                                                    │
                                                         RRF reranking (k=60)
                                                                    │
                                                    top-5 chunks → GPT-4o-mini
                                                                    │
                                                            Resposta + fontes
```

### Parâmetros padrão

| Parâmetro | Valor |
|---|---|
| Modelo de embedding | `text-embedding-3-small` (512 dim) |
| Chunk size | ~150 tokens |
| match_threshold | 0.5 |
| match_count | 20 |
| top_k (após RRF) | 5 |
| RRF k | 60 |
| Modelo de geração | `gpt-4o-mini` |
| temperature | 0.2 |
| max_tokens | 800 |

---

## Avaliação Experimental

O pipeline foi avaliado em **12 configurações distintas** com **8 perguntas** cada, totalizando **96 inferências**, variando:

| Parâmetro | Valores testados |
|---|---|
| `match_threshold` | 0.3 / **0.5** / 0.7 |
| `match_count` | 10 / **20** / 30 |
| `top_k` | 3 / **5** / 7 |
| `rrf_k` | 20 / **60** / 100 |

*(valores em negrito = configuração padrão adotada)*

**Métricas coletadas por configuração:**
- Similaridade média dos chunks recuperados
- Cobertura de palavras-chave esperadas na resposta
- Quantidade de chunks recuperados
- Latência de retrieval e geração (ms)

**Artefatos gerados:**
- `back/src/scripts/evaluation_report.json` — dados brutos
- `back/src/scripts/evaluation_report.html` — relatório visual com gráficos

Para reproduzir a avaliação:
```bash
cd back && npm run evaluate
```

---

## Como Executar

### Pré-requisitos
- Node.js 18+
- Conta Supabase com extensão `pgvector` habilitada e função `match_documents`
- Chave de API OpenAI

### 1. Backend

```bash
cd back
npm install
npm run dev        # Servidor em localhost:3001
```

### 2. Frontend

```bash
cd front
npm install
npm run dev        # App em localhost:8080
```

### 3. Indexar os documentos (primeira execução)

Antes de usar o chat, indexe a base de conhecimento no Supabase:

```bash
cd back && npm run ingest
```

> Atenção: o script não faz upsert. Limpe a tabela `documents` no Supabase antes de re-ingerir para evitar duplicatas.

---

## Variáveis de Ambiente

**`back/.env`**
```env
PORT=3001
JWT_SECRET=seu_secret_jwt

SUPABASE_URL=https://xxx.supabase.co
SUPABASE_PUBLISHABLE_KEY=sua_chave_anon
SUPABASE_SECRET_KEY=sua_chave_service_role

OPENAI_API_KEY=sk-...

DEMO_EMAIL=demo@suaempresa.com
DEMO_PASSWORD=sua_senha_demo
```

**`front/.env`**
```env
VITE_API_URL=http://localhost:3001
```

> Nunca commite o arquivo `.env`. Ele já está incluído no `.gitignore`.

---

## Base de Conhecimento

Documentos fictícios da empresa **Techsfera Soluções S.A.**, organizados em 9 categorias:

| Categoria | Documentos |
|---|---|
| RH | Política de Férias, Benefícios, Controle de Ponto |
| TI | Suporte e Chamados, Política de Senhas, Equipamentos |
| Onboarding | Programa de Integração, Buddy Program |
| Processos | Reembolso de Despesas, Compras, Viagens Corporativas |
| Segurança | Política de Segurança da Informação, Uso Aceitável de TI |
| LGPD | Política de Privacidade, Tratamento de Dados |
| Ética | Código de Ética e Conduta |
| Treinamento | Trilhas por Setor, Desenvolvimento e Carreira |
| Empresa | Informações Gerais Corporativas |

---

## Tecnologias

**Frontend:** React 18, Vite, TypeScript, Tailwind CSS, shadcn/ui, Radix UI, Framer Motion, Lucide React

**Backend:** Node.js, Express 5, TypeScript, Supabase (pgvector), OpenAI API, JWT, bcryptjs, ts-node-dev

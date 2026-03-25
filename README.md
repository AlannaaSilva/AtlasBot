# AtlasBot 🚀

O AtlasBot é um assistente corporativo inteligente que utiliza a técnica de **RAG (Retrieval-Augmented Generation)** para responder perguntas baseadas em documentos internos da empresa. Ele combina tecnologias modernas de frontend e backend para oferecer uma experiência de chat rápida e contextualizada.

## 📁 Estrutura do Projeto

O repositório está dividido em duas partes principais:

- **`/front`**: Aplicação React Single Page (SPA) construída com **Vite**, **TypeScript**, **Tailwind CSS** e **shadcn/ui**.
- **`/back`**: API robusta em **Node.js** com **TypeScript**, utilizando **Express**, **Supabase** (para banco de dados vetorial e auth) e **OpenAI**.

---

## ⚙️ Como Iniciar

### 🔙 Backend

1. Navegue até a pasta `back`:
   ```bash
   cd back
   ```
2. Instale as dependências:
   ```bash
   npm install
   ```
3. Configure as variáveis de ambiente (veja a seção abaixo).
4. Inicie o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```

### 🖼️ Frontend

1. Navegue até a pasta `front`:
   ```bash
   cd front
   ```
2. Instale as dependências:
   ```bash
   yarn install
   ```
3. Inicie o servidor de desenvolvimento:
   ```bash
   yarn dev
   ```

---

## 🔑 Variáveis de Ambiente (Backend)

Crie um arquivo `.env` dentro da pasta `/back` com as seguintes chaves:

```env
SUPABASE_URL=sua_url_do_supabase
SUPABASE_SECRET_KEY=sua_chave_service_role
OPENAI_API_KEY=sua_chave_da_openai
JWT_SECRET=sua_secret_para_tokens_jwt
```

> [!IMPORTANT]
> Nunca commite o arquivo `.env`. Ele já está incluído no `.gitignore`.

---

## ✨ Funcionalidades Principais

- **RAG (Retrieval-Augmented Generation)**: Respostas baseadas em contexto real extraído de documentos.
- **Busca Vetorial**: Uso de embeddings da OpenAI e busca via RPC no Supabase.
- **Reranking RRF**: Sistema de Reciprocal Rank Fusion para melhorar a relevância dos resultados.
- **Autenticação JWT**: Rotas protegidas e gestão de usuários.
- **UI Moderna**: Interface responsiva com suporte a Markdown e destaque de sintaxe.

## 🛠️ Tecnologias Utilizadas

**Frontend:** Vite, React, TypeScript, shadcn/ui, Tailwind CSS, React Query, Lucide React.

**Backend:** Node.js, Express, TypeScript, Supabase (@supabase/supabase-js), OpenAI SDK, JWT, ts-node-dev.

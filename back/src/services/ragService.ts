import { supabase } from "../config/supabase";
import { generateEmbedding } from "./embeddingService";

interface DocumentChunk {
  content: string;
  metadata: {
    id?: string;
    title?: string;
    category?: string;
    version?: string;
  };
  similarity: number;
}

interface RankedChunk extends DocumentChunk {
  rrfScore: number;
}

interface ConversationMessage {
  role: "user" | "assistant";
  content: string;
}

export async function ragQuery(
  question: string,
  history: ConversationMessage[],
  category: string | null = null,
) {
  const queryEmbedding = await generateEmbedding(question);

  let query = supabase.rpc("match_documents", {
    query_embedding: queryEmbedding,
    match_threshold: 0.5,
    match_count: 20,
  });

  if (category) {
    query = query.eq("metadata->>category", category);
  }

  const { data: chunks, error } = await query;
  if (error) throw new Error(error.message);

  const reranked = rerankRRF(chunks as DocumentChunk[]);
  const topChunks = reranked.slice(0, 5);

  const context = topChunks.map((c) => c.content).join("\n\n---\n\n");

  const messages = [
    {
      role: "system",
      content: `Você é o AtlasBot, assistente corporativo da Techsfera. Seu tom é profissional mas amigável e acolhedor.

${category ? `FILTRO ATIVO: a busca está limitada à categoria "${category}". Se não encontrar a informação, avise o usuário que o filtro de categoria está ativo e sugira desativá-lo para uma busca mais ampla.` : ""}

Regras:
- Se a pergunta for respondida pelo contexto abaixo, responda com base nele de forma clara e objetiva.
- Se a informação não estiver no contexto, diga de forma gentil que não encontrou nos documentos internos e sugira entrar em contato com o setor responsável.
- Se a mensagem for uma saudação, agradecimento ou conversa informal (ex: "obrigada", "tudo bem?", "oi"), responda de forma natural e simpática, sem forçar uma resposta técnica.
- Nunca seja frio ou robótico. Use linguagem natural, como um colega prestativo.

CONTEXTO:
${context}`,
    },
    ...history.slice(-6),
    { role: "user", content: question },
  ];

  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages,
      temperature: 0.2,
      max_tokens: 800,
    }),
  });

  if (!res.ok) {
    const err = (await res.json()) as any;
    throw new Error(err.error?.message ?? `HTTP ${res.status}`);
  }

  const completion = (await res.json()) as any;

  return {
    answer: completion.choices[0].message.content,
    sources: topChunks.map((c) => ({
      content: c.content,
      ...c.metadata,
    })),
  };
}

function rerankRRF(chunks: DocumentChunk[], k = 60): RankedChunk[] {
  return chunks
    .map((chunk, index) => ({
      ...chunk,
      rrfScore: 1 / (k + index + 1),
    }))
    .sort((a, b) => b.rrfScore - a.rrfScore);
}

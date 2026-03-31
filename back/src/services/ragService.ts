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
) {
  const queryEmbedding = await generateEmbedding(question);

  const { data: chunks, error } = await supabase.rpc("match_documents", {
    query_embedding: queryEmbedding,
    match_threshold: 0.5,
    match_count: 20,
  });
  if (error) throw new Error(error.message);

  const reranked = rerankRRF(chunks as DocumentChunk[]);
  const topChunks = reranked.slice(0, 5);

  const context = topChunks.map((c) => c.content).join("\n\n---\n\n");

  const messages = [
    {
      role: "system",
      content: `Você é o AtlasBot, assistente corporativo. Responda apenas com base no contexto fornecido.
Se a informação não estiver no contexto, diga que não encontrou nos documentos internos.

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

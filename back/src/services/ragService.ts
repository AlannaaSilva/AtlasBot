import OpenAI from "openai";
import { supabase } from "../config/supabase";
import { generateEmbedding } from "./embeddingService";
import dotenv from "dotenv";
dotenv.config();

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function ragQuery(
  question: string,
  history: { role: string; content: string }[],
) {
  // 1. Gerar embedding da pergunta
  const queryEmbedding = await generateEmbedding(question);

  // 2. Busca vetorial no Supabase
  const { data: chunks, error } = await supabase.rpc("match_documents", {
    query_embedding: queryEmbedding,
    match_threshold: 0.5,
    match_count: 20,
  });
  if (error) throw new Error(error.message);

  // 3. Reranking simples por RRF (Reciprocal Rank Fusion)
  const reranked = rerankRRF(chunks);
  const topChunks = reranked.slice(0, 5);

  // 4. Construir contexto
  const context = topChunks.map((c: any) => c.content).join("\n\n---\n\n");

  // 5. Gerar resposta com GPT
  const messages: any[] = [
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

  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages,
    temperature: 0.2,
    max_tokens: 800,
  });

  return {
    answer: completion.choices[0].message.content,
    sources: topChunks.map((c: any) => ({
      content: c.content,
      ...c.metadata,
    })),
  };
}

function rerankRRF(chunks: any[], k = 60) {
  return chunks
    .map((chunk, index) => ({
      ...chunk,
      rrfScore: 1 / (k + index + 1),
    }))
    .sort((a, b) => b.rrfScore - a.rrfScore);
}

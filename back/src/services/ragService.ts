import OpenAI from "openai";
import { supabase } from "../config/supabase";
import { generateEmbedding } from "./embeddingService";
import dotenv from "dotenv";
dotenv.config();

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

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

  const messages: OpenAI.Chat.ChatCompletionMessageParam[] = [
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

export async function generateEmbedding(text: string): Promise<number[]> {
  const response = await fetch("https://api.openai.com/v1/embeddings", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ model: "text-embedding-3-small", input: text, dimensions: 512 }),
  });

  if (!response.ok) {
    const err = (await response.json()) as any;
    throw new Error(err.error?.message ?? `HTTP ${response.status}`);
  }

  const data = (await response.json()) as any;
  return data.data[0].embedding;
}

import dotenv from 'dotenv';
dotenv.config({ override: true });

import { supabase } from '../config/supabase';
import { generateEmbedding } from '../services/embeddingService';
import { documents } from '../data/knowledgeBase';

function chunkText(text: string, maxTokens = 150): string[] {
  const sentences = text.split(/(?<=[.!?])\s+/);
  const chunks: string[] = [];
  let current = '';

  for (const sentence of sentences) {
    const combined = current ? `${current} ${sentence}` : sentence;
    // Estimativa: 1 token ≈ 4 caracteres
    if (combined.length / 4 > maxTokens && current) {
      chunks.push(current.trim());
      current = sentence;
    } else {
      current = combined;
    }
  }
  if (current.trim()) chunks.push(current.trim());
  return chunks;
}

async function ingest() {
  const key = process.env.OPENAI_API_KEY;
  console.log(`\n🔑 OPENAI_API_KEY: ${key ? key.slice(0, 10) + '...' + key.slice(-4) + ` (${key.length} chars)` : 'NÃO CARREGADA ❌'}`);

  // Teste direto da chave via HTTP
  const testRes = await fetch('https://api.openai.com/v1/models', {
    headers: { Authorization: `Bearer ${key}` },
  });
  const testBody = await testRes.json() as any;
  console.log(`🌐 Teste HTTP da chave: ${testRes.status} ${testRes.statusText}`);
  if (!testRes.ok) console.log('   Detalhe:', JSON.stringify(testBody?.error ?? testBody));
  console.log(`\n🚀 Iniciando ingestão de ${documents.length} documentos...\n`);

  let totalChunks = 0;
  let errors = 0;

  for (const doc of documents) {
    console.log(`📄 Processando: ${doc.title}`);
    const chunks = chunkText(doc.content);
    console.log(`   → ${chunks.length} chunks gerados`);

    for (let i = 0; i < chunks.length; i++) {
      try {
        const embedding = await generateEmbedding(chunks[i]);
        console.log(`      ✔ embedding gerado (${embedding.length} dims)`);

        const { error } = await supabase.from('documents').insert({
          content: chunks[i],
          metadata: {
            title: doc.title,
            category: doc.category,
            chunkIndex: i,
            totalChunks: chunks.length,
          },
          embedding,
        });

        if (error) throw new Error(`[Supabase] ${error.message}`);
        totalChunks++;

        // Pequena pausa para não ultrapassar rate limit da OpenAI
        await new Promise(r => setTimeout(r, 200));
      } catch (err: any) {
        if (errors === 0) {
          console.error('ERRO COMPLETO:', {
            name: err.constructor?.name,
            message: err.message,
            status: err.status,
            code: err.code,
            type: err.type,
            error: err.error,
          });
        }
        errors++;
      }
    }
    console.log(`   ✅ ${doc.title} indexado!\n`);
  }

  console.log('─────────────────────────────────');
  console.log(`✅ Ingestão concluída!`);
  console.log(`   Chunks indexados: ${totalChunks}`);
  console.log(`   Erros: ${errors}`);
  console.log('─────────────────────────────────\n');
}

ingest();

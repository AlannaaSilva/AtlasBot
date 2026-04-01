/**
 * Script de Avaliação Experimental do Pipeline RAG — AtlasBot
 *
 * Testa diferentes configurações de:
 *  - match_threshold (limiar de similaridade)
 *  - match_count     (chunks recuperados)
 *  - top_k           (chunks passados ao modelo após reranking)
 *  - rrf_k           (parâmetro k do Reciprocal Rank Fusion)
 *
 * Métricas coletadas por configuração:
 *  - Média de similaridade dos chunks recuperados
 *  - Número de chunks acima do threshold
 *  - Latência de recuperação (ms)
 *  - Latência de geração (ms)
 *  - Cobertura de resposta (se palavras-chave esperadas aparecem na resposta)
 *
 * Saída: back/src/scripts/evaluation_report.json  (dados brutos)
 *        back/src/scripts/evaluation_report.html   (relatório visual)
 */

import dotenv from "dotenv";
dotenv.config({ override: true });

import * as fs from "fs";
import * as path from "path";
import { supabase } from "../config/supabase";
import { generateEmbedding } from "../services/embeddingService";

// ─── Dataset de avaliação ────────────────────────────────────────────────────

const TEST_QUESTIONS = [
  {
    id: "q1",
    question: "Quantos dias de férias o colaborador tem direito?",
    category: null,
    keywords: ["30 dias", "férias", "período aquisitivo"],
  },
  {
    id: "q2",
    question: "Como abrir um chamado de suporte de TI?",
    category: null,
    keywords: ["Help Desk", "chamado", "ramal", "2100"],
  },
  {
    id: "q3",
    question: "Quais são os benefícios oferecidos pela empresa?",
    category: null,
    keywords: ["plano de saúde", "vale-refeição", "benefícios"],
  },
  {
    id: "q4",
    question: "Como funciona o programa de onboarding?",
    category: null,
    keywords: ["30 dias", "semana", "integração", "buddy"],
  },
  {
    id: "q5",
    question: "Qual é a política de senhas corporativas?",
    category: null,
    keywords: ["12 caracteres", "90 dias", "senha", "2FA"],
  },
  {
    id: "q6",
    question: "Como solicitar reembolso de despesas?",
    category: null,
    keywords: ["Concur", "30 dias", "comprovante", "reembolso"],
  },
  {
    id: "q7",
    question: "O que diz a política de LGPD da empresa?",
    category: null,
    keywords: ["LGPD", "dados", "DPO", "privacidade"],
  },
  {
    id: "q8",
    question: "Como funciona o controle de ponto?",
    category: null,
    keywords: ["PointMe", "banco de horas", "ponto", "jornada"],
  },
];

// ─── Configurações experimentais ────────────────────────────────────────────

const CONFIGURATIONS = [
  // Variação de match_threshold
  { id: "cfg_threshold_03", label: "Threshold 0.3", match_threshold: 0.3, match_count: 20, top_k: 5, rrf_k: 60 },
  { id: "cfg_threshold_05", label: "Threshold 0.5 (padrão)", match_threshold: 0.5, match_count: 20, top_k: 5, rrf_k: 60 },
  { id: "cfg_threshold_07", label: "Threshold 0.7", match_threshold: 0.7, match_count: 20, top_k: 5, rrf_k: 60 },

  // Variação de match_count
  { id: "cfg_count_10",  label: "match_count=10",  match_threshold: 0.5, match_count: 10,  top_k: 5, rrf_k: 60 },
  { id: "cfg_count_20",  label: "match_count=20 (padrão)", match_threshold: 0.5, match_count: 20, top_k: 5, rrf_k: 60 },
  { id: "cfg_count_30",  label: "match_count=30",  match_threshold: 0.5, match_count: 30,  top_k: 5, rrf_k: 60 },

  // Variação de top_k (após reranking)
  { id: "cfg_topk_3",  label: "top_k=3",  match_threshold: 0.5, match_count: 20, top_k: 3,  rrf_k: 60 },
  { id: "cfg_topk_5",  label: "top_k=5 (padrão)",  match_threshold: 0.5, match_count: 20, top_k: 5,  rrf_k: 60 },
  { id: "cfg_topk_7",  label: "top_k=7",  match_threshold: 0.5, match_count: 20, top_k: 7,  rrf_k: 60 },

  // Variação do parâmetro RRF k
  { id: "cfg_rrf_20",  label: "RRF k=20",  match_threshold: 0.5, match_count: 20, top_k: 5, rrf_k: 20 },
  { id: "cfg_rrf_60",  label: "RRF k=60 (padrão)",  match_threshold: 0.5, match_count: 20, top_k: 5, rrf_k: 60 },
  { id: "cfg_rrf_100", label: "RRF k=100", match_threshold: 0.5, match_count: 20, top_k: 5, rrf_k: 100 },
];

// ─── Tipos ──────────────────────────────────────────────────────────────────

interface DocumentChunk {
  content: string;
  metadata: { title?: string; category?: string };
  similarity: number;
}

interface QuestionResult {
  questionId: string;
  question: string;
  chunksRetrieved: number;
  avgSimilarity: number;
  maxSimilarity: number;
  minSimilarity: number;
  retrievalLatencyMs: number;
  generationLatencyMs: number;
  keywordCoverage: number;
  answer: string;
}

interface ConfigResult {
  configId: string;
  label: string;
  params: { match_threshold: number; match_count: number; top_k: number; rrf_k: number };
  results: QuestionResult[];
  avgChunksRetrieved: number;
  avgSimilarity: number;
  avgRetrievalLatencyMs: number;
  avgGenerationLatencyMs: number;
  avgKeywordCoverage: number;
}

// ─── Funções auxiliares ──────────────────────────────────────────────────────

function rerankRRF(chunks: DocumentChunk[], k: number): DocumentChunk[] {
  return chunks
    .map((chunk, index) => ({ ...chunk, rrfScore: 1 / (k + index + 1) }))
    .sort((a: any, b: any) => b.rrfScore - a.rrfScore);
}

function computeKeywordCoverage(answer: string, keywords: string[]): number {
  const answerLower = answer.toLowerCase();
  const found = keywords.filter(kw => answerLower.includes(kw.toLowerCase()));
  return found.length / keywords.length;
}

async function callOpenAI(messages: any[]): Promise<string> {
  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ model: "gpt-4o-mini", messages, temperature: 0.2, max_tokens: 400 }),
  });
  if (!res.ok) throw new Error(`OpenAI error: ${res.status}`);
  const data = (await res.json()) as any;
  return data.choices[0].message.content;
}

// ─── Avaliação de uma configuração ──────────────────────────────────────────

async function evaluateConfig(cfg: typeof CONFIGURATIONS[0]): Promise<ConfigResult> {
  console.log(`\n📊 Avaliando: ${cfg.label}`);
  const results: QuestionResult[] = [];

  for (const q of TEST_QUESTIONS) {
    process.stdout.write(`   → ${q.id}... `);

    // Gera embedding da pergunta
    const embedding = await generateEmbedding(q.question);

    // Recuperação
    const retrievalStart = Date.now();
    const { data: chunks, error } = await supabase.rpc("match_documents", {
      query_embedding: embedding,
      match_threshold: cfg.match_threshold,
      match_count: cfg.match_count,
    });
    const retrievalLatencyMs = Date.now() - retrievalStart;

    if (error) {
      console.log(`❌ erro: ${error.message}`);
      continue;
    }

    const typedChunks = (chunks ?? []) as DocumentChunk[];
    const reranked = rerankRRF(typedChunks, cfg.rrf_k);
    const topChunks = reranked.slice(0, cfg.top_k);

    const similarities = topChunks.map(c => c.similarity);
    const avgSimilarity = similarities.length > 0
      ? similarities.reduce((a, b) => a + b, 0) / similarities.length
      : 0;

    // Geração
    const context = topChunks.map(c => c.content).join("\n\n---\n\n");
    const messages = [
      {
        role: "system",
        content: `Você é o AtlasBot, assistente corporativo. Responda apenas com base no contexto.\nCONTEXTO:\n${context}`,
      },
      { role: "user", content: q.question },
    ];

    const generationStart = Date.now();
    let answer = "";
    try {
      answer = await callOpenAI(messages);
    } catch (e: any) {
      answer = `[erro: ${e.message}]`;
    }
    const generationLatencyMs = Date.now() - generationStart;

    const keywordCoverage = computeKeywordCoverage(answer, q.keywords);

    results.push({
      questionId: q.id,
      question: q.question,
      chunksRetrieved: topChunks.length,
      avgSimilarity: parseFloat(avgSimilarity.toFixed(4)),
      maxSimilarity: parseFloat((similarities.length ? Math.max(...similarities) : 0).toFixed(4)),
      minSimilarity: parseFloat((similarities.length ? Math.min(...similarities) : 0).toFixed(4)),
      retrievalLatencyMs,
      generationLatencyMs,
      keywordCoverage: parseFloat(keywordCoverage.toFixed(4)),
      answer,
    });

    console.log(`✓ (${topChunks.length} chunks, sim=${avgSimilarity.toFixed(3)}, cov=${(keywordCoverage * 100).toFixed(0)}%)`);

    // Pausa para não ultrapassar rate limit
    await new Promise(r => setTimeout(r, 500));
  }

  const avg = (arr: number[]) => arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : 0;

  return {
    configId: cfg.id,
    label: cfg.label,
    params: { match_threshold: cfg.match_threshold, match_count: cfg.match_count, top_k: cfg.top_k, rrf_k: cfg.rrf_k },
    results,
    avgChunksRetrieved:      parseFloat(avg(results.map(r => r.chunksRetrieved)).toFixed(2)),
    avgSimilarity:           parseFloat(avg(results.map(r => r.avgSimilarity)).toFixed(4)),
    avgRetrievalLatencyMs:   parseFloat(avg(results.map(r => r.retrievalLatencyMs)).toFixed(1)),
    avgGenerationLatencyMs:  parseFloat(avg(results.map(r => r.generationLatencyMs)).toFixed(1)),
    avgKeywordCoverage:      parseFloat(avg(results.map(r => r.keywordCoverage)).toFixed(4)),
  };
}

// ─── Geração do relatório HTML ───────────────────────────────────────────────

function generateHTML(allResults: ConfigResult[]): string {
  const labels = allResults.map(r => `"${r.label}"`).join(",");
  const avgSim = allResults.map(r => r.avgSimilarity);
  const avgChunks = allResults.map(r => r.avgChunksRetrieved);
  const avgCov = allResults.map(r => (r.avgKeywordCoverage * 100).toFixed(1));
  const avgRetLatency = allResults.map(r => r.avgRetrievalLatencyMs);
  const avgGenLatency = allResults.map(r => r.avgGenerationLatencyMs);

  const tableRows = allResults.map(r => `
    <tr>
      <td>${r.label}</td>
      <td>${r.params.match_threshold}</td>
      <td>${r.params.match_count}</td>
      <td>${r.params.top_k}</td>
      <td>${r.params.rrf_k}</td>
      <td>${r.avgChunksRetrieved}</td>
      <td>${r.avgSimilarity}</td>
      <td>${(r.avgKeywordCoverage * 100).toFixed(1)}%</td>
      <td>${r.avgRetrievalLatencyMs} ms</td>
      <td>${r.avgGenerationLatencyMs} ms</td>
    </tr>`).join("");

  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8" />
  <title>Avaliação RAG — AtlasBot</title>
  <script src="https://cdn.jsdelivr.net/npm/chart.js@4"></script>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: 'Segoe UI', sans-serif; background: #0f1117; color: #e2e8f0; padding: 32px; }
    h1 { font-size: 1.8rem; font-weight: 700; color: #a78bfa; margin-bottom: 4px; }
    .subtitle { color: #94a3b8; font-size: 0.9rem; margin-bottom: 32px; }
    h2 { font-size: 1.1rem; color: #c4b5fd; margin-bottom: 16px; border-left: 3px solid #7c3aed; padding-left: 12px; }
    .section { background: #1e2130; border-radius: 12px; padding: 24px; margin-bottom: 28px; border: 1px solid #2d3148; }
    .grid2 { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; }
    .grid3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 24px; }
    canvas { max-height: 280px; }
    table { width: 100%; border-collapse: collapse; font-size: 0.8rem; }
    th { background: #2d3148; color: #a78bfa; text-align: left; padding: 10px 12px; font-weight: 600; }
    td { padding: 9px 12px; border-bottom: 1px solid #2d3148; color: #cbd5e1; }
    tr:hover td { background: #252840; }
    .badge { display: inline-block; padding: 2px 8px; border-radius: 9999px; font-size: 0.7rem; font-weight: 600; }
    .badge-default { background: #7c3aed22; color: #a78bfa; border: 1px solid #7c3aed44; }
    .meta { display: flex; gap: 24px; flex-wrap: wrap; margin-bottom: 24px; }
    .meta-card { background: #252840; border-radius: 8px; padding: 16px 20px; border: 1px solid #2d3148; }
    .meta-card .val { font-size: 1.6rem; font-weight: 700; color: #a78bfa; }
    .meta-card .lbl { font-size: 0.75rem; color: #94a3b8; margin-top: 2px; }
  </style>
</head>
<body>

<h1>⚡ AtlasBot — Avaliação Experimental do Pipeline RAG</h1>
<p class="subtitle">Gerado em ${new Date().toLocaleString("pt-BR")} · ${allResults.length} configurações · ${TEST_QUESTIONS.length} perguntas por configuração</p>

<div class="meta">
  <div class="meta-card"><div class="val">${allResults.length}</div><div class="lbl">Configurações testadas</div></div>
  <div class="meta-card"><div class="val">${TEST_QUESTIONS.length}</div><div class="lbl">Perguntas de avaliação</div></div>
  <div class="meta-card"><div class="val">${allResults.length * TEST_QUESTIONS.length}</div><div class="lbl">Total de inferências</div></div>
  <div class="meta-card"><div class="val">text-embedding-3-small</div><div class="lbl">Modelo de embedding</div></div>
  <div class="meta-card"><div class="val">gpt-4o-mini</div><div class="lbl">Modelo de geração</div></div>
  <div class="meta-card"><div class="val">RRF</div><div class="lbl">Estratégia de reranking</div></div>
</div>

<div class="section grid2">
  <div>
    <h2>Similaridade Média por Configuração</h2>
    <canvas id="chartSim"></canvas>
  </div>
  <div>
    <h2>Cobertura de Palavras-Chave (%)</h2>
    <canvas id="chartCov"></canvas>
  </div>
</div>

<div class="section grid2">
  <div>
    <h2>Chunks Recuperados (média)</h2>
    <canvas id="chartChunks"></canvas>
  </div>
  <div>
    <h2>Latência Média (ms)</h2>
    <canvas id="chartLatency"></canvas>
  </div>
</div>

<div class="section">
  <h2>Tabela Comparativa Completa</h2>
  <table>
    <thead>
      <tr>
        <th>Configuração</th>
        <th>Threshold</th>
        <th>match_count</th>
        <th>top_k</th>
        <th>RRF k</th>
        <th>Chunks (média)</th>
        <th>Similaridade (média)</th>
        <th>Cobertura</th>
        <th>Latência Retrieval</th>
        <th>Latência Geração</th>
      </tr>
    </thead>
    <tbody>${tableRows}</tbody>
  </table>
</div>

<script>
const labels = [${labels}];
const colors = labels.map((_, i) => \`hsl(\${200 + i * 15}, 70%, 60%)\`);
const borderColors = labels.map((_, i) => \`hsl(\${200 + i * 15}, 80%, 50%)\`);

function barChart(id, data, label, color) {
  new Chart(document.getElementById(id), {
    type: 'bar',
    data: {
      labels,
      datasets: [{ label, data, backgroundColor: colors, borderColor: borderColors, borderWidth: 1.5, borderRadius: 6 }]
    },
    options: {
      responsive: true,
      plugins: { legend: { display: false } },
      scales: {
        x: { ticks: { color: '#94a3b8', font: { size: 10 } }, grid: { color: '#2d3148' } },
        y: { ticks: { color: '#94a3b8' }, grid: { color: '#2d3148' } }
      }
    }
  });
}

barChart('chartSim', [${avgSim}], 'Similaridade média', '#a78bfa');
barChart('chartCov', [${avgCov}], 'Cobertura (%)', '#34d399');
barChart('chartChunks', [${avgChunks}], 'Chunks recuperados', '#60a5fa');

new Chart(document.getElementById('chartLatency'), {
  type: 'bar',
  data: {
    labels,
    datasets: [
      { label: 'Retrieval (ms)', data: [${avgRetLatency}], backgroundColor: '#818cf8aa', borderColor: '#818cf8', borderWidth: 1.5, borderRadius: 6 },
      { label: 'Geração (ms)',   data: [${avgGenLatency}], backgroundColor: '#f472b6aa', borderColor: '#f472b6', borderWidth: 1.5, borderRadius: 6 },
    ]
  },
  options: {
    responsive: true,
    plugins: { legend: { labels: { color: '#94a3b8' } } },
    scales: {
      x: { ticks: { color: '#94a3b8', font: { size: 10 } }, grid: { color: '#2d3148' } },
      y: { ticks: { color: '#94a3b8' }, grid: { color: '#2d3148' } }
    }
  }
});
</script>

</body>
</html>`;
}

// ─── Main ────────────────────────────────────────────────────────────────────

async function main() {
  console.log("🔬 AtlasBot — Avaliação Experimental do Pipeline RAG");
  console.log(`   ${CONFIGURATIONS.length} configurações × ${TEST_QUESTIONS.length} perguntas = ${CONFIGURATIONS.length * TEST_QUESTIONS.length} inferências\n`);

  const allResults: ConfigResult[] = [];

  for (const cfg of CONFIGURATIONS) {
    const result = await evaluateConfig(cfg);
    allResults.push(result);
  }

  // Salva JSON
  const jsonPath = path.join(__dirname, "evaluation_report.json");
  fs.writeFileSync(jsonPath, JSON.stringify(allResults, null, 2));
  console.log(`\n✅ JSON salvo em: ${jsonPath}`);

  // Salva HTML
  const htmlPath = path.join(__dirname, "evaluation_report.html");
  fs.writeFileSync(htmlPath, generateHTML(allResults));
  console.log(`✅ Relatório HTML salvo em: ${htmlPath}`);
  console.log("\n🎉 Avaliação concluída! Abra o HTML no navegador para ver os gráficos.\n");
}

main().catch(console.error);

import { Category } from "@/lib/knowledgeBase";

export const CATEGORY_LABELS: Record<Category, string> = {
  rh: "RH",
  ti: "TI",
  onboarding: "Onboarding",
  processos: "Processos",
  seguranca: "Segurança",
  lgpd: "LGPD",
  etica: "Ética",
  treinamento: "Treinamento",
  empresa: "Empresa",
};

export const EXAMPLE_QUERIES = [
  { text: "Como solicitar férias?", icon: "🏖️" },
  { text: "Como abrir um chamado de suporte?", icon: "🎫" },
  { text: "Como solicitar reembolso de despesas?", icon: "💰" },
  { text: "Onde encontro a documentação de onboarding?", icon: "📋" },
];

export const RETRIEVAL_STAGES = {
  searching: { label: "Pesquisando...", progress: 20 },
  retrieving: { label: "Recuperando documentos...", progress: 55 },
  generating: { label: "Gerando resposta...", progress: 85 },
} as const;

export type RetrievalStage = keyof typeof RETRIEVAL_STAGES;

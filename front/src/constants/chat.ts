import { Category } from "@/lib/knowledgeBase";

export const CATEGORY_LABELS: Record<Category, string> = {
  "HR Policies": "Políticas de RH",
  "IT Support": "Suporte de TI",
  "Engineering Docs": "Docs de Engenharia",
  "Onboarding": "Integração",
};

export const EXAMPLE_QUERIES = [
  { text: "Como solicitar férias?", icon: "🏖️" },
  { text: "Como abrir um chamado de suporte?", icon: "🎫" },
  { text: "Qual é o processo de deploy?", icon: "🚀" },
  { text: "Onde encontro a documentação de onboarding?", icon: "📋" },
];

export const RETRIEVAL_STAGES = {
  searching: { label: "Pesquisando...", progress: 20 },
  retrieving: { label: "Recuperando documentos...", progress: 55 },
  generating: { label: "Gerando resposta...", progress: 85 },
} as const;

export type RetrievalStage = keyof typeof RETRIEVAL_STAGES;

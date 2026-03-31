export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  sources?: KBDocument[];
  timestamp: Date;
}

export interface KBDocument {
  id: string;
  title: string;
  category: string;
  content: string;
  version: string;
}

export type Category =
  | "rh"
  | "ti"
  | "onboarding"
  | "processos"
  | "seguranca"
  | "lgpd"
  | "etica"
  | "treinamento"
  | "empresa";

export const categories: Category[] = [
  "rh",
  "ti",
  "onboarding",
  "processos",
  "seguranca",
  "lgpd",
  "etica",
  "treinamento",
  "empresa",
];

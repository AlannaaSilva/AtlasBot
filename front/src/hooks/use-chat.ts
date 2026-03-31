import { useState, useCallback } from "react";
import { type ChatMessage, type KBDocument } from "@/lib/knowledgeBase";
import { RetrievalStage, RETRIEVAL_STAGES } from "@/constants/chat";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

function getToken(): string | null {
  return localStorage.getItem("atlasbot_token");
}

export function useChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [retrievalStage, setRetrievalStage] = useState<RetrievalStage | null>(
    null,
  );
  const [retrievalProgress, setRetrievalProgress] = useState(0);
  const [conversationId, setConversationId] = useState<string | null>(null);

  const clearChat = useCallback(() => {
    setMessages([]);
    setRetrievalStage(null);
    setRetrievalProgress(0);
    setConversationId(null);
  }, []);

  const handleSubmit = useCallback(
    async (query: string) => {
      setIsProcessing(true);

      // Adiciona mensagem do usuário
      const userMsg: ChatMessage = {
        id: crypto.randomUUID(),
        role: "user",
        content: query,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, userMsg]);

      try {
        // Stage: Searching (Simulando o início da busca para feedback visual)
        setRetrievalStage("searching");
        setRetrievalProgress(RETRIEVAL_STAGES.searching.progress);
        await delay(400);

        // Stage: Retrieving
        setRetrievalStage("retrieving");
        setRetrievalProgress(RETRIEVAL_STAGES.retrieving.progress);

        // Chamada ao backend real
        const res = await fetch(`${API_URL}/api/chat`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getToken()}`,
          },
          body: JSON.stringify({
            question: query,
            conversationId,
          }),
        });

        if (!res.ok) {
          const err = await res.json();
          if (res.status === 401) {
            localStorage.removeItem("atlasbot_token");
            window.location.href = "/login";
            return;
          }
          throw new Error(err.error || "Erro ao obter resposta");
        }

        // Stage: Generating
        setRetrievalStage("generating");
        setRetrievalProgress(RETRIEVAL_STAGES.generating.progress);

        const data = await res.json();

        // Salvar conversationId para manter histórico
        if (data.conversationId) {
          setConversationId(data.conversationId);
        }

        setRetrievalProgress(100);
        await delay(200);
        setRetrievalStage(null);
        setRetrievalProgress(0);

        // Mapear sources retornadas pelo backend
        // Agora o backend envia 'content' e os campos de 'metadata'
        const sources: KBDocument[] = (data.sources || [])
          .filter(Boolean)
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          .map((meta: any) => ({
            id: meta?.id || crypto.randomUUID(),
            title: meta?.title || "Documento interno",
            category: meta?.category || "IT Support", // Default para categoria válida
            content: meta?.content || "",
            version: meta?.version || "v1.0",
          }));

        const assistantMsg: ChatMessage = {
          id: crypto.randomUUID(),
          role: "assistant",
          content: data.answer,
          sources,
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, assistantMsg]);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        setRetrievalStage(null);
        setRetrievalProgress(0);

        // Mensagem de erro amigável no chat
        const errorMsg: ChatMessage = {
          id: crypto.randomUUID(),
          role: "assistant",
          content: `Desculpe, ocorreu um erro: ${error.message}. Verifique se o backend está rodando em ${API_URL}.`,
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, errorMsg]);
      } finally {
        setIsProcessing(false);
      }
    },
    [conversationId],
  );

  return {
    messages,
    isProcessing,
    retrievalStage,
    retrievalProgress,
    handleSubmit,
    clearChat,
  };
}

import { useState, useCallback } from "react";
import { 
  retrieveDocuments, 
  generateResponse, 
  type ChatMessage,
  type KBDocument
} from "@/lib/knowledgeBase";
import { RetrievalStage, RETRIEVAL_STAGES } from "@/constants/chat";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export function useChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [retrievalStage, setRetrievalStage] = useState<RetrievalStage | null>(null);
  const [retrievalProgress, setRetrievalProgress] = useState(0);

  const clearChat = useCallback(() => {
    setMessages([]);
    setRetrievalStage(null);
    setRetrievalProgress(0);
  }, []);

  const addMessage = useCallback((msg: ChatMessage) => {
    setMessages((prev) => [...prev, msg]);
  }, []);

  const handleSubmit = useCallback(async (query: string) => {
    setIsProcessing(true);

    const userMsg: ChatMessage = {
      id: crypto.randomUUID(),
      role: "user",
      content: query,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMsg]);

    // Stage: Searching
    setRetrievalStage("searching");
    setRetrievalProgress(RETRIEVAL_STAGES.searching.progress);
    await delay(600);

    // Stage: Retrieving
    setRetrievalStage("retrieving");
    setRetrievalProgress(RETRIEVAL_STAGES.retrieving.progress);
    const sources = retrieveDocuments(query);
    await delay(500);

    // Stage: Generating
    setRetrievalStage("generating");
    setRetrievalProgress(RETRIEVAL_STAGES.generating.progress);
    const response = generateResponse(query, sources);
    await delay(700);

    setRetrievalProgress(100);
    await delay(200);

    setRetrievalStage(null);
    setRetrievalProgress(0);

    const assistantMsg: ChatMessage = {
      id: crypto.randomUUID(),
      role: "assistant",
      content: response,
      sources: sources.map((s) => s.document),
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, assistantMsg]);
    setIsProcessing(false);
  }, []);

  return {
    messages,
    isProcessing,
    retrievalStage,
    retrievalProgress,
    handleSubmit,
    clearChat,
  };
}

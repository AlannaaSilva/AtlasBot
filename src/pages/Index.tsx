import { useState, useRef, useEffect, useCallback } from "react";
import { AnimatePresence } from "framer-motion";
import { ChatSidebar } from "@/components/ChatSidebar";
import { MessageBubble, type ChatMessage } from "@/components/MessageBubble";
import { ChatInput } from "@/components/ChatInput";
import { RetrievalStatus } from "@/components/RetrievalStatus";
import { DocumentPanel } from "@/components/DocumentPanel";
import { Sparkles, MessageCircle, Zap, Home } from "lucide-react";
import {
  retrieveDocuments,
  generateResponse,
  type Category,
  type KBDocument,
} from "@/lib/knowledgeBase";

const EXAMPLE_QUERIES = [
  "Como solicitar férias?",
  "Como abrir um chamado de suporte?",
  "Qual é o processo de deploy?",
  "Onde encontro a documentação de onboarding?",
];

const QUERY_ICONS = ["🏖️", "🎫", "🚀", "📋"];

function Typewriter({ text, delay = 50 }: { text: string; delay?: number }) {
  const [currentText, setCurrentText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setCurrentText(prev => prev + text[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, delay);
      return () => clearTimeout(timeout);
    }
  }, [currentIndex, delay, text]);

  return (
    <span className="flex items-center justify-center">
      {currentText}
      <span 
        className={`inline-block w-1.5 h-[1em] bg-primary ml-1.5 rounded-sm ${currentIndex < text.length ? 'animate-pulse' : 'animate-pulse opacity-50'}`} 
      />
    </span>
  );
}

export default function Index() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [activeCategory, setActiveCategory] = useState<Category | null>(null);
  const [recentQueries, setRecentQueries] = useState<string[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [retrievalStage, setRetrievalStage] = useState<
    "searching" | "retrieving" | "generating" | null
  >(null);
  const [retrievalProgress, setRetrievalProgress] = useState(0);
  const [selectedDoc, setSelectedDoc] = useState<KBDocument | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = useCallback(() => {
    setTimeout(() => {
      scrollRef.current?.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: "smooth",
      });
    }, 50);
  }, []);

  useEffect(scrollToBottom, [messages, retrievalStage, scrollToBottom]);

  const handleSubmit = async (query: string) => {
    setIsProcessing(true);
    setRecentQueries((prev) => [query, ...prev.filter((q) => q !== query)]);

    const userMsg: ChatMessage = {
      id: crypto.randomUUID(),
      role: "user",
      content: query,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMsg]);

    setRetrievalStage("searching");
    setRetrievalProgress(20);
    await delay(600);

    setRetrievalStage("retrieving");
    setRetrievalProgress(55);
    const sources = retrieveDocuments(query);
    await delay(500);

    setRetrievalStage("generating");
    setRetrievalProgress(85);
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
  };

  return (
    <div className="flex h-screen text-foreground antialiased">
      <ChatSidebar
        activeCategory={activeCategory}
        onCategorySelect={setActiveCategory}
        recentQueries={recentQueries}
        onQuerySelect={handleSubmit}
      />

      <main className="flex-1 flex flex-col relative bg-background min-w-0">
        {/* Header */}
        <header className="h-16 border-b border-border bg-gradient-to-r from-card/80 to-card/60 backdrop-blur-md flex items-center px-6 md:px-8 justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-primary to-primary-glow flex items-center justify-center shadow-lg shadow-primary/20">
              <MessageCircle size={18} className="text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-sm font-semibold text-foreground">Assistente de Conhecimento</h1>
              <p className="text-[11px] text-muted-foreground">Base de conhecimento interna</p>
            </div>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            {messages.length > 0 && (
              <button
                onClick={() => {
                  setMessages([]);
                  setRetrievalStage(null);
                  setRetrievalProgress(0);
                }}
                className="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full bg-background hover:bg-accent text-foreground transition-all duration-200 text-xs font-medium border border-border shadow-sm group hover:border-primary/40 hover:shadow-md"
              >
                <Home size={14} className="text-muted-foreground group-hover:text-primary transition-colors" />
                <span className="hidden sm:inline">Início</span>
              </button>
            )}
            <div className="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full bg-accent/60 border border-primary/20">
              <Zap size={14} className="text-primary" />
              <span className="hidden sm:inline text-[11px] font-medium text-accent-foreground tabular-nums">
                IA Ativa
              </span>
            </div>
          </div>
        </header>

        {/* Messages */}
        <div
          ref={scrollRef}
          className="flex-1 overflow-y-auto p-6 md:p-8 space-y-8 max-w-3xl mx-auto w-full"
        >
          {messages.length === 0 && !isProcessing && (
            <div className="flex flex-col items-center justify-center h-full text-center space-y-10 animate-fade-in">
              <div className="space-y-5">
                <div className="h-20 w-20 rounded-3xl bg-gradient-to-br from-primary via-primary-glow to-purple-400 flex items-center justify-center mx-auto shadow-2xl shadow-primary/30 ring-4 ring-primary/10">
                  <Sparkles size={32} className="text-primary-foreground" />
                </div>
                <div className="space-y-3">
                  <h2 className="text-2xl font-semibold text-foreground flex justify-center">
                    <Typewriter text="Como posso ajudar?" delay={60} />
                  </h2>
                  <p className="text-sm text-muted-foreground max-w-md leading-relaxed">
                    Pergunte sobre políticas de RH, suporte de TI, processos de engenharia ou integração de novos colaboradores.
                  </p>
                </div>
              </div>
              
              {/* Quick Actions Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-xl">
                {EXAMPLE_QUERIES.map((q, i) => (
                  <button
                    key={q}
                    onClick={() => handleSubmit(q)}
                    className="text-left px-5 py-5 text-sm text-foreground/80 bg-card rounded-2xl border border-border shadow-card hover:shadow-card-hover hover:border-primary/30 hover:text-foreground hover:bg-accent/30 transition-all duration-300 flex items-start gap-4 group"
                  >
                    <span className="text-2xl shrink-0 group-hover:scale-110 transition-transform">{QUERY_ICONS[i]}</span>
                    <span className="group-hover:text-foreground transition-colors font-medium">{q}</span>
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-2 text-[11px] text-muted-foreground/60">
                <div className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
                <span>Sistema pronto para responder</span>
              </div>
            </div>
          )}

          {messages.map((msg) => (
            <MessageBubble
              key={msg.id}
              message={msg}
              onSourceClick={setSelectedDoc}
            />
          ))}

          <AnimatePresence>
            {retrievalStage && (
              <RetrievalStatus
                stage={retrievalStage}
                progress={retrievalProgress}
              />
            )}
          </AnimatePresence>
        </div>

        {/* Input */}
        <ChatInput
          onSubmit={handleSubmit}
          isProcessing={isProcessing}
          activeCategory={activeCategory}
        />
      </main>

      <DocumentPanel document={selectedDoc} onClose={() => setSelectedDoc(null)} />
    </div>
  );
}

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
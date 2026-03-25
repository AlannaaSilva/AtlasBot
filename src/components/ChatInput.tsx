import { useState, useRef, useEffect } from "react";
import { ArrowUp, Loader2 } from "lucide-react";
import type { Category } from "@/lib/knowledgeBase";

interface ChatInputProps {
  onSubmit: (message: string) => void;
  isProcessing: boolean;
  activeCategory: Category | null;
}

export function ChatInput({ onSubmit, isProcessing, activeCategory }: ChatInputProps) {
  const [value, setValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSubmit = () => {
    const trimmed = value.trim();
    if (!trimmed || isProcessing) return;
    onSubmit(trimmed);
    setValue("");
  };

  return (
    <div className="p-4 md:p-6 border-t border-border/50 bg-gradient-to-t from-card/50 to-transparent">
      <div className="max-w-3xl mx-auto space-y-3">
        {activeCategory && (
          <div className="flex items-center gap-2 px-1">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span className="text-[11px] font-medium text-accent-foreground bg-accent/70 px-2.5 py-1 rounded-full border border-primary/20">
              {activeCategory === "HR Policies" ? "Políticas de RH" :
               activeCategory === "IT Support" ? "Suporte de TI" :
               activeCategory === "Engineering Docs" ? "Docs de Engenharia" :
               activeCategory === "Onboarding" ? "Integração" : activeCategory}
            </span>
          </div>
        )}
        <div className="relative group flex items-center">
          <input
            ref={inputRef}
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            placeholder="Digite sua pergunta sobre processos internos..."
            disabled={isProcessing}
            className="w-full pl-6 pr-20 py-5 bg-card rounded-2xl border border-border/70 shadow-sm focus:shadow-md focus:border-primary/50 focus:ring-4 focus:ring-primary/10 focus:outline-none transition-all duration-300 text-base placeholder:text-muted-foreground/60 disabled:opacity-50"
          />
          <button
            onClick={handleSubmit}
            disabled={isProcessing || !value.trim()}
            className="absolute right-3 p-3.5 bg-gradient-to-br from-primary to-primary-glow text-primary-foreground rounded-xl shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 hover:scale-105 active:scale-95 transition-all duration-200 disabled:opacity-30 disabled:from-muted disabled:to-muted disabled:shadow-none flex items-center justify-center"
          >
            {isProcessing ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              <ArrowUp size={18} strokeWidth={2.5} />
            )}
          </button>
        </div>
        <div className="flex items-center justify-center gap-4 text-[11px] text-muted-foreground/50">
          <span className="flex items-center gap-1.5">
            <span className="w-1 h-1 rounded-full bg-green-500" />
            Base de conhecimento interna
          </span>
          <span className="w-1 h-1 rounded-full bg-border" />
          <span>Sem dados externos</span>
        </div>
      </div>
    </div>
  );
}

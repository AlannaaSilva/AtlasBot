import { motion } from "framer-motion";
import ReactMarkdown from "react-markdown";
import { SourceCard } from "./SourceCard";
import { User, Bot } from "lucide-react";
import type { KBDocument, ChatMessage } from "@/lib/knowledgeBase";

interface MessageBubbleProps {
  message: ChatMessage;
  onSourceClick: (doc: KBDocument) => void;
}

const transition = { duration: 0.3, ease: [0.25, 0.1, 0.25, 1] as const };

export function MessageBubble({ message, onSourceClick }: MessageBubbleProps) {
  const isUser = message.role === "user";

  return (
    <motion.div
      initial={{ opacity: 0, y: 16, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ ...transition, duration: 0.35 }}
      className="w-full"
    >
      <div className="flex items-start gap-3 mb-4">
        <div className={`h-8 w-8 rounded-xl flex items-center justify-center shrink-0 shadow-lg ${
          isUser
            ? "bg-secondary text-muted-foreground"
            : "bg-gradient-to-br from-primary to-primary-glow text-primary-foreground shadow-primary/30"
        }`}>
          {isUser ? <User size={16} /> : <Bot size={16} />}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-sm font-semibold text-foreground">
              {isUser ? "Você" : "Assistente IA"}
            </span>
            <span className="text-[11px] text-muted-foreground/60 tabular-nums">
              {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
            </span>
          </div>

          {isUser ? (
            <div className="text-sm text-foreground bg-card rounded-2xl rounded-tl-sm px-5 py-3.5 border border-border shadow-card">
              {message.content}
            </div>
          ) : (
            <div className="space-y-4">
              <div className="text-sm leading-[1.75] text-foreground/90 text-pretty max-w-prose prose prose-sm prose-zinc dark:prose-invert">
                <ReactMarkdown>{message.content}</ReactMarkdown>
              </div>

              {message.sources && message.sources.length > 0 && (
                <div className="space-y-3 pt-2">
                  <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider text-primary">
                    <span className="w-4 h-[2px] bg-primary rounded-full" />
                    Fontes Consultadas
                  </div>
                  <div className="flex flex-wrap gap-2.5">
                    {message.sources.map((doc, i) => (
                      <SourceCard
                        key={doc.id}
                        document={doc}
                        index={i}
                        onClick={onSourceClick}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

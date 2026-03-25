import { X, FileText, Tag, Hash } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import ReactMarkdown from "react-markdown";
import type { KBDocument } from "@/lib/knowledgeBase";

interface DocumentPanelProps {
  document: KBDocument | null;
  onClose: () => void;
}

export function DocumentPanel({ document, onClose }: DocumentPanelProps) {
  return (
    <AnimatePresence>
      {document && (
        <motion.div
          initial={{ x: "100%", opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: "100%", opacity: 0 }}
          transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
          className="w-[420px] border-l border-border bg-card shrink-0 flex flex-col overflow-hidden"
        >
          <div className="h-14 border-b border-border flex items-center justify-between px-5">
            <div className="flex items-center gap-3 min-w-0">
              <div className="h-7 w-7 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                <FileText size={13} className="text-primary" />
              </div>
              <span className="text-sm font-semibold truncate">
                {document.title}
              </span>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-secondary transition-colors text-muted-foreground"
            >
              <X size={16} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-accent-foreground bg-accent px-2.5 py-1.5 rounded-lg">
                <Tag size={10} />
                {document.category}
              </span>
              <span className="inline-flex items-center gap-1 text-[10px] tabular-nums text-muted-foreground bg-secondary px-2 py-1.5 rounded-lg">
                <Hash size={10} />
                {document.id} · {document.version}
              </span>
            </div>

            <div className="text-sm leading-[1.75] text-foreground/90 text-pretty prose prose-sm prose-zinc dark:prose-invert">
              <ReactMarkdown>{document.content}</ReactMarkdown>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

import { FileText, ExternalLink } from "lucide-react";
import { motion } from "framer-motion";
import type { KBDocument } from "@/lib/knowledgeBase";

interface SourceCardProps {
  document: KBDocument;
  index: number;
  onClick: (doc: KBDocument) => void;
}

export function SourceCard({ document, index, onClick }: SourceCardProps) {
  return (
    <motion.button
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{
        duration: 0.2,
        ease: [0.25, 0.1, 0.25, 1],
        delay: index * 0.06,
      }}
      onClick={() => onClick(document)}
      className="px-3.5 py-2.5 bg-accent border border-border rounded-xl flex items-center gap-2.5 cursor-pointer hover:shadow-card-hover hover:border-primary/20 transition-all duration-200 text-left group"
    >
      <div className="h-7 w-7 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
        <FileText size={13} className="text-primary" />
      </div>
      <div className="min-w-0">
        <span className="text-xs font-medium text-accent-foreground block truncate">
          {document.title}
        </span>
        <span className="text-[10px] text-muted-foreground tabular-nums">
          {document.id} · {document.version}
        </span>
      </div>
      <ExternalLink size={10} className="text-muted-foreground/40 group-hover:text-primary transition-colors shrink-0 ml-1" />
    </motion.button>
  );
}

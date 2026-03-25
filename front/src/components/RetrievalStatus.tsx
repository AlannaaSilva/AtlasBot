import { motion } from "framer-motion";
import { Search, FileText, Sparkles } from "lucide-react";

interface RetrievalStatusProps {
  stage: "searching" | "retrieving" | "generating";
  progress: number;
}

const stageConfig = {
  searching: { label: "Pesquisando na base de conhecimento…", icon: Search, color: "text-primary" },
  retrieving: { label: "Recuperando documentos relevantes…", icon: FileText, color: "text-primary" },
  generating: { label: "Gerando resposta contextualizada…", icon: Sparkles, color: "text-primary" },
};

export function RetrievalStatus({ stage, progress }: RetrievalStatusProps) {
  const config = stageConfig[stage];
  const Icon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
      className="w-full ml-8"
    >
      <div className="bg-card border border-border rounded-2xl p-4 shadow-card space-y-3">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-xl bg-primary/10 flex items-center justify-center">
            <Icon size={14} className={`${config.color} animate-pulse-soft`} />
          </div>
          <div>
            <span className="text-sm font-medium text-foreground">{config.label}</span>
            <span className="block text-[10px] text-muted-foreground tabular-nums">{progress}% concluído</span>
          </div>
        </div>
        <div className="h-1.5 w-full bg-secondary rounded-full overflow-hidden">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-primary to-primary-glow"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          />
        </div>
      </div>
    </motion.div>
  );
}

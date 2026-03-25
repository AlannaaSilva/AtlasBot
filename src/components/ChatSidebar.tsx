import {
  Search,
  Sparkles,
  Clock,
  ChevronRight,
  BookOpen,
  HelpCircle,
  Zap,
  Briefcase,
  Monitor,
  Code,
  Rocket,
  type LucideIcon,
} from "lucide-react";
import { categories, type Category } from "@/lib/knowledgeBase";

interface ChatSidebarProps {
  activeCategory: Category | null;
  onCategorySelect: (category: Category | null) => void;
  recentQueries: string[];
  onQuerySelect: (query: string) => void;
}

const categoryIcons: Record<Category, LucideIcon> = {
  "HR Policies": Briefcase,
  "IT Support": Monitor,
  "Engineering Docs": Code,
  Onboarding: Rocket,
};

const categoryLabels: Record<Category, string> = {
  "HR Policies": "Políticas de RH",
  "IT Support": "Suporte de TI",
  "Engineering Docs": "Docs de Engenharia",
  Onboarding: "Integração",
};

export function ChatSidebar({
  activeCategory,
  onCategorySelect,
  recentQueries,
  onQuerySelect,
}: ChatSidebarProps) {
  return (
    <aside className="w-72 bg-sidebar p-6 flex flex-col gap-5 shrink-0 hidden md:flex border-r border-sidebar-border">
      {/* Logo */}
      <div className="flex items-center gap-3 px-2">
        <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary to-primary-glow flex items-center justify-center shadow-lg shadow-primary/30">
          <Zap size={20} className="text-primary-foreground" />
        </div>
        <div>
          <span className="text-sm font-semibold text-sidebar-primary">
            AtlasBot
          </span>
          <span className="block text-[10px] text-sidebar-muted flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
            Online
          </span>
        </div>
      </div>

      {/* Search hint */}
      <div className="flex items-center gap-2.5 px-4 py-3 rounded-xl bg-sidebar-accent/40 border border-sidebar-border hover:bg-sidebar-accent/60 transition-colors cursor-pointer group">
        <Search
          size={14}
          className="text-sidebar-primary group-hover:scale-110 transition-transform"
        />
        <span className="text-xs text-sidebar-foreground/80">
          Buscar na base...
        </span>
      </div>

      {/* Categories */}
      <nav className="space-y-1">
        <div className="px-3 mb-3 text-[10px] font-semibold uppercase tracking-widest text-sidebar-muted flex items-center gap-2">
          <BookOpen size={12} />
          Categorias
        </div>
        <button
          onClick={() => onCategorySelect(null)}
          className={`w-full text-left px-3.5 py-2.5 text-sm rounded-xl transition-all duration-200 flex items-center gap-3 ${
            activeCategory === null
              ? "bg-gradient-to-r from-sidebar-accent to-sidebar-accent/70 text-sidebar-accent-foreground font-medium shadow-lg shadow-black/20"
              : "text-sidebar-foreground hover:bg-sidebar-accent/40 hover:text-sidebar-accent-foreground"
          }`}
        >
          <HelpCircle
            size={14}
            className={
              activeCategory === null
                ? "text-sidebar-primary"
                : "text-sidebar-muted"
            }
          />
          <span>Todas as Categorias</span>
        </button>
        {categories.map((cat) => {
          const Icon = categoryIcons[cat];
          return (
            <button
              key={cat}
              onClick={() => onCategorySelect(cat)}
              className={`w-full text-left px-3.5 py-2.5 text-sm rounded-xl transition-all duration-200 flex items-center gap-3 group ${
                activeCategory === cat
                  ? "bg-gradient-to-r from-sidebar-accent to-sidebar-accent/70 text-sidebar-accent-foreground font-medium shadow-lg shadow-black/20"
                  : "text-sidebar-foreground hover:bg-sidebar-accent/40 hover:text-sidebar-accent-foreground"
              }`}
            >
              <Icon
                size={14}
                className={
                  activeCategory === cat
                    ? "text-sidebar-primary"
                    : "text-sidebar-muted"
                }
              />
              <span className="flex-1">{categoryLabels[cat]}</span>
              <ChevronRight
                size={14}
                className="opacity-0 group-hover:opacity-60 transition-opacity text-sidebar-primary"
              />
            </button>
          );
        })}
      </nav>

      {/* Recent */}
      {recentQueries.length > 0 && (
        <div className="space-y-2">
          <div className="px-3 flex items-center gap-2 text-[10px] font-semibold uppercase tracking-widest text-sidebar-muted">
            <Clock size={12} />
            Recentes
          </div>
          <div className="space-y-0.5">
            {recentQueries.slice(0, 5).map((q, i) => (
              <button
                key={i}
                onClick={() => onQuerySelect(q)}
                className="w-full text-left px-3.5 py-2.5 text-xs text-sidebar-foreground/70 rounded-xl hover:bg-sidebar-accent/40 hover:text-sidebar-accent-foreground transition-all truncate flex items-center gap-2"
              >
                <span className="w-5 h-5 rounded-lg bg-sidebar-accent/50 flex items-center justify-center text-[10px]">
                  {i + 1}
                </span>
                {q}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="mt-auto p-4 rounded-xl bg-gradient-to-br from-sidebar-accent/50 to-sidebar-accent/30 border border-sidebar-border">
        <div className="flex items-start gap-2">
          <Sparkles
            size={14}
            className="text-sidebar-primary mt-0.5 shrink-0"
          />
          <div className="text-[10px] text-sidebar-muted leading-relaxed">
            <span className="text-sidebar-foreground/80 font-medium">
              RAG Ativo
            </span>
            <br />
            Respostas baseadas exclusivamente na documentação interna.
          </div>
        </div>
      </div>
    </aside>
  );
}

import { Router, Response } from "express";
import { authMiddleware, AuthRequest } from "../middleware/auth";
import { generateEmbedding } from "../services/embeddingService";
import { supabase } from "../config/supabase";

const router = Router();

const MAX_CONTENT_LENGTH = 50000;

interface IngestBody {
  title: string;
  content: string;
  category: string;
  version?: string;
}

router.post(
  "/",
  authMiddleware,
  async (req: AuthRequest, res: Response): Promise<void> => {
    const { title, content, category, version } = req.body as Partial<IngestBody>;

    if (!title || typeof title !== "string" || title.trim().length === 0) {
      res.status(400).json({ error: "Campo 'title' é obrigatório" });
      return;
    }

    if (!content || typeof content !== "string" || content.trim().length === 0) {
      res.status(400).json({ error: "Campo 'content' é obrigatório" });
      return;
    }

    if (content.length > MAX_CONTENT_LENGTH) {
      res.status(400).json({
        error: `Conteúdo deve ter no máximo ${MAX_CONTENT_LENGTH} caracteres`,
      });
      return;
    }

    if (!category || typeof category !== "string" || category.trim().length === 0) {
      res.status(400).json({ error: "Campo 'category' é obrigatório" });
      return;
    }

    try {
      const embedding = await generateEmbedding(content.trim());

      const { data, error } = await supabase
        .from("documents")
        .insert({
          content: content.trim(),
          embedding,
          metadata: {
            title: title.trim(),
            category: category.trim(),
            version: version?.trim() ?? "v1.0",
          },
        })
        .select("id")
        .single();

      if (error) throw new Error(error.message);

      res.status(201).json({ id: data.id, message: "Documento indexado com sucesso" });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Erro interno";
      console.error("[ingest] Erro ao indexar documento:", message);
      res.status(500).json({ error: "Erro ao indexar documento" });
    }
  },
);

export default router;

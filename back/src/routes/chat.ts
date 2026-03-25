import { Router, Response } from "express";
import { authMiddleware, AuthRequest } from "../middleware/auth";
import { ragQuery } from "../services/ragService";
import { supabase } from "../config/supabase";

const router = Router();

router.post(
  "/",
  authMiddleware,
  async (req: AuthRequest, res: Response): Promise<void> => {
    const { question, conversationId } = req.body;
    if (!question) {
      res.status(400).json({ error: "Pergunta obrigatória" });
      return;
    }

    try {
      // Buscar histórico
      let history: any[] = [];
      let convId = conversationId;

      if (convId) {
        const { data } = await supabase
          .from("conversations")
          .select("messages")
          .eq("id", convId)
          .single();
        if (data) history = data.messages;
      }

      // Executar RAG
      const { answer, sources } = await ragQuery(question, history);

      // Atualizar histórico
      const updatedHistory = [
        ...history,
        { role: "user", content: question },
        { role: "assistant", content: answer },
      ];

      if (convId) {
        await supabase
          .from("conversations")
          .update({
            messages: updatedHistory,
            updated_at: new Date().toISOString(),
          })
          .eq("id", convId);
      } else {
        const { data } = await supabase
          .from("conversations")
          .insert({ user_id: req.userId, messages: updatedHistory })
          .select("id")
          .single();
        convId = data?.id;
      }

      res.json({ answer, sources, conversationId: convId });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  },
);

export default router;

import { Router, Response } from "express";
import { authMiddleware, AuthRequest } from "../middleware/auth";
import { ragQuery } from "../services/ragService";
import { supabase } from "../config/supabase";

const router = Router();

const MAX_QUESTION_LENGTH = 2000;
const MAX_HISTORY_MESSAGES = 20;

interface ConversationMessage {
  role: "user" | "assistant";
  content: string;
}

router.post(
  "/",
  authMiddleware,
  async (req: AuthRequest, res: Response): Promise<void> => {
    const { question, conversationId } = req.body;

    if (!question || typeof question !== "string") {
      res.status(400).json({ error: "Pergunta obrigatória" });
      return;
    }

    if (question.trim().length === 0) {
      res.status(400).json({ error: "Pergunta não pode ser vazia" });
      return;
    }

    if (question.length > MAX_QUESTION_LENGTH) {
      res.status(400).json({
        error: `Pergunta deve ter no máximo ${MAX_QUESTION_LENGTH} caracteres`,
      });
      return;
    }

    try {
      let history: ConversationMessage[] = [];
      let convId: string | undefined = conversationId;

      if (convId) {
        const { data } = await supabase
          .from("conversations")
          .select("messages")
          .eq("id", convId)
          .single();
        if (data?.messages) {
          history = (data.messages as ConversationMessage[]).slice(
            -MAX_HISTORY_MESSAGES,
          );
        }
      }

      const { answer, sources } = await ragQuery(question.trim(), history);

      const updatedHistory: ConversationMessage[] = [
        ...history,
        { role: "user" as const, content: question.trim() },
        { role: "assistant" as const, content: answer ?? "" },
      ].slice(-MAX_HISTORY_MESSAGES);

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
    } catch (err) {
      const message = err instanceof Error ? err.message : "Erro interno";
      console.error("[chat] Erro ao processar pergunta:", message);
      res.status(500).json({ error: "Erro ao processar sua pergunta" });
    }
  },
);

export default router;

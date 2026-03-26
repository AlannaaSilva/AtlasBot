import { Router, Request, Response } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const router = Router();

// Usuário fixo para demonstração
const DEMO_USER = {
  id: "user-demo-atlasbot",
  email: "demo@atlasbot.com",
  password: "atlasbot2024",
};

router.post("/login", (req: Request, res: Response): void => {
  const { email, password } = req.body;

  if (email !== DEMO_USER.email || password !== DEMO_USER.password) {
    res.status(401).json({ error: "Credenciais inválidas" });
    return;
  }

  const token = jwt.sign({ userId: DEMO_USER.id }, process.env.JWT_SECRET!, {
    expiresIn: "8h",
  });

  res.json({
    token,
    user: { id: DEMO_USER.id, email: DEMO_USER.email },
  });
});

export default router;

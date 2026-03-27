import { Router, Request, Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
dotenv.config();

const router = Router();

const DEMO_ID = "user-demo-atlasbot";

let cachedPasswordHash: string | null = null;
function getPasswordHash(): string {
  if (!cachedPasswordHash) {
    cachedPasswordHash = bcrypt.hashSync(process.env.DEMO_PASSWORD as string, 10);
  }
  return cachedPasswordHash;
}

router.post("/login", async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;

  if (!email || typeof email !== "string" || !password || typeof password !== "string") {
    res.status(400).json({ error: "Email e senha são obrigatórios" });
    return;
  }

  if (email !== process.env.DEMO_EMAIL) {
    res.status(401).json({ error: "Credenciais inválidas" });
    return;
  }

  const passwordMatch = await bcrypt.compare(password, getPasswordHash());
  if (!passwordMatch) {
    res.status(401).json({ error: "Credenciais inválidas" });
    return;
  }

  const token = jwt.sign({ userId: DEMO_ID }, process.env.JWT_SECRET as string, {
    expiresIn: "8h",
  });

  res.json({
    token,
    user: { id: DEMO_ID, email: process.env.DEMO_EMAIL },
  });
});

export default router;

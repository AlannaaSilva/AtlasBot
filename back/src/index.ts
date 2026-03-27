import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import chatRouter from "./routes/chat";
import authRouter from "./routes/auth";
import ingestRouter from "./routes/ingest";
dotenv.config();

const REQUIRED_ENV_VARS = [
  "JWT_SECRET",
  "SUPABASE_URL",
  "SUPABASE_SECRET_KEY",
  "OPENAI_API_KEY",
  "DEMO_EMAIL",
  "DEMO_PASSWORD",
];

const missing = REQUIRED_ENV_VARS.filter((key) => !process.env[key]);
if (missing.length > 0) {
  console.error(
    `[AtlasBot] Variáveis de ambiente obrigatórias não definidas: ${missing.join(", ")}`,
  );
  process.exit(1);
}

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json({ limit: "1mb" }));

app.get("/health", (_, res) => res.json({ status: "ok", project: "AtlasBot" }));
app.use("/api/auth", authRouter);
app.use("/api/chat", chatRouter);
app.use("/api/ingest", ingestRouter);

app.listen(PORT, () =>
  console.log(`AtlasBot backend rodando na porta ${PORT}`),
);

import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import chatRouter from "./routes/chat";
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.get("/health", (_, res) => res.json({ status: "ok", project: "AtlasBot" }));
app.use("/api/chat", chatRouter);

app.listen(PORT, () =>
  console.log(`AtlasBot backend rodando na porta ${PORT}`),
);

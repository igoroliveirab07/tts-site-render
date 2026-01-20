require("dotenv").config();

const express = require("express");
const fs = require("fs");
const path = require("path");
const OpenAI = require("openai");

const app = express();
const PORT = process.env.PORT || 3000;

/* =========================
   MIDDLEWARES
========================= */
app.use(express.json());

// Servir arquivos estáticos da pasta public
app.use(express.static(path.join(process.cwd(), "public")));

/* =========================
   ROTA PRINCIPAL
   (blindada contra erro de src)
========================= */
app.get("/", (req, res) => {
  res.sendFile(
    path.resolve(process.cwd(), "public", "index.html")
  );
});

/* =========================
   OPENAI CONFIG
========================= */
const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/* =========================
   TEXT TO SPEECH
========================= */
app.post("/tts", async (req, res) => {
  try {
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({ error: "Texto não enviado" });
    }

    const response = await client.audio.speech.create({
      model: "gpt-4o-mini-tts",
      voice: "alloy",
      input: text,
    });

    const audioPath = path.resolve(process.cwd(), "public", "audio.mp3");
    const buffer = Buffer.from(await response.arrayBuffer());

    fs.writeFileSync(audioPath, buffer);

    res.json({
      success: true,
      audio: "/audio.mp3",
    });
  } catch (error) {
    console.error("Erro TTS:", error);
    res.status(500).json({ error: "Erro ao gerar áudio" });
  }
});

/* =========================
   START SERVER
========================= */
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
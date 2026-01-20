const express = require("express");
const path = require("path");
require("dotenv").config();

const app = express();

// Servir arquivos estáticos
app.use(express.static(path.join(__dirname, "public")));

// Rota principal
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Porta exigida pelo Render
const PORT = process.env.PORT || 3000;

// ESSENCIAL — mantém o app vivo
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
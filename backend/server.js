import { translateToEnglish } from './translate.js';
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import fetch from "node-fetch";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json({ limit: "10mb" }));

const PORT = process.env.PORT || 5000;
const STABILITY_KEY = process.env.STABILITY_API_KEY;

if (!STABILITY_KEY) {
  console.warn("⚠️ STABILITY_API_KEY não definido em .env. Coloque sua chave em backend/.env");
}

app.get("/", (req, res) => {
  res.json({ ok: true, message: "Backend ativo. Use POST /api/generate-image" });
});

app.post("/api/generate-image", async (req, res) => {
  try {
    const { prompt } = req.body;
    const promptEn = await translateToEnglish(prompt);
    console.log('🈂️ Prompt traduzido automaticamente:', promptEn);
    if (!prompt) return res.status(400).json({ error: "Campo 'prompt' é obrigatório." });

    const engine = "stable-diffusion-xl-1024-v1-0";
    const url = `https://api.stability.ai/v1/generation/${engine}/text-to-image`;

    const body = {
      text_prompts: [{ text: promptEn }],
      cfg_scale: 7,
      height: 1024,
      width: 1024,
      samples: 1,
      steps: 30
    };

    const resp = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
        "Authorization": `Bearer ${STABILITY_KEY}`
      },
      body: JSON.stringify(body),
    });

    const data = await resp.json();

    if (!resp.ok) {
      console.error("Erro Stability:", data);
      return res.status(500).json({ error: data });
    }

    // Try to read base64 artifact or URL
    let imageData = null;
    if (data?.artifacts && Array.isArray(data.artifacts) && data.artifacts.length > 0) {
      const art = data.artifacts[0];
      const b64 = art.base64 || art.b64 || art.base64_string || art.b64_json;
      if (b64) {
        imageData = `data:image/png;base64,${b64}`;
      } else if (art.url) {
        imageData = art.url;
      }
    }

    if (!imageData) {
      console.error("Resposta inesperada da Stability:", JSON.stringify(data).slice(0,1000));
      return res.status(500).json({ error: "Resposta inesperada da Stability. Verifique logs no servidor." });
    }

    res.json({ imageUrl: imageData });
  } catch (err) {
    console.error("Erro ao gerar imagem (Stability):", err);
    res.status(500).json({ error: err.message || "Erro interno" });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Backend rodando na porta ${PORT}`);
});

// --- ADDED BY CHATGPT: auto-translate integration ---

// Helper wrapper example: if you send images with a function sendToStability(prompt, otherOptions)
// convert prompt before calling: const enPrompt = await translateToEnglish(prompt);
// then call the Stability API with enPrompt.

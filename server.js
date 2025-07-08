const express = require('express');
const axios = require('axios');
const OpenAI = require('openai');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;
const SLACK_BOT_TOKEN = process.env.SLACK_BOT_TOKEN;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

console.log("🔐 SLACK TOKEN utilisé :", SLACK_BOT_TOKEN ? "✓ présent" : "❌ manquant");
console.log("🔐 OPENAI KEY utilisée :", OPENAI_API_KEY ? "✓ présente" : "❌ manquante");

const openai = new OpenAI({ apiKey: OPENAI_API_KEY });
app.use(express.json());

app.post('/slack/events', async (req, res) => {
  if (req.body.type === 'url_verification') {
    return res.status(200).type('text/plain').send(req.body.challenge);
  }

  if (req.body.event && req.body.event.type === 'app_mention') {
    const { user, text, channel } = req.body.event;
    console.log(`📨 Mention de ${user} : ${text}`);

    try {
      const aiResponse = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: `Tu es "Agent IA Hôtel", assistant stratégique de Pascal, chargé d’accompagner les équipes du Grand Hôtel de Serre-Chevalier dans une mission d’organisation, de qualité et d’excellence.
Ta mission est d’écouter, comprendre, analyser, répondre avec rigueur et intelligence à toute sollicitation sur Slack.
Tu dois t’exprimer avec professionnalisme, clarté, bienveillance, et une touche d’élégance discrète.
Adapte toujours ta réponse au ton du message reçu.`
          },
          {
            role: "user",
            content: text
          }
        ],
        temperature: 0.7
      });

      const message = aiResponse.choices[0].message.content;
      console.log("🤖 Réponse générée :", message);

      await axios.post('https://slack.com/api/chat.postMessage', {
        channel,
        text: message,
      }, {
        headers: {
          Authorization: `Bearer ${SLACK_BOT_TOKEN}`,
          'Content-Type': 'application/json',
        }
      });

    } catch (error) {
      console.error("❌ Erreur OpenAI ou Slack :", error.response?.data || error.message);
    }
  }

  res.status(200).send();
});

app.listen(port, () => {
  console.log(`✅ Serveur démarré sur le port ${port}`);
});
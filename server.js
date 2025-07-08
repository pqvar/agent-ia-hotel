const express = require('express');
const axios = require('axios');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;
const SLACK_BOT_TOKEN = process.env.SLACK_BOT_TOKEN;
console.log("🔐 TOKEN utilisé :", SLACK_BOT_TOKEN ? "✓ présent" : "❌ manquant");
console.log("🔐 TOKEN utilisé :", SLACK_BOT_TOKEN);

app.use(express.json());

app.post('/slack/events', async (req, res) => {
  // 1. Répondre au challenge de vérification
  if (req.body.type === 'url_verification') {
    console.log('✅ Challenge reçu :', req.body.challenge);
    return res.status(200).type('text/plain').send(req.body.challenge);
  }

  // 2. Traiter les événements Slack (ex: mention du bot)
  if (req.body.event) {
    const event = req.body.event;
    console.log('📨 Événement reçu de Slack :', event);

    if (event.type === 'app_mention') {
      const user = event.user;
      const channel = event.channel;
      const text = event.text;

      console.log(`👋 Mention détectée par ${user} : ${text}`);

      // 3. Répondre automatiquement dans Slack
      try {
        const response = await axios.post('https://slack.com/api/chat.postMessage', {
  channel: event.channel,
  text: `👋 Hello <@${event.user}> !`
}, {
  headers: {
    Authorization: `Bearer ${SLACK_BOT_TOKEN}`,
    'Content-Type': 'application/json'
  }
});

console.log("✅ Réponse Slack API :", response.data);

        console.log('✅ Réponse envoyée dans Slack');
      } catch (error) {
        console.error('❌ Erreur lors de la réponse Slack :', error.response?.data || error.message);
      }
    }
  }

  // 4. Toujours répondre à Slack avec un 200 OK
  res.status(200).send();
});

app.listen(port, () => {
  console.log(`✅ Serveur démarré sur le port ${port}`);
});
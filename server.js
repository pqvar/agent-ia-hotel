const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send('🤖 Agent IA Hôtel prêt à répondre !');
});

app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
});
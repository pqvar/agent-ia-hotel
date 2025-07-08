const express = require('express');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.post('/slack/events', (req, res) => {
  if (req.body.type === 'url_verification') {
    console.log('✅ Challenge reçu :', req.body.challenge);
    return res.status(200).type('text/plain').send(req.body.challenge);
  }

  res.status(200).send();
});

app.listen(port, () => {
  console.log(`✅ Serveur démarré sur le port ${port}`);
});
const express = require('express');
const path = require('path');

const app = express();
const port = 3000;

// Statische Dateien bereitstellen
app.use(express.static('public'));

// Server starten
app.listen(port, () => {
  console.log(`Web-App läuft unter http://localhost:${port}`);
});

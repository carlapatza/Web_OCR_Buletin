const express = require('express');
const multer = require('multer');
const Tesseract = require('tesseract.js');
const path = require('path');

const app = express();
const port = 3000;

// Multer-Konfiguration für Datei-Uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

// Statische Dateien bereitstellen
app.use(express.static('public'));

// Route für Datei-Uploads
app.post('/upload', upload.single('image'), (req, res) => {
  Tesseract.recognize(
    req.file.path,
    'eng',
    {
      logger: m => console.log(m)
    }
  ).then(({ data: { text } }) => {
    res.send({ text });
  }).catch(err => {
    res.status(500).send({ error: err.message });
  });
});

// Server starten
app.listen(port, () => {
  console.log(`Web-App läuft unter http://localhost:${port}`);
});
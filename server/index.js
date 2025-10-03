const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

// Static hosting for videos and AR marker descriptor files
app.use('/public', express.static(path.join(__dirname, '..', 'public')));

const dataDir = path.join(__dirname, 'data');
const dataFile = path.join(dataDir, 'artworks.json');

function ensureData() {
  if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
  if (!fs.existsSync(dataFile)) fs.writeFileSync(dataFile, JSON.stringify({ artworks: [] }, null, 2));
}

ensureData();

function readData() {
  return JSON.parse(fs.readFileSync(dataFile, 'utf-8'));
}

function writeData(json) {
  fs.writeFileSync(dataFile, JSON.stringify(json, null, 2));
}

app.get('/api/health', (_, res) => res.json({ ok: true }));

app.get('/api/artworks', (req, res) => {
  const db = readData();
  res.json(db.artworks);
});

app.get('/api/artworks/:id', (req, res) => {
  const db = readData();
  const item = db.artworks.find(a => String(a.id) === String(req.params.id));
  if (!item) return res.status(404).json({ error: 'Not found' });
  res.json(item);
});

app.post('/api/artworks', (req, res) => {
  const db = readData();
  const payload = req.body || {};
  if (!payload.title) return res.status(400).json({ error: 'title required' });
  const id = payload.id || Date.now();
  const record = {
    id,
    title: payload.title,
    image_url: payload.image_url || '',
    original_photo_url: payload.original_photo_url || '',
    has_hidden_content: !!payload.has_hidden_content,
    hidden_content: payload.hidden_content || null,
    ar_content: payload.ar_content || '', // video url under /public/videos/...
    marker_descriptor_base: payload.marker_descriptor_base || '', // e.g. /public/markers/my-marker
  };
  db.artworks.push(record);
  writeData(db);
  res.status(201).json(record);
});

app.put('/api/artworks/:id', (req, res) => {
  const db = readData();
  const idx = db.artworks.findIndex(a => String(a.id) === String(req.params.id));
  if (idx === -1) return res.status(404).json({ error: 'Not found' });
  db.artworks[idx] = { ...db.artworks[idx], ...req.body, id: db.artworks[idx].id };
  writeData(db);
  res.json(db.artworks[idx]);
});

app.delete('/api/artworks/:id', (req, res) => {
  const db = readData();
  const next = db.artworks.filter(a => String(a.id) !== String(req.params.id));
  if (next.length === db.artworks.length) return res.status(404).json({ error: 'Not found' });
  writeData({ artworks: next });
  res.status(204).end();
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

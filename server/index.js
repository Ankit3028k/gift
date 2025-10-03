const express = require('express');
const cors = require('cors');
const path = require('path');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config({ path: path.join(__dirname, '..', '.env') });

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

// Static hosting for videos and AR marker descriptor files
app.use('/public', express.static(path.join(__dirname, '..', 'public')));

// Mongoose models
const ArtworkSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    image_url: String,
    original_photo_url: String,
    has_hidden_content: { type: Boolean, default: false },
    hidden_content: {
      type: { type: String, enum: ['message', 'video'], default: 'video' },
      message: String,
      video_name: String,
    },
    ar_content: String, // video url under /public/videos/...
    marker_descriptor_base: String, // e.g. /public/markers/my-marker
  },
  { timestamps: true }
);

const Artwork = mongoose.model('Artwork', ArtworkSchema);

app.get('/api/health', async (_, res) => {
  const state = mongoose.connection.readyState; // 0=disconnected,1=connected,2=connecting,3=disconnecting
  res.json({ ok: true, db: state });
});

// CRUD
app.get('/api/artworks', async (req, res) => {
  const list = await Artwork.find().lean();
  res.json(list);
});

app.get('/api/artworks/:id', async (req, res) => {
  const doc = await Artwork.findById(req.params.id).lean();
  if (!doc) return res.status(404).json({ error: 'Not found' });
  res.json(doc);
});

app.post('/api/artworks', async (req, res) => {
  try {
    const payload = req.body || {};
    if (!payload.title) return res.status(400).json({ error: 'title required' });
    const created = await Artwork.create(payload);
    res.status(201).json(created);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

app.put('/api/artworks/:id', async (req, res) => {
  try {
    const updated = await Artwork.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    if (!updated) return res.status(404).json({ error: 'Not found' });
    res.json(updated);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

app.delete('/api/artworks/:id', async (req, res) => {
  const result = await Artwork.findByIdAndDelete(req.params.id);
  if (!result) return res.status(404).json({ error: 'Not found' });
  res.status(204).end();
});
 
async function start() {
  try {
    const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/gift';
    await mongoose.connect(uri, { autoIndex: true });
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (e) {
    console.error('Failed to start server:', e);
    process.exit(1);
  }
}

start();

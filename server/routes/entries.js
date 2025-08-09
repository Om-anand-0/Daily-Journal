const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const JournalEntry = require('../models/JournalEntry');

// POST /api/entries/import
router.post('/import', async (req, res) => {
  try {
    const items = req.body.entries;
    if (!Array.isArray(items)) {
      return res.status(400).json({ error: 'entries must be an array' });
    }
    const inserted = await JournalEntry.insertMany(items);
    res.json({
      insertedCount: inserted.length,
      insertedIds: inserted.map(i => i._id)
    });
  } catch (err) {
    console.error('Import error:', err);
    res.status(500).json({ error: 'Import failed' });
  }
});

// GET /api/entries/export
router.get('/export', async (req, res) => {
  const all = await JournalEntry.find().sort({ date: -1 }).lean();
  res.json(all);
});

// GET /api/entries
router.get('/', async (req, res) => {
  const list = await JournalEntry.find().sort({ date: -1 }).limit(100).lean();
  res.json(list);
});

// GET /api/entries/:id
router.get('/:id', async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).json({ error: 'Invalid ID' });
  }
  const item = await JournalEntry.findById(req.params.id).lean();
  if (!item) return res.status(404).json({ error: 'Not found' });
  res.json(item);
});

// POST /api/entries
router.post('/', async (req, res) => {
  try {
    const entry = new JournalEntry(req.body);
    const saved = await entry.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PUT /api/entries/:id
router.put('/:id', async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).json({ error: 'Invalid ID' });
  }
  try {
    const updated = await JournalEntry.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updated) return res.status(404).json({ error: 'Not found' });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE /api/entries/:id
router.delete('/:id', async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).json({ error: 'Invalid ID' });
  }
  const deleted = await JournalEntry.findByIdAndDelete(req.params.id);
  if (!deleted) return res.status(404).json({ error: 'Not found' });
  res.json({ success: true });
});

module.exports = router;

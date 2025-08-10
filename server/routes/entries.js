const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const JournalEntry = require('../models/JournalEntry');
const auth = require('../middleware/auth');

// POST /api/entries/import
router.post('/import', auth, async (req, res) => {
  try {
    const items = req.body.entries;
    if (!Array.isArray(items)) {
      return res.status(400).json({ error: 'entries must be an array' });
    }
    // Add user ID to all entries
    const entriesWithUser = items.map(item => ({ ...item, user: req.user._id }));
    const inserted = await JournalEntry.insertMany(entriesWithUser);
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
router.get('/export', auth, async (req, res) => {
  const all = await JournalEntry.find({ user: req.user._id }).sort({ date: -1 }).lean();
  res.json(all);
});

// GET /api/entries
router.get('/', auth, async (req, res) => {
  const list = await JournalEntry.find({ user: req.user._id }).sort({ date: -1 }).limit(100).lean();
  res.json(list);
});

// GET /api/entries/:id
router.get('/:id', auth, async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).json({ error: 'Invalid ID' });
  }
  const item = await JournalEntry.findOne({ _id: req.params.id, user: req.user._id }).lean();
  if (!item) return res.status(404).json({ error: 'Not found' });
  res.json(item);
});

// POST /api/entries
router.post('/', auth, async (req, res) => {
  try {
    const entry = new JournalEntry({ ...req.body, user: req.user._id });
    const saved = await entry.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PUT /api/entries/:id
router.put('/:id', auth, async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).json({ error: 'Invalid ID' });
  }
  try {
    const updated = await JournalEntry.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
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
router.delete('/:id', auth, async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).json({ error: 'Invalid ID' });
  }
  const deleted = await JournalEntry.findOneAndDelete({ _id: req.params.id, user: req.user._id });
  if (!deleted) return res.status(404).json({ error: 'Not found' });
  res.json({ success: true });
});

module.exports = router;

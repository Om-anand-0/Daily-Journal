const mongoose = require('mongoose');
const { Schema } = mongoose;

const journalEntrySchema = new Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  date: { type: Date, required: true },
  top3Goals: {
    type: [String],
    required: true,
    validate: {
      validator: arr => Array.isArray(arr) && arr.length === 3,
      message: 'Please provide exactly 3 goals'
    }
  },
  focusAreas: {
    type: [String],
    enum: [
      'MERN / JavaScript',
      'Python / NLP',
      'DSA / Coding Practice',
      'Japanese (JLPT N3)',
      'Gym / Exercise',
      'Journaling / Mindfulness'
    ],
    default: []
  },
  intention: { type: String, default: '' },
  midday: {
    progress: { type: String, default: '' },
    biggestDistraction: { type: String, default: '' }
  },
  evening: {
    wins: { type: String, default: '' },
    improvements: { type: String, default: '' },
    learnings: { type: [String], default: [] },
    gratitude: { type: String, default: '' }
  },
  stuckToPlan: {
    type: String,
    enum: ['Yes, full focus', 'Mostly, small distractions', "No, but I’ll bounce back"],
    default: 'Mostly, small distractions'
  }
}, { timestamps: true });

module.exports = mongoose.model('JournalEntry', journalEntrySchema);

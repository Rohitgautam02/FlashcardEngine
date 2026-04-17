const mongoose = require('mongoose');

const cardSchema = new mongoose.Schema({
  deck: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Deck',
    required: true,
  },
  question: {
    type: String,
    required: true,
  },
  answer: {
    type: String,
    required: true,
  },
  // SM-2 Algorithm Data
  easeFactor: {
    type: Number,
    default: 2.5,
  },
  interval: {
    type: Number,
    default: 0, // Days
  },
  repetitions: {
    type: Number,
    default: 0,
  },
  nextReviewDate: {
    type: Date,
    default: Date.now,
  },
  lastReviewedAt: {
    type: Date,
  },
});

// Index for efficient querying of cards due for review
cardSchema.index({ deck: 1, nextReviewDate: 1 });

module.exports = mongoose.model('Card', cardSchema);

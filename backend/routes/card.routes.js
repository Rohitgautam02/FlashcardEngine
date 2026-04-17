const express = require('express');
const Card = require('../models/Card');
const auth = require('../middleware/auth.middleware');

const router = express.Router();

// Get all cards for a deck
router.get('/deck/:deckId', auth, async (req, res) => {
  try {
    const cards = await Card.find({ deck: req.params.deckId });
    res.send(cards);
  } catch (err) {
    res.status(500).send(err);
  }
});

// Update card with SM-2 rating
router.post('/:id/study', auth, async (req, res) => {
  try {
    const { quality } = req.body; // 0 to 5
    const card = await Card.findById(req.params.id);

    if (!card) return res.status(404).send();

    // SM-2 Algorithm Implementation
    let { easeFactor, interval, repetitions } = card;

    if (quality >= 3) {
      // Success
      if (repetitions === 0) {
        interval = 1;
      } else if (repetitions === 1) {
        interval = 6;
      } else {
        interval = Math.round(interval * easeFactor);
      }
      repetitions++;
    } else {
      // Failure
      repetitions = 0;
      interval = 1;
    }

    // Update Ease Factor
    easeFactor = easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
    easeFactor = Math.max(1.3, easeFactor);

    card.easeFactor = easeFactor;
    card.interval = interval;
    card.repetitions = repetitions;
    card.nextReviewDate = new Date(Date.now() + interval * 24 * 60 * 60 * 1000);
    card.lastReviewedAt = new Date();

    await card.save();
    res.send(card);
  } catch (err) {
    res.status(400).send(err);
  }
});

// Get session of cards due for review in a deck
router.get('/deck/:deckId/due', auth, async (req, res) => {
  try {
    const cards = await Card.find({
      deck: req.params.deckId,
      nextReviewDate: { $lte: new Date() }
    }).sort({ nextReviewDate: 1 });
    
    res.send(cards);
  } catch (err) {
    res.status(500).send(err);
  }
});

// Summary stats for dashboard
router.get('/stats/summary', auth, async (req, res) => {
  try {
    const totalCards = await Card.countDocuments({});
    const dueCount = await Card.countDocuments({ nextReviewDate: { $lte: new Date() } });
    const masteredCount = await Card.countDocuments({ repetitions: { $gt: 5 } }); // Just a metric

    res.send({ totalCards, dueCount, masteredCount });
  } catch (err) {
    res.status(500).send(err);
  }
});

module.exports = router;

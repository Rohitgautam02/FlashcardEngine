const express = require('express');
const multer = require('multer');
const pdfParse = require('pdf-parse');
const OpenAI = require('openai');
const Deck = require('../models/Deck');
const Card = require('../models/Card');
const auth = require('../middleware/auth.middleware');

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

const isGroq = process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY.startsWith('gsk_');

console.log(`[AI Sync] Using ${isGroq ? 'Groq' : 'OpenAI'} provider`);

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: isGroq ? 'https://api.groq.com/openai/v1' : undefined,
});

// Create Deck from PDF
router.post('/upload', auth, upload.single('pdf'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).send({ error: 'Please upload a PDF file.' });
    }

    const dataBuffer = require('fs').readFileSync(req.file.path);
    const pdfData = await pdfParse(dataBuffer);
    const text = pdfData.text.trim();

    // Scanned PDF check: if text is too short or empty
    if (text.length < 100) {
      return res.status(400).send({ 
        error: 'This PDF appears to be scanned or contains very little text. Please upload a text-based PDF.' 
      });
    }

    const { title } = req.body;
    const deck = new Deck({
      title: title || req.file.originalname.replace('.pdf', ''),
      user: req.user._id,
    });

    // OpenAI Prompting - Simplified service layer
    const prompt = `
      You are an expert teacher. Your goal is to transform the provided text into a comprehensive, practice-ready deck of flashcards that ensures deep conceptual mastery.
      
      Requirements:
      1. COMPREHENSIVE COVERAGE: Cover key concepts, relationships, edge cases, and worked examples.
      2. CATEGORIZATION: Every card MUST be assigned exactly one of these categories:
         - "Definition": Core terminology.
         - "Concept": Deep theoretical understanding.
         - "Relationship": How different ideas connect.
         - "Example": Practical, worked-out application.
         - "Edge Case": Tricky, non-obvious specific scenarios.
      3. QUANTITY: Generate 15-20 high-quality cards.
      
      Return ONLY a JSON array of objects with "question", "answer", and "category" keys.
      
      Example:
      [{"question": "How do quadratic equations relate to parabolic curves?", "answer": "The solutions (roots) denote the x-intercepts of the parabola.", "category": "Relationship"}]

      Text:
      ${text.substring(0, 12000)}
    `;

    const response = await openai.chat.completions.create({
      model: isGroq ? "llama-3.3-70b-versatile" : "gpt-4o",
      messages: [
        { 
          role: "system", 
          content: "You are an expert teacher. Return ONLY a valid JSON object matching the requested format. No markdown, no thinking blocks." 
        },
        { role: "user", content: prompt }
      ],
      ...(isGroq ? {} : { response_format: { type: "json_object" } }),
    });

    let responseText = response.choices[0].message.content;
    responseText = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
    
    const content = JSON.parse(responseText);
    const cardsData = content.cards || content.flashcards || (Array.isArray(content) ? content : Object.values(content)[0]); 

    if (!Array.isArray(cardsData)) {
      throw new Error("Invalid response format from AI");
    }

    await deck.save();

    const cards = cardsData.map(c => ({
      deck: deck._id,
      question: c.question,
      answer: c.answer,
      category: c.category || 'Concept',
    }));

    await Card.insertMany(cards);
    
    deck.cardCount = cards.length;
    await deck.save();

    // Cleanup uploaded file
    require('fs').unlinkSync(req.file.path);

    res.status(201).send(deck);
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: 'Generation failed: ' + err.message });
  }
});

// Get all decks for user
router.get('/', auth, async (req, res) => {
  try {
    const decks = await Deck.find({ user: req.user._id }).sort({ createdAt: -1 });
    
    // Enrich decks with "cards due" count
    const enrichedDecks = await Promise.all(decks.map(async (deck) => {
      const dueCount = await Card.countDocuments({
        deck: deck._id,
        nextReviewDate: { $lte: new Date() }
      });
      return { ...deck._doc, dueCount };
    }));

    res.send(enrichedDecks);
  } catch (err) {
    res.status(500).send(err);
  }
});

// Delete deck
router.delete('/:id', auth, async (req, res) => {
  try {
    const deck = await Deck.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!deck) return res.status(404).send();
    await Card.deleteMany({ deck: deck._id });
    res.send(deck);
  } catch (err) {
    res.status(500).send(err);
  }
});

module.exports = router;

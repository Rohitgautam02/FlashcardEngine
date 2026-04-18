# Flashcard Engine AI 🧠

A premium study assistant that transforms complex PDF notes into interactive flashcards using GPT-4o and schedules reviews using the scientific **SM-2 Spaced Repetition** algorithm.

Built for the CUEMATH Build Challenge.

## 🚀 Key Features
- **Smart Logic**: Implements the scientific **SM-2 Algorithm** for review scheduling.
- **AI-Powered**: Supports **OpenAI (GPT-4o)** and **Groq (Llama 3)** for instant deck generation.
- **Premium UX**: Keyboard shortcuts (1, 2, 3, Space), 3D flip cards, and Recharts analytics.
- **User Privacy**: Fully isolated user accounts with name-based personalization.

## 🛠 Tech Stack
- **Frontend**: React (Vite), Tailwind CSS, Framer Motion, Recharts, Lucide React.
- **Backend**: Node.js, Express, MongoDB (Mongoose).
- **AI/Processors**: OpenAI (GPT-4o), PDF-Parse.

---

## 🏁 Getting Started

### 1. Prerequisites
- Node.js (v18+)
- MongoDB Atlas (or local MongoDB)
- OpenAI API Key

### 2. Backend Setup
1. `cd backend`
2. `npm install`
3. Create a `.env` file based on `.env.example`:
   ```env
   PORT=5000
   MONGO_URI=your_mongodb_uri
   JWT_SECRET=your_jwt_secret
   OPENAI_API_KEY=your_openai_api_key
   ```
4. `npm run dev`

### 3. Frontend Setup
1. `cd frontend`
2. `npm install`
3. Create a `.env` file:
   ```env
   VITE_API_URL=http://localhost:5000/api
   ```
4. `npm run dev`

---

## 🧠 Architectural Decisions & Trade-offs
- **GPT-4o vs Choice of Model**: Opted for GPT-4o for its high-reasoning capabilities, ensuring that generated flashcards are conceptually accurate rather than just word-for-word extraction.
- **SM-2 Algorithm**: Selected the SM-2 algorithm over simpler Leitner systems to provide a more granular and efficient review schedule based on individual memory stability.
- **Schema Design**: Cards and Decks are modularly indexed in MongoDB to ensure lightning-fast queries for "Due Today" stats even as the user's library grows.

## ⚠️ Known Limitations
- **Scanned PDFs**: Currently only supports text-based PDFs. Image-based/Scanned PDFs will trigger a validation error.
- **i18n**: Initial build is optimized for English text.

---

Built by [Rohit Gautam](https://github.com/Rohitgautam02)
 | April 2026

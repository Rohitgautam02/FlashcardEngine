import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { ChevronLeft, Loader2, CheckCircle, RotateCcw } from 'lucide-react';
import Flashcard from '../components/Flashcard';

const StudyRoom = () => {
  const { deckId } = useParams();
  const navigate = useNavigate();
  const [cards, setCards] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isFinished, setIsFinished] = useState(false);
  const [feedback, setFeedback] = useState(null);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  useEffect(() => {
    const fetchCards = async () => {
      try {
        // Try fetching due cards first, if none, fetch all
        const dueRes = await axios.get(`${API_URL}/cards/deck/${deckId}/due`);
        if (dueRes.data.length > 0) {
          setCards(dueRes.data.map(c => ({...c, isNew: false})));
        } else {
          const allRes = await axios.get(`${API_URL}/cards/deck/${deckId}`);
          setCards(allRes.data.map(c => ({...c, isNew: true})));
        }
      } catch (err) {
        console.error('Failed to fetch cards', err);
      } finally {
        setLoading(false);
      }
    };
    fetchCards();
  }, [deckId]);

  const handleRate = useCallback(async (quality) => {
    if (!cards[currentIndex]) return;
    const cardId = cards[currentIndex]._id;
    try {
      const res = await axios.post(`${API_URL}/cards/${cardId}/study`, { quality });
      const updatedCard = res.data;
      
      // Show SM-2 Feedback
      setFeedback(`Next review in ${updatedCard.interval} days`);
      setTimeout(() => setFeedback(null), 1500);
      
      if (currentIndex < cards.length - 1) {
        setCurrentIndex(v => v + 1);
      } else {
        setIsFinished(true);
      }
    } catch (err) {
      console.error('Failed to update card', err);
    }
  }, [currentIndex, cards, isFinished]);

  // Keyboard Shortcuts
  useEffect(() => {
    const handleKey = (e) => {
      if (isFinished) return;
      
      if (e.key === '1') handleRate(1);
      if (e.key === '2') handleRate(3);
      if (e.key === '3') handleRate(5);
      if (e.key === ' ' || e.key === 'Enter') {
        const cardElement = document.getElementById('active-flashcard');
        if (cardElement) cardElement.click();
      }
    };
    
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [handleRate, isFinished]);

  // Delight: Confetti effect on finish
  useEffect(() => {
    if (isFinished) {
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/canvas-confetti@1.6.0/dist/confetti.browser.min.js';
      script.onload = () => {
        window.confetti({
          particleCount: 150,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#66FCF1', '#45A29E', '#FFFFFF']
        });
      };
      document.body.appendChild(script);
    }
  }, [isFinished]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <Loader2 className="animate-spin text-primary" size={48} />
    </div>
  );

  if (cards.length === 0) return (
    <div className="min-h-screen pt-24 px-6 flex flex-col items-center justify-center text-center">
      <h2 className="text-3xl font-bold mb-4">No cards found</h2>
      <Link to="/dashboard" className="text-primary hover:underline">Return to Dashboard</Link>
    </div>
  );


  if (isFinished) return (
    <div className="min-h-screen pt-24 px-6 flex flex-col items-center justify-center text-center">
      <div className="bg-primary/20 p-6 rounded-full text-primary mb-8 animate-bounce">
        <CheckCircle size={64} />
      </div>
      <h2 className="text-4xl font-extrabold mb-4 animate-in zoom-in duration-500">Session Complete!</h2>
      <p className="text-xl text-textMain/60 mb-10 max-w-md">Excellent work! You've reviewed all cards scheduled for today.</p>
      <div className="flex gap-4">
        <button 
          onClick={() => window.location.reload()}
          className="flex items-center gap-2 bg-white/10 hover:bg-white/20 px-8 py-4 rounded-2xl font-bold transition-all"
        >
          <RotateCcw size={20} />
          Restart Session
        </button>
        <Link 
          to="/dashboard"
          className="bg-primary text-background px-8 py-4 rounded-2xl font-bold hover:shadow-[0_0_20px_rgba(102,252,241,0.3)] transition-all"
        >
          Back to Dashboard
        </Link>
      </div>
    </div>
  );

  const progress = ((currentIndex) / cards.length) * 100;

  return (
    <div className="min-h-screen pt-24 pb-12 px-6 max-w-4xl mx-auto flex flex-col">
      <div className="flex items-center justify-between mb-12">
        <Link to="/dashboard" className="flex items-center gap-2 text-textMain/60 hover:text-white transition-colors group">
          <ChevronLeft className="group-hover:-translate-x-1 transition-transform" />
          <span>Exit Study Room</span>
        </Link>
        <div className="text-sm font-bold bg-white/5 px-4 py-2 rounded-full border border-white/10">
          Card {currentIndex + 1} of {cards.length}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full h-2 bg-white/5 rounded-full mb-12 overflow-hidden">
        <div 
          className="h-full bg-primary transition-all duration-500 ease-out" 
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="flex-1 flex flex-col items-center justify-center gap-12 relative">
        {/* Magic Feedback Toast */}
        {feedback && (
          <div className="absolute top-0 bg-primary/20 text-primary border border-primary/30 px-6 py-2 rounded-full font-bold text-sm animate-in fade-in slide-in-from-bottom-4 duration-300 z-50 backdrop-blur-md">
            ✨ {feedback}
          </div>
        )}

        <Flashcard 
          key={cards[currentIndex]._id}
          question={cards[currentIndex].question}
          answer={cards[currentIndex].answer}
          category={cards[currentIndex].category}
          repetitions={cards[currentIndex].repetitions}
        />

        <div className="grid grid-cols-3 gap-4 w-full max-w-2xl">
          <button 
            onClick={() => handleRate(1)}
            className="flex flex-col items-center gap-2 p-6 glass rounded-2xl hover:border-red-500/50 hover:bg-red-500/5 group transition-all"
          >
            <span className="text-3xl grayscale group-hover:grayscale-0 transition-all">😓</span>
            <span className="font-bold text-red-400">Hard</span>
          </button>
          <button 
            onClick={() => handleRate(3)}
            className="flex flex-col items-center gap-2 p-6 glass rounded-2xl hover:border-yellow-500/50 hover:bg-yellow-500/5 group transition-all"
          >
            <span className="text-3xl grayscale group-hover:grayscale-0 transition-all">😐</span>
            <span className="font-bold text-yellow-400">Medium</span>
          </button>
          <button 
            onClick={() => handleRate(5)}
            className="flex flex-col items-center gap-2 p-6 glass rounded-2xl hover:border-primary/50 hover:bg-primary/5 group transition-all"
          >
            <span className="text-3xl grayscale group-hover:grayscale-0 transition-all">😊</span>
            <span className="font-bold text-primary">Easy</span>
          </button>
        </div>
        
        <p className="text-center text-textMain/30 text-xs font-medium mt-6">
          Keyboard: <kbd className="bg-white/10 px-2 py-0.5 rounded">1</kbd> Hard &nbsp;
          <kbd className="bg-white/10 px-2 py-0.5 rounded">2</kbd> Medium &nbsp;
          <kbd className="bg-white/10 px-2 py-0.5 rounded">3</kbd> Easy &nbsp;
          <kbd className="bg-white/10 px-2 py-0.5 rounded">Space</kbd> Flip
        </p>
      </div>
    </div>
  );
};

export default StudyRoom;

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Plus, BookOpen, Clock, Trash2, Loader2, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import UploadModal from '../components/UploadModal';

const Dashboard = () => {
  const [decks, setDecks] = useState([]);
  const [stats, setStats] = useState({ totalCards: 0, dueCount: 0, masteredCount: 0 });
  const [loading, setLoading] = useState(true);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const { user } = useAuth();

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  const fetchData = async () => {
    try {
      const [decksRes, statsRes] = await Promise.all([
        axios.get(`${API_URL}/decks`),
        axios.get(`${API_URL}/cards/stats/summary`)
      ]);
      setDecks(decksRes.data);
      setStats(statsRes.data);
    } catch (err) {
      console.error('Failed to fetch dashboard data', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const deleteDeck = async (id) => {
    if (!window.confirm('Delete this deck and all its cards?')) return;
    try {
      await axios.delete(`${API_URL}/decks/${id}`);
      setDecks(decks.filter(d => d._id !== id));
      fetchData();
    } catch (err) {
      alert('Failed to delete deck');
    }
  };

  if (loading) return (
    <div className="min-h-screen pt-24 flex items-center justify-center">
      <Loader2 className="animate-spin text-primary" size={48} />
    </div>
  );

  return (
    <div className="pt-24 pb-12 px-6 max-w-7xl mx-auto">
      {/* Header & Stats */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div>
          <h1 className="text-4xl font-extrabold mb-2">My Decks</h1>
          <p className="text-textMain/70">Welcome back! Here's your study overview.</p>
        </div>
        <button 
          onClick={() => setIsUploadOpen(true)}
          className="flex items-center gap-2 bg-primary text-background px-6 py-3 rounded-2xl font-bold hover:scale-105 transition-transform"
        >
          <Plus size={20} />
          Create New Deck
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="glass-card flex items-center gap-4">
          <div className="bg-primary/20 p-3 rounded-xl text-primary">
            <Clock size={24} />
          </div>
          <div>
            <div className="text-3xl font-bold text-white">{stats.dueCount}</div>
            <div className="text-sm text-textMain/60 font-medium">Cards Due Today</div>
          </div>
        </div>
        <div className="glass-card flex items-center gap-4 border-primary/20 bg-primary/5">
          <div className="bg-primary p-3 rounded-xl text-background">
            <AlertCircle size={24} />
          </div>
          <div>
            <div className="text-3xl font-bold text-white">{stats.dueCount > 0 ? 'Urgent' : 'All Clear'}</div>
            <div className="text-sm text-textMain/60 font-medium">Study Status</div>
          </div>
        </div>
        <div className="glass-card flex items-center gap-4">
          <div className="bg-white/10 p-3 rounded-xl text-white">
            <BookOpen size={24} />
          </div>
          <div>
            <div className="text-3xl font-bold text-white">{stats.totalCards}</div>
            <div className="text-sm text-textMain/60 font-medium">Total Flashcards</div>
          </div>
        </div>
      </div>

      {/* Deck Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {decks.map((deck) => (
          <div key={deck._id} className="glass-card relative group flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-bold line-clamp-2 pr-8">{deck.title}</h3>
                <button 
                  onClick={() => deleteDeck(deck._id)}
                  className="absolute top-6 right-6 p-2 text-white/20 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all"
                >
                  <Trash2 size={18} />
                </button>
              </div>
              <div className="flex gap-4 text-sm text-textMain/60 mb-6 font-medium">
                <span className="flex items-center gap-1"><BookOpen size={14}/> {deck.cardCount} cards</span>
                <span className={`flex items-center gap-1 ${deck.dueCount > 0 ? 'text-primary' : ''}`}>
                  <Clock size={14}/> {deck.dueCount} due
                </span>
              </div>
            </div>
            
            <Link 
              to={`/study/${deck._id}`}
              className={`w-full py-3 rounded-xl font-bold text-center transition-all ${
                deck.dueCount > 0 
                  ? 'bg-primary text-background hover:shadow-[0_0_20px_rgba(102,252,241,0.3)]' 
                  : 'bg-white/10 text-white hover:bg-white/20'
              }`}
            >
              {deck.dueCount > 0 ? 'Study Now' : 'Review Deck'}
            </Link>
          </div>
        ))}

        {decks.length === 0 && (
          <div className="col-span-full py-20 text-center glass rounded-3xl border-dashed border-2 border-white/10">
            <BookOpen className="mx-auto text-white/20 mb-4" size={48} />
            <h3 className="text-xl font-bold mb-2">No decks yet</h3>
            <p className="text-textMain/60 mb-6">Upload a PDF to generate your first study deck.</p>
            <button 
              onClick={() => setIsUploadOpen(true)}
              className="bg-primary/20 text-primary px-6 py-2 rounded-xl font-bold hover:bg-primary/30 transition-colors"
            >
              Upload PDF
            </button>
          </div>
        )}
      </div>

      {isUploadOpen && (
        <UploadModal 
          onClose={() => setIsUploadOpen(false)} 
          onSuccess={() => {
            setIsUploadOpen(false);
            fetchData();
          }} 
        />
      )}
    </div>
  );
};

export default Dashboard;

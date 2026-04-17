import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Plus, BookOpen, Clock, Trash2, Loader2, AlertCircle, Award } from 'lucide-react';
import { Link } from 'react-router-dom';
import UploadModal from '../components/UploadModal';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const Dashboard = () => {
  const [decks, setDecks] = useState([]);
  const [stats, setStats] = useState({ totalCards: 0, dueCount: 0, masteredCount: 0 });
  const [loading, setLoading] = useState(true);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const { user } = useAuth();

  const chartData = decks.map(d => ({
    name: d.title.substring(0, 10) + '...',
    cards: d.cardCount,
    due: d.dueCount
  }));

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
          <h1 className="text-4xl font-extrabold mb-2 font-outfit">Welcome back, <span className="text-primary">{user.name}</span></h1>
          <p className="text-textMain/70 font-medium">Ready for another productive study session?</p>
        </div>
        <button 
          onClick={() => setIsUploadOpen(true)}
          className="flex items-center gap-2 bg-primary text-background px-6 py-3 rounded-2xl font-bold hover:scale-105 transition-transform shadow-[0_0_20px_rgba(102,252,241,0.2)]"
        >
          <Plus size={20} />
          Create New Deck
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
        <div className="glass-card flex items-center gap-4 border-primary/20 bg-primary/5">
          <div className="bg-primary p-3 rounded-xl text-background shrink-0">
            <Clock size={24} />
          </div>
          <div>
            <div className="text-3xl font-bold text-white leading-tight">{stats.dueCount}</div>
            <div className="text-xs text-textMain/60 font-bold uppercase tracking-wider">Due Today</div>
          </div>
        </div>
        <div className="glass-card flex items-center gap-4">
          <div className="bg-white/10 p-3 rounded-xl text-white shrink-0">
            <BookOpen size={24} />
          </div>
          <div>
            <div className="text-3xl font-bold text-white leading-tight">{stats.totalCards}</div>
            <div className="text-xs text-textMain/60 font-bold uppercase tracking-wider">Total Cards</div>
          </div>
        </div>
        <div className="glass-card flex items-center gap-4">
          <div className="bg-secondary/20 p-3 rounded-xl text-secondary shrink-0">
            <Award size={24} />
          </div>
          <div>
            <div className="text-3xl font-bold text-white leading-tight">{stats.masteredCount}</div>
            <div className="text-xs text-textMain/60 font-bold uppercase tracking-wider">Mastered</div>
          </div>
        </div>
        <div className="glass-card flex items-center gap-4">
          <div className="bg-white/10 p-3 rounded-xl text-white shrink-0">
            <Award size={24} className="opacity-40" />
          </div>
          <div>
            <div className="text-3xl font-bold text-white leading-tight">{decks.length}</div>
            <div className="text-xs text-textMain/60 font-bold uppercase tracking-wider">Active Decks</div>
          </div>
        </div>
      </div>

      {/* Progress Chart */}
      {decks.length > 0 && (
        <div className="glass-card mb-12 h-[350px]">
          <h3 className="text-xl font-bold mb-6 font-outfit">Study Progress Overview</h3>
          <ResponsiveContainer width="100%" height="80%">
            <BarChart data={chartData}>
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#C5C6C7', fontSize: 12}} />
              <YAxis hide />
              <Tooltip 
                cursor={{fill: 'rgba(255,255,255,0.05)'}} 
                contentStyle={{backgroundColor: '#1F2833', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px'}}
              />
              <Bar dataKey="cards" radius={[6, 6, 0, 0]} barSize={40}>
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.due > 0 ? '#66FCF1' : '#45A29E'} fillOpacity={0.8} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

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

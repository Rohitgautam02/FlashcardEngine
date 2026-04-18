import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Plus, BookOpen, Clock, Trash2, Loader2, AlertCircle, Award, Search, Filter } from 'lucide-react';
import { Link } from 'react-router-dom';
import UploadModal from '../components/UploadModal';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, LineChart, Line, AreaChart, Area } from 'recharts';

const Dashboard = () => {
  const [decks, setDecks] = useState([]);
  const [stats, setStats] = useState({ totalCards: 0, dueCount: 0, masteredCount: 0, forecast: [] });
  const [loading, setLoading] = useState(true);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all'); // all, due
  const { user } = useAuth();

  const filteredDecks = decks.filter(d => {
    const matchesSearch = d.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterType === 'all' || (filterType === 'due' && d.dueCount > 0);
    return matchesSearch && matchesFilter;
  });

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
      {/* Header & Main Stats */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div>
          <h1 className="text-4xl font-extrabold mb-2 font-outfit">Welcome back, <span className="text-primary">{user.name}</span></h1>
          <p className="text-textMain/70 font-medium">Your learning journey continues here.</p>
        </div>
        <button 
          onClick={() => setIsUploadOpen(true)}
          className="flex items-center gap-2 bg-primary text-background px-8 py-3 rounded-2xl font-bold hover:scale-105 transition-transform shadow-[0_0_30px_rgba(102,252,241,0.3)]"
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
          <div className="bg-secondary/10 p-3 rounded-xl text-secondary shrink-0 border border-secondary/20">
            <Award size={24} />
          </div>
          <div>
            <div className="text-3xl font-bold text-white leading-tight">{stats.masteredCount}</div>
            <div className="text-xs text-textMain/60 font-bold uppercase tracking-wider">Mastered</div>
          </div>
        </div>
        <div className="glass-card flex items-center gap-4 opacity-70">
          <div className="bg-white/10 p-3 rounded-xl text-white shrink-0">
            <Filter size={24} />
          </div>
          <div>
            <div className="text-3xl font-bold text-white leading-tight">{decks.length}</div>
            <div className="text-xs text-textMain/60 font-bold uppercase tracking-wider">Total Decks</div>
          </div>
        </div>
      </div>

      {/* Analytics Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
        {/* Progress Chart */}
        <div className="glass-card h-[350px]">
          <h3 className="text-xl font-bold mb-6 font-outfit">Deck Distribution</h3>
          <ResponsiveContainer width="100%" height="80%">
            <BarChart data={chartData}>
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#C5C6C7', fontSize: 11}} />
              <YAxis hide />
              <Tooltip 
                cursor={{fill: 'rgba(255,255,255,0.05)'}} 
                contentStyle={{backgroundColor: '#1F2833', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px'}}
              />
              <Bar dataKey="cards" radius={[6, 6, 0, 0]} barSize={30}>
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.due > 0 ? '#66FCF1' : '#45A29E'} fillOpacity={0.8} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Forecast Chart */}
        <div className="glass-card h-[350px] border-primary/10">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold font-outfit">7-Day Review Forecast</h3>
            <div className="text-xs text-primary font-bold bg-primary/10 px-3 py-1 rounded-full border border-primary/20">Planning Ahead</div>
          </div>
          <ResponsiveContainer width="100%" height="80%">
            <AreaChart data={stats.forecast}>
              <defs>
                <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#66FCF1" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#66FCF1" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fill: '#C5C6C7', fontSize: 12}} />
              <Tooltip 
                contentStyle={{backgroundColor: '#1F2833', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px'}}
                itemStyle={{color: '#66FCF1'}}
              />
              <Area type="monotone" dataKey="count" stroke="#66FCF1" strokeWidth={3} fillOpacity={1} fill="url(#colorCount)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Deck Management Controls */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" size={18} />
          <input 
            type="text" 
            placeholder="Search decks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 py-4 focus:border-primary/50 focus:bg-white/10 outline-none transition-all font-medium"
          />
        </div>
        <div className="flex bg-white/5 p-1 rounded-2xl border border-white/10">
          <button 
            onClick={() => setFilterType('all')}
            className={`px-6 py-3 rounded-xl text-sm font-bold transition-all ${filterType === 'all' ? 'bg-white/10 text-primary' : 'text-textMain/50 hover:text-white'}`}
          >
            All Decks
          </button>
          <button 
            onClick={() => setFilterType('due')}
            className={`px-6 py-3 rounded-xl text-sm font-bold transition-all ${filterType === 'due' ? 'bg-white/10 text-primary' : 'text-textMain/50 hover:text-white'}`}
          >
            Due Only
          </button>
        </div>
      </div>

      {/* Deck Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDecks.map((deck) => (
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

              {/* Mastery Progress Bar */}
              <div className="mb-6">
                <div className="flex justify-between text-[10px] font-bold uppercase tracking-wider mb-2 text-textMain/40">
                  <span>Mastery Progress</span>
                  <span>{Math.round(((deck.cardCount - deck.dueCount) / deck.cardCount) * 100)}%</span>
                </div>
                <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-secondary to-primary transition-all duration-1000" 
                    style={{ width: `${((deck.cardCount - deck.dueCount) / deck.cardCount) * 100}%` }}
                  />
                </div>
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

        {filteredDecks.length === 0 && (
          <div className="col-span-full py-20 text-center glass rounded-3xl border-dashed border-2 border-white/10">
            <BookOpen className="mx-auto text-white/20 mb-4" size={48} />
            <h3 className="text-xl font-bold mb-2">
              {searchQuery ? 'No matching decks found' : 'No decks yet'}
            </h3>
            <p className="text-textMain/60 mb-6">
              {searchQuery ? 'Try a different search term.' : 'Upload a PDF to generate your first study deck.'}
            </p>
            {!searchQuery && (
              <button 
                onClick={() => setIsUploadOpen(true)}
                className="bg-primary/20 text-primary px-6 py-2 rounded-xl font-bold hover:bg-primary/30 transition-colors"
              >
                Upload PDF
              </button>
            )}
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

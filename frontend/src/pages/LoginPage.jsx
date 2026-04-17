import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Brain, Mail, Lock, Loader2, AlertCircle } from 'lucide-react';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-12 px-6 flex items-center justify-center bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-background to-background">
      <div className="w-full max-w-md">
        <div className="text-center mb-10 animate-in slide-in-from-bottom-4 duration-700">
          <div className="inline-flex bg-primary p-3 rounded-2xl mb-4 text-background shadow-[0_0_20px_rgba(102,252,241,0.3)]">
            <Brain size={32} />
          </div>
          <h1 className="text-3xl font-extrabold mb-2">Welcome Back</h1>
          <p className="text-textMain/60">Log in to continue your learning journey.</p>
        </div>

        <div className="glass-card p-8 animate-in slide-in-from-bottom-8 duration-1000">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold mb-2 opacity-70">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" size={18} />
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="name@example.com"
                  className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-3 focus:border-primary/50 outline-none transition-all font-medium"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2 opacity-70">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" size={18} />
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-3 focus:border-primary/50 outline-none transition-all font-medium"
                />
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-3 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                <AlertCircle size={18} />
                <span>{error}</span>
              </div>
            )}

            <button 
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-background py-4 rounded-xl font-bold text-lg hover:shadow-[0_0_30px_rgba(102,252,241,0.4)] disabled:opacity-50 transition-all flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 className="animate-spin" size={24} /> : 'Enter Study Room'}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-white/10 text-center text-sm">
            <span className="text-textMain/60">Don't have an account?</span>{' '}
            <Link to="/register" className="text-primary font-bold hover:underline">Get Started</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;

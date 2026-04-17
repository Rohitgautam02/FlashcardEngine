import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Brain, LogOut, User as UserIcon } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between glass px-6 py-3 rounded-2xl">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="bg-primary p-2 rounded-xl group-hover:rotate-12 transition-transform duration-300">
            <Brain className="text-background" size={24} />
          </div>
          <span className="text-xl font-bold font-outfit tracking-tight">Flashcard<span className="text-primary">Engine</span></span>
        </Link>

        <div className="flex items-center gap-6">
          {user ? (
            <>
              <Link to="/dashboard" className="text-sm font-medium hover:text-primary transition-colors">Dashboard</Link>
              <div className="flex items-center gap-3 pl-4 border-l border-white/10">
                <div className="flex items-center gap-2 text-sm text-white/70">
                  <UserIcon size={16} />
                  <span>{user.name}</span>
                </div>
                <button 
                  onClick={() => { logout(); navigate('/'); }}
                  className="p-2 text-white/50 hover:text-red-400 transition-colors"
                  title="Logout"
                >
                  <LogOut size={20} />
                </button>
              </div>
            </>
          ) : (
            <>
              <Link to="/login" className="text-sm font-medium hover:text-primary transition-colors">Login</Link>
              <Link 
                to="/register" 
                className="bg-primary text-background px-5 py-2 rounded-xl text-sm font-bold hover:opacity-90 transition-opacity"
              >
                Get Started
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

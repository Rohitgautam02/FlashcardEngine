import React from 'react';
import { Link } from 'react-router-dom';
import { Brain, Sparkles, Zap, Shield, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

const LandingPage = () => {
  return (
    <div className="bg-background overflow-hidden">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6">
        {/* Background Gradients */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-primary/10 blur-[120px] rounded-full -z-10" />
        
        <div className="max-w-7xl mx-auto text-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-2 rounded-full text-primary text-sm font-bold mb-8"
          >
            <Sparkles size={16} />
            <span>AI-Powered Learning has arrived</span>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-5xl md:text-7xl font-extrabold font-outfit leading-tight mb-8"
          >
            Master Anything with <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">AI-Generated Flashcards</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl text-textMain/70 max-w-2xl mx-auto mb-12 font-medium"
          >
            Upload your lecture notes, PDFs, or textbook chapters. Our engine creates smart flashcards and schedules your reviews using the SM-2 algorithm.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link 
              to="/register" 
              className="group bg-primary text-background px-8 py-4 rounded-2xl font-bold text-lg hover:shadow-[0_0_30px_rgba(102,252,241,0.4)] transition-all flex items-center gap-2"
            >
              Start Building Decks
              <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link 
              to="/login" 
              className="px-8 py-4 rounded-2xl font-bold text-lg border border-white/10 hover:bg-white/5 transition-all"
            >
              View Demo
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 px-6 border-t border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="glass-card p-10">
              <div className="bg-primary/20 w-14 h-14 rounded-2xl flex items-center justify-center text-primary mb-6">
                <Zap size={28} />
              </div>
              <h3 className="text-2xl font-bold mb-4">Instant Generation</h3>
              <p className="text-textMain/60 leading-relaxed">Our GPT-4o powered engine parses complex PDFs in seconds, extracting key concepts and creating high-retention questions.</p>
            </div>
            
            <div className="glass-card p-10">
              <div className="bg-secondary/20 w-14 h-14 rounded-2xl flex items-center justify-center text-secondary mb-6">
                <Brain size={28} />
              </div>
              <h3 className="text-2xl font-bold mb-4">SM-2 Scheduling</h3>
              <p className="text-textMain/60 leading-relaxed">Don't over-study what you know. Our spaced repetition algorithm schedules reviews exactly when your memory starts to fade.</p>
            </div>
            
            <div className="glass-card p-10">
              <div className="bg-white/10 w-14 h-14 rounded-2xl flex items-center justify-center text-white mb-6">
                <Shield size={28} />
              </div>
              <h3 className="text-2xl font-bold mb-4">Progress Tracking</h3>
              <p className="text-textMain/60 leading-relaxed">Visualize your mastery with advanced stats and streaks. See exactly how many cards are due today at a glance.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-24 px-6">
        <div className="max-w-5xl mx-auto glass p-12 md:p-20 rounded-[40px] text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 blur-[80px] rounded-full -z-10" />
          <h2 className="text-4xl md:text-5xl font-extrabold mb-6 leading-tight">Ready to transform your <br/> study routine?</h2>
          <p className="text-textMain/60 text-lg mb-10 max-w-xl mx-auto">Join students worldwide using AI to memorize faster and retain longer. Your first deck is just a PDF upload away.</p>
          <Link 
            to="/register" 
            className="inline-block bg-primary text-background px-10 py-5 rounded-2xl font-extrabold text-xl hover:shadow-[0_0_40px_rgba(102,252,241,0.5)] transition-all"
          >
            Create Your Free Account
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-white/5 text-center text-textMain/40 text-sm">
        <p>© 2026 Flashcard Engine AI. Built for the CUEMATH Build Challenge.</p>
      </footer>
    </div>
  );
};

export default LandingPage;

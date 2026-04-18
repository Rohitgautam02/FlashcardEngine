import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Star, Info, Zap, Link as LinkIcon, Compass, AlertTriangle } from 'lucide-react';

const Flashcard = ({ question, answer, category = 'Concept', repetitions = 0 }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  const getCategoryStyles = () => {
    switch (category) {
      case 'Definition': return { color: '#66FCF1', bg: 'bg-[#66FCF1]/10', icon: <Zap size={14} />, glow: 'shadow-[0_0_50px_rgba(102,252,241,0.15)]' };
      case 'Concept': return { color: '#45A29E', bg: 'bg-[#45A29E]/10', icon: <Compass size={14} />, glow: 'shadow-[0_0_50px_rgba(69,162,158,0.15)]' };
      case 'Example': return { color: '#C5C6C7', bg: 'bg-[#C5C6C7]/10', icon: <Info size={14} />, glow: 'shadow-[0_0_50px_rgba(197,198,199,0.15)]' };
      case 'Relationship': return { color: '#66FCF1', bg: 'bg-[#66FCF1]/10', icon: <LinkIcon size={14} />, glow: 'shadow-[0_0_50px_rgba(102,252,241,0.15)]' };
      case 'Edge Case': return { color: '#F87171', bg: 'bg-red-500/10', icon: <AlertTriangle size={14} />, glow: 'shadow-[0_0_50px_rgba(248,113,113,0.15)]' };
      default: return { color: '#66FCF1', bg: 'bg-primary/10', icon: <Zap size={14} />, glow: '' };
    }
  };

  const style = getCategoryStyles();
  const masteryStars = Math.min(5, Math.floor(repetitions / 2));

  return (
    <div 
      id="active-flashcard"
      className="w-full max-w-2xl h-[450px] perspective-1000 cursor-pointer group"
      onClick={() => setIsFlipped(!isFlipped)}
    >
      <motion.div
        className={`w-full h-full relative preserve-3d transition-all duration-700 rounded-[2rem] ${style.glow}`}
        initial={false}
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
      >
        {/* Front */}
        <div className="absolute inset-0 w-full h-full backface-hidden glass-card flex flex-col items-center justify-center p-12 bg-[#0B0C10]/80 rounded-[2rem] border border-white/10 group-hover:border-primary/30 transition-colors overflow-hidden">
          {/* Category Badge */}
          <div className={`absolute top-8 px-4 py-1.5 rounded-full flex items-center gap-2 border border-current ${style.bg} ${style.color}`} style={{ color: style.color }}>
            {style.icon}
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">{category}</span>
          </div>

          <h3 className="text-3xl md:text-4xl font-extrabold text-center leading-tight font-outfit mt-4">
            {question}
          </h3>

          <div className="absolute bottom-8 flex flex-col items-center gap-4">
            <div className="flex gap-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={14} className={i < masteryStars ? "text-primary fill-primary" : "text-white/10"} />
              ))}
            </div>
            <p className="text-[10px] text-textMain/20 font-bold uppercase tracking-widest animate-pulse">Click to reveal answer</p>
          </div>

          {/* Background Mesh */}
          <div className="absolute -z-10 w-full h-full opacity-10 bg-[radial-gradient(circle_at_50%_50%,rgba(102,252,241,0.2),transparent_70%)]" />
        </div>

        {/* Back */}
        <div 
          className="absolute inset-0 w-full h-full backface-hidden glass-card flex flex-col items-center justify-center p-12 bg-primary/5 rotate-y-180 border-primary/20 rounded-[2rem] overflow-hidden"
        >
          <div className="absolute top-8 flex items-center gap-2 text-primary/40">
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">Verified Answer</span>
          </div>

          <div className="text-xl md:text-2xl font-semibold text-center leading-relaxed text-white max-h-[250px] overflow-y-auto whitespace-pre-wrap px-4 scrollbar-hide">
            {answer}
          </div>

          <div className="absolute bottom-8 flex flex-col items-center gap-4">
            <p className="text-[10px] text-textMain/20 font-bold uppercase tracking-widest">Rate difficulty below to progress</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Flashcard;

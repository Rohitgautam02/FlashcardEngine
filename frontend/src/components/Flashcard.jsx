import React, { useState } from 'react';
import { motion } from 'framer-motion';

const Flashcard = ({ question, answer }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div 
      id="active-flashcard"
      className="w-full max-w-2xl h-[400px] perspective-1000 cursor-pointer"
      onClick={() => setIsFlipped(!isFlipped)}
    >
      <motion.div
        className="w-full h-full relative preserve-3d transition-all duration-700"
        initial={false}
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
      >
        {/* Front */}
        <div className="absolute inset-0 w-full h-full backface-hidden glass-card flex flex-col items-center justify-center p-12 bg-white/[0.03]">
          <span className="text-secondary font-bold tracking-widest text-xs uppercase mb-8">Question</span>
          <h3 className="text-3xl md:text-4xl font-bold text-center leading-tight">
            {question}
          </h3>
          <p className="mt-12 text-sm text-textMain/30 font-medium">Click card to reveal answer</p>
        </div>

        {/* Back */}
        <div 
          className="absolute inset-0 w-full h-full backface-hidden glass-card flex flex-col items-center justify-center p-12 bg-primary/5 rotate-y-180 border-primary/20"
        >
          <span className="text-primary font-bold tracking-widest text-xs uppercase mb-8">Answer</span>
          <div className="text-xl md:text-2xl font-medium text-center leading-relaxed text-white">
            {answer}
          </div>
          <p className="mt-12 text-sm text-textMain/30 font-medium">Click card to see question</p>
        </div>
      </motion.div>
    </div>
  );
};

export default Flashcard;

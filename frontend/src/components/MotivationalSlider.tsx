
"use client";

import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Quote } from 'lucide-react';

const motivationalQuotes = [
  "Believe you can and you're halfway there. - Theodore Roosevelt",
  "The only way to do great work is to love what you do. - Steve Jobs",
  "Success is not final, failure is not fatal: It is the courage to continue that counts. - Winston Churchill",
  "Your limitation—it's only your imagination.",
  "Push yourself, because no one else is going to do it for you.",
  "Great things never come from comfort zones.",
  "Dream it. Wish it. Do it.",
  "Success doesn’t just find you. You have to go out and get it.",
  "The harder you work for something, the greater you’ll feel when you achieve it.",
  "Focus on your goal. Don’t look in any direction but ahead.",
  "Continuous improvement is better than delayed perfection. - Mark Twain",
  "Feedback is the breakfast of champions. - Ken Blanchard",
  "Strive for progress, not perfection."
];

export const MotivationalSlider: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % motivationalQuotes.length);
    }, 7000); // Change quote every 7 seconds

    return () => clearInterval(interval); // Cleanup interval on component unmount
  }, []);

  return (
    <div className="h-10 bg-secondary text-secondary-foreground flex items-center justify-center overflow-hidden relative shadow-inner">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.5 }}
          className="flex items-center text-sm italic px-4"
        >
           <Quote className="w-4 h-4 mr-2 flex-shrink-0 opacity-70 transform scale-x-[-1]" /> {/* Mirrored opening quote */}
            <span className="truncate">{motivationalQuotes[currentIndex]}</span>
           <Quote className="w-4 h-4 ml-2 flex-shrink-0 opacity-70" /> {/* Closing quote */}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

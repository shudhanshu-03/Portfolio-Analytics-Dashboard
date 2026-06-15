import React from 'react';
import { motion } from 'framer-motion';
import { LayoutDashboard, Command } from 'lucide-react';

interface EmptyStateProps {
  onAddWidget: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ onAddWidget }) => {
  return (
    <div className="w-full h-full min-h-[400px] flex flex-col items-center justify-center p-8 text-center">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, type: 'spring' }}
        className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mb-6 text-primary"
      >
        <LayoutDashboard size={40} />
      </motion.div>
      
      <motion.h2 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="text-2xl font-bold mb-2 tracking-tight"
      >
        Your Dashboard is Empty
      </motion.h2>
      
      <motion.p 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="text-muted-foreground max-w-md mb-8 leading-relaxed"
      >
        Get started by adding widgets to monitor your portfolio, track live market data, and analyse your risk profile.
      </motion.p>
      
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="flex flex-col sm:flex-row gap-4 items-center"
      >
        <button
          onClick={onAddWidget}
          className="bg-primary text-primary-foreground hover:bg-primary/90 px-6 py-2.5 rounded-md font-medium transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
        >
          Open Widget Library
        </button>
        
        <div className="flex items-center text-sm text-muted-foreground border border-border/50 bg-secondary/50 px-4 py-2 rounded-md">
          <Command size={14} className="mr-2" />
          <span>Press <kbd className="font-sans font-semibold bg-background border border-border px-1 rounded shadow-sm mx-1 text-xs">Ctrl</kbd> + <kbd className="font-sans font-semibold bg-background border border-border px-1 rounded shadow-sm text-xs">K</kbd> to open Command Palette</span>
        </div>
      </motion.div>
    </div>
  );
};

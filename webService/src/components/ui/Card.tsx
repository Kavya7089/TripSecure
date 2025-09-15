import React from 'react';
import { motion } from 'framer-motion';
import { clsx } from 'clsx';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  padding?: boolean;
  hover?: boolean;
}

export const Card: React.FC<CardProps> = ({ 
  children, 
  className, 
  padding = true, 
  hover = false 
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={hover ? { scale: 1.02, boxShadow: '0 10px 25px rgba(0,0,0,0.1)' } : {}}
      className={clsx(
        'bg-white rounded-xl shadow-sm border border-gray-100',
        padding && 'p-6',
        hover && 'cursor-pointer transition-all duration-200',
        className
      )}
    >
      {children}
    </motion.div>
  );
};
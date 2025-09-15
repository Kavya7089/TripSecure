import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface PageTransitionProps {
  children: React.ReactNode;
  className?: string;
}

export const PageTransition: React.FC<PageTransitionProps> = ({ children, className = '' }) => {
  return (
    <motion.div
      initial={{ 
        opacity: 0,
        scale: 0.8,
        rotateY: -15,
        transformOrigin: 'left center'
      }}
      animate={{ 
        opacity: 1,
        scale: 1,
        rotateY: 0,
        transformOrigin: 'left center'
      }}
      exit={{ 
        opacity: 0,
        scale: 0.8,
        rotateY: 15,
        transformOrigin: 'right center'
      }}
      transition={{
        duration: 0.6,
        ease: [0.25, 0.46, 0.45, 0.94],
        type: 'spring',
        stiffness: 100,
        damping: 15
      }}
      className={className}
      style={{
        transformStyle: 'preserve-3d',
        perspective: '1000px'
      }}
    >
      {children}
    </motion.div>
  );
};

interface BookPageProps {
  children: React.ReactNode;
  isOpen: boolean;
  className?: string;
}

export const BookPage: React.FC<BookPageProps> = ({ children, isOpen, className = '' }) => {
  return (
    <motion.div
      initial={false}
      animate={{
        rotateY: isOpen ? 0 : -180,
        transformOrigin: 'left center'
      }}
      transition={{
        duration: 0.8,
        ease: [0.25, 0.46, 0.45, 0.94],
        type: 'spring',
        stiffness: 80,
        damping: 20
      }}
      className={`${className} relative`}
      style={{
        transformStyle: 'preserve-3d',
        perspective: '1000px'
      }}
    >
      <motion.div
        className="w-full h-full"
        style={{
          backfaceVisibility: 'hidden'
        }}
      >
        {children}
      </motion.div>
    </motion.div>
  );
};

interface FadeTransitionProps {
  children: React.ReactNode;
  className?: string;
}

export const FadeTransition: React.FC<FadeTransitionProps> = ({ children, className = '' }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{
        duration: 0.4,
        ease: 'easeInOut'
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

interface SlideTransitionProps {
  children: React.ReactNode;
  direction?: 'left' | 'right' | 'up' | 'down';
  className?: string;
}

export const SlideTransition: React.FC<SlideTransitionProps> = ({ 
  children, 
  direction = 'right',
  className = '' 
}) => {
  const getInitialPosition = () => {
    switch (direction) {
      case 'left':
        return { x: -100, opacity: 0 };
      case 'right':
        return { x: 100, opacity: 0 };
      case 'up':
        return { y: -100, opacity: 0 };
      case 'down':
        return { y: 100, opacity: 0 };
      default:
        return { x: 100, opacity: 0 };
    }
  };

  const getAnimatePosition = () => {
    switch (direction) {
      case 'left':
      case 'right':
        return { x: 0, opacity: 1 };
      case 'up':
      case 'down':
        return { y: 0, opacity: 1 };
      default:
        return { x: 0, opacity: 1 };
    }
  };

  return (
    <motion.div
      initial={getInitialPosition()}
      animate={getAnimatePosition()}
      exit={{
        ...getInitialPosition(),
        transition: { duration: 0.2 }
      }}
      transition={{
        duration: 0.5,
        ease: [0.25, 0.46, 0.45, 0.94]
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

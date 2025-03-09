import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../lib/utils';
import '../styles/Lamp.css';

interface LampContainerProps {
  children: React.ReactNode;
  className?: string;
}

export const LampContainer = ({ children, className }: LampContainerProps) => {
  return (
    <div className={cn('lamp-container', className)}>
      <div className="lamp-inner-container">
        <motion.div
          className="lamp-left"
          initial={{ opacity: 0.5, width: '15rem' }}
          animate={{ opacity: 1, width: '30rem' }}
          transition={{
            delay: 0.3,
            duration: 0.8,
            ease: 'easeInOut',
          }}
          style={{ filter: 'blur(20px)' }}
        >
          <div className="lamp-mask-bottom" />
          <div className="lamp-mask-left" />
        </motion.div>

        <motion.div
          className="lamp-right"
          initial={{ opacity: 0.5, width: '15rem' }}
          animate={{ opacity: 1, width: '30rem' }}
          transition={{
            delay: 0.3,
            duration: 0.8,
            ease: 'easeInOut',
          }}
          style={{ filter: 'blur(20px)' }}
        >
          <div className="lamp-mask-right" />
          <div className="lamp-mask-bottom" />
        </motion.div>

        <div className="lamp-shadow"></div>
        <div className="lamp-blur"></div>
        <div className="lamp-glow"></div>

        <motion.div
          className="lamp-center"
          initial={{ width: '8rem' }}
          animate={{ width: '16rem' }}
          transition={{
            delay: 0.3,
            duration: 0.8,
            ease: 'easeInOut',
          }}
          style={{ filter: 'blur(30px)' }}
        ></motion.div>

        <motion.div
          className="lamp-line"
          initial={{ width: '15rem' }}
          animate={{ width: '30rem' }}
          transition={{
            delay: 0.3,
            duration: 0.8,
            ease: 'easeInOut',
          }}
        ></motion.div>

        <div className="lamp-top-mask"></div>
      </div>

      <div className="lamp-content">{children}</div>
    </div>
  );
};

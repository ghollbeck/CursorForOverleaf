import React from 'react';
import { motion } from 'framer-motion';
import { LampContainer } from './Lamp';
import '../styles/Lamp.css';

export function LampDemo() {
  return (
    <LampContainer className="dark-theme-lamp">
      <motion.h1
        initial={{ opacity: 0.5, y: 50 }}
        animate={{ opacity: 1, y: -150 }}
        transition={{
          delay: 0.3,
          duration: 0.8,
          ease: 'easeInOut',
        }}
        className="lamp-title dark-theme-title"
      >
        Trump Imitation Game <br /> Speak like Trump!
      </motion.h1>
    </LampContainer>
  );
}

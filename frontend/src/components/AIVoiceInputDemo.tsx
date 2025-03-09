import React, { useState } from 'react';
import { AIVoiceInput } from './AIVoiceInput';
import '../styles/AIVoiceInput.css';

export function AIVoiceInputDemo() {
  const [recordings, setRecordings] = useState<{ duration: number; timestamp: Date }[]>([]);

  const handleStart = () => {
    console.log('Recording started');
  };

  const handleStop = (duration: number) => {
    setRecordings((prev) => [...prev.slice(-4), { duration, timestamp: new Date() }]);
    console.log(`Recording stopped after ${duration} seconds`);
  };

  return (
    <div className="ai-voice-input-demo">
      <AIVoiceInput onStart={handleStart} onStop={handleStop} />
    </div>
  );
}

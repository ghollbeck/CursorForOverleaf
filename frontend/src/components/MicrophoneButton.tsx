import { useState } from 'react';
import '../styles/MicrophoneButton.css';

interface MicrophoneButtonProps {
  onStart: () => void;
  onStop: () => void;
}

const MicrophoneButton = ({ onStart, onStop }: MicrophoneButtonProps) => {
  const [isRecording, setIsRecording] = useState(false);

  const handleClick = () => {
    if (isRecording) {
      setIsRecording(false);
      onStop();
    } else {
      setIsRecording(true);
      onStart();
    }
  };

  return (
    <button
      className={`microphone-button ${isRecording ? 'recording' : ''}`}
      onClick={handleClick}
      aria-label={isRecording ? 'Stop recording' : 'Start recording'}
    >
      <div className="button-content">
        {isRecording ? (
          <>
            <span className="icon stop-icon">■</span>
            <span className="button-text">Stop</span>
          </>
        ) : (
          <>
            <span className="icon mic-icon">🎤</span>
            <span className="button-text">Start</span>
          </>
        )}
      </div>
    </button>
  );
};

export default MicrophoneButton;

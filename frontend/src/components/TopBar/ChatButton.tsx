import React from 'react';
import './ChatButton.css';

const ChatButton = () => {
  return (
    <button className="chat-button" aria-label="Chat">
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
      </svg>
      <span className="chat-text">Chat</span>
    </button>
  );
};

export default ChatButton; 
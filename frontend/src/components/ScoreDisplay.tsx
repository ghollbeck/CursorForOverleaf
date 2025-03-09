import { useState } from 'react';
import '../styles/ScoreDisplay.css';

interface ScoreDisplayProps {
  userScore?: number;
}

const ScoreDisplay = ({ userScore = 0 }: ScoreDisplayProps) => {
  // Calculate score color based on value
  const getScoreColor = (score: number) => {
    if (score >= 80) return '#4CAF50'; // Green
    if (score >= 60) return '#FFC107'; // Yellow
    if (score >= 40) return '#FF9800'; // Orange
    return '#F44336'; // Red
  };

  return (
    <div className="score-display-container">
      <div className="score-section">
        <h2 className="section-title">Your Trump Imitation Score</h2>
        <p className="section-description">
          How well do you imitate Trump's speech patterns? The higher the score, the more you sound
          like him!
        </p>

        <div className="score-bar-container">
          <div className="score-value">{userScore}%</div>
          <div className="score-bar">
            <div
              className="score-fill"
              style={{
                width: `${userScore}%`,
                backgroundColor: getScoreColor(userScore),
              }}
            ></div>
          </div>
          <div className="score-labels">
            <span>0%</span>
            <span>25%</span>
            <span>50%</span>
            <span>75%</span>
            <span>100%</span>
          </div>
        </div>

        <div className="score-feedback">
          {userScore >= 80 && (
            <p>Tremendous! You have the best words, absolutely fantastic Trump imitation!</p>
          )}
          {userScore >= 60 && userScore < 80 && (
            <p>Pretty good, pretty good. Getting there, but needs more winning energy!</p>
          )}
          {userScore >= 40 && userScore < 60 && (
            <p>Not bad, but not great either. Needs more work, believe me.</p>
          )}
          {userScore < 40 && (
            <p>Sad! Low energy performance. You need to study the art of the deal more!</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ScoreDisplay;

import React from 'react';
import './GameCard.css';

function GameCard({ game }) {
  const defaultImage = "https://via.placeholder.com/200x150?text=No+Image";

  return (
    <div className="game-card">
      <img 
        src={game.image || defaultImage} 
        alt={game.title}
        className="game-image"
        onError={(e) => {
          e.target.onerror = null;
          e.target.src = defaultImage;
        }}
      />
      <div className="game-info">
        <h3>{game.title}</h3>
        <p>Players: {game.players}</p>
        <p>Play Time: {game.time} min</p>
        <p>Complexity: {game.complexity}</p>
        <p className="added-by">Added by: {game.addedBy}</p>
        <p className="date-added">Date: {game.dateAdded}</p>
      </div>
    </div>
  );
}

export default GameCard;


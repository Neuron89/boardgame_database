import React from 'react';
import './GameCard.css';

const GameCard = ({ game, onDelete }) => {
  console.log('GameCard received game:', game); // Debug log

  return (
    <div className="game-card">
      {game.image_url && (
        <img src={game.image_url} alt={game.name} className="game-image" />
      )}
      <div className="game-info">
        <h3>{game.name}</h3>
        <p>{game.description}</p>
        <div className="game-details">
          <span>Players: {game.min_players}-{game.max_players}</span>
          <span>Time: {game.playing_time} min</span>
          <span>Complexity: {game.complexity}</span>
        </div>
      <button 
        className="delete-button"
        onClick={() => {
          if (window.confirm('Are you sure you want to delete this game?')) {
            onDelete(game.id);
          }
        }}
      >
        Delete
      </button>
      </div>
    </div>
  );
};

export default GameCard;


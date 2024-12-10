import React from 'react';
import GameCard from './GameCard';
import './GameList.css';

const GameList = ({ games, onDeleteGame }) => {
  if (!games || games.length === 0) {
    return <div className="no-games">No games found</div>;
  }

  return (
    <div className="game-list">
      {games.map(game => (
        <GameCard key={game.id} game={game}
        onDelete={onDeleteGame} />
      ))}
    </div>
  );
};

export default GameList;


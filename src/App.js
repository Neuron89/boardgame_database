import React, { useState, useEffect } from 'react';
import SearchBar from './components/SearchBar';
import GameList from './components/GameList';
import AddGameForm from './components/AddGameForm';
import './App.css';

function App() {
  const [games, setGames] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);

  // Fetch all games from the database
  const fetchGames = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/boardgames');
      if (!response.ok) {
        throw new Error('Failed to fetch games');
      }
      const data = await response.json();
      setGames(data);
    } catch (error) {
      console.error('Error fetching games:', error);
    }
  };

  // Load games when component mounts
  useEffect(() => {
    fetchGames();
  }, []);

  // Handle search
  const handleSearch = async (term) => {
    setSearchTerm(term);
    try {
      const response = await fetch(`http://localhost:5000/api/boardgames/search?term=${encodeURIComponent(term)}`);
      if (!response.ok) {
        throw new Error('Failed to search games');
      }
      const data = await response.json();
      setGames(data);
    } catch (error) {
      console.error('Error searching games:', error);
    }
  };

  // Handle deleting a game
  const handleDeleteGame = async (gameId) => {
    try {
      console.log('Attempting to delete game with ID:', gameId);
      
      const response = await fetch(`http://localhost:5000/api/boardgames/${gameId}`, {
        method: 'DELETE',
      });

      const data = await response.json();
      console.log('Server response:', data);

      if (!response.ok) {
        throw new Error(`Failed to delete game: ${data.error || 'Unknown error'}`);
      }

      console.log('Game deleted successfully');
      // Refresh the games list after deletion
      await fetchGames();
    } catch (error) {
      console.error('Error deleting game:', error);
      alert('Failed to delete game. Please try again.');
    }
  };

  // Handle adding new game
  const handleAddGame = async (newGame) => {
    try {
      console.log('Sending new game data:', newGame); // Debug log
      
      // Parse the players and time values safely
      let minPlayers, maxPlayers, playingTime;
      try {
        minPlayers = newGame.players ? parseInt(newGame.players.split('-')[0]) : null;
        maxPlayers = newGame.players ? parseInt(newGame.players.split('-')[1]) : null;
        playingTime = newGame.time ? parseInt(newGame.time.split('-')[0]) : null;
      } catch (parseError) {
        console.error('Error parsing numeric values:', parseError);
        minPlayers = null;
        maxPlayers = null;
        playingTime = null;
      }

      const gameData = {
        name: newGame.title,
        description: newGame.description || '',
        min_players: minPlayers,
        max_players: maxPlayers,
        playing_time: playingTime,
        year_published: null, // Add if you have this field
        publisher: '', // Add if you have this field
        image_url: newGame.image || '',
        complexity: newGame.complexity || '',
        date_added: new Date().toISOString().split('T')[0]
      };

      console.log('Formatted game data:', gameData); // Debug log

      const response = await fetch('http://localhost:5000/api/boardgames', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(gameData)
      });

      if (!response.ok) {
        throw new Error('Failed to add game');
      }

      const savedGame = await response.json();
      console.log('Server response:', savedGame);

      // Refresh the games list after adding
      await fetchGames();
      console.log('Updated games list:', games);
      setShowAddForm(false);
    } catch (error) {
      console.error('Error adding game:', error);
      alert('Failed to add game. Please try again.');
    }
  };

  return (
    <div className="container">
      <h1>Boardgame Database</h1>
      <div className="controls">
        <SearchBar onSearch={handleSearch} />
        <button 
          className="add-button"
          onClick={() => setShowAddForm(true)}
        >
          Add Game
        </button>
      </div>
      
      {showAddForm && (
        <div className="modal">
          <div className="modal-content">
            <AddGameForm 
              onSubmit={handleAddGame}
              onCancel={() => setShowAddForm(false)}
            />
          </div>
        </div>
      )}

      <GameList games={games} onDeleteGame={handleDeleteGame} />
    </div>
  );
}

export default App;


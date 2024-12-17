import React, { useState, useEffect } from 'react';
import SearchBar from './components/SearchBar';
import GameList from './components/GameList';
import AddGameForm from './components/AddGameForm';
import { database } from './firebase-config';
import { ref, onValue, push, remove, set } from 'firebase/database';
import './App.css';

function App() {
  const [games, setGames] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Load games from Firebase when component mounts
  useEffect(() => {
    setIsLoading(true);
    const gamesRef = ref(database, 'games');
    
    const unsubscribe = onValue(gamesRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const gamesArray = Object.entries(data).map(([key, value]) => ({
          ...value,
          firebaseKey: key
        }));
        setGames(gamesArray);
      } else {
        setGames([]);
      }
      setIsLoading(false);
    }, (error) => {
      console.error('Error loading games:', error);
      setError('Failed to load games');
      setIsLoading(false);
    });

    // Cleanup subscription
    return () => unsubscribe();
  }, []);

  // Handle search
  const handleSearch = (term) => {
    setSearchTerm(term);
    if (!term.trim()) {
      const gamesRef = ref(database, 'games');
      onValue(gamesRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          const gamesArray = Object.entries(data).map(([key, value]) => ({
            ...value,
            firebaseKey: key
          }));
          setGames(gamesArray);
        }
      });
      return;
    }
    
    const filteredGames = games.filter(game => 
      game.name.toLowerCase().includes(term.toLowerCase()) ||
      (game.description && game.description.toLowerCase().includes(term.toLowerCase()))
    );
    setGames(filteredGames);
  };

  // Handle deleting a game
  const handleDeleteGame = async (gameId) => {
    try {
      const gameToDelete = games.find(game => game.id === gameId);
      if (gameToDelete && gameToDelete.firebaseKey) {
        await remove(ref(database, `games/${gameToDelete.firebaseKey}`));
        console.log('Game deleted successfully');
      }
    } catch (error) {
      console.error('Error deleting game:', error);
      alert('Failed to delete game. Please try again.');
    }
  };

  // Handle adding new game
  const handleAddGame = async (newGame) => {
    try {
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
        id: Date.now(), // Use timestamp as unique ID
        name: newGame.title,
        description: newGame.description || '',
        min_players: minPlayers,
        max_players: maxPlayers,
        playing_time: playingTime,
        year_published: null,
        publisher: '',
        image_url: newGame.image || '',
        complexity: newGame.complexity || '',
        date_added: new Date().toISOString().split('T')[0]
      };

      // Add to Firebase
      const newGameRef = push(ref(database, 'games'));
      await set(newGameRef, gameData);
      setShowAddForm(false);
      console.log('Game added successfully:', gameData);
    } catch (error) {
      console.error('Error adding game:', error);
      alert('Failed to add game. Please try again.');
    }
  };

  if (isLoading) {
    return <div className="container">Loading...</div>;
  }

  if (error) {
    return <div className="container">Error: {error}</div>;
  }

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


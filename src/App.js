import React, { useState } from 'react';
import SearchBar from './components/SearchBar';
import GameList from './components/GameList';
import AddGameForm from './components/AddGameForm';
import './App.css';
    
    const initialGames = [
      {
        id: 1,
        title: "Catan",
        image: "https://cf.geekdo-images.com/W3Bsga_uLP9kO91gZ7H8yw__thumb/img/8a9HeqFydO7Uun_le9bXWPnidcA=/fit-in/200x150/filters:strip_icc()/pic2419375.jpg",
        players: "3-4",
        time: "60-120",
        complexity: "Medium",
        addedBy: "Admin",
        dateAdded: "2023-01-01"
      },
      {
        id: 2,
        title: "Ticket to Ride",
        image: "https://cf.geekdo-images.com/ZWJg0dCdrWHxVnc0eFXK8w__thumb/img/a9rsFV6KR0aun8GobhRU16aU8Kc=/fit-in/200x150/filters:strip_icc()/pic38668.jpg",
        players: "2-5",
        time: "30-60",
        complexity: "Easy",
        addedBy: "Admin",
        dateAdded: "2023-01-01"
      }
    ];
    
    function App() {
      const [games, setGames] = useState(initialGames);
      const [searchTerm, setSearchTerm] = useState('');
      const [showAddForm, setShowAddForm] = useState(false);
    
      const handleSearch = (term) => {
        setSearchTerm(term);
        const filteredGames = initialGames.filter(game =>
          game.title.toLowerCase().includes(term.toLowerCase())
        );
        setGames(filteredGames);
      };
    
      const handleAddGame = (newGame) => {
        const gameToAdd = {
          ...newGame,
          id: games.length + 1,
          dateAdded: new Date().toISOString().split('T')[0]
        };
        
        setGames(prevGames => [...prevGames, gameToAdd]);
        setShowAddForm(false);
      };
    
      return (
        <div className="container">
          <h1>Boardgame Database</h1>
          <div className="controls">
            <SearchBar onSearch={handleSearch} />
            <button 
              className="add-game-button" 
              onClick={() => setShowAddForm(!showAddForm)}
            >
              {showAddForm ? 'Cancel' : 'Add New Game'}
            </button>
          </div>
          {showAddForm && <AddGameForm onSubmit={handleAddGame} />}
          <GameList games={games} />
        </div>
      );
}

export default App;

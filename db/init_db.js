const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Create a new database connection
const dbPath = path.join(__dirname, 'boardgames.db');
const db = new sqlite3.Database(dbPath);

// Create tables
db.serialize(() => {
    // Drop existing tables if they exist
    db.run("DROP TABLE IF EXISTS boardgame_categories");
    db.run("DROP TABLE IF EXISTS categories");
    db.run("DROP TABLE IF EXISTS boardgames");

    // Create boardgames table
    db.run(`CREATE TABLE boardgames (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        description TEXT,
        min_players INTEGER,
        max_players INTEGER,
        playing_time INTEGER,
        year_published INTEGER,
        publisher TEXT,
        image_url TEXT,
        complexity TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`);

    // Create categories table
    db.run(`CREATE TABLE categories (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL UNIQUE
    )`);

    // Create boardgame_categories table
    db.run(`CREATE TABLE boardgame_categories (
        boardgame_id INTEGER,
        category_id INTEGER,
        PRIMARY KEY (boardgame_id, category_id),
        FOREIGN KEY (boardgame_id) REFERENCES boardgames(id) ON DELETE CASCADE,
        FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE
    )`);

    console.log('Database initialized successfully!');
});

// Close the database connection
db.close((err) => {
    if (err) {
        console.error('Error closing database:', err.message);
    } else {
        console.log('Database connection closed.');
    }
});


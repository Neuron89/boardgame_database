const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
const port = 5000;

// Enable CORS for all routes with specific options
app.use(cors({
    origin: 'http://localhost:3000', // Allow your React app's origin
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Allowed methods
    allowedHeaders: ['Content-Type', 'Authorization'], // Allowed headers
    credentials: true // Allow credentials
}));

// Parse JSON bodies
app.use(express.json());

// Database connection
const db = new sqlite3.Database(path.join(__dirname, 'db/boardgames.db'), (err) => {
    if (err) {
        console.error('Error connecting to database:', err);
    } else {
        console.log('Connected to SQLite database');
    }
});

// GET all boardgames
app.get('/api/boardgames', (req, res) => {
    db.all('SELECT * FROM boardgames', [], (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(rows);
    });
});

// POST new boardgame
app.post('/api/boardgames', (req, res) => {
    const {
        name,
        description,
        min_players,
        max_players,
        playing_time,
        year_published,
        publisher,
        image_url,
        complexity
    } = req.body;

    const sql = `
        INSERT INTO boardgames (
            name, description, min_players, max_players,
            playing_time, year_published, publisher,
            image_url, complexity
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    db.run(sql, [
        name,
        description,
        min_players,
        max_players,
        playing_time,
        year_published,
        publisher,
        image_url,
        complexity
    ], function(err) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({
            id: this.lastID,
            message: "Game added successfully"
        });
    });
});

// Search boardgames
app.get('/api/boardgames/search', (req, res) => {
    const searchTerm = req.query.term;
    const sql = `
        SELECT * FROM boardgames 
        WHERE name LIKE ? 
        OR description LIKE ?
    `;
    const params = [`%${searchTerm}%`, `%${searchTerm}%`];

    db.all(sql, params, (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(rows);
    });
});

// Start server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');
require('dotenv').config();

const app = express();
const port = 5000;

// Enable CORS for all routes with specific options
app.use(cors({
    origin: 'http://localhost:3000', // Allow your React app's origin
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Allowed methods
    allowedHeaders: ['Content-Type', 'Authorization'], // Allowed headers
    credentials: true // Allow credentials
}));

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Convert pool to use promises
const promisePool = pool.promise();

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
app.get('/api/boardgames', async (req, res) => {
    try {
        const [rows] = await promisePool.query('SELECT * FROM boardgames');
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});

// POST new boardgame
app.post('/api/boardgames', async (req, res) => {
    try {
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

        const [result] = await promisePool.query(
            `INSERT INTO boardgames (
                name, description, min_players, max_players,
                playing_time, year_published, publisher,
                image_url, complexity
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                name,
                description,
                min_players,
                max_players,
                playing_time,
                year_published,
                publisher,
                image_url,
                complexity
            ]
        );
        
        res.json({
            id: result.insertId,
            message: "Game added successfully"
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});

// Search boardgames
app.get('/api/boardgames/search', async (req, res) => {
    try {
        const searchTerm = req.query.term;
        const [rows] = await promisePool.query(
            `SELECT * FROM boardgames 
            WHERE name LIKE ? 
            OR description LIKE ?`,
            [`%${searchTerm}%`, `%${searchTerm}%`]
        );
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});

// DELETE a boardgame
app.delete('/api/boardgames/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const [result] = await promisePool.query(
            'DELETE FROM boardgames WHERE id = ?',
            [id]
        );
        
        if (result.affectedRows === 0) {
            res.status(404).json({ error: "Game not found" });
            return;
        }
        
        res.json({ message: "Game deleted successfully", id: id });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});



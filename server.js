const express = require('express');
const cors = require('cors');
const mariadb = require('mariadb');
require('dotenv').config();

const app = express();
const port = 5000;

// Helper function to convert BigInt to Number
const sanitizeData = (data) => {
    if (Array.isArray(data)) {
        return data.map(item => sanitizeData(item));
    }
    if (typeof data === 'object' && data !== null) {
        return Object.fromEntries(
            Object.entries(data).map(([key, value]) => [key, sanitizeData(value)])
        );
    }
    if (typeof data === 'bigint') {
        return Number(data);
    }
    return data;
};

// Enable CORS for all origins during development
app.use(cors({
    origin: '*',  // Allow all origins
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: false  // Set to false when using origin: '*'
}));

// Parse JSON bodies
app.use(express.json());

// Create MariaDB connection pool
const pool = mariadb.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT || 3306,
    connectionLimit: 10
});

// Test database connection
async function testConnection() {
    let conn;
    try {
        conn = await pool.getConnection();
        console.log('Successfully connected to MariaDB');
    } catch (err) {
        console.error('Error connecting to MariaDB:', err);
    } finally {
        if (conn) conn.release();
    }
}

testConnection();

// GET all boardgames
app.get('/api/boardgames', async (req, res) => {
    let conn;
    try {
        conn = await pool.getConnection();
        const rows = await conn.query('SELECT * FROM boardgames');
        const sanitizedRows = sanitizeData(rows);
        res.json(sanitizedRows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    } finally {
        if (conn) conn.release();
    }
});

// POST new boardgame
app.post('/api/boardgames', async (req, res) => {
    let conn;
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

        conn = await pool.getConnection();
        const result = await conn.query(
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
        
        const sanitizedResult = sanitizeData(result);
        res.json({
            id: sanitizedResult.insertId,
            message: "Game added successfully"
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    } finally {
        if (conn) conn.release();
    }
});

// Search boardgames
app.get('/api/boardgames/search', async (req, res) => {
    let conn;
    try {
        const searchTerm = req.query.term;
        conn = await pool.getConnection();
        const rows = await conn.query(
            `SELECT * FROM boardgames 
            WHERE name LIKE ? 
            OR description LIKE ?`,
            [`%${searchTerm}%`, `%${searchTerm}%`]
        );
        const sanitizedRows = sanitizeData(rows);
        res.json(sanitizedRows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    } finally {
        if (conn) conn.release();
    }
});

// DELETE a boardgame
app.delete('/api/boardgames/:id', async (req, res) => {
    let conn;
    try {
        const id = req.params.id;
        conn = await pool.getConnection();
        const result = await conn.query(
            'DELETE FROM boardgames WHERE id = ?',
            [id]
        );
        
        const sanitizedResult = sanitizeData(result);
        if (sanitizedResult.affectedRows === 0) {
            res.status(404).json({ error: "Game not found" });
            return;
        }
        
        res.json({ message: "Game deleted successfully", id: Number(id) });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    } finally {
        if (conn) conn.release();
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

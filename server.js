const express = require('express');
const cors = require('cors');
const mariadb = require('mariadb');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;
const clientUrl = process.env.CLIENT_URL || 'http://localhost:8081';
const isDevelopment = process.env.NODE_ENV === 'development';

// CORS configuration
const corsOptions = {
    origin: isDevelopment ? [clientUrl, 'http://localhost:8081'] : clientUrl,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
    maxAge: 86400 // 24 hours
};

// Enable CORS with options
app.use(cors(corsOptions));

// Additional CORS headers for specific cases
app.use((req, res, next) => {
    const origin = req.headers.origin;
    if (corsOptions.origin.includes(origin)) {
        res.header('Access-Control-Allow-Origin', origin);
    }
    res.header('Access-Control-Allow-Headers', corsOptions.allowedHeaders.join(', '));
    res.header('Access-Control-Allow-Methods', corsOptions.methods.join(', '));
    res.header('Access-Control-Allow-Credentials', 'true');
    
    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Max-Age', corsOptions.maxAge);
        return res.status(200).json({});
    }
    next();
});

// Handle uncaught errors
process.on('uncaughtException', (error) => {
    console.error('Uncaught Exception:', error);
});

process.on('unhandledRejection', (error) => {
    console.error('Unhandled Rejection:', error);
});


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

// Enable CORS for specific origin
app.use(cors({
    origin: 'http://localhost:8081', // Replace with your React app's URL
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));

// Add CORS headers middleware
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', 'http://localhost:8081'); // Replace with your React app's URL
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Credentials', 'true');
    
    // Handle preflight requests
    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Max-Age', '86400'); // 24 hours
        return res.status(200).json({});
    }
    
    next();
});

// Parse JSON bodies
app.use(express.json());

// Create MariaDB connection pool
const pool = mariadb.createPool({
    host: '192.168.1.252',  // Your MariaDB IP address
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: 3306,
    connectionLimit: 10,
    connectTimeout: 30000, // Increase timeout to 30 seconds
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

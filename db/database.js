const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

module.exports = {
  query: (text, params) => pool.query(text, params),
};
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, 'boardgames.db');

// Create a database connection
const getDbConnection = () => {
    return new sqlite3.Database(dbPath, (err) => {
        if (err) {
            console.error('Error connecting to database:', err);
        } else {
            console.log('Connected to SQLite database');
        }
    });
};

// Initialize the database with schema
const initializeDatabase = () => {
    const db = getDbConnection();
    const schema = require('fs').readFileSync(path.resolve(__dirname, 'schema.sql'), 'utf8');
    
    db.exec(schema, (err) => {
        if (err) {
            console.error('Error initializing database:', err);
        } else {
            console.log('Database initialized successfully');
        }
    });
    
    db.close();
};

module.exports = {
    getDbConnection,
    initializeDatabase
};


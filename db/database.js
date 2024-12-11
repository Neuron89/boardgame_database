const mariadb = require('mariadb');
require('dotenv').config();

const pool = mariadb.createPool({
    host: '192.168.1.252',
    port: 3306,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    connectionLimit: 5,
    connectTimeout: 10000
});

// Test database connection
const testConnection = async () => {
    let conn;
    try {
        conn = await pool.getConnection();
        console.log('Successfully connected to MariaDB');
        return true;
    } catch (err) {
        console.error('Database connection error:', err);
        return false;
    } finally {
        if (conn) conn.release();
    }
};

// Query wrapper function
const query = async (sql, params) => {
    let conn;
    try {
        conn = await pool.getConnection();
        const result = await conn.query(sql, params);
        return result;
    } catch (err) {
        console.error('Query error:', err);
        throw err;
    } finally {
        if (conn) conn.release();
    }
};

module.exports = {
    pool,
    query,
    testConnection
};


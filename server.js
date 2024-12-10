const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors());
app.use(express.json());
app.post('/api/boardgames', (req, res) => {
    try {
        // Validate request body
        if (!req.body) {
            console.error('No request body received');
            return res.status(400).json({ error: 'No data provided' });
        }

        console.log('Received new game data:', req.body);

        const {
            name,
            description,
            minPlayers,
            maxPlayers,
            playingTime,
            yearPublished,
            publisher,
            imageUrl
        } = req.body;

        // Validate required fields
        if (!name) {
            console.error('Name is required');
            return res.status(400).json({ error: 'Game name is required' });
        }

        // Validate numeric fields
        if (minPlayers && isNaN(minPlayers)) {
            console.error('Invalid minPlayers value:', minPlayers);
            return res.status(400).json({ error: 'Min players must be a number' });
        }
        if (maxPlayers && isNaN(maxPlayers)) {
            console.error('Invalid maxPlayers value:', maxPlayers);
            return res.status(400).json({ error: 'Max players must be a number' });
        }

        let db;
        try {
            db = getDbConnection();
            console.log('Database connection established');
        } catch (dbError) {
            console.error('Database connection error:', dbError);
            return res.status(500).json({ error: 'Database connection failed' });
        }

        const query = `INSERT INTO boardgames (
            name, description, min_players, max_players, 
            playing_time, year_published, publisher, image_url
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;

        const params = [
            name, 
            description || null, 
            minPlayers || null, 
            maxPlayers || null, 
            playingTime || null, 
            yearPublished || null, 
            publisher || null, 
            imageUrl || null
        ];

        console.log('Executing query:', query);
        console.log('With parameters:', params);

        db.serialize(() => {
            db.run(query, params, function(err) {
                if (err) {
                    console.error('Insert error:', err);
                    res.status(500).json({ 
                        error: 'Failed to insert game',
                        details: err.message 
                    });
                    db.close();
                    return;
                }

                const insertId = this.lastID;
                console.log('Successfully inserted game with ID:', insertId);

                // Verify the insert by selecting the new record
                db.get('SELECT * FROM boardgames WHERE id = ?', [insertId], (selectErr, row) => {
                    if (selectErr) {
                        console.error('Error verifying insert:', selectErr);
                        res.status(500).json({ 
                            error: 'Game was inserted but could not be retrieved',
                            details: selectErr.message 
                        });
                    } else if (!row) {
                        console.error('Inserted game not found:', insertId);
                        res.status(500).json({ 
                            error: 'Game was inserted but could not be found' 
                        });
                    } else {
                        console.log('Successfully retrieved new game:', row);
                        res.json(row);
                    }
                    db.close();
                });
            });
        });

    } catch (error) {
        console.error('Unexpected error:', error);
        res.status(500).json({ 
            error: 'An unexpected error occurred',
            details: error.message 
        });
        if (db) db.close();
    }
});


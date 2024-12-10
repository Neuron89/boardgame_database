CREATE TABLE IF NOT EXISTS boardgames (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT,
    min_players INTEGER,
    max_players INTEGER,
    Best_player_count INTEGER,
    playing_time INTEGER,
    year_published INTEGER,
    publisher TEXT,
    Owner TEXT,
    image_url TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS boardgame_categories (
    boardgame_id INTEGER,
    category_id INTEGER,
    PRIMARY KEY (boardgame_id, category_id),
    FOREIGN KEY (boardgame_id) REFERENCES boardgames(id) ON DELETE CASCADE,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE
);


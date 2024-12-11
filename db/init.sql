CREATE DATABASE IF NOT EXISTS boardgames_db;
USE boardgames_db;

CREATE TABLE IF NOT EXISTS boardgames (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    min_players INT,
    max_players INT,
    playing_time INT,
    year_published INT,
    publisher VARCHAR(255),
    image_url TEXT,
    complexity VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS boardgame_categories (
    boardgame_id INT,
    category_id INT,
    PRIMARY KEY (boardgame_id, category_id),
    FOREIGN KEY (boardgame_id) REFERENCES boardgames(id) ON DELETE CASCADE,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


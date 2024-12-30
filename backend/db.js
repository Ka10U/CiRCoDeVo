const sqlite3 = require("sqlite3").verbose();
// const { v4: uuidv4 } = require('uuid');
const db = new sqlite3.Database("circodevo.db"); // Utilisez ':memory:' pour une base de données en mémoire, ou un fichier pour une base de données persistante

db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        username TEXT UNIQUE,
        email TEXT UNIQUE,
        password TEXT,)...
        temp_password_expiration INTEGER,
        created_polls TEXT,
        participated_polls TEXT
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS polls (
        id TEXT PRIMARY KEY,
        creator_id TEXT,
        title TEXT,
        questions TEXT,
        voting_period_start INTEGER,
        voting_period_end INTEGER,
        FOREIGN KEY (creator_id) REFERENCES users (id)
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS votes (
        id TEXT PRIMARY KEY,
        poll_id TEXT,
        user_id TEXT,
        vote_data TEXT,
        FOREIGN KEY (poll_id) REFERENCES polls (id),
        FOREIGN KEY (user_id) REFERENCES users (id)
    )`);
});

module.exports = db;

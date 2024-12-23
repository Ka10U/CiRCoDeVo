const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("circodevo.db"); // Utilisez ':memory:' pour une base de données en mémoire, ou un fichier pour une base de données persistante

db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE,
        email TEXT UNIQUE,
        password TEXT,
        temp_password_expiration INTEGER
    )`);
});

module.exports = db;

const sqlite3 = require("sqlite3").verbose();

const connectSqliteDB = () => {
    const connectionSqliteDB = new sqlite3.Database("./blacklist.db");

    connectionSqliteDB.serialize(() => {
        connectionSqliteDB.run(`CREATE TABLE IF NOT EXISTS tokens (token TEXT PRIMARY KEY, created_at DATETIME DEFAULT CURRENT_TIMESTAMP);`);
    });

    return connectionSqliteDB;
}

module.exports = connectSqliteDB;
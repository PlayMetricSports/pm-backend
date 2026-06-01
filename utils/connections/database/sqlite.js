const connectSqliteDB = require("@/utils/connections/database/connectSqliteDB");

module.exports = {
    sqliteDelete: () => {
        const connectionSqliteDB = connectSqliteDB();

        connectionSqliteDB.serialize(() => {
            const twentyFourHoursAgo = new Date();
            twentyFourHoursAgo.setHours(twentyFourHoursAgo.getHours() - 24); // Calculate the date and time 24 hours ago
    
            connectionSqliteDB.run(`DELETE FROM tokens WHERE created_at < ?;`, [twentyFourHoursAgo.toISOString()]);
        })
    },

    sqliteInsert: (token) => {
        const connectionSqliteDB = connectSqliteDB();

        connectionSqliteDB.serialize(() => {
            connectionSqliteDB.run(`INSERT INTO tokens (token) VALUES (?);`, [token]);
        })
    }
};
const mongoose = require('mongoose');
const { MONGO_URI, API_NAME } = process.env;

let db;

if (process.env.NODE_ENV !== 'test') {
    // Production db setup
    db = mongoose.createConnection(MONGO_URI);
    db.on('connected', () => console.log(`Successfully connected to \x1b[32m${API_NAME}\x1b[0m`));
    db.on('error', err => console.error(`Failed to connect to \x1b[31m${API_NAME}\x1b[0m\n`, err));
} else {
    // Testing db setup (MONGODB_URI envioronment variable is set in test/mongo-memory-server.js>startDatabase())
    db = mongoose.createConnection(process.env.MONGODB_URI);
}

module.exports = db;

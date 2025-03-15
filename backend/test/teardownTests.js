const { stopDatabase } = require('./mongo-memory-server');

module.exports = async function globalTeardown() {
    await stopDatabase();
};
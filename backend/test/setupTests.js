const { startDatabase } = require('./mongo-memory-server');

module.exports = async function globalSetup() {
    await startDatabase();
};
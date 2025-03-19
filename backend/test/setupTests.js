const { startDatabase } = require('./mongo-memory-server');

module.exports = async function globalSetup() {
    // Set to test environment
    process.env.NODE_ENV = 'test';
    // Start database
    await startDatabase();
};
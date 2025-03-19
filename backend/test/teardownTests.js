const { stopDatabase } = require('./mongo-memory-server');

module.exports = async function globalTeardown() {
    await stopDatabase();
    console.log('MongoDB test database teardown completed');
};
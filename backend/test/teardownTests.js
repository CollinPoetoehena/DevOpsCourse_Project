const { stopDatabase } = require('./mongo-memory-server');

module.exports = async function globalTeardown() {
    // Remove NODE_ENV env variable to avoid running in test environment in cloud deployments
    process.env.NODE_ENV = '';

    // Stop database
    await stopDatabase();
    console.log('MongoDB test database teardown completed');
};
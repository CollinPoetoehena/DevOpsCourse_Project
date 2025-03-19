const { startDatabase } = require('./mongo-memory-server');

module.exports = async function globalSetup() {
    process.env.NODE_ENV = 'test';
    await startDatabase();
};
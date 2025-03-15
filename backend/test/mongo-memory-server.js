const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');

let mongoServer;

async function startDatabase() {
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    console.log('MongoDB URI (start)', mongoUri);
    process.env.MONGODB_URI = mongoUri;

    await mongoose.connect(mongoUri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
}

async function stopDatabase() {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
    await mongoServer.stop();
}

module.exports = {
    startDatabase,
    stopDatabase,
};
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
    await mongoose.disconnect();
    await mongoServer.stop();
}

async function clearDatabase() {
    const collections = mongoose.connection.collections;

    for (const key in collections) {
        const collection = collections[key];
        await collection.deleteMany({});
    }
}

module.exports = {
    startDatabase,
    stopDatabase,
    clearDatabase,
};
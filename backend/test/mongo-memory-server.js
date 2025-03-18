// Import required packages
const { MongoMemoryServer } = require('mongodb-memory-server');  // Creates an in-memory MongoDB instance
const mongoose = require('mongoose');                            // MongoDB Object Modeling tool

// Global variable to store our temporary MongoDB server instance
let mongoServer;

/**
 * Starts an in-memory MongoDB server and connects to it
 * This is used for testing to avoid using a real database
 */
async function startDatabase() {
    // Create a new instance of in-memory MongoDB server
    // This creates a temporary database that exists only in memory
    mongoServer = await MongoMemoryServer.create();
    
    // Get the connection URI for the temporary database
    // Example URI: mongodb://127.0.0.1:51234/some-random-db-name
    const mongoUri = mongoServer.getUri();
    console.log('MongoDB URI (start)', mongoUri);
    
    // Store the URI in environment variables
    // This allows our app to connect to this temporary database instead of the real one
    process.env.MONGODB_URI = mongoUri;

    // Connect mongoose to our temporary database
    // This is the same as connecting to a real MongoDB database, but using our temporary one
    await mongoose.connect(mongoUri, {
        useNewUrlParser: true,      // Use new URL parser to avoid deprecation warnings
        useUnifiedTopology: true,   // Use new Server Discovery and Monitoring engine
    });
}

/**
 * Stops the temporary database and cleans up resources
 * This should be called after tests are complete
 */
async function stopDatabase() {
    // Drop all data from the temporary database
    // This ensures we don't have leftover data between tests
    await mongoose.connection.dropDatabase();
    
    // Close the mongoose connection to our temporary database
    await mongoose.connection.close();
    
    // Stop the temporary MongoDB server
    // This frees up memory and resources
    await mongoServer.stop();
}

// Export functions to be used in test files
module.exports = {
    startDatabase,
    stopDatabase,
};
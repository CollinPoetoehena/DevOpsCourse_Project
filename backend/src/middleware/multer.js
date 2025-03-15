// Multer middleware for reading file data

// Load environment variables
require('dotenv').config();
// Import necessary modules
const multer = require("multer"); // Middleware for handling file uploads

// Configure multer for memory storage
const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 30 * 1024 * 1024 // 30MB limit
    }
});

module.exports = upload;
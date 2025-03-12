const mongoose = require('mongoose');

const db = require("../config/db");

const garageSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    // Reference to the maintainer (User) who manages this garage
    // Maintainer is now just a username (string) instead of an ObjectId reference with the new AWS Cognito implementation
    maintainer: {
        type: String,
        required: true,
        // Ensure consistency in storage
        trim: true,
        lowercase: true, 
    },
}, { timestamps: true });

module.exports = db.model("Garage", garageSchema);

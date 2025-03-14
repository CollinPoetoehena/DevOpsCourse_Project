require('dotenv').config();
// Verifier for JWTs from AWS Cognito
const { verifier, cognitoOAuthAPI } = require('../config/cognito');
const axios = require('axios');
// Import user and garage model
const User = require("../models/user.model");
const Garage = require("../models/garage.model");

// Verify Token using AWS verification steps (since SECRET_KEY is not accessible): https://docs.aws.amazon.com/cognito/latest/developerguide/amazon-cognito-user-pools-using-tokens-verifying-a-jwt.html
// Specifically this uses: https://docs.aws.amazon.com/cognito/latest/developerguide/amazon-cognito-user-pools-using-tokens-verifying-a-jwt.html
const verifyToken = (token) => {
    return new Promise((resolve, reject) => {
        if (!token) {
            return reject("A token is required for authentication");
        }
        try {
            // const decoded = jwt.verify(token, SECRET_KEY);
            const decoded = verifier.verify(token);
            resolve(decoded);
        } catch (err) {
            reject("Invalid Token");
            console.log("Error for invalid token: ", err);
        }
    });
};

// Authentication Middleware (Validates User)
const auth = async (req, res, next) => {
    const token = req.headers["bearer"];
    if (!token) {
        return res.status(401).send("A token is required for authentication");
    }
    try {
        const user = await getUserFromToken(token);
        // Add the user to the request to make it useable for further processing
        req.user = user;
    } catch (err) {
        return res.status(401).send(`Error: Authorization failed: ${err.message}`);
    }
    return next();
};

// Check only user
const checkUser = async (req, res, next) => {
    if (!req.user || req.user.role !== 'user') {
        return res.status(403).send("Access denied. Users only.");
    }
    return next();
};

// Check Admin Permission
const checkAdmin = async (req, res, next) => {
    if (!req.user || req.user.role !== 'admin') {
        return res.status(403).send("Access denied. Admins only.");
    }
    return next();
};

// Middleware to Check if a Maintainer Owns the Garage
const checkMaintainer = async (req, res, next) => {
    if (!req.user || (req.user.role !== "maintainer" && req.user.role !== "admin")) {
        return res.status(403).json({ error: "Access denied. Only maintainers or admins are allowed." });
    }

    // Admins have full access
    if (req.user.role === "admin") {
        return next();
    }

    try {
        // Find the garage by ID from the request
        const garage = await Garage.findById(req.body.garageId || req.params.garageId);

        if (!garage) {
            return res.status(404).json({ error: "Garage not found." });
        }

        // Check if the logged-in maintainer is the owner of the garage
        if (garage.maintainer !== req.user.username) {
            return res.status(403).json({ error: "Access denied. You can only manage your own garage." });
        }

        next();
    } catch (error) {
        return res.status(500).json({ error: "Server error. Please try again." });
    }
};

// Get User from Token and AWS Cognito user info
const getUserFromToken = async (token) => {
    try {
        // Verify token
        const decoded = await verifyToken(token);
        // Get user info with token
        const response = await axios.get(`${cognitoOAuthAPI}/userInfo`, {
            headers: {
                // Use Authorization header in specific format for AWS Cognito /userInfo endpoint
                Authorization: `Bearer ${token}`,
            },
        });

        // Create a user object with the user model based on the above user information
        const user = User.create({
            username: response.data.username,
            email: response.data.email,
            // Extract groups from decoded token if present, otherwise use an empty list
            role: extractRoleFromCognitoUserGroups(decoded["cognito:groups"] || [])
        });
        return user;
    } catch (err) {
        // Print error for debugging purposes
        console.error("Error getting user: ", err);
        // Return error, could be JWT expired for example
        throw new Error(`Error getting user: ${err.message}`);
    }
};

// Extracts the user role from AWS Cognito user groups
const extractRoleFromCognitoUserGroups = (groups) => {
    if (groups.includes("admin")) {
        return "admin";
    }
    if (groups.includes("maintainer")) {
        return "maintainer";
    }
    return "user";
};

module.exports = {
    auth,
    checkAdmin,
    checkMaintainer,
    checkUser
};

// Old encrypt and decrypt code used before using AWS Cognito user pools
// const CryptoJS = require('crypto-js');
// const jwt = require('jsonwebtoken');
// const { SECRET_KEY } = process.env;
// // Encrypt Token
// const encryptToken = (token) => {
//     return CryptoJS.AES.encrypt(token, SECRET_KEY).toString();
// };

// // Decrypt Token
// const decryptToken = (encryptedToken) => {
//     const decryptedBytes = CryptoJS.AES.decrypt(encryptedToken, SECRET_KEY);
//     return decryptedBytes.toString(CryptoJS.enc.Utf8);
// };
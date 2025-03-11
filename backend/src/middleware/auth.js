const CryptoJS = require('crypto-js');
const jwt = require('jsonwebtoken');
require('dotenv').config();
// Verifier for JWTs from AWS Cognito
const { verifier, cognitoOAuthAPI } = require('../config/cognito');
const axios = require('axios');
// Import user model
const User = require("../models/user.model");

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
            console.log("Token is valid.");
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
        console.log("User: ", user);
        // Add the user to the request to make it useable for further processing
        req.user = user;
    } catch (err) {
        return res.status(401).send("Error: Authorization failed.");
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

// Check Garage Maintainer Permission (Can Manage Only Their Own Garage)
const checkMaintainer = async (req, res, next) => {
    if (!req.user || (req.user.role !== 'maintainer' && req.user.role !== 'admin')) {
        return res.status(403).send("Access denied. Garage maintainers or admins only.");
    }

    // Ensure maintainers can only modify their assigned garage
    if (req.user.role === 'maintainer' && req.body.garageId && req.body.garageId !== req.user.garageId) {
        return res.status(403).send("Access denied. You can only manage your assigned garage.");
    }

    return next();
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
        console.log("Decoded: ", decoded);
        console.log("Response data: ", response.data);

        // Create a user object with the user model based on the above user information
        const user = User.create({
            username: response.data.username,
            email: response.data.email,
            // Extract groups from decoded token if present, otherwise use an empty list
            role: extractRoleFromCognitoUserGroups(decoded["cognito:groups"] || [])
        });
        // Return the user
        return user;
    } catch (err) {
        console.error("Error getting user: ", err);
        return null;
    }
};

// Custom function to extract the user role from the user groups from the AWS Cognito auth object
const extractRoleFromCognitoUserGroups = (groups) => {
    // Extract groups from auth.user object
    console.log("User groups: ", groups)

    // Set role based on groups (give admin preference by checking that one first)
    // If not admin or maintainer, then set to user
    if (groups.includes("admin")) {
        console.log("Using admin role for user...")
        return "admin";
    } else if (groups.includes("maintainer")) {
        console.log("Using maintainer role for user...")
        return "maintainer";
    } else {
        console.log("Using user role for user...")
        return "user";
    }
};

// TODO: remove .env values that are not used anymore, such as SECRET_KEY, and other information, such as ROLE, etc.
// TODO: now change all the models and services and test the changes. 
// Need to replace user attributes (now linked to ObjectId) to username from AWS Cognito, since this is unique

module.exports = {
    auth,
    checkAdmin,
    checkMaintainer,
};

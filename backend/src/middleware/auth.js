const CryptoJS = require('crypto-js');
const jwt = require('jsonwebtoken');
require('dotenv').config();
// Verifier for JWTs from AWS Cognito
const { verifier, cognitoOAuthAPI } = require('../config/cognito');
const axios = require('axios');

const { SECRET_KEY } = process.env;

// Encrypt Token
const encryptToken = (token) => {
    return CryptoJS.AES.encrypt(token, SECRET_KEY).toString();
};

// Decrypt Token
const decryptToken = (encryptedToken) => {
    const decryptedBytes = CryptoJS.AES.decrypt(encryptedToken, SECRET_KEY);
    return decryptedBytes.toString(CryptoJS.enc.Utf8);
};

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

// Extract User from Token
const getUserFromToken = async (token) => {
    try {
        // if (token.startsWith('ey')) {
        //     return await verifyToken(token);
        // }
        // // TODO: decrypt token not necessary anymore, so these two lines can be ignored, and only verifyToken can be done, removing if with 'ey' probably.
        // // TODO: add here getting user from decoded JWT if possible. Otherwise, use the userInfo endpoint: https://docs.aws.amazon.com/cognito/latest/developerguide/userinfo-endpoint.html
        // const decryptedToken = decryptToken(token);
        // return await verifyToken(decryptedToken);

        // Verify token
        const decoded = await verifyToken(token);
        console.log("Decoded: ", decoded);
        // Get user info with token
        const response = await axios.get(`${cognitoOAuthAPI}/userInfo`, {
            headers: {
                // Use Authorization header in specific format for AWS Cognito /userInfo endpoint
                Authorization: `Bearer ${token}`,
            },
        });
        // Merge decoded token data (contains group, which is the role of the user) with user info data from the response
        const user = {
            ...response.data,
            // Extract groups from decoded token
            groups: decoded["cognito:groups"] || [],
        };
        console.log("User: ", user);
        return user;
    } catch (err) {
        return null;
    }
};

// TODO: create extract role from JWT function, role is:
// if user in group maintainer -> maintainer, if user in admin group -> admin, otherwise, user
// Group example from JWT: "cognito:groups": ["maintainer"]
// TODO: then change checkMaintainer and checkAdmin to use the result of this new function of the role.
// TODO: See frontend for how it is done there to assign the roles, can use the similar if statements to extract the roles.

module.exports = {
    encryptToken,
    auth,
    checkAdmin,
    checkMaintainer,
};

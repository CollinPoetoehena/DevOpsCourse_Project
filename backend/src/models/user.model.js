// Plain JavaScript object with validation rules and transformations (user is handled in AWS Cognito, so no need to save it in our db)
const User = {
    // Create function to create a user (default role is user)
    create({ username, email, role = "user" }) {
        // Input validation and transformations
        if (!username || typeof username !== "string" || username.length > 30) {
            throw new Error("Invalid username");
        }
        if (!email || typeof email !== "string" || email.length > 50) {
            throw new Error("Invalid email");
        }
        if (!["user", "maintainer", "admin"].includes(role)) {
            throw new Error("Invalid role");
        }

        return {
            username: username.toLowerCase().trim(),
            email: email.toLowerCase().trim(),
            role
        };
    }
};

module.exports = User;

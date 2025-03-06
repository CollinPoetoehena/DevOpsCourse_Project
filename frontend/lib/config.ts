const title = "Rent a Car";

// Set URLs from the .env file (next.js has build in support for .env files: https://nextjs.org/docs/pages/building-your-application/configuring/environment-variables)
// Environment variables have to include the prefix NEXT_PUBLIC_ to be available for the browser, otherwise it shows undefined
const baseUrl = process.env.NEXT_PUBLIC_FRONTEND_URL || 'http://localhost:3000';
const racUrl = process.env.NEXT_PUBLIC_BACKEND_FULL_URL || 'http://localhost:4001/api/v1';

// Cognito Configuration
const cognitoConfig = {
    region: process.env.NEXT_PUBLIC_AWS_REGION || 'us-east-1',
    userPoolId: process.env.NEXT_PUBLIC_COGNITO_USER_POOL_ID || '',
    userPoolWebClientId: process.env.NEXT_PUBLIC_COGNITO_APP_CLIENT_ID || '',
    oauth: {
        domain: process.env.NEXT_PUBLIC_COGNITO_DOMAIN || '',
        scope: ['openid', 'email', 'profile'],
        redirectSignIn: process.env.NEXT_PUBLIC_COGNITO_REDIRECT_SIGN_IN || `${baseUrl}/auth/callback`,
        redirectSignOut: process.env.NEXT_PUBLIC_COGNITO_REDIRECT_SIGN_OUT || `${baseUrl}/`,
        responseType: 'code', // Use 'code' for Authorization Code Grant
    }
};

// Log variables for debugging purposes
console.log("NEXT_PUBLIC_FRONTEND_URL:", baseUrl);
console.log("NEXT_PUBLIC_BACKEND_FULL_URL:", racUrl);

const config = {
    title,
    titleWithSeparator: ` | ${title}`,
    role: "user",
    baseUrl,
    user: `${racUrl}/users`,
    car: `${racUrl}/cars`,
    garage: `${racUrl}/garages`,
    reservation: `${racUrl}/reservations`,
    vehicle: `${racUrl}/vehicles`,
    // Amazon Cognito configuration
    cognito: cognitoConfig,
};

export default config;
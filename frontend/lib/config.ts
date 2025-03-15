const title = "Rent a Car";

// Set URLs from the .env file (next.js has build in support for .env files: https://nextjs.org/docs/pages/building-your-application/configuring/environment-variables)
// Environment variables have to include the prefix NEXT_PUBLIC_ to be available for the browser, otherwise it shows undefined
const baseUrl = process.env.NEXT_PUBLIC_FRONTEND_URL || 'http://localhost:3000';
const racUrl = process.env.NEXT_PUBLIC_BACKEND_FULL_URL || 'http://localhost:4001/api/v1';

// Cognito Configuration
const cognitoClientId = process.env.NEXT_PUBLIC_COGNITO_APP_CLIENT_ID;
const cognitoDomain = process.env.NEXT_PUBLIC_COGNITO_DOMAIN;
const cognitoLogoutUri = process.env.NEXT_PUBLIC_COGNITO_REDIRECT_SIGN_OUT;
const cognitoAuthConfig = {
  // Authority is the static url, but then with the region replaced and after the / the ID of the User pool, such as:
  // https://cognito-idp.eu-central-1.amazonaws.com/eu-central-1_VVebgtNmw
  authority: process.env.NEXT_PUBLIC_COGNITO_AUTHORITY,
  client_id: cognitoClientId,
  // Must be present in callback_urls specified, otherwise it errors with something like "redirect_mismatch" 
  // Uses specific page for the callback to handle the callback after the login/signup
  redirect_uri: process.env.NEXT_PUBLIC_COGNITO_REDIRECT_SIGN_IN,
  response_type: "code",
  scope: "phone openid email",
};

// Log variables for debugging purposes
// console.log("NEXT_PUBLIC_FRONTEND_URL:", baseUrl);
// console.log("NEXT_PUBLIC_BACKEND_FULL_URL:", racUrl);
// console.log("NEXT_PUBLIC_COGNITO_REDIRECT_SIGN_OUT:", cognitoLogoutUri);

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
    cognitoAuthConfig: cognitoAuthConfig,
    cognitoClientId: cognitoClientId,
    cognitoDomain: cognitoDomain,
    cognitoLogoutUri: cognitoLogoutUri,
};

export default config;
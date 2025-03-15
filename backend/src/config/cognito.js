// Config file for AWS Cognito
const { CognitoJwtVerifier } = require('aws-jwt-verify');
const { COGNITO_APP_CLIENT_ID, COGNITO_USER_POOL_ID, COGNITO_DOMAIN } = process.env;

// Verifier that expects valid access tokens:
const verifier = CognitoJwtVerifier.create({
  userPoolId: COGNITO_USER_POOL_ID,
  tokenUse: "access",
  clientId: COGNITO_APP_CLIENT_ID,
});

// User pool endpoint URL for the API that can be used with AWS Cognito
// https://docs.aws.amazon.com/cognito/latest/developerguide/federation-endpoints.html
const cognitoOAuthAPI = COGNITO_DOMAIN + "/oauth2";

module.exports = {
  verifier,
  cognitoOAuthAPI
};
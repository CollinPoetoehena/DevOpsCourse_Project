// Main testing file for the backend. For simplicity and time constraints, 
// just a simple test file is created to test DevOps practices and CI/CD pipeline
// Note: this test assumes the service is running in the Docker container when executed

// Configure/load environment variables
require('dotenv').config();
// Library used for testing requests
const request = require('supertest');
// Get environment variables. Use BACKEND_URL instead of requiring app.js, 
// as this will connect to the db, etc., but we just want to test the endpoints
const { API_NAME, API_VERSION, BACKEND_URL } = process.env;

// Successful test
test('adds 1 + 2 to equal 3', () => {
    expect(1+2).toBe(3);
});

// Failed test (can be commented or uncommented to test CI/CD pipeline with testing)
test('adds 3 + 2 to equal 3', () => {
    expect(3+2).toBe(3);
});

// Test welcome message
test('GET /api/v1/', async () => {
    // Make a request to the backend using the backend URL
    const response = await request(BACKEND_URL).get(`${API_VERSION}/`);
    expect(response.status).toBe(200);
    expect(response.body).toBe(`Welcome to ${API_NAME}`);
});

// Test a specific request
test('GET /garages', async () => {
    // Make a request to the backend using the backend URL
    const response = await request(BACKEND_URL).get(`${API_VERSION}/garages`);
    expect(response.status).toBe(200);
});

// Test a request without a token
test('GET /reservations (without token)', async () => {
    // Make a request to the backend using the backend URL
    const response = await request(BACKEND_URL).get(`${API_VERSION}/reservations`);
    expect(response.status).toBe(401);
    expect(response.text).toBe(`A token is required for authentication`);
});
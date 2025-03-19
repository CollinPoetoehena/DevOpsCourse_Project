module.exports = {
    // Force Jest to search from the correct root
    rootDir: ".",
    // Explicitely state the path to the tests from the root of the backend folder
    testMatch: ["**/test/**/*.test.js"],
    globalSetup: './test/setupTests.js',
    globalTeardown: './test/teardownTests.js',
    testEnvironment: 'node',
};
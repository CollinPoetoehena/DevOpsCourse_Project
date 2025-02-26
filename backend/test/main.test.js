// Main testing file for the backend. For simplicity and time constraints, 
// just a simple test file is created to test DevOps practices and CI/CD pipeline

// TODO: add some simple tests here to test the application

// Simple function
const sum = (a, b) => a + b;

// Successful test
test('adds 1 + 2 to equal 3', () => {
    expect(sum(1, 2)).toBe(3);
});

// Failed test
test('adds 3 + 2 to equal 3', () => {
    expect(sum(3, 2)).toBe(3);
});
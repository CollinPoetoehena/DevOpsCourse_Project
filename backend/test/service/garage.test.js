// test/your-backend.test.js
const mongoose = require('mongoose');
const { clearDatabase } = require('../mongo-memory-server');
const { createGarage,
    getAllGarages,
    getGarageById,
    getGarageByUsername,
    updateGarage,
    deleteGarage } = require('../../src/services/garage.service');

describe('Your backend tests', () => {
  beforeEach(async () => {
    await clearDatabase();
  });

  // Your tests go here...
  it('should perform a test', async () => {
    console.log('MONGODB_URI', process.env.MONGODB_URI);
    const allGarages = await getAllGarages();
    expect(allGarages).toHaveLength(0);
    console.log("Get all garages", allGarages);
  });
});
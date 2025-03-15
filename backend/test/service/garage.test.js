const { clearDatabase } = require('../mongo-memory-server');
const { createGarage,
  getAllGarages,
  getGarageById,
  getGarageByUsername,
  updateGarage,
  deleteGarage } = require('../../src/services/garage.service');
const { get } = require('../../src/models/picture.model');

describe('Garage service tests', () => {
  const newGarage = {
    name: 'Garage 1',
    maintainer: 'testMaintainer',
  }
  const newGarage2 = {
    name: 'Garage 2',
    maintainer: 'testMaintainer',
  }
  const updatedGarage = {
    name: 'Updated Garage',
    maintainer: 'testMaintainer',
  }
  const newMaintainer = {
    username: 'testMaintainer',
    password: 'testMaintainerPW',
    role: 'maintainer',
  }
  const updatedMaintainer = {
    username: 'testMaintainer',
    password: 'testMaintainerPW',
    role: 'maintainer',
  }
  const admin = {
    username: 'admin',
    password: 'adminPW',
    role: 'admin',
  }

  it('Function createGarage should create a new garage', async () => {
    expect(await getAllGarages()).toHaveLength(0);
    await createGarage(newGarage, newMaintainer);
    expect(await getAllGarages()).toHaveLength(1);
    await createGarage(newGarage2, newMaintainer);
    expect(await getAllGarages()).toHaveLength(2);
  });

  it('Function getAllGarages should return all garages', async () => {
    expect(await getAllGarages()).toHaveLength(2);
  });

  it('Function getGarageById should return a garage by id', async () => {
    const garages = await getAllGarages();
    const garage = garages[0];
    const foundGarage = await getGarageById(garage._id);

    expect(foundGarage).toBeTruthy();
    expect(foundGarage._id).toEqual(garage._id);
  });

  it('Function getGarageByUsername should return a garage by username', async () => {
    const garages = await getAllGarages();
    const garage = garages[0];
    const foundGarage = await getGarageByUsername(garage.maintainer);

    expect(foundGarage).toBeTruthy();
    expect(foundGarage._id).toEqual(garage._id);
  });

  // it('Function updateGarage should update a garage', async () => {
  //   const garages = await getAllGarages();
  //   const garage = garages[0];
    
  //   expect(await updateGarage(garage._id, updatedGarage, newMaintainer)).toThrow();
  //   // expect(updatedGarageData.name).toEqual(updatedGarage.name);
  // });
});
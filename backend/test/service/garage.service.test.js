const garageService = require("../../src/services/garage.service");
const Garage = require("../../src/models/garage.model");


describe("🛠️ Garage Service Tests", () => {
  let testAdmin;
  let testGarage;
  let testGarage2;

  beforeEach(async () => {
    await Garage.deleteMany();
    testAdmin = { username: "garageMaintainer", role: "maintainer" }
    testGarage = await Garage.create({ name: "Test Garage", maintainer: testAdmin.username });
  });

  test("Should create a garage", async () => {
    testGarage2 = await garageService.createGarage({ name: "Test Garage 2" }, testAdmin);
    expect(testGarage2.name).toBe("Test Garage 2");
  });

  test("Should get all garages", async () => {
    const garages = await garageService.getAllGarages();
    expect(garages.length).toBe(1);
  });

  test("Should update a garage", async () => {
    const testGarageCopy = testGarage;
    testGarageCopy.name = "Updated Garage";
    testAdmin.role = "admin";
    const updatedGarage = await garageService.updateGarage(testGarage._id, testGarageCopy, testAdmin);
    expect(updatedGarage.name).toBe("Updated Garage");
  });

  test("Should delete a garage", async () => {
    await garageService.deleteGarage(testGarage._id, testAdmin);
    const garages = await garageService.getAllGarages();
    expect(garages.length).toBe(0);
  });

  test("Should handle invalid input when creating a garage", async () => {
    await expect(garageService.createGarage({}, testAdmin))
      .rejects.toThrow();
  });
});
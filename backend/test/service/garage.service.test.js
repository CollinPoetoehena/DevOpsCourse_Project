const garageService = require("../../src/services/garage.service");
const Garage = require("../../src/models/garage.model");
const { clearDatabase } = require("../setupTests");

beforeEach(async () => {
  await clearDatabase();
});

describe("🛠️ Garage Service Tests", () => {
  test("Should create a garage", async () => {
    const garage = await garageService.createGarage({ name: "Downtown Garage" }, { username: "admin", role: "admin" });
    expect(garage.name).toBe("Downtown Garage");
  });

  test("Should fetch all garages", async () => {
    await Garage.create({ name: "Garage A" });
    const garages = await garageService.getAllGarages();
    expect(garages.length).toBe(1);
  });

  test("Should update a garage", async () => {
    const garage = await Garage.create({ name: "Garage A" });
    const updatedGarage = await garageService.updateGarage(garage._id, { name: "Garage B" }, { username: "admin", role: "admin" });
    expect(updatedGarage.name).toBe("Garage B");
  });

  test("Should delete a garage", async () => {
    const garage = await Garage.create({ name: "Garage A" });
    await garageService.deleteGarage(garage._id, { username: "admin", role: "admin" });
    const garages = await garageService.getAllGarages();
    expect(garages.length).toBe(0);
  });

  test("Should fail to delete a non-existent garage", async () => {
    await expect(garageService.deleteGarage("nonExistentId", { username: "admin", role: "admin" }))
      .rejects.toThrow("Garage not found");
  });

  test("Should handle invalid input when creating a garage", async () => {
    await expect(garageService.createGarage({}, { username: "admin", role: "admin" }))
      .rejects.toThrow("Invalid input");
  });

  // Add more tests as needed
});
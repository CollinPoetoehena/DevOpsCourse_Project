const vehicleService = require("../../src/services/vehicle.service");
const axios = require("axios");

jest.mock("axios"); // Mock external API requests

describe("Vehicle Service Tests", () => {
  test("Should fetch vehicle makes", async () => {
    axios.get.mockResolvedValue({ data: { Results: [{ MakeName: "Toyota" }, { MakeName: "Honda" }] } });

    const result = await vehicleService.fetchVehicleMakes();
    expect(result).toEqual([{ name: "Honda" }, { name: "Toyota" }]); // Sorted alphabetically
  });

  test("Should fetch models for a given make", async () => {
    axios.get.mockResolvedValue({ data: { Results: [{ Model_Name: "Civic" }, { Model_Name: "Accord" }] } });

    const result = await vehicleService.fetchModelsForMakeName("Honda");
    expect(result).toEqual([{ name: "Accord" }, { name: "Civic" }]);
  });

  test("Should handle API errors gracefully", async () => {
    axios.get.mockRejectedValue(new Error("API Error"));

    await expect(vehicleService.fetchVehicleMakes()).rejects.toThrow("API Error");
  });

  test("Should handle empty results", async () => {
    axios.get.mockResolvedValue({ data: { Results: [] } });

    const result = await vehicleService.fetchVehicleMakes();
    expect(result).toEqual([]);
  });
});
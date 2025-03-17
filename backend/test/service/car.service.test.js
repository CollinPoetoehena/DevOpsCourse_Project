const carService = require("../src/services/car.service");
const Car = require("../src/models/car.model");
const Garage = require("../src/models/garage.model");
const { clearDatabase } = require("./setupTests");

beforeEach(async () => {
  await clearDatabase();
});

describe("🚗 Car Service Tests", () => {
  test("Should add a new car", async () => {
    const garage = await Garage.create({ name: "Test Garage", maintainer: "admin" });

    const car = await carService.addCar({ brand: "Tesla", model: "Model S", garage: garage._id }, { username: "admin", role: "maintainer" });

    expect(car.brand).toBe("Tesla");
    expect(car.model).toBe("Model S");
    expect(car.garage.toString()).toBe(garage._id.toString());
  });

  test("Should get all cars", async () => {
    await Car.create({ brand: "Honda", model: "Civic" });
    const cars = await carService.getAllCars();
    expect(cars.length).toBe(1);
    expect(cars[0].brand).toBe("Honda");
    expect(cars[0].model).toBe("Civic");
  });

  test("Should update a car", async () => {
    const car = await Car.create({ brand: "Honda", model: "Civic" });
    const updatedCar = await carService.updateCar(car._id, { brand: "Toyota", model: "Corolla" }, { username: "admin", role: "maintainer" });
    expect(updatedCar.brand).toBe("Toyota");
    expect(updatedCar.model).toBe("Corolla");
  });

  test("Should delete a car", async () => {
    const car = await Car.create({ brand: "Honda", model: "Civic" });
    await carService.deleteCar(car._id, { username: "admin", role: "maintainer" });
    const cars = await carService.getAllCars();
    expect(cars.length).toBe(0);
  });

  test("Should fail to delete a non-existent car", async () => {
    await expect(carService.deleteCar("nonExistentId", { username: "admin", role: "maintainer" }))
      .rejects.toThrow("Car not found");
  });

  test("Should handle invalid input when adding a car", async () => {
    await expect(carService.addCar({}, { username: "admin", role: "maintainer" }))
      .rejects.toThrow("Invalid input");
  });

  // Add more tests as needed
});
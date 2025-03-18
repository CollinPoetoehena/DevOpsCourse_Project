const carService = require("../../src/services/car.service");
const Garage = require("../../src/models/garage.model");


describe("🚗 Car Service Tests", () => {
  let testGarage;
  let testCar;
  let testCar2;
  let testAdmin = { username: "admin", role: "maintainer" };

  beforeAll(async () => {
    testGarage = await Garage.create({ name: "Test Garage", maintainer: testAdmin.username });

    testCar = await carService.addCar({
      make: "Lamborghini",
      model: "Aventador",
      garage: testGarage._id,
      gear: "Automatic",
      powerHP: 750,
      firstRegistration: 2019,
      fuelType: "Gasoline",
      bodyType: "Coupe",
    }, testAdmin);
  });

  test("Should add a new car", async () => {
    testCar2 = await carService.addCar({
      make: "Ferrari",
      model: "812 Superfast",
      garage: testGarage._id,
      gear: "Automatic",
      powerHP: 800,
      firstRegistration: 2024,
      fuelType: "Gasoline",
      bodyType: "Coupe",
    }, testAdmin);

    expect(testCar2.make).toBe("Ferrari");
    expect(testCar2.model).toBe("812 Superfast");
    expect(testCar2.garage.toString()).toBe(testGarage._id.toString());
  });

  test("Should get all cars", async () => {
    const cars = await carService.getAllCars();

    expect(cars.length).toBe(2);
    expect(cars[0].make).toBe("Ferrari");
    expect(cars[0].model).toBe("812 Superfast");
    expect(cars[1].make).toBe(testCar.make);
    expect(cars[1].model).toBe(testCar.model);
  });

  test("Should update a car", async () => {
    const testCarCopy = testCar;
    testCarCopy.powerHP = 770;
    const updatedCar = await carService.updateCar(testCar._id, testCarCopy, testAdmin);
    expect(updatedCar.powerHP).toBe(770);
  });

  test("Should delete a car", async () => {
    await carService.deleteCar(testCar._id, testAdmin);
    await carService.deleteCar(testCar2._id, testAdmin);
    const cars = await carService.getAllCars();
    expect(cars.length).toBe(0);
  });

  test("Should fail to delete a non-existent car", async () => {
    await expect(carService.deleteCar('67d99feeb65a5424cc50215d', testAdmin))
      .rejects.toThrow("Car not found");
  });

  test("Should handle invalid input when adding a car", async () => {
    await expect(carService.addCar({}, testAdmin))
      .rejects.toThrow();
  });

  // Add more tests as needed
});
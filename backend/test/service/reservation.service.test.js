const reservationService = require("../../src/services/reservation.service");
const Reservation = require("../../src/models/reservation.model");
const Car = require("../../src/models/car.model");
const Garage = require("../../src/models/garage.model");
const carService = require("../../src/services/car.service");


describe("📅 Reservation Service Tests", () => {
  let testGarage;
  let testCar;
  let testAdmin = { username: "admin", role: "maintainer" };
  let testUser = { username: "user", role: "user" };
  let reservation;
  const startDate = new Date("2024-05-01");
  const endDate = new Date("2024-05-10");

  beforeEach(async () => {
    await Car.deleteMany();
    await Garage.deleteMany();
    await Reservation.deleteMany();
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

    reservation = await reservationService.createReservation({ car: testCar._id, startDate: startDate, endDate: endDate }, testUser);
  });


  test("Should create a reservation", async () => {
    expect(reservation.car.toString()).toBe(testCar._id.toString());
    expect(reservation.startDate.toLocaleDateString()).toBe(startDate.toLocaleDateString());
    expect(reservation.endDate.toLocaleDateString()).toBe(endDate.toLocaleDateString());
  });

  test("Should retrieve reservations", async () => {
    const reservations = await reservationService.getReservations(testUser);

    expect(reservations.length).toBe(1);
    expect(reservations[0].car._id.toString()).toBe(testCar._id.toString());
    expect(reservations[0].startDate.toLocaleDateString()).toBe(startDate.toLocaleDateString());
    expect(reservations[0].endDate.toLocaleDateString()).toBe(endDate.toLocaleDateString());
  });

  test("Should update a reservation", async () => {
    const updatedStartDate = new Date("2024-06-05");
    const updatedEndDate = new Date("2024-06-15");
    const updatedReservation = await reservationService.updateReservation(reservation._id, { startDate: updatedStartDate, endDate: updatedEndDate }, testUser);

    expect(updatedReservation.startDate.toLocaleDateString()).toBe(updatedStartDate.toLocaleDateString());
    expect(updatedReservation.endDate.toLocaleDateString()).toBe(updatedEndDate.toLocaleDateString());
  });

  test("Should delete a reservation", async () => {
    await reservationService.deleteReservation(reservation._id, testUser);

    const reservations = await reservationService.getReservations(testUser);
    expect(reservations.length).toBe(0);
  });

  test("Should fail to delete a non-existent reservation", async () => {
    await expect(reservationService.deleteReservation("11a11aaaa11a1111aa11111a", testUser))
      .rejects.toThrow("Reservation not found");
  });

  test("Should handle invalid input when creating a reservation", async () => {
    await expect(reservationService.createReservation({}, testUser))
      .rejects.toThrow();
  });

  // Add more tests as needed
});
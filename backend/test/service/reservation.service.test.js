const reservationService = require("../../src/services/reservation.service");
const Reservation = require("../../src/models/reservation.model");
const Car = require("../../src/models/car.model");
const { clearDatabase } = require("../setupTests");

beforeEach(async () => {
  await clearDatabase();
});

describe("📅 Reservation Service Tests", () => {
  test("Should create a reservation", async () => {
    const car = await Car.create({ brand: "BMW", model: "X5" });

    const reservation = await reservationService.createReservation({ car: car._id, startDate: "2024-05-01", endDate: "2024-05-10" }, { username: "user1", role: "user" });

    expect(reservation.car.toString()).toBe(car._id.toString());
    expect(reservation.startDate).toBe("2024-05-01");
    expect(reservation.endDate).toBe("2024-05-10");
  });

  test("Should retrieve reservations", async () => {
    const car = await Car.create({ brand: "BMW", model: "X5" });
    await Reservation.create({ user: "user1", car: car._id, startDate: "2024-06-01", endDate: "2024-06-10" });

    const reservations = await reservationService.getReservations({ username: "user1", role: "user" });

    expect(reservations.length).toBe(1);
    expect(reservations[0].car.toString()).toBe(car._id.toString());
    expect(reservations[0].startDate).toBe("2024-06-01");
    expect(reservations[0].endDate).toBe("2024-06-10");
  });

  test("Should update a reservation", async () => {
    const car = await Car.create({ brand: "BMW", model: "X5" });
    const reservation = await Reservation.create({ user: "user1", car: car._id, startDate: "2024-06-01", endDate: "2024-06-10" });

    const updatedReservation = await reservationService.updateReservation(reservation._id, { startDate: "2024-06-05", endDate: "2024-06-15" }, { username: "user1", role: "user" });

    expect(updatedReservation.startDate).toBe("2024-06-05");
    expect(updatedReservation.endDate).toBe("2024-06-15");
  });

  test("Should delete a reservation", async () => {
    const car = await Car.create({ brand: "BMW", model: "X5" });
    const reservation = await Reservation.create({ user: "user1", car: car._id, startDate: "2024-06-01", endDate: "2024-06-10" });

    await reservationService.deleteReservation(reservation._id, { username: "user1", role: "user" });

    const reservations = await reservationService.getReservations({ username: "user1", role: "user" });
    expect(reservations.length).toBe(0);
  });

  test("Should fail to delete a non-existent reservation", async () => {
    await expect(reservationService.deleteReservation("nonExistentId", { username: "user1", role: "user" }))
      .rejects.toThrow("Reservation not found");
  });

  test("Should handle invalid input when creating a reservation", async () => {
    await expect(reservationService.createReservation({}, { username: "user1", role: "user" }))
      .rejects.toThrow("Invalid input");
  });

  // Add more tests as needed
});
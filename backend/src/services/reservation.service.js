const Reservation = require('../models/reservation.model');
const Car = require('../models/car.model');
const Garage = require('../models/garage.model');

async function createReservation(reservationData, user) {
    const newReservation = await Reservation.create({
        user: user.username,
        car: reservationData.car,
        startDate: reservationData.startDate,
        endDate: reservationData.endDate,
    });
    // Immediately update the associated car's status to "reserved"
    await Car.findByIdAndUpdate(reservationData.car, { status: 'reserved' });
    return newReservation;
}

async function getReservations(user) {
    let reservations;

    if (user.role === 'maintainer') {
        // Find the maintainer's garage
        const garage = await Garage.findOne({ maintainer: user.username });

        if (!garage) {
            throw new Error('You do not own a garage.');
        }

        // Get all reservations where the car belongs to the maintainer's garage
        reservations = await Reservation.find()
            .populate({
                path: 'car',
                match: { garage: garage._id }, // Only cars from the maintainer's garage
                populate: { path: 'garage', select: 'name' }
            })
            .populate('user', 'username email');

        // Filter out reservations that have no valid car (i.e., not in their garage)
        reservations = reservations.filter(reservation => reservation.car);
    } 
    else if (user.role === 'admin') {
        // Admin gets all reservations from all garages
        reservations = await Reservation.find()
            .populate({
                path: 'car',
                populate: { path: 'garage', select: 'name' }
            })
            .populate('user', 'username email');
    } 
    else {
        // Regular user gets only their own reservations
        reservations = await Reservation.find({ user: user.username })
            .populate({
                path: 'car',
                populate: { path: 'garage', select: 'name' }
            });
    }
    return reservations;
}

async function getReservationById(reservationId, user) {
    const reservation = await Reservation.findById(reservationId)
        .populate('user', 'username email')
        .populate({
            path: 'car',
            populate: {
                path: 'garage',
                select: 'name maintainer'
            }
        });

    if (!reservation) {
        throw new Error('Reservation not found');
    }

    // Check if the user is authorized to access this reservation
    if (user.role !== 'maintainer' && user.role !== 'admin' && reservation.user !== user.username) {
        throw new Error('Unauthorized access');
    }

    return reservation;
}


async function updateReservation(reservationId, updateData, user) {
    const reservation = await Reservation.findById(reservationId);
    if (!reservation) {
        throw new Error('Reservation not found');
    }
    if (user.role !== 'maintainer' && reservation.user !== user.username) {
        throw new Error('Unauthorized to update this reservation');
    }
    const updatedReservation = await Reservation.findByIdAndUpdate(reservationId, updateData, { new: true });
    // If the reservation is cancelled, update the associated car's status to "available"
    if (updateData.status && updateData.status === 'cancelled') {
        await Car.findByIdAndUpdate(reservation.car, { status: 'available' });
    }
    return updatedReservation;
}

async function deleteReservation(reservationId, user) {
    const reservation = await Reservation.findById(reservationId);
    if (!reservation) {
        throw new Error('Reservation not found');
    }
    if (user.role !== 'maintainer' && reservation.user !== user.username) {
        throw new Error('Unauthorized to delete this reservation');
    }
    await Reservation.findByIdAndDelete(reservationId);
}

async function requestReturn(reservationId, user) {    
    const reservation = await Reservation.findById(reservationId);
    if (!reservation) {
        throw new Error('Reservation not found');
    }
    if (user.role !== 'maintainer' && reservation.user !== user.username) {
        throw new Error('Unauthorized to request return');
    }
    reservation.requestReturn();
    await reservation.save();
    return reservation;
}

async function approveReturn(reservationId, user, pictures) {
    const reservation = await Reservation.findById(reservationId);
    if (!reservation) {
        throw new Error('Reservation not found');
    }
    if (user.role !== 'maintainer') {
        throw new Error('Unauthorized to approve return');
    }
    reservation.approveReturn();
    if (pictures && Array.isArray(pictures)) {
        pictures.forEach(url => {
            reservation.pictures.push({ url });
        });
    }
    await reservation.save();
    return reservation;
}

async function rejectReturn(reservationId, user, pictures) {
    const reservation = await Reservation.findById(reservationId);
    if (!reservation) {
        throw new Error('Reservation not found');
    }
    if (user.role !== 'maintainer') {
        throw new Error('Unauthorized to reject return');
    }
    reservation.rejectReturn();
    if (pictures && Array.isArray(pictures)) {
        pictures.forEach(url => {
            reservation.pictures.push({ url });
        });
    }
    await reservation.save();
    return reservation;
}

module.exports = {
    createReservation,
    getReservations,
    getReservationById,
    updateReservation,
    deleteReservation,
    requestReturn,
    approveReturn,
    rejectReturn,
};

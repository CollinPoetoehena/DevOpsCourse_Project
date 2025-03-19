const Garage = require('../models/garage.model');
const Car = require('../models/car.model');
// const User = require('../models/user.model');

async function createGarage(garageData, creator) {
    // Only a maintainer can create garages
    if (creator.role !== 'maintainer') {
        throw new Error('Unauthorized to create garages');
    }
    
    // Automatically assign the creator as the maintainer
    garageData.maintainer = creator.username;

    // Create the garage
    const newGarage = await Garage.create(garageData);

    return newGarage;
}

async function getAllGarages() {
    const garages = await Garage.find().populate('maintainer', 'username email');
    return garages;
}

async function getGarageById(garageId) {
    // Get the garage and populate the maintainer field
    const garage = await Garage.findById(garageId)
        .populate('maintainer', 'username email');

    if (!garage) {
        throw new Error('Garage not found');
    }

    // Get all cars that belong to this garage
    const cars = await Car.find({ garage: garageId }).select('make model year mileage status image');

    // Attach the list of cars to the garage object
    const garageObject = garage.toObject();
    garageObject.cars = cars;

    return garageObject;
}

async function getGarageByUsername(username) {
    const garage = await Garage.findOne({ maintainer: username });
    return garage;
}

async function updateGarage(garageId, updateData, user) {
    const garage = await Garage.findById(garageId);
    if (!garage) {
        throw new Error('Garage not found');
    }
    // Only the assigned maintainer or an admin can update
    if (user.role !== 'admin' && garage.maintainer !== user.username) {
        throw new Error('Unauthorized to update this garage');
    }
    const updatedGarage = await Garage.findByIdAndUpdate(garageId, updateData, { new: true });
    return updatedGarage;
}

async function deleteGarage(garageId) {
    const garage = await Garage.findByIdAndDelete(garageId);
    return garage;
}

module.exports = {
    createGarage,
    getAllGarages,
    getGarageById,
    getGarageByUsername,
    updateGarage,
    deleteGarage
};

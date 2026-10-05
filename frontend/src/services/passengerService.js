import api from './api';

// ============================================================
// PASSENGER SERVICE
// Backend Controller: PassengerController
// Base URL: /passengers
// ============================================================

// 1. Get all passengers
export const getAllPassengers = () =>
    api.get('/passengers');

// 2. Get passenger by ID
export const getPassengerById = (id) =>
    api.get(`/passengers/${id}`);

// 3. Get passengers by contact
export const getPassengersByContact = (contact) =>
    api.get('/passengers/contact', {
        params: { contact }
    });

// 4. Get passengers by gender
export const getPassengersByGender = (gender) =>
    api.get('/passengers/gender', {
        params: { gender }
    });

// 5. Update passenger
export const updatePassenger = (id, passenger) =>
    api.put(`/passengers/${id}`, passenger);

// 6. Remove ONE passenger from booking
export const removePassengerFromBooking = (passengerId) =>
    api.delete(`/passengers/${passengerId}/booking`);

// 7. Get passengers by flight
export const getPassengersByFlight = (flightId) =>
    api.get(`/passengers/flight/${flightId}`);
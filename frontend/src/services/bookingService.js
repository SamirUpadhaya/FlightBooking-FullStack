import api from './api';

// ============================================================
// BOOKING SERVICE
// Backend Controller: BookingController
// Base URL: /bookings
// ============================================================

// 1. Create booking
export const createBooking = (flightId, booking) => {
    return api.post(`/bookings/flight/${flightId}`, booking);
};


// 2. Get all bookings
export const getAllBookings = () => {
    return api.get('/bookings');
};


// 3. Get booking by ID
export const getBookingById = (id) => {
    return api.get(`/bookings/${id}`);
};


// 4. Get bookings by flight
export const getBookingsByFlight = (flightId) => {
    return api.get(`/bookings/flight/${flightId}`);
};


// 5. Get bookings by date
export const getBookingsByDate = (date) => {
    return api.get('/bookings/date', {
        params: {
            date
        }
    });
};


// 6. Get bookings by status
export const getBookingsByStatus = (status) => {
    return api.get('/bookings/status', {
        params: {
            status
        }
    });
};


// 7. Get passengers of a booking
export const getPassengersByBookingId = (bookingId) => {
    return api.get(`/bookings/${bookingId}/passengers`);
};


// 8. Get payment of a booking
export const getPaymentByBookingId = (bookingId) => {
    return api.get(`/bookings/${bookingId}/payment`);
};


// 9. Update booking status
export const updateBookingStatus = (bookingId, status) => {
    return api.put(`/bookings/${bookingId}/status`, null, {
        params: {
            status
        }
    });
};


// 10. Delete/cancel booking
export const cancelBooking = (bookingId) => {
    return api.delete(`/bookings/${bookingId}`);
};


// 11. Get booking history by passenger contact
export const getBookingHistoryByPassenger = (contact) => {
    return api.get('/bookings/history/passenger', {
        params: {
            contact
        }
    });
};
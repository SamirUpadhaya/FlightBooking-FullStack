import api from './api';

// ============================================================
// FLIGHT SERVICE
// Backend Controller: FlightController
// Base URL: /flights
// ============================================================

// 1. Get all flights
export const getAllFlights = () => {
    return api.get('/flights');
};


// 2. Get flight by ID
export const getFlightById = (id) => {
    return api.get(`/flights/${id}`);
};


// 3. Search flights by source, destination and date
export const searchFlights = (source, destination, date) => {
    return api.get('/flights/search', {
        params: {
            source,
            destination,
            date
        }
    });
};


// 4. Get flights by airline
export const getFlightsByAirline = (airline) => {
    return api.get('/flights/airline', {
        params: {
            airline
        }
    });
};


// 5. Create flight
// Admin API
export const createFlight = (flight) => {
    return api.post('/flights', flight);
};


// 6. Update flight
// Admin API
export const updateFlight = (id, flight) => {
    return api.put(`/flights/${id}`, flight);
};


// 7. Delete flight
// Admin API
export const deleteFlight = (id) => {
    return api.delete(`/flights/${id}`);
};


// 8. Get flights by price range
export const getFlightsByPriceRange = (minPrice, maxPrice) => {
    return api.get('/flights/price-range', {
        params: {
            minPrice,
            maxPrice
        }
    });
};


// 9. Get cheapest flight
export const getCheapestFlight = (source, destination) => {
    return api.get('/flights/cheapest', {
        params: {
            source,
            destination
        }
    });
};


// 10. Get flights by available seats
export const getFlightsByAvailableSeats = (seats) => {
    return api.get('/flights/available-seats', {
        params: {
            seats
        }
    });
};


// 11. Get flights with pagination and sorting
export const getFlightsWithPagination = (
    page = 0,
    size = 5,
    sortBy = 'flightId',
    direction = 'asc'
) => {
    return api.get('/flights/page', {
        params: {
            page,
            size,
            sortBy,
            direction
        }
    });
};
# SkyBook Frontend

React + Vite frontend mapped to the supplied Spring Boot FlightBookingApplication backend.

## Backend contract used
- Flights: 11 APIs
- Bookings: 11 APIs
- Passengers: 7 APIs
- Payments: 6 APIs
- Total: 35 APIs

The frontend uses Vite's development proxy, so no backend CORS change is required for local development.

## Run
1. Make sure the Spring Boot backend is running on `http://localhost:8080`.
2. In this folder run `npm install`.
3. Run `npm run dev`.
4. Open `http://localhost:5173`.

The **Admin** page provides a UI for the backend query/update APIs that are not part of the normal customer booking flow.

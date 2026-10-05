# ✈️ Flight Booking System

A RESTful Flight Booking Management System developed using Spring Boot,
Spring Data JPA, Hibernate, and PostgreSQL.

The application manages flights, bookings, passengers, and payments while
implementing business rules such as seat availability, payment calculation,
booking cancellation, refunds, and passenger management.

## 🛠 Technologies Used

- Java
- Spring Boot
- Spring Data JPA
- Hibernate
- PostgreSQL
- Maven
- Lombok
- Postman
- Eclipse IDE

## 📂 Project Architecture

The project follows a layered architecture:

- Controller Layer - Handles HTTP requests and responses
- Service Layer - Contains business logic
- Repository Layer - Handles database operations using Spring Data JPA
- Entity Layer - Represents database tables
- DTO Layer - Provides structured API responses
- Exception Layer - Handles custom exceptions globally
- Enum Layer - Stores predefined application constants

## 📦 Main Modules

### Flight Management
- Add a flight
- Get all flights
- Get flight by ID
- Search flights by source, destination, and date
- Search flights by airline
- Update flight
- Delete flight
- Search flights by price range
- Find cheapest flight
- Search flights by available seats
- Pagination and sorting

### Booking Management
- Create a booking
- Get all bookings
- Get booking by ID
- Get bookings by flight
- Get bookings by date
- Get bookings by status
- Get passengers of a booking
- Get payment details of a booking
- Update booking status
- Cancel booking
- Get booking history by passenger contact

### Passenger Management
- Get all passengers
- Get passenger by ID
- Get passengers by contact
- Get passengers by gender
- Update passenger
- Remove passenger from booking
- Get passengers by flight

### Payment Management
- Get all payments
- Get payment by ID
- Update payment status
- Get payments by status
- Get payments by payment mode
- Get total successful payment amount for a flight

## 🔗 Entity Relationships

Flight → Booking  
One Flight can have many Bookings.

Booking → Passenger  
One Booking can have many Passengers.

Booking → Payment  
One Booking has one Payment.

## 💼 Business Rules

- A booking requires a valid flight, passengers, and payment information.
- Passenger contact numbers must contain exactly 10 digits and be unique.
- Available seats are reduced when a booking is confirmed.
- Payment amount is calculated automatically based on flight price and
  number of passengers.
- Cancelling a booking restores the booked seats.
- Cancelling a booking changes the payment status to REFUNDED.
- An already cancelled booking cannot be cancelled again.
- Removing a passenger restores one seat and recalculates the payment amount.
- If no passengers remain in a booking, the booking is automatically cancelled.
- A flight cannot be deleted if bookings are associated with it.

## ⚙️ Database Configuration

The application uses PostgreSQL.

Create a database:

FlightDatabase

The application reads database credentials from environment variables:

DB_USERNAME
DB_PASSWORD

Example application.properties configuration:

spring.datasource.url=jdbc:postgresql://localhost:5432/FlightDatabase
spring.datasource.username=${DB_USERNAME}
spring.datasource.password=${DB_PASSWORD}

spring.jpa.hibernate.ddl-auto=update

## ▶️ Running the Application

1. Clone the repository.
2. Create the PostgreSQL database `FlightDatabase`.
3. Configure `DB_USERNAME` and `DB_PASSWORD`.
4. Run `FlightBookingApplication`.
5. Test REST APIs using Postman.

## 📌 API Response Structure

The application uses a common response structure:

{
  "statusCode": 200,
  "message": "Operation successful",
  "data": {}
}

## ⚠️ Exception Handling

The project uses custom exceptions and global exception handling using
`@RestControllerAdvice`.

Examples include:

- FlightNotFoundException
- BookingNotFoundException
- PassengerNotFoundException
- PaymentNotFoundException
- InsufficientSeatsException
- DuplicateContactNumberException
- InvalidContactNumberException
- BookingAlreadyCancelledException

## 👨‍💻 Author

Samir Upadhaya
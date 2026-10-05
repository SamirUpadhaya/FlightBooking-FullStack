# ✈️ SkyBook – Flight Booking Full Stack Application

SkyBook is a full-stack flight booking application built with **Spring Boot + Java + PostgreSQL** for the backend and **React + Vite + Axios** for the frontend.

The application supports flight search, booking creation, passenger management, booking history, cancellation, payment information, and an admin dashboard for flight and operational management.

---

## 📌 Features

- Search flights by source, destination and date
- View flight details and available seats
- Filter flights by airline, price and available seats
- Find the cheapest flight for a route
- Create and manage bookings
- Add and manage passengers
- Search booking by Booking ID or passenger contact
- View booking passengers and payment information
- Update booking status
- Cancel bookings
- Admin dashboard for flight management
- Create, update and delete flights
- View bookings, passengers and payments from the admin dashboard
- Flight pagination and sorting
- React frontend connected to Spring Boot REST APIs

---

## 🏗️ Project Structure

```text
FlightBooking-FullStack/
│
├── FlightBookingApplication/       # Spring Boot Backend
│   ├── .mvn/
│   ├── src/
│   ├── target/                     # Generated; do not commit
│   ├── pom.xml
│   ├── mvnw
│   ├── mvnw.cmd
│   ├── .gitignore
│   └── README.md
│
├── frontend/                       # React + Vite Frontend
│   ├── src/
│   ├── node_modules/               # Generated; do not commit
│   ├── index.html
│   ├── package.json
│   ├── package-lock.json
│   ├── vite.config.js
│   ├── .gitignore
│   └── README.md
│
└── .gitignore                      # Root Git configuration
```

---

## 🛠️ Technology Stack

### Backend

- Java
- Spring Boot
- Spring Web / REST APIs
- Spring Data JPA
- Hibernate
- PostgreSQL
- Maven

### Frontend

- React
- JavaScript / JSX
- Vite
- Axios
- React Router
- HTML5 / CSS3

### Tools

- Eclipse – Backend development
- VS Code – Frontend development
- PostgreSQL / pgAdmin
- Postman
- Git / GitHub

---

# 🔌 Application Ports

| Application | URL |
|---|---|
| React Frontend | `http://localhost:5173` |
| Spring Boot Backend | `http://localhost:8080` |
| Flight API | `http://localhost:8080/flights` |

The frontend communicates with the backend through HTTP/REST APIs using Axios.

```text
React (5173)
     |
     | Axios / HTTP
     v
Spring Boot (8080)
     |
     v
PostgreSQL
```

The frontend never connects directly to PostgreSQL.

---

# 🗄️ Database Configuration

The backend uses PostgreSQL. Configure the database in:

```text
FlightBookingApplication/src/main/resources/application.properties
```

Typical configuration:

```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/<database_name>
spring.datasource.username=<postgres_username>
spring.datasource.password=<postgres_password>

spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.format_sql=true

server.port=8080
```

Replace the placeholders with your local PostgreSQL values.

**Never commit real passwords, API keys or other secrets to GitHub.**

---

# 📡 REST API Documentation

The frontend service layer currently uses the following backend APIs.

## ✈️ Flight APIs

Base path: `/flights`

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/flights` | Get all flights |
| GET | `/flights/{id}` | Get flight by ID |
| GET | `/flights/search` | Search by source, destination and date |
| GET | `/flights/airline` | Get flights by airline |
| POST | `/flights` | Create a flight (Admin) |
| PUT | `/flights/{id}` | Update a flight (Admin) |
| DELETE | `/flights/{id}` | Delete a flight (Admin) |
| GET | `/flights/price-range` | Get flights within a price range |
| GET | `/flights/cheapest` | Find cheapest flight for a route |
| GET | `/flights/available-seats` | Find flights with required seats |
| GET | `/flights/page` | Get paginated/sorted flights |

### Examples

```text
GET /flights
```

```text
GET /flights/search?source=Delhi&destination=Bengaluru&date=2026-10-04
```

```text
GET /flights/page?page=0&size=5&sortBy=flightId&direction=asc
```

---

## 🧾 Booking APIs

Base path: `/bookings`

| Method | Endpoint | Purpose |
|---|---|---|
| POST | `/bookings/flight/{flightId}` | Create booking for a flight |
| GET | `/bookings` | Get all bookings |
| GET | `/bookings/{id}` | Get booking by ID |
| GET | `/bookings/flight/{flightId}` | Get bookings for a flight |
| GET | `/bookings/date` | Get bookings by date |
| GET | `/bookings/status` | Get bookings by status |
| GET | `/bookings/{bookingId}/passengers` | Get passengers of a booking |
| GET | `/bookings/{bookingId}/payment` | Get payment of a booking |
| PUT | `/bookings/{bookingId}/status` | Update booking status |
| DELETE | `/bookings/{bookingId}` | Cancel/delete booking |
| GET | `/bookings/history/passenger` | Booking history by passenger contact |

Examples:

```text
POST /bookings/flight/20
```

```text
GET /bookings/20
```

```text
GET /bookings/history/passenger?contact=9876500001
```

---

## 👤 Passenger APIs

Base path: `/passengers`

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/passengers` | Get all passengers |
| GET | `/passengers/{id}` | Get passenger by ID |
| GET | `/passengers/contact` | Find passengers by contact |
| GET | `/passengers/gender` | Find passengers by gender |
| PUT | `/passengers/{id}` | Update passenger |
| DELETE | `/passengers/{passengerId}/booking` | Remove passenger from booking |
| GET | `/passengers/flight/{flightId}` | Get passengers for a flight |

Example:

```text
GET /passengers/contact?contact=9876500001
```

---

## 💳 Payment Information

Payment information associated with a booking can be retrieved through:

```text
GET /bookings/{bookingId}/payment
```

Example:

```text
GET /bookings/20/payment
```

Additional payment-controller endpoints, if present in the backend, should be added here from the corresponding controller/service definitions.

---

# 🖥️ Frontend Structure

The React application is inside `frontend/`.

```text
frontend/
├── src/
│   ├── components/
│   ├── pages/
│   ├── services/
│   ├── context/
│   └── ...
├── index.html
├── package.json
├── package-lock.json
└── vite.config.js
```

The service layer keeps API calls separate from UI components. Examples include:

```text
src/services/api.js
src/services/flightService.js
src/services/bookingService.js
src/services/passengerService.js
```

Example service call:

```javascript
export const getAllFlights = () => {
    return api.get('/flights');
};
```

---

# 👨‍💼 Admin Dashboard

The application contains an Admin dashboard for operational management.

### Flights

- Create flight
- View flights
- Update flight
- Delete flight
- Search/filter flight information
- Pagination and sorting

### Bookings

- View bookings
- View booking details
- View booking passengers
- View booking payment information
- Update booking status

### Passengers

- View passenger information
- View passengers by flight
- Manage passenger information

### Payments

- View payment information associated with bookings

---

# 🚀 How to Run the Project

## Prerequisites

Install:

- Java JDK
- Maven
- PostgreSQL
- Node.js and npm
- Git

Check installation:

```bash
java -version
mvn -version
node -v
npm -v
git --version
```

---

## 1. Start PostgreSQL

Make sure PostgreSQL is running and the configured database exists.

---

## 2. Start the Backend

Open a terminal in:

```text
FlightBooking-FullStack/FlightBookingApplication
```

Run:

```bash
mvn spring-boot:run
```

Or run the main Spring Boot application from Eclipse.

Backend:

```text
http://localhost:8080
```

Test an API:

```text
http://localhost:8080/flights
```

---

## 3. Start the Frontend

Open a second terminal in:

```text
FlightBooking-FullStack/frontend
```

Install dependencies if required:

```bash
npm install
```

Start Vite:

```bash
npm run dev
```

Frontend:

```text
http://localhost:5173
```

---

# 🔄 Full Application Flow

```text
User opens React application
          ↓
React component/page
          ↓
Axios service
          ↓
Spring Boot REST Controller
          ↓
Service Layer
          ↓
JPA Repository
          ↓
PostgreSQL
          ↓
Response returned to React
          ↓
UI updated
```

For example, flight search works as:

```text
Search form
   ↓
searchFlights(source, destination, date)
   ↓
GET /flights/search
   ↓
FlightController
   ↓
FlightService
   ↓
FlightRepository
   ↓
PostgreSQL
   ↓
Flight JSON response
   ↓
React flight cards/table
```

---

# 🌐 CORS

During local development the applications run on different ports:

```text
Frontend: http://localhost:5173
Backend:  http://localhost:8080
```

The backend must allow the frontend origin if CORS is configured restrictively. If the browser shows a CORS error, check the Spring Boot CORS configuration and allow:

```text
http://localhost:5173
```

---

# 🧪 Testing

Use Postman to test backend APIs independently before testing the React UI.

Example:

```text
GET http://localhost:8080/flights
```

Then test the same functionality through:

```text
http://localhost:5173
```

This helps identify whether an issue is in the backend API or frontend integration.

---

# 📦 GitHub Repository

The recommended repository structure is:

```text
FlightBooking-FullStack/
├── FlightBookingApplication/
├── frontend/
└── README.md
```

The root `README.md` documents the complete full-stack project, while the individual backend and frontend README files can contain technology-specific instructions.

Do not commit generated folders:

```text
frontend/node_modules/
FlightBookingApplication/target/
```

They are recreated using `npm install` and Maven.

---

# 🔐 Security

Never push the following to GitHub:

- Database passwords
- API keys
- Access tokens
- Private credentials
- Production secrets

Use environment variables or local configuration for sensitive values.

---

# 🧑‍💻 Development Workflow

```text
1. Start PostgreSQL
2. Start Spring Boot backend on port 8080
3. Verify REST APIs
4. Start React frontend on port 5173
5. Test user booking flow
6. Test Admin dashboard
7. Commit changes with Git
8. Push to GitHub
```

---

# 📊 Project Highlights

This project demonstrates practical experience with:

- Java and Spring Boot
- REST API development
- Spring Data JPA and Hibernate
- PostgreSQL integration
- React and JSX
- Axios API integration
- CRUD operations
- Search and filtering
- Pagination and sorting
- Flight booking workflow
- Passenger management
- Booking and payment information
- Admin dashboard
- Frontend/backend integration
- Git and GitHub

---

## 📄 License

This project is intended for learning, portfolio and demonstration purposes.

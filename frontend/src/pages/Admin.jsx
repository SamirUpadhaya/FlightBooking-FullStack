import { useEffect, useState } from "react";

import Alert from "../components/Alert";

import {
    errorMessage,
    formatDateTime,
    money,
    unwrap
} from "../utils";

import * as F from "../services/flightService";
import * as B from "../services/bookingService";
import * as P from "../services/passengerService";
import * as Pay from "../services/paymentService";


// ============================================================
// DEFAULT FLIGHT FORM
// ============================================================

const blankFlight = {
    airline: "",
    source: "",
    destination: "",
    departureDateTime: "",
    arrivalDateTime: "",
    totalSeats: "",
    availableSeats: "",
    price: ""
};


// ============================================================
// ADMIN TABS
// ============================================================

const tabs = [
    "Flights",
    "Bookings",
    "Passengers",
    "Payments"
];


// ============================================================
// MAIN ADMIN COMPONENT
// ============================================================

export default function Admin() {

    const [tab, setTab] = useState("Flights");

    const [error, setError] = useState("");
    const [message, setMessage] = useState("");
    const [busy, setBusy] = useState(false);

    const [flights, setFlights] = useState([]);
    const [bookings, setBookings] = useState([]);
    const [passengers, setPassengers] = useState([]);
    const [payments, setPayments] = useState([]);

    const [flightForm, setFlightForm] = useState(blankFlight);

    const [editingFlight, setEditingFlight] = useState(null);


    // ========================================================
    // COMMON API RUNNER
    // ========================================================

    const run = async (
        apiFunction,
        successMessage = "Operation successful"
    ) => {

        setBusy(true);
        setError("");
        setMessage("");

        try {

            const response = await apiFunction();

            const data = unwrap(response);

            setMessage(successMessage);

            return data;

        } catch (error) {

            console.error(error);

            setError(errorMessage(error));

            return null;

        } finally {

            setBusy(false);

        }
    };


    // ========================================================
    // LOAD FLIGHTS
    // ========================================================

    const loadFlights = async () => {

        const data = await run(
            F.getAllFlights
        );

        setFlights(
            Array.isArray(data)
                ? data
                : []
        );
    };


    // ========================================================
    // LOAD BOOKINGS
    // ========================================================

    const loadBookings = async () => {

        const data = await run(
            B.getAllBookings
        );

        setBookings(
            Array.isArray(data)
                ? data
                : []
        );
    };


    // ========================================================
    // LOAD PASSENGERS
    // ========================================================

    const loadPassengers = async () => {

        const data = await run(
            P.getAllPassengers
        );

        setPassengers(
            Array.isArray(data)
                ? data
                : []
        );
    };


    // ========================================================
    // LOAD PAYMENTS
    // ========================================================

    const loadPayments = async () => {

        const data = await run(
            Pay.getAllPayments
        );

        setPayments(
            Array.isArray(data)
                ? data
                : []
        );
    };


    // ========================================================
    // LOAD DATA WHEN TAB CHANGES
    // ========================================================

    useEffect(() => {

        setError("");
        setMessage("");

        if (tab === "Flights") {
            loadFlights();
        }

        if (tab === "Bookings") {
            loadBookings();
        }

        if (tab === "Passengers") {
            loadPassengers();
        }

        if (tab === "Payments") {
            loadPayments();
        }

    }, [tab]);


    // ========================================================
    // RENDER MAIN ADMIN PAGE
    // ========================================================

    return (

        <main className="page">

            {/* =================================================
                HEADER
            ================================================= */}

            <div className="admin-head">

                <div>

                    <span className="eyebrow">
                        SKYBOOK ADMIN
                    </span>

                    <h1>
                        Operations Dashboard
                    </h1>

                    <p>
                        Manage flights, bookings, passengers
                        and payments from one place.
                    </p>

                </div>

                <span className="api-count">
                    Complete Flight Management
                </span>

            </div>


            {/* =================================================
                TABS
            ================================================= */}

            <div className="tabs">

                {tabs.map((item) => (

                    <button
                        key={item}
                        className={
                            tab === item
                                ? "tab active"
                                : "tab"
                        }
                        onClick={() => {

                            setTab(item);

                            setError("");
                            setMessage("");

                        }}
                    >
                        {item}
                    </button>

                ))}

            </div>


            {/* =================================================
                ALERTS
            ================================================= */}

            <Alert type="success">
                {message}
            </Alert>

            <Alert>
                {error}
            </Alert>


            {/* =================================================
                FLIGHTS
            ================================================= */}

            {tab === "Flights" && (

                <FlightsAdmin
                    flights={flights}
                    flightForm={flightForm}
                    setFlightForm={setFlightForm}

                    editingFlight={editingFlight}
                    setEditingFlight={setEditingFlight}

                    loadFlights={loadFlights}
                    run={run}
                    busy={busy}
                />

            )}


            {/* =================================================
                BOOKINGS
            ================================================= */}

            {tab === "Bookings" && (

                <BookingsAdmin
                    bookings={bookings}
                    loadBookings={loadBookings}
                    run={run}
                    busy={busy}
                />

            )}


            {/* =================================================
                PASSENGERS
            ================================================= */}

            {tab === "Passengers" && (

                <PassengersAdmin
                    passengers={passengers}
                    loadPassengers={loadPassengers}
                    run={run}
                    busy={busy}
                />

            )}


            {/* =================================================
                PAYMENTS
            ================================================= */}

            {tab === "Payments" && (

                <PaymentsAdmin
                    payments={payments}
                    loadPayments={loadPayments}
                    run={run}
                    busy={busy}
                />

            )}

        </main>
    );
}


// ################################################################
// FLIGHTS ADMIN
// ################################################################

function FlightsAdmin({
    flights,
    flightForm,
    setFlightForm,
    editingFlight,
    setEditingFlight,
    loadFlights,
    run,
    busy
}) {

    const [tool, setTool] = useState("all");

    const [values, setValues] = useState({

        id: "",

        airline: "",

        source: "",

        destination: "",

        date: "",

        minPrice: "",

        maxPrice: "",

        seats: "",

        page: 0,

        size: 5,

        sortBy: "flightId",

        direction: "asc"

    });

    const [result, setResult] = useState([]);


    // ============================================================
    // THIS IS THE IMPORTANT FIX
    // ============================================================

    const handleFlightChange = (e) => {

        const {
            name,
            value
        } = e.target;

        setFlightForm((prev) => ({

            ...prev,

            [name]: value

        }));
    };


    // ============================================================
    // UPDATE SEARCH TOOL VALUE
    // ============================================================

    const updateValue = (name, value) => {

        setValues((prev) => ({

            ...prev,

            [name]: value

        }));
    };


    // ============================================================
    // CREATE / UPDATE FLIGHT
    // ============================================================

    const saveFlight = async (event) => {

        event.preventDefault();

        const flight = {

            airline: flightForm.airline,

            source: flightForm.source,

            destination: flightForm.destination,

            departureDateTime:
                flightForm.departureDateTime,

            arrivalDateTime:
                flightForm.arrivalDateTime,

            totalSeats:
                Number(flightForm.totalSeats),

            availableSeats:
                Number(flightForm.availableSeats),

            price:
                Number(flightForm.price)

        };


        let result;


        // UPDATE
        if (editingFlight) {

            result = await run(

                () =>
                    F.updateFlight(
                        editingFlight,
                        flight
                    ),

                "Flight updated successfully"

            );

        }

        // CREATE
        else {

            result = await run(

                () =>
                    F.createFlight(flight),

                "Flight created successfully"

            );

        }


        if (result !== null) {

            setEditingFlight(null);

            setFlightForm({
                ...blankFlight
            });

            await loadFlights();

        }

    };


    // ============================================================
    // EDIT FLIGHT
    // ============================================================

    const editFlight = (flight) => {

        setEditingFlight(
            flight.flightId
        );

        setFlightForm({

            airline:
                flight.airline || "",

            source:
                flight.source || "",

            destination:
                flight.destination || "",

            departureDateTime:
                flight.departureDateTime
                    ? flight.departureDateTime.slice(0, 16)
                    : "",

            arrivalDateTime:
                flight.arrivalDateTime
                    ? flight.arrivalDateTime.slice(0, 16)
                    : "",

            totalSeats:
                flight.totalSeats ?? "",

            availableSeats:
                flight.availableSeats ?? "",

            price:
                flight.price ?? ""

        });


        window.scrollTo({

            top: 0,

            behavior: "smooth"

        });

    };


    // ============================================================
    // CANCEL EDIT
    // ============================================================

    const cancelFlightEdit = () => {

        setEditingFlight(null);

        setFlightForm({
            ...blankFlight
        });

    };


    // ============================================================
    // FLIGHT SEARCH / API TOOLS
    // ============================================================

    const runFlightTool = async () => {

        setResult([]);

        try {

            let data;


            // GET ALL
            if (tool === "all") {

                data = unwrap(
                    await F.getAllFlights()
                );

            }


            // GET BY ID
            else if (tool === "id") {

                data = unwrap(
                    await F.getFlightById(
                        values.id
                    )
                );

            }


            // SEARCH
            else if (tool === "search") {

                data = unwrap(
                    await F.searchFlights(
                        values.source,
                        values.destination,
                        values.date
                    )
                );

            }


            // AIRLINE
            else if (tool === "airline") {

                data = unwrap(
                    await F.getFlightsByAirline(
                        values.airline
                    )
                );

            }


            // PRICE RANGE
            else if (tool === "price") {

                data = unwrap(
                    await F.getFlightsByPriceRange(
                        values.minPrice,
                        values.maxPrice
                    )
                );

            }


            // CHEAPEST
            else if (tool === "cheapest") {

                data = unwrap(
                    await F.getCheapestFlight(
                        values.source,
                        values.destination
                    )
                );

            }


            // AVAILABLE SEATS
            else if (tool === "seats") {

                data = unwrap(
                    await F.getFlightsByAvailableSeats(
                        values.seats
                    )
                );

            }


            // PAGINATION
            else if (tool === "pagination") {

                const response =
                    await F.getFlightsWithPagination(

                        Number(values.page),

                        Number(values.size),

                        values.sortBy,

                        values.direction

                    );

                data = unwrap(response);

                data =
                    data?.content || [];

            }


            if (Array.isArray(data)) {

                setResult(data);

            }

            else if (data) {

                setResult([data]);

            }

            else {

                setResult([]);

            }

        } catch (error) {

            console.error(error);

            alert(
                errorMessage(error)
            );

        }

    };


    // ============================================================
    // DELETE FLIGHT
    // ============================================================

    const handleDeleteFlight = async (
        flightId
    ) => {

        const confirmed =
            window.confirm(
                `Delete flight #${flightId}?`
            );

        if (!confirmed) {
            return;
        }


        const result =
            await run(

                () =>
                    F.deleteFlight(
                        flightId
                    ),

                "Flight deleted successfully"

            );


        if (result !== null) {

            await loadFlights();

        }

    };


    return (

        <div className="admin-section">


            {/* =================================================
                CREATE / UPDATE FLIGHT
            ================================================= */}

            <section className="panel">

                <div className="panel-heading">

                    <div>

                        <span className="eyebrow">
                            FLIGHT MANAGEMENT
                        </span>

                        <h2>
                            {editingFlight
                                ? "Update Flight"
                                : "Create New Flight"}
                        </h2>

                    </div>


                    {editingFlight && (

                        <button
                            type="button"
                            className="link-btn"
                            onClick={
                                cancelFlightEdit
                            }
                        >
                            Cancel Edit
                        </button>

                    )}

                </div>


                <form
                    className="form-grid"
                    onSubmit={saveFlight}
                >

                    {/* AIRLINE */}

                    <label>

                        Airline

                        <input
                            name="airline"
                            value={
                                flightForm.airline
                            }
                            onChange={
                                handleFlightChange
                            }
                            required
                            placeholder="IndiGo"
                        />

                    </label>


                    {/* SOURCE */}

                    <label>

                        Source

                        <input
                            name="source"
                            value={
                                flightForm.source
                            }
                            onChange={
                                handleFlightChange
                            }
                            required
                            placeholder="Delhi"
                        />

                    </label>


                    {/* DESTINATION */}

                    <label>

                        Destination

                        <input
                            name="destination"
                            value={
                                flightForm.destination
                            }
                            onChange={
                                handleFlightChange
                            }
                            required
                            placeholder="Mumbai"
                        />

                    </label>


                    {/* DEPARTURE */}

                    <label>

                        Departure Date & Time

                        <input
                            type="datetime-local"
                            name="departureDateTime"
                            value={
                                flightForm.departureDateTime
                            }
                            onChange={
                                handleFlightChange
                            }
                            required
                        />

                    </label>


                    {/* ARRIVAL */}

                    <label>

                        Arrival Date & Time

                        <input
                            type="datetime-local"
                            name="arrivalDateTime"
                            value={
                                flightForm.arrivalDateTime
                            }
                            onChange={
                                handleFlightChange
                            }
                            required
                        />

                    </label>


                    {/* TOTAL SEATS */}

                    <label>

                        Total Seats

                        <input
                            type="number"
                            name="totalSeats"
                            value={
                                flightForm.totalSeats
                            }
                            onChange={
                                handleFlightChange
                            }
                            min="1"
                            required
                        />

                    </label>


                    {/* AVAILABLE SEATS */}

                    <label>

                        Available Seats

                        <input
                            type="number"
                            name="availableSeats"
                            value={
                                flightForm.availableSeats
                            }
                            onChange={
                                handleFlightChange
                            }
                            min="0"
                            max={
                                flightForm.totalSeats || undefined
                            }
                            required
                        />

                    </label>


                    {/* PRICE */}

                    <label>

                        Price

                        <input
                            type="number"
                            name="price"
                            value={
                                flightForm.price
                            }
                            onChange={
                                handleFlightChange
                            }
                            min="0"
                            step="0.01"
                            required
                        />

                    </label>


                    <button
                        type="submit"
                        className="primary"
                        disabled={busy}
                    >

                        {editingFlight
                            ? "Update Flight"
                            : "Create Flight"}

                    </button>

                </form>

            </section>


            {/* =================================================
                FLIGHT API TOOLS
            ================================================= */}

            <section className="panel">

                <div className="panel-heading">

                    <div>

                        <span className="eyebrow">
                            FLIGHT APIs
                        </span>

                        <h2>
                            Flight Search & Tools
                        </h2>

                    </div>

                </div>


                <div className="tool-row">

                    <select
                        value={tool}
                        onChange={(e) =>
                            setTool(
                                e.target.value
                            )
                        }
                    >

                        <option value="all">
                            All Flights
                        </option>

                        <option value="id">
                            Flight By ID
                        </option>

                        <option value="search">
                            Search by Route & Date
                        </option>

                        <option value="airline">
                            By Airline
                        </option>

                        <option value="price">
                            Price Range
                        </option>

                        <option value="cheapest">
                            Cheapest Flight
                        </option>

                        <option value="seats">
                            Available Seats
                        </option>

                        <option value="pagination">
                            Pagination & Sorting
                        </option>

                    </select>


                    {/* FLIGHT ID */}

                    {tool === "id" && (

                        <input
                            type="number"
                            placeholder="Flight ID"
                            value={
                                values.id
                            }
                            onChange={(e) =>
                                updateValue(
                                    "id",
                                    e.target.value
                                )
                            }
                        />

                    )}


                    {/* SEARCH */}

                    {tool === "search" && (

                        <>

                            <input
                                placeholder="Source"
                                value={
                                    values.source
                                }
                                onChange={(e) =>
                                    updateValue(
                                        "source",
                                        e.target.value
                                    )
                                }
                            />

                            <input
                                placeholder="Destination"
                                value={
                                    values.destination
                                }
                                onChange={(e) =>
                                    updateValue(
                                        "destination",
                                        e.target.value
                                    )
                                }
                            />

                            <input
                                type="date"
                                value={
                                    values.date
                                }
                                onChange={(e) =>
                                    updateValue(
                                        "date",
                                        e.target.value
                                    )
                                }
                            />

                        </>

                    )}


                    {/* AIRLINE */}

                    {tool === "airline" && (

                        <input
                            placeholder="Airline"
                            value={
                                values.airline
                            }
                            onChange={(e) =>
                                updateValue(
                                    "airline",
                                    e.target.value
                                )
                            }
                        />

                    )}


                    {/* PRICE */}

                    {tool === "price" && (

                        <>

                            <input
                                type="number"
                                placeholder="Minimum price"
                                value={
                                    values.minPrice
                                }
                                onChange={(e) =>
                                    updateValue(
                                        "minPrice",
                                        e.target.value
                                    )
                                }
                            />

                            <input
                                type="number"
                                placeholder="Maximum price"
                                value={
                                    values.maxPrice
                                }
                                onChange={(e) =>
                                    updateValue(
                                        "maxPrice",
                                        e.target.value
                                    )
                                }
                            />

                        </>

                    )}


                    {/* CHEAPEST */}

                    {tool === "cheapest" && (

                        <>

                            <input
                                placeholder="Source"
                                value={
                                    values.source
                                }
                                onChange={(e) =>
                                    updateValue(
                                        "source",
                                        e.target.value
                                    )
                                }
                            />

                            <input
                                placeholder="Destination"
                                value={
                                    values.destination
                                }
                                onChange={(e) =>
                                    updateValue(
                                        "destination",
                                        e.target.value
                                    )
                                }
                            />

                        </>

                    )}


                    {/* SEATS */}

                    {tool === "seats" && (

                        <input
                            type="number"
                            placeholder="Minimum seats"
                            value={
                                values.seats
                            }
                            onChange={(e) =>
                                updateValue(
                                    "seats",
                                    e.target.value
                                )
                            }
                        />

                    )}


                    {/* PAGINATION */}

                    {tool === "pagination" && (

                        <>

                            <input
                                type="number"
                                min="0"
                                placeholder="Page"
                                value={
                                    values.page
                                }
                                onChange={(e) =>
                                    updateValue(
                                        "page",
                                        e.target.value
                                    )
                                }
                            />

                            <input
                                type="number"
                                min="1"
                                placeholder="Size"
                                value={
                                    values.size
                                }
                                onChange={(e) =>
                                    updateValue(
                                        "size",
                                        e.target.value
                                    )
                                }
                            />

                            <select
                                value={
                                    values.sortBy
                                }
                                onChange={(e) =>
                                    updateValue(
                                        "sortBy",
                                        e.target.value
                                    )
                                }
                            >

                                <option value="flightId">
                                    Flight ID
                                </option>

                                <option value="airline">
                                    Airline
                                </option>

                                <option value="source">
                                    Source
                                </option>

                                <option value="destination">
                                    Destination
                                </option>

                                <option value="price">
                                    Price
                                </option>

                            </select>


                            <select
                                value={
                                    values.direction
                                }
                                onChange={(e) =>
                                    updateValue(
                                        "direction",
                                        e.target.value
                                    )
                                }
                            >

                                <option value="asc">
                                    Ascending
                                </option>

                                <option value="desc">
                                    Descending
                                </option>

                            </select>

                        </>

                    )}


                    <button
                        type="button"
                        className="outline"
                        onClick={
                            runFlightTool
                        }
                        disabled={busy}
                    >
                        Run API
                    </button>

                </div>


                {result.length > 0 && (

                    <FlightTable
                        flights={result}
                    />

                )}

            </section>


            {/* =================================================
                ALL FLIGHTS
            ================================================= */}

            <section className="panel">

                <div className="panel-heading">

                    <div>

                        <span className="eyebrow">
                            DATABASE
                        </span>

                        <h2>
                            All Flights
                        </h2>

                    </div>

                    <button
                        type="button"
                        className="link-btn"
                        onClick={
                            loadFlights
                        }
                    >
                        Refresh
                    </button>

                </div>


                <div className="table-wrap">

                    <table>

                        <thead>

                            <tr>

                                <th>ID</th>

                                <th>Airline</th>

                                <th>Route</th>

                                <th>Departure</th>

                                <th>Seats</th>

                                <th>Price</th>

                                <th>Actions</th>

                            </tr>

                        </thead>


                        <tbody>

                            {flights.map(
                                (flight) => (

                                    <tr
                                        key={
                                            flight.flightId
                                        }
                                    >

                                        <td>
                                            {
                                                flight.flightId
                                            }
                                        </td>

                                        <td>
                                            {
                                                flight.airline
                                            }
                                        </td>

                                        <td>
                                            {
                                                flight.source
                                            }
                                            {" → "}
                                            {
                                                flight.destination
                                            }
                                        </td>

                                        <td>
                                            {formatDateTime(
                                                flight.departureDateTime
                                            )}
                                        </td>

                                        <td>
                                            {
                                                flight.availableSeats
                                            }
                                            /
                                            {
                                                flight.totalSeats
                                            }
                                        </td>

                                        <td>
                                            {money(
                                                flight.price
                                            )}
                                        </td>

                                        <td>

                                            <button
                                                type="button"
                                                className="small-btn"
                                                onClick={() =>
                                                    editFlight(
                                                        flight
                                                    )
                                                }
                                            >
                                                Edit
                                            </button>


                                            <button
                                                type="button"
                                                className="small-btn danger-text"
                                                onClick={() =>
                                                    handleDeleteFlight(
                                                        flight.flightId
                                                    )
                                                }
                                                disabled={
                                                    busy
                                                }
                                            >
                                                Delete
                                            </button>

                                        </td>

                                    </tr>

                                )
                            )}

                        </tbody>

                    </table>

                </div>

            </section>

        </div>

    );
}


// ################################################################
// FLIGHT TABLE
// ################################################################

function FlightTable({
    flights
}) {

    return (

        <div className="table-wrap">

            <table>

                <thead>

                    <tr>

                        <th>ID</th>

                        <th>Airline</th>

                        <th>Route</th>

                        <th>Departure</th>

                        <th>Arrival</th>

                        <th>Price</th>

                        <th>Available</th>

                    </tr>

                </thead>


                <tbody>

                    {flights.map(
                        (flight) => (

                            <tr
                                key={
                                    flight.flightId
                                }
                            >

                                <td>
                                    {
                                        flight.flightId
                                    }
                                </td>

                                <td>
                                    {
                                        flight.airline
                                    }
                                </td>

                                <td>
                                    {
                                        flight.source
                                    }
                                    {" → "}
                                    {
                                        flight.destination
                                    }
                                </td>

                                <td>
                                    {formatDateTime(
                                        flight.departureDateTime
                                    )}
                                </td>

                                <td>
                                    {formatDateTime(
                                        flight.arrivalDateTime
                                    )}
                                </td>

                                <td>
                                    {money(
                                        flight.price
                                    )}
                                </td>

                                <td>
                                    {
                                        flight.availableSeats
                                    }
                                </td>

                            </tr>

                        )
                    )}

                </tbody>

            </table>

        </div>

    );
}


// ################################################################
// BOOKINGS ADMIN
// ################################################################

function BookingsAdmin({
    bookings,
    loadBookings,
    run,
    busy
}) {

    const [tool, setTool] =
        useState("all");

    const [value, setValue] =
        useState("");

    const [result, setResult] =
        useState([]);


    // ============================================================
    // BOOKING API TOOL
    // ============================================================

    const runBookingTool = async () => {

        try {

            let data;


            if (tool === "all") {

                data = unwrap(
                    await B.getAllBookings()
                );

            }

            else if (tool === "id") {

                data = unwrap(
                    await B.getBookingById(
                        value
                    )
                );

            }

            else if (tool === "flight") {

                data = unwrap(
                    await B.getBookingsByFlight(
                        value
                    )
                );

            }

            else if (tool === "date") {

                data = unwrap(
                    await B.getBookingsByDate(
                        value
                    )
                );

            }

            else if (tool === "status") {

                data = unwrap(
                    await B.getBookingsByStatus(
                        value
                    )
                );

            }

            else if (tool === "passenger") {

                data = unwrap(
                    await B.getBookingHistoryByPassenger(
                        value
                    )
                );

            }


            if (Array.isArray(data)) {

                setResult(data);

            }

            else if (data) {

                setResult([data]);

            }

            else {

                setResult([]);

            }

        } catch (error) {

            alert(
                errorMessage(error)
            );

        }

    };


    // ============================================================
    // CANCEL BOOKING
    // ============================================================

    const cancelBooking = async (
        bookingId
    ) => {

        if (
            !window.confirm(
                `Cancel booking #${bookingId}?`
            )
        ) {
            return;
        }


        const result =
            await run(

                () =>
                    B.updateBookingStatus(
                        bookingId,
                        "CANCELLED"
                    ),

                "Booking cancelled successfully"

            );


        if (result !== null) {

            await loadBookings();

        }

    };


    // ============================================================
    // DELETE BOOKING
    // ============================================================

    const deleteBooking = async (
        bookingId
    ) => {

        if (
            !window.confirm(
                `Delete booking #${bookingId}?`
            )
        ) {
            return;
        }


        const result =
            await run(

                () =>
                    B.cancelBooking(
                        bookingId
                    ),

                "Booking deleted successfully"

            );


        if (result !== null) {

            await loadBookings();

        }

    };


    return (

        <div className="admin-section">


            <section className="panel">

                <div className="panel-heading">

                    <div>

                        <span className="eyebrow">
                            BOOKING APIs
                        </span>

                        <h2>
                            Booking Search
                        </h2>

                    </div>

                </div>


                <div className="tool-row">

                    <select
                        value={tool}
                        onChange={(e) =>
                            setTool(
                                e.target.value
                            )
                        }
                    >

                        <option value="all">
                            All Bookings
                        </option>

                        <option value="id">
                            Booking By ID
                        </option>

                        <option value="flight">
                            By Flight
                        </option>

                        <option value="date">
                            By Date
                        </option>

                        <option value="status">
                            By Status
                        </option>

                        <option value="passenger">
                            By Passenger Contact
                        </option>

                    </select>


                    {tool === "date" && (

                        <input
                            type="date"
                            value={value}
                            onChange={(e) =>
                                setValue(
                                    e.target.value
                                )
                            }
                        />

                    )}


                    {tool === "status" && (

                        <select
                            value={value}
                            onChange={(e) =>
                                setValue(
                                    e.target.value
                                )
                            }
                        >

                            <option value="">
                                Select Status
                            </option>

                            <option value="CONFIRMED">
                                CONFIRMED
                            </option>

                            <option value="CANCELLED">
                                CANCELLED
                            </option>

                        </select>

                    )}


                    {tool !== "all" &&
                        tool !== "date" &&
                        tool !== "status" && (

                            <input
                                placeholder={
                                    tool === "passenger"
                                        ? "Passenger contact"
                                        : "Enter value"
                                }
                                value={
                                    value
                                }
                                onChange={(e) =>
                                    setValue(
                                        e.target.value
                                    )
                                }
                            />

                        )}


                    <button
                        type="button"
                        className="outline"
                        onClick={
                            runBookingTool
                        }
                        disabled={busy}
                    >
                        Run API
                    </button>

                </div>


                {result.length > 0 && (

                    <BookingTable
                        bookings={result}
                    />

                )}

            </section>


            {/* ALL BOOKINGS */}

            <section className="panel">

                <div className="panel-heading">

                    <div>

                        <span className="eyebrow">
                            DATABASE
                        </span>

                        <h2>
                            All Bookings
                        </h2>

                    </div>

                    <button
                        type="button"
                        className="link-btn"
                        onClick={
                            loadBookings
                        }
                    >
                        Refresh
                    </button>

                </div>


                <div className="table-wrap">

                    <table>

                        <thead>

                            <tr>

                                <th>ID</th>

                                <th>Date</th>

                                <th>Route</th>

                                <th>Status</th>

                                <th>Passengers</th>

                                <th>Actions</th>

                            </tr>

                        </thead>


                        <tbody>

                            {bookings.map(
                                (booking) => (

                                    <tr
                                        key={
                                            booking.bookingId
                                        }
                                    >

                                        <td>
                                            #
                                            {
                                                booking.bookingId
                                            }
                                        </td>

                                        <td>
                                            {formatDateTime(
                                                booking.bookingDateTime
                                            )}
                                        </td>

                                        <td>
                                            {
                                                booking.flight
                                                    ?.source
                                            }
                                            {" → "}
                                            {
                                                booking.flight
                                                    ?.destination
                                            }
                                        </td>

                                        <td>
                                            {
                                                booking.status
                                            }
                                        </td>

                                        <td>
                                            {
                                                booking
                                                    .passengers
                                                    ?.length || 0
                                            }
                                        </td>

                                        <td>

                                            <button
                                                type="button"
                                                className="small-btn"
                                                disabled={
                                                    busy ||
                                                    booking.status ===
                                                        "CANCELLED"
                                                }
                                                onClick={() =>
                                                    cancelBooking(
                                                        booking.bookingId
                                                    )
                                                }
                                            >
                                                Cancel
                                            </button>


                                            <button
                                                type="button"
                                                className="small-btn danger-text"
                                                onClick={() =>
                                                    deleteBooking(
                                                        booking.bookingId
                                                    )
                                                }
                                            >
                                                Delete
                                            </button>


                                            <button
                                                type="button"
                                                className="small-btn"
                                                onClick={
                                                    async () => {

                                                        try {

                                                            const data =
                                                                unwrap(
                                                                    await B.getPassengersByBookingId(
                                                                        booking.bookingId
                                                                    )
                                                                );

                                                            alert(

                                                                data
                                                                    ?.map(
                                                                        (p) =>
                                                                            `${p.name} - Seat ${p.seatNumber}`
                                                                    )
                                                                    .join(
                                                                        "\n"
                                                                    ) ||
                                                                "No passengers"

                                                            );

                                                        } catch (error) {

                                                            alert(
                                                                errorMessage(
                                                                    error
                                                                )
                                                            );

                                                        }

                                                    }
                                                }
                                            >
                                                Passengers
                                            </button>


                                            <button
                                                type="button"
                                                className="small-btn"
                                                onClick={
                                                    async () => {

                                                        try {

                                                            const payment =
                                                                unwrap(
                                                                    await B.getPaymentByBookingId(
                                                                        booking.bookingId
                                                                    )
                                                                );

                                                            alert(

                                                                `Payment ID: ${payment?.paymentId}
Mode: ${payment?.modeOfPayment}
Amount: ${money(payment?.amount)}
Status: ${payment?.status}`

                                                            );

                                                        } catch (error) {

                                                            alert(
                                                                errorMessage(
                                                                    error
                                                                )
                                                            );

                                                        }

                                                    }
                                                }
                                            >
                                                Payment
                                            </button>

                                        </td>

                                    </tr>

                                )
                            )}

                        </tbody>

                    </table>

                </div>

            </section>

        </div>

    );
}


// ################################################################
// BOOKING TABLE
// ################################################################

function BookingTable({
    bookings
}) {

    return (

        <div className="table-wrap">

            <table>

                <thead>

                    <tr>

                        <th>ID</th>

                        <th>Route</th>

                        <th>Status</th>

                        <th>Passengers</th>

                        <th>Date</th>

                    </tr>

                </thead>


                <tbody>

                    {bookings.map(
                        (booking) => (

                            <tr
                                key={
                                    booking.bookingId
                                }
                            >

                                <td>
                                    #
                                    {
                                        booking.bookingId
                                    }
                                </td>

                                <td>
                                    {
                                        booking.flight
                                            ?.source
                                    }
                                    {" → "}
                                    {
                                        booking.flight
                                            ?.destination
                                    }
                                </td>

                                <td>
                                    {
                                        booking.status
                                    }
                                </td>

                                <td>
                                    {
                                        booking.passengers
                                            ?.length || 0
                                    }
                                </td>

                                <td>
                                    {formatDateTime(
                                        booking.bookingDateTime
                                    )}
                                </td>

                            </tr>

                        )
                    )}

                </tbody>

            </table>

        </div>

    );
}


// ################################################################
// PASSENGERS ADMIN
// ################################################################

function PassengersAdmin({
    passengers,
    loadPassengers,
    run,
    busy
}) {

    const [tool, setTool] =
        useState("all");

    const [value, setValue] =
        useState("");

    const [result, setResult] =
        useState([]);

    const [editingPassenger,
        setEditingPassenger] =
        useState(null);


    // ============================================================
    // PASSENGER SEARCH
    // ============================================================

    const runPassengerTool = async () => {

        try {

            let data;


            if (tool === "all") {

                data = unwrap(
                    await P.getAllPassengers()
                );

            }

            else if (tool === "id") {

                data = unwrap(
                    await P.getPassengerById(
                        value
                    )
                );

            }

            else if (tool === "contact") {

                data = unwrap(
                    await P.getPassengersByContact(
                        value
                    )
                );

            }

            else if (tool === "gender") {

                data = unwrap(
                    await P.getPassengersByGender(
                        value
                    )
                );

            }

            else if (tool === "flight") {

                data = unwrap(
                    await P.getPassengersByFlight(
                        value
                    )
                );

            }


            if (Array.isArray(data)) {

                setResult(data);

            }

            else if (data) {

                setResult([data]);

            }

            else {

                setResult([]);

            }

        } catch (error) {

            alert(
                errorMessage(error)
            );

        }

    };


    // ============================================================
    // REMOVE PASSENGER
    // ============================================================

    const removePassenger = async (
        passenger
    ) => {

        const confirmed =
            window.confirm(
                `Remove ${passenger.name} from this booking?`
            );

        if (!confirmed) {
            return;
        }


        const result =
            await run(

                () =>
                    P.removePassengerFromBooking(
                        passenger.passengerId
                    ),

                `${passenger.name} removed successfully`

            );


        if (result !== null) {

            await loadPassengers();

            await runPassengerTool();

        }

    };


    // ============================================================
    // UPDATE PASSENGER
    // ============================================================

    const savePassenger = async (
        passenger
    ) => {

        const result =
            await run(

                () =>
                    P.updatePassenger(
                        passenger.passengerId,
                        passenger
                    ),

                "Passenger updated successfully"

            );


        if (result !== null) {

            setEditingPassenger(null);

            await loadPassengers();

            await runPassengerTool();

        }

    };


    return (

        <div className="admin-section">


            {/* SEARCH */}

            <section className="panel">

                <div className="panel-heading">

                    <div>

                        <span className="eyebrow">
                            PASSENGER APIs
                        </span>

                        <h2>
                            Passenger Search
                        </h2>

                    </div>

                </div>


                <div className="tool-row">

                    <select
                        value={tool}
                        onChange={(e) =>
                            setTool(
                                e.target.value
                            )
                        }
                    >

                        <option value="all">
                            All Passengers
                        </option>

                        <option value="id">
                            Passenger By ID
                        </option>

                        <option value="contact">
                            By Contact
                        </option>

                        <option value="gender">
                            By Gender
                        </option>

                        <option value="flight">
                            By Flight
                        </option>

                    </select>


                    {tool === "gender" && (

                        <select
                            value={value}
                            onChange={(e) =>
                                setValue(
                                    e.target.value
                                )
                            }
                        >

                            <option value="">
                                Select Gender
                            </option>

                            <option value="MALE">
                                MALE
                            </option>

                            <option value="FEMALE">
                                FEMALE
                            </option>

                            <option value="OTHER">
                                OTHER
                            </option>

                        </select>

                    )}


                    {tool !== "all" &&
                        tool !== "gender" && (

                            <input
                                placeholder={
                                    tool === "contact"
                                        ? "10 digit contact"
                                        : tool === "id"
                                            ? "Passenger ID"
                                            : "Flight ID"
                                }
                                value={
                                    value
                                }
                                onChange={(e) =>
                                    setValue(
                                        e.target.value
                                    )
                                }
                            />

                        )}


                    <button
                        type="button"
                        className="outline"
                        onClick={
                            runPassengerTool
                        }
                        disabled={busy}
                    >
                        Run API
                    </button>

                </div>


                {result.length > 0 && (

                    <PassengerTable
                        rows={result}
                    />

                )}

            </section>


            {/* DATABASE */}

            <section className="panel">

                <div className="panel-heading">

                    <div>

                        <span className="eyebrow">
                            DATABASE
                        </span>

                        <h2>
                            Passenger Records
                        </h2>

                    </div>

                    <button
                        type="button"
                        className="link-btn"
                        onClick={
                            loadPassengers
                        }
                    >
                        Refresh
                    </button>

                </div>


                <div className="table-wrap">

                    <table>

                        <thead>

                            <tr>

                                <th>ID</th>

                                <th>Name</th>

                                <th>Age</th>

                                <th>Gender</th>

                                <th>Seat</th>

                                <th>Contact</th>

                                <th>Actions</th>

                            </tr>

                        </thead>


                        <tbody>

                            {passengers.map(
                                (passenger) => (

                                    <tr
                                        key={
                                            passenger.passengerId
                                        }
                                    >

                                        <td>
                                            {
                                                passenger.passengerId
                                            }
                                        </td>

                                        <td>
                                            {
                                                passenger.name
                                            }
                                        </td>

                                        <td>
                                            {
                                                passenger.age
                                            }
                                        </td>

                                        <td>
                                            {
                                                passenger.gender
                                            }
                                        </td>

                                        <td>
                                            {
                                                passenger.seatNumber
                                            }
                                        </td>

                                        <td>
                                            {
                                                passenger.contact
                                            }
                                        </td>

                                        <td>

                                            <button
                                                type="button"
                                                className="small-btn"
                                                onClick={() =>
                                                    setEditingPassenger(
                                                        passenger
                                                    )
                                                }
                                            >
                                                Edit
                                            </button>


                                            <button
                                                type="button"
                                                className="small-btn danger-text"
                                                disabled={
                                                    busy
                                                }
                                                onClick={() =>
                                                    removePassenger(
                                                        passenger
                                                    )
                                                }
                                            >
                                                Remove
                                            </button>

                                        </td>

                                    </tr>

                                )
                            )}

                        </tbody>

                    </table>

                </div>


                {editingPassenger && (

                    <PassengerEditor
                        passenger={
                            editingPassenger
                        }

                        onSave={
                            savePassenger
                        }

                        onCancel={() =>
                            setEditingPassenger(
                                null
                            )
                        }
                    />

                )}

            </section>

        </div>

    );
}


// ################################################################
// PASSENGER TABLE
// ################################################################

function PassengerTable({
    rows
}) {

    return (

        <div className="table-wrap">

            <table>

                <thead>

                    <tr>

                        <th>ID</th>

                        <th>Name</th>

                        <th>Age</th>

                        <th>Gender</th>

                        <th>Seat</th>

                        <th>Contact</th>

                    </tr>

                </thead>


                <tbody>

                    {rows.map(
                        (passenger) => (

                            <tr
                                key={
                                    passenger.passengerId
                                }
                            >

                                <td>
                                    {
                                        passenger.passengerId
                                    }
                                </td>

                                <td>
                                    {
                                        passenger.name
                                    }
                                </td>

                                <td>
                                    {
                                        passenger.age
                                    }
                                </td>

                                <td>
                                    {
                                        passenger.gender
                                    }
                                </td>

                                <td>
                                    {
                                        passenger.seatNumber
                                    }
                                </td>

                                <td>
                                    {
                                        passenger.contact
                                    }
                                </td>

                            </tr>

                        )
                    )}

                </tbody>

            </table>

        </div>

    );
}


// ################################################################
// PASSENGER EDITOR
// ################################################################

function PassengerEditor({
    passenger,
    onSave,
    onCancel
}) {

    const [form, setForm] =
        useState({

            name:
                passenger.name || "",

            age:
                passenger.age || "",

            gender:
                passenger.gender || "MALE",

            seatNumber:
                passenger.seatNumber || "",

            contact:
                passenger.contact || ""

        });


    const update = (
        name,
        value
    ) => {

        setForm((prev) => ({

            ...prev,

            [name]: value

        }));

    };


    return (

        <div className="edit-box">

            <h3>
                Edit Passenger
            </h3>


            <div className="form-grid">

                <label>

                    Name

                    <input
                        value={
                            form.name
                        }
                        onChange={(e) =>
                            update(
                                "name",
                                e.target.value
                            )
                        }
                    />

                </label>


                <label>

                    Age

                    <input
                        type="number"
                        value={
                            form.age
                        }
                        onChange={(e) =>
                            update(
                                "age",
                                e.target.value
                            )
                        }
                    />

                </label>


                <label>

                    Gender

                    <select
                        value={
                            form.gender
                        }
                        onChange={(e) =>
                            update(
                                "gender",
                                e.target.value
                            )
                        }
                    >

                        <option value="MALE">
                            MALE
                        </option>

                        <option value="FEMALE">
                            FEMALE
                        </option>

                        <option value="OTHER">
                            OTHER
                        </option>

                    </select>

                </label>


                <label>

                    Seat Number

                    <input
                        value={
                            form.seatNumber
                        }
                        onChange={(e) =>
                            update(
                                "seatNumber",
                                e.target.value
                            )
                        }
                    />

                </label>


                <label>

                    Contact

                    <input
                        value={
                            form.contact
                        }
                        maxLength="10"
                        onChange={(e) =>
                            update(
                                "contact",
                                e.target.value
                            )
                        }
                    />

                </label>

            </div>


            <button
                type="button"
                className="primary"
                onClick={() =>
                    onSave({

                        ...passenger,

                        ...form,

                        age:
                            Number(
                                form.age
                            )

                    })
                }
            >
                Save Changes
            </button>


            <button
                type="button"
                className="link-btn"
                onClick={
                    onCancel
                }
            >
                Cancel
            </button>

        </div>

    );
}


// ################################################################
// PAYMENTS ADMIN
// ################################################################

function PaymentsAdmin({
    payments,
    loadPayments,
    run,
    busy
}) {

    const [tool, setTool] =
        useState("all");

    const [value, setValue] =
        useState("");

    const [result, setResult] =
        useState([]);


    // ============================================================
    // PAYMENT API
    // ============================================================

    const runPaymentTool = async () => {

        try {

            let data;


            if (tool === "all") {

                data = unwrap(
                    await Pay.getAllPayments()
                );

            }

            else if (tool === "id") {

                data = unwrap(
                    await Pay.getPaymentById(
                        value
                    )
                );

            }

            else if (tool === "status") {

                data = unwrap(
                    await Pay.getPaymentsByStatus(
                        value
                    )
                );

            }

            else if (tool === "mode") {

                data = unwrap(
                    await Pay.getPaymentsByMode(
                        value
                    )
                );

            }

            else if (tool === "flight") {

                data = unwrap(
                    await Pay.getTotalAmountPaidByFlight(
                        value
                    )
                );

            }


            if (Array.isArray(data)) {

                setResult(data);

            }

            else if (
                data !== null &&
                data !== undefined
            ) {

                setResult([data]);

            }

            else {

                setResult([]);

            }

        } catch (error) {

            alert(
                errorMessage(error)
            );

        }

    };


    // ============================================================
    // UPDATE PAYMENT STATUS
    // ============================================================

    const updatePaymentStatus = async (
        paymentId,
        status
    ) => {

        if (!status) {
            return;
        }


        const result =
            await run(

                () =>
                    Pay.updatePaymentStatus(
                        paymentId,
                        status
                    ),

                "Payment status updated successfully"

            );


        if (result !== null) {

            await loadPayments();

        }

    };


    return (

        <div className="admin-section">


            {/* PAYMENT SEARCH */}

            <section className="panel">

                <div className="panel-heading">

                    <div>

                        <span className="eyebrow">
                            PAYMENT APIs
                        </span>

                        <h2>
                            Payment Search
                        </h2>

                    </div>

                </div>


                <div className="tool-row">

                    <select
                        value={tool}
                        onChange={(e) =>
                            setTool(
                                e.target.value
                            )
                        }
                    >

                        <option value="all">
                            All Payments
                        </option>

                        <option value="id">
                            Payment By ID
                        </option>

                        <option value="status">
                            By Status
                        </option>

                        <option value="mode">
                            By Payment Mode
                        </option>

                        <option value="flight">
                            Total Paid By Flight
                        </option>

                    </select>


                    {tool === "status" && (

                        <select
                            value={value}
                            onChange={(e) =>
                                setValue(
                                    e.target.value
                                )
                            }
                        >

                            <option value="">
                                Select Status
                            </option>

                            <option value="PENDING">
                                PENDING
                            </option>

                            <option value="SUCCESS">
                                SUCCESS
                            </option>

                            <option value="FAILED">
                                FAILED
                            </option>

                            <option value="REFUNDED">
                                REFUNDED
                            </option>

                        </select>

                    )}


                    {tool === "mode" && (

                        <select
                            value={value}
                            onChange={(e) =>
                                setValue(
                                    e.target.value
                                )
                            }
                        >

                            <option value="">
                                Select Mode
                            </option>

                            <option value="UPI">
                                UPI
                            </option>

                            <option value="CREDIT_CARD">
                                CREDIT_CARD
                            </option>

                            <option value="DEBIT_CARD">
                                DEBIT_CARD
                            </option>

                            <option value="NET_BANKING">
                                NET_BANKING
                            </option>

                        </select>

                    )}


                    {(tool === "id" ||
                        tool === "flight") && (

                        <input
                            type="number"
                            placeholder={
                                tool === "id"
                                    ? "Payment ID"
                                    : "Flight ID"
                            }
                            value={
                                value
                            }
                            onChange={(e) =>
                                setValue(
                                    e.target.value
                                )
                            }
                        />

                    )}


                    <button
                        type="button"
                        className="outline"
                        onClick={
                            runPaymentTool
                        }
                        disabled={busy}
                    >
                        Run API
                    </button>

                </div>


                {result.length > 0 && (

                    <PaymentTable
                        payments={result}
                        isFlightTotal={
                            tool === "flight"
                        }
                    />

                )}

            </section>


            {/* ALL PAYMENTS */}

            <section className="panel">

                <div className="panel-heading">

                    <div>

                        <span className="eyebrow">
                            DATABASE
                        </span>

                        <h2>
                            All Payments
                        </h2>

                    </div>

                    <button
                        type="button"
                        className="link-btn"
                        onClick={
                            loadPayments
                        }
                    >
                        Refresh
                    </button>

                </div>


                <div className="table-wrap">

                    <table>

                        <thead>

                            <tr>

                                <th>ID</th>

                                <th>Amount</th>

                                <th>Mode</th>

                                <th>Status</th>

                                <th>Date</th>

                                <th>Update</th>

                            </tr>

                        </thead>


                        <tbody>

                            {payments.map(
                                (payment) => (

                                    <tr
                                        key={
                                            payment.paymentId
                                        }
                                    >

                                        <td>
                                            #
                                            {
                                                payment.paymentId
                                            }
                                        </td>

                                        <td>
                                            {money(
                                                payment.amount
                                            )}
                                        </td>

                                        <td>
                                            {
                                                payment.modeOfPayment
                                            }
                                        </td>

                                        <td>
                                            {
                                                payment.status
                                            }
                                        </td>

                                        <td>
                                            {formatDateTime(
                                                payment.paymentDateTime
                                            )}
                                        </td>

                                        <td>

                                            <select
                                                disabled={
                                                    busy ||
                                                    payment.status ===
                                                        "REFUNDED"
                                                }
                                                defaultValue=""
                                                onChange={(e) =>
                                                    updatePaymentStatus(
                                                        payment.paymentId,
                                                        e.target.value
                                                    )
                                                }
                                            >

                                                <option value="">
                                                    Update status
                                                </option>

                                                <option value="PENDING">
                                                    PENDING
                                                </option>

                                                <option value="SUCCESS">
                                                    SUCCESS
                                                </option>

                                                <option value="FAILED">
                                                    FAILED
                                                </option>

                                                <option value="REFUNDED">
                                                    REFUNDED
                                                </option>

                                            </select>

                                        </td>

                                    </tr>

                                )
                            )}

                        </tbody>

                    </table>

                </div>

            </section>

        </div>

    );
}


// ################################################################
// PAYMENT TABLE
// ################################################################

function PaymentTable({
    payments,
    isFlightTotal
}) {

    if (isFlightTotal) {

        return (

            <div className="panel">

                <h3>
                    Total Amount Paid
                </h3>

                <div className="admin-total">

                    {money(
                        payments[0]
                    )}

                </div>

            </div>

        );

    }


    return (

        <div className="table-wrap">

            <table>

                <thead>

                    <tr>

                        <th>ID</th>

                        <th>Amount</th>

                        <th>Mode</th>

                        <th>Status</th>

                        <th>Date</th>

                    </tr>

                </thead>


                <tbody>

                    {payments.map(
                        (payment, index) => (

                            <tr
                                key={
                                    payment?.paymentId ||
                                    index
                                }
                            >

                                <td>
                                    {
                                        payment?.paymentId
                                    }
                                </td>

                                <td>
                                    {money(
                                        payment?.amount
                                    )}
                                </td>

                                <td>
                                    {
                                        payment?.modeOfPayment ||
                                        "—"
                                    }
                                </td>

                                <td>
                                    {
                                        payment?.status ||
                                        "—"
                                    }
                                </td>

                                <td>
                                    {formatDateTime(
                                        payment?.paymentDateTime
                                    )}
                                </td>

                            </tr>

                        )
                    )}

                </tbody>

            </table>

        </div>

    );
}
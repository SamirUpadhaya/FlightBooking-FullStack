import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import {
    getBookingById,
    getBookingHistoryByPassenger,
    getPassengersByBookingId,
    getPaymentByBookingId,
    cancelBooking
} from '../services/bookingService';

import { removePassengerFromBooking } from '../services/passengerService';

import { errorMessage, formatDateTime, money, unwrap } from '../utils';
import Alert from '../components/Alert';

export default function MyBookings() {

    const navigate = useNavigate();

    const [searchType, setSearchType] = useState('booking');

    const [searchValue, setSearchValue] = useState('');

    const [booking, setBooking] = useState(null);

    const [bookings, setBookings] = useState([]);

    const [passengers, setPassengers] = useState([]);

    const [payment, setPayment] = useState(null);

    const [loading, setLoading] = useState(false);

    const [error, setError] = useState('');

    const [message, setMessage] = useState('');

    // =========================================================
    // SEARCH
    // =========================================================

    const handleSearch = async (e) => {

        e.preventDefault();

        setError('');
        setMessage('');
        setBooking(null);
        setBookings([]);
        setPassengers([]);
        setPayment(null);

        if (!searchValue.trim()) {
            setError(
                searchType === 'booking'
                    ? 'Please enter a booking ID.'
                    : 'Please enter a passenger contact number.'
            );
            return;
        }

        setLoading(true);

        try {

            if (searchType === 'booking') {

                const response = await getBookingById(searchValue.trim());

                const bookingData = unwrap(response);

                setBooking(bookingData);

                await loadBookingDetails(bookingData.bookingId);

            } else {

                const response =
                    await getBookingHistoryByPassenger(
                        searchValue.trim()
                    );

                const data = unwrap(response) || [];

                setBookings(data);

                if (data.length === 0) {
                    setMessage(
                        'No bookings found for this contact number.'
                    );
                }

            }

        } catch (error) {

            console.error(error);

            setError(errorMessage(error));

        } finally {

            setLoading(false);

        }
    };


    // =========================================================
    // LOAD PASSENGERS + PAYMENT
    // =========================================================

    const loadBookingDetails = async (bookingId) => {

        try {

            const [passengerResponse, paymentResponse] =
                await Promise.all([
                    getPassengersByBookingId(bookingId),
                    getPaymentByBookingId(bookingId)
                ]);

            setPassengers(
                unwrap(passengerResponse) || []
            );

            setPayment(
                unwrap(paymentResponse)
            );

        } catch (error) {

            console.error(error);

            setError(errorMessage(error));

        }
    };


    // =========================================================
    // SELECT BOOKING FROM CONTACT SEARCH
    // =========================================================

    const openBooking = async (selectedBooking) => {

        setError('');
        setMessage('');
        setLoading(true);

        try {

            setBooking(selectedBooking);

            await loadBookingDetails(
                selectedBooking.bookingId
            );

        } catch (error) {

            setError(errorMessage(error));

        } finally {

            setLoading(false);
        }
    };


    // =========================================================
    // REMOVE ONE PASSENGER
    // =========================================================

    const handleRemovePassenger = async (passenger) => {

        const confirmed = window.confirm(
            `Remove ${passenger.name} from this booking?`
        );

        if (!confirmed) {
            return;
        }

        setLoading(true);
        setError('');
        setMessage('');

        try {

            await removePassengerFromBooking(
                passenger.passengerId
            );

            setMessage(
                `${passenger.name} has been removed successfully.`
            );

            // Reload booking
            const bookingResponse =
                await getBookingById(
                    booking.bookingId
                );

            const updatedBooking =
                unwrap(bookingResponse);

            setBooking(updatedBooking);

            // Reload passengers and payment
            await loadBookingDetails(
                updatedBooking.bookingId
            );

        } catch (error) {

            console.error(error);

            setError(errorMessage(error));

        } finally {

            setLoading(false);
        }
    };


    // =========================================================
    // CANCEL ENTIRE BOOKING
    // =========================================================

    const handleCancelBooking = async () => {

        if (!booking) {
            return;
        }

        const confirmed = window.confirm(
            `Cancel entire booking #${booking.bookingId}?\n\n` +
            `This will cancel the complete booking, not just one passenger.`
        );

        if (!confirmed) {
            return;
        }

        setLoading(true);
        setError('');
        setMessage('');

        try {

            await cancelBooking(booking.bookingId);

            setMessage(
                'Booking cancelled successfully.'
            );

            // Reload booking
            const bookingResponse =
                await getBookingById(
                    booking.bookingId
                );

            setBooking(
                unwrap(bookingResponse)
            );

            await loadBookingDetails(
                booking.bookingId
            );

        } catch (error) {

            console.error(error);

            setError(errorMessage(error));

        } finally {

            setLoading(false);
        }
    };


    return (

        <main className="page">

            <div className="page-header">

                <div>

                    <span className="eyebrow">
                        SKYBOOK
                    </span>

                    <h1>
                        My Bookings
                    </h1>

                    <p>
                        Search and manage your flight reservations.
                    </p>

                </div>

            </div>


            {/* =================================================
                SEARCH SECTION
            ================================================= */}

            <section className="panel">

                <h2>
                    Find Your Booking
                </h2>

                <p>
                    Search using your booking ID or passenger
                    contact number.
                </p>


                <div className="tabs">

                    <button
                        className={
                            searchType === 'booking'
                                ? 'tab active'
                                : 'tab'
                        }
                        onClick={() => {
                            setSearchType('booking');
                            setSearchValue('');
                            setError('');
                            setMessage('');
                            setBooking(null);
                            setBookings([]);
                        }}
                    >
                        Booking ID
                    </button>


                    <button
                        className={
                            searchType === 'contact'
                                ? 'tab active'
                                : 'tab'
                        }
                        onClick={() => {
                            setSearchType('contact');
                            setSearchValue('');
                            setError('');
                            setMessage('');
                            setBooking(null);
                            setBookings([]);
                        }}
                    >
                        Passenger Contact
                    </button>

                </div>


                <form
                    className="search-form"
                    onSubmit={handleSearch}
                >

                    <label>

                        {searchType === 'booking'
                            ? 'Booking ID'
                            : 'Passenger Contact Number'
                        }

                    </label>


                    <input
                        type={
                            searchType === 'booking'
                                ? 'number'
                                : 'text'
                        }
                        value={searchValue}
                        onChange={(e) =>
                            setSearchValue(e.target.value)
                        }
                        placeholder={
                            searchType === 'booking'
                                ? 'Example: 20'
                                : 'Example: 9876500001'
                        }
                    />


                    <button
                        type="submit"
                        className="primary"
                        disabled={loading}
                    >

                        {loading
                            ? 'Searching...'
                            : 'Search Booking'
                        }

                    </button>

                </form>

            </section>


            <Alert>
                {error}
            </Alert>


            {message && (

                <div className="alert success">
                    {message}
                </div>

            )}


            {/* =================================================
                CONTACT SEARCH RESULTS
            ================================================= */}

            {bookings.length > 0 && (

                <section className="panel">

                    <div className="panel-heading">

                        <h2>
                            Booking History
                        </h2>

                        <span>
                            {bookings.length}
                        </span>

                    </div>


                    <div className="booking-list">

                        {bookings.map((item) => (

                            <div
                                className="booking-card"
                                key={item.bookingId}
                            >

                                <div>

                                    <span>
                                        Booking #
                                    </span>

                                    <h3>
                                        #{item.bookingId}
                                    </h3>

                                </div>


                                <div>

                                    <span>
                                        Route
                                    </span>

                                    <strong>
                                        {item.flight?.source}
                                        {' → '}
                                        {item.flight?.destination}
                                    </strong>

                                </div>


                                <div>

                                    <span>
                                        Status
                                    </span>

                                    <strong>
                                        {item.status}
                                    </strong>

                                </div>


                                <div>

                                    <span>
                                        Booking Date
                                    </span>

                                    <strong>
                                        {formatDateTime(
                                            item.bookingDateTime
                                        )}
                                    </strong>

                                </div>


                                <button
                                    className="primary"
                                    onClick={() =>
                                        openBooking(item)
                                    }
                                >
                                    View Booking
                                </button>

                            </div>

                        ))}

                    </div>

                </section>

            )}


            {/* =================================================
                SINGLE BOOKING
            ================================================= */}

            {booking && (

                <section className="panel">

                    <div className="panel-heading">

                        <div>

                            <span className="eyebrow">
                                BOOKING
                            </span>

                            <h2>
                                #{booking.bookingId}
                            </h2>

                        </div>


                        <span
                            className={
                                booking.status === 'CANCELLED'
                                    ? 'status cancelled'
                                    : 'status confirmed'
                            }
                        >
                            {booking.status}
                        </span>

                    </div>


                    {/* BOOKING DETAILS */}

                    <div className="detail-list">

                        <div>

                            <span>
                                Route
                            </span>

                            <b>
                                {booking.flight?.source}
                                {' → '}
                                {booking.flight?.destination}
                            </b>

                        </div>


                        <div>

                            <span>
                                Airline
                            </span>

                            <b>
                                {booking.flight?.airline}
                            </b>

                        </div>


                        <div>

                            <span>
                                Booking Date
                            </span>

                            <b>
                                {formatDateTime(
                                    booking.bookingDateTime
                                )}
                            </b>

                        </div>

                    </div>


                    {/* =================================================
                        PASSENGERS
                    ================================================= */}

                    <div className="panel-heading">

                        <h2>
                            Passengers
                        </h2>

                        <span>
                            {passengers.length}
                        </span>

                    </div>


                    {passengers.length === 0 ? (

                        <p>
                            No passengers remain in this booking.
                        </p>

                    ) : (

                        <div className="table-wrap">

                            <table>

                                <thead>

                                    <tr>

                                        <th>
                                            Name
                                        </th>

                                        <th>
                                            Age
                                        </th>

                                        <th>
                                            Gender
                                        </th>

                                        <th>
                                            Seat
                                        </th>

                                        <th>
                                            Contact
                                        </th>

                                        <th>
                                            Action
                                        </th>

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
                                                    {passenger.name}
                                                </td>

                                                <td>
                                                    {passenger.age}
                                                </td>

                                                <td>
                                                    {passenger.gender}
                                                </td>

                                                <td>
                                                    {passenger.seatNumber}
                                                </td>

                                                <td>
                                                    {passenger.contact}
                                                </td>

                                                <td>

                                                    <button
                                                        className="danger small"
                                                        disabled={
                                                            loading ||
                                                            booking.status ===
                                                                'CANCELLED'
                                                        }
                                                        onClick={() =>
                                                            handleRemovePassenger(
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

                    )}


                    {/* =================================================
                        PAYMENT
                    ================================================= */}

                    <div className="panel-heading">

                        <h2>
                            Payment
                        </h2>

                        <span>
                            {payment?.status || '—'}
                        </span>

                    </div>


                    {payment ? (

                        <div className="detail-list">

                            <div>

                                <span>
                                    Payment ID
                                </span>

                                <b>
                                    #{payment.paymentId}
                                </b>

                            </div>


                            <div>

                                <span>
                                    Payment Mode
                                </span>

                                <b>
                                    {payment.modeOfPayment}
                                </b>

                            </div>


                            <div>

                                <span>
                                    Amount
                                </span>

                                <b>
                                    {money(payment.amount)}
                                </b>

                            </div>


                            <div>

                                <span>
                                    Payment Date
                                </span>

                                <b>
                                    {formatDateTime(
                                        payment.paymentDateTime
                                    )}
                                </b>

                            </div>

                        </div>

                    ) : (

                        <p>
                            No payment information available.
                        </p>

                    )}


                    {/* =================================================
                        ACTIONS
                    ================================================= */}

                    <div className="action-row">

                        {booking.status !== 'CANCELLED' && (

                            <button
                                className="danger"
                                onClick={
                                    handleCancelBooking
                                }
                                disabled={loading}
                            >

                                {loading
                                    ? 'Processing...'
                                    : 'Cancel Entire Booking'
                                }

                            </button>

                        )}


                        <button
                            className="primary"
                            onClick={() =>
                                navigate('/flights')
                            }
                        >
                            Book Another Flight
                        </button>

                    </div>

                </section>

            )}

        </main>
    );
}
import { useEffect, useState } from 'react';
import {
    Link,
    useLocation,
    useNavigate,
    useParams
} from 'react-router-dom';

import {
    cancelBooking,
    getBookingById,
    getPassengersByBookingId,
    getPaymentByBookingId
} from '../services/bookingService';

import {
    removePassengerFromBooking
} from '../services/passengerService';

import {
    errorMessage,
    formatDateTime,
    money,
    unwrap
} from '../utils';

import Alert from '../components/Alert';

export default function BookingConfirmation() {

    const { id } = useParams();

    const location = useLocation();
    const navigate = useNavigate();

    const [booking, setBooking] =
        useState(location.state?.booking || null);

    const [passengers, setPassengers] =
        useState([]);

    const [payment, setPayment] =
        useState(null);

    const [error, setError] =
        useState('');

    const [busy, setBusy] =
        useState(false);

    const [removingPassengerId, setRemovingPassengerId] =
        useState(null);


    // ============================================================
    // LOAD BOOKING DETAILS
    // ============================================================

    const load = async () => {

        try {

            setError('');

            const [
                bookingResponse,
                passengersResponse,
                paymentResponse
            ] = await Promise.all([

                getBookingById(id),

                getPassengersByBookingId(id),

                getPaymentByBookingId(id)
            ]);


            setBooking(
                unwrap(bookingResponse)
            );

            setPassengers(
                unwrap(passengersResponse) || []
            );

            setPayment(
                unwrap(paymentResponse)
            );

        } catch (e) {

            setError(
                errorMessage(e)
            );
        }
    };


    useEffect(() => {

        load();

    }, [id]);


    // ============================================================
    // CANCEL ENTIRE BOOKING
    // ============================================================

    const handleCancelBooking = async () => {

        const confirmed = window.confirm(
            'Are you sure you want to cancel the entire booking?'
        );

        if (!confirmed) {
            return;
        }


        setBusy(true);

        setError('');


        try {

            await cancelBooking(id);

            await load();

        } catch (e) {

            setError(
                errorMessage(e)
            );

        } finally {

            setBusy(false);
        }
    };


    // ============================================================
    // REMOVE ONE PASSENGER
    // ============================================================

    const handleRemovePassenger = async (passenger) => {

        const confirmed = window.confirm(
            `Remove ${passenger.name} from this booking?`
        );

        if (!confirmed) {
            return;
        }


        setRemovingPassengerId(
            passenger.passengerId
        );

        setError('');


        try {

            // IMPORTANT:
            // This calls:
            // DELETE /passengers/{passengerId}/booking

            await removePassengerFromBooking(
                passenger.passengerId
            );


            // Reload booking, passengers and payment
            await load();


        } catch (e) {

            console.error(
                'Remove passenger error:',
                e
            );

            setError(
                errorMessage(e)
            );

        } finally {

            setRemovingPassengerId(null);
        }
    };


    // ============================================================
    // LOADING
    // ============================================================

    if (!booking && !error) {

        return (
            <div className="center">

                <div className="loader">
                    Loading...
                </div>

            </div>
        );
    }


    // ============================================================
    // UI
    // ============================================================

    return (

        <main className="page narrow">

            <Alert>
                {error}
            </Alert>


            {booking && (

                <>

                    {/* ==================================================
                        BOOKING STATUS
                    ================================================== */}

                    <section
                        className={
                            booking.status === 'CANCELLED'
                                ? 'status-banner cancelled'
                                : 'status-banner confirmed'
                        }
                    >

                        <div className="status-icon">

                            {booking.status === 'CANCELLED'
                                ? '×'
                                : '✓'
                            }

                        </div>


                        <div>

                            <span className="eyebrow">

                                Booking #{booking.bookingId}

                            </span>


                            <h1>

                                {booking.status === 'CANCELLED'
                                    ? 'Booking Cancelled'
                                    : 'Booking Confirmed!'
                                }

                            </h1>


                            <p>

                                {booking.status === 'CANCELLED'
                                    ? 'This booking has been cancelled and the payment is marked refunded where applicable.'
                                    : 'Your flight has been booked successfully.'
                                }

                            </p>

                        </div>

                    </section>


                    {/* ==================================================
                        BOOKING DETAILS
                    ================================================== */}

                    <section className="panel">

                        <div className="detail-list">

                            <div>

                                <span>
                                    Status
                                </span>

                                <b>
                                    {booking.status}
                                </b>

                            </div>


                            <div>

                                <span>
                                    Booked on
                                </span>

                                <b>
                                    {formatDateTime(
                                        booking.bookingDateTime
                                    )}
                                </b>

                            </div>


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

                        </div>

                    </section>


                    {/* ==================================================
                        PASSENGERS
                    ================================================== */}

                    <section className="panel">

                        <div className="panel-heading">

                            <h2>
                                Passengers
                            </h2>

                            <span>
                                {passengers.length}
                            </span>

                        </div>


                        {passengers.length === 0 ? (

                            <div className="empty-state">

                                No passengers in this booking.

                            </div>

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

                                                        {booking.status !==
                                                            'CANCELLED' && (

                                                            <button
                                                                className="danger"
                                                                onClick={() =>
                                                                    handleRemovePassenger(
                                                                        passenger
                                                                    )
                                                                }
                                                                disabled={
                                                                    removingPassengerId ===
                                                                    passenger.passengerId
                                                                }
                                                            >

                                                                {removingPassengerId ===
                                                                passenger.passengerId
                                                                    ? 'Removing...'
                                                                    : 'Remove'
                                                                }

                                                            </button>

                                                        )}

                                                    </td>

                                                </tr>

                                            )
                                        )}

                                    </tbody>

                                </table>

                            </div>

                        )}

                    </section>


                    {/* ==================================================
                        PAYMENT
                    ================================================== */}

                    <section className="panel">

                        <div className="panel-heading">

                            <h2>
                                Payment
                            </h2>

                            <span>
                                {payment?.status || '—'}
                            </span>

                        </div>


                        {payment && (

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
                                        Mode
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
                                        Paid at
                                    </span>

                                    <b>
                                        {formatDateTime(
                                            payment.paymentDateTime
                                        )}
                                    </b>

                                </div>

                            </div>

                        )}

                    </section>


                    {/* ==================================================
                        ACTION BUTTONS
                    ================================================== */}

                    <div className="action-row">

                        <Link
                            className="secondary-btn"
                            to="/my-bookings"
                        >
                            My bookings
                        </Link>


                        {booking.status !== 'CANCELLED' && (

                            <button
                                className="danger"
                                onClick={handleCancelBooking}
                                disabled={busy}
                            >

                                {busy
                                    ? 'Cancelling...'
                                    : 'Cancel entire booking'
                                }

                            </button>

                        )}


                        <button
                            className="primary"
                            onClick={() =>
                                navigate('/flights')
                            }
                        >

                            Book another flight

                        </button>

                    </div>

                </>

            )}

        </main>
    );
}
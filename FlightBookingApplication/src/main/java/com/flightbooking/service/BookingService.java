package com.flightbooking.service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import com.flightbooking.dto.ResponseStructure;
import com.flightbooking.entity.Booking;
import com.flightbooking.entity.Flight;
import com.flightbooking.entity.Passenger;
import com.flightbooking.entity.Payment;
import com.flightbooking.enums.BookingStatus;
import com.flightbooking.enums.PaymentStatus;
import com.flightbooking.exception.BookingAlreadyCancelledException;
import com.flightbooking.exception.BookingNotFoundException;
import com.flightbooking.exception.DuplicateContactNumberException;
import com.flightbooking.exception.FlightNotFoundException;
import com.flightbooking.exception.InsufficientSeatsException;
import com.flightbooking.exception.InvalidContactNumberException;
import com.flightbooking.exception.PaymentNotFoundException;
import com.flightbooking.repository.BookingRepository;
import com.flightbooking.repository.FlightRepository;
import com.flightbooking.repository.PassengerRepository;

import jakarta.transaction.Transactional;

@Service
public class BookingService {
	
	@Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private FlightRepository flightRepository;
    
    @Autowired
    private PassengerRepository passengerRepository;

    //Create booking
    @Transactional
    public ResponseStructure<Booking> createBooking(Integer flightId, Booking booking) {

        // Check Flight
        Flight flight = flightRepository.findById(flightId)
                .orElseThrow(() ->
                        new FlightNotFoundException("Flight not found with ID: " + flightId)
                );

        // Check Passengers
        List<Passenger> passengers = booking.getPassengers();

        if (passengers == null || passengers.isEmpty()) {
            throw new IllegalArgumentException("At least one passenger is required");
        }

        //Validate passenger contacts
        for (Passenger passenger : passengers) {
            String contact = passenger.getContact();
            if (contact == null || !contact.matches("\\d{10}")) {
                throw new InvalidContactNumberException("Passenger contact number must contain exactly 10 digits");
            }

            if (passengerRepository.existsByContact(contact)) {
                throw new DuplicateContactNumberException("Passenger contact number already exists: "+ contact);
            }
        }

        // Check available seats
        int requiredSeats = passengers.size();

        if (flight.getAvailableSeats() < requiredSeats) {
            throw new InsufficientSeatsException("Only " + flight.getAvailableSeats() + " seats are available, but "+ requiredSeats+ " seats were requested");
        }

        // Check Payment
        Payment payment = booking.getPayment();

        if (payment == null || payment.getModeOfPayment() == null) {
            throw new IllegalArgumentException("Payment mode is required");
        }

        // Calculate payment automatically
        BigDecimal totalAmount = flight.getPrice().multiply(BigDecimal.valueOf(requiredSeats));

        payment.setAmount(totalAmount);
        payment.setPaymentDateTime(LocalDateTime.now());
        payment.setStatus(PaymentStatus.SUCCESS);

        // Booking information
        booking.setBookingDateTime(LocalDateTime.now());
        booking.setStatus(BookingStatus.CONFIRMED);
        booking.setFlight(flight);

        // Set Passenger → Booking
        for (Passenger passenger : passengers) {
            passenger.setBooking(booking);
        }

        // Update seats
        flight.setAvailableSeats(flight.getAvailableSeats() - requiredSeats);

        // Save booking
        Booking savedBooking = bookingRepository.save(booking);

        flightRepository.save(flight);

        ResponseStructure<Booking> response = new ResponseStructure<>();

        response.setStatusCode(HttpStatus.CREATED.value());
        response.setMessage("Booking created successfully!");
        response.setData(savedBooking);
        return response;
    }
    
    
    //Get all bookings
    public ResponseStructure<List<Booking>> getAllBookings() {

        List<Booking> bookings = bookingRepository.findAll();

        ResponseStructure<List<Booking>> response = new ResponseStructure<>();

        response.setStatusCode(HttpStatus.OK.value());
        response.setMessage("All bookings fetched successfully!");
        response.setData(bookings);
        return response;
    }
    
    
    //Get booking by id
    public ResponseStructure<Booking> getBookingById(Integer id) {

        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() ->
                        new BookingNotFoundException("Booking not found with ID: " + id)
                );

        ResponseStructure<Booking> response = new ResponseStructure<>();

        response.setStatusCode(HttpStatus.OK.value());
        response.setMessage("Booking fetched successfully!");
        response.setData(booking);
        return response;
    }
    
    
    //Get booking by flight
    public ResponseStructure<List<Booking>> getBookingsByFlightId(Integer flightId) {

        flightRepository.findById(flightId)
                .orElseThrow(() ->
                        new FlightNotFoundException("Flight not found with ID: " + flightId)
                );

        List<Booking> bookings = bookingRepository.findByFlightFlightId(flightId);

        ResponseStructure<List<Booking>> response = new ResponseStructure<>();

        response.setStatusCode(HttpStatus.OK.value());
        response.setMessage("Bookings fetched successfully for Flight ID: "+ flightId);
        response.setData(bookings);
        return response;
    }
    
    //Get booking by date
    public ResponseStructure<List<Booking>> getBookingsByDate(LocalDate date) {

        LocalDateTime startDateTime = date.atStartOfDay();

        LocalDateTime endDateTime = date.plusDays(1).atStartOfDay();

        List<Booking> bookings = bookingRepository.findByBookingDateTimeGreaterThanEqualAndBookingDateTimeLessThan(startDateTime, endDateTime);

        ResponseStructure<List<Booking>> response = new ResponseStructure<>();

        response.setStatusCode(HttpStatus.OK.value());
        response.setMessage("Bookings fetched successfully for date: " + date);
        response.setData(bookings);
        return response;
    }
    
    //Get booking by status
    public ResponseStructure<List<Booking>> getBookingsByStatus(BookingStatus status) {

        List<Booking> bookings = bookingRepository.findByStatus(status);

        ResponseStructure<List<Booking>> response = new ResponseStructure<>();

        response.setStatusCode(HttpStatus.OK.value());
        response.setMessage("Bookings fetched successfully with status: " + status);
        response.setData(bookings);
        return response;
    }
    
    //Get all passenger in booking
    public ResponseStructure<List<Passenger>> getPassengersByBookingId(Integer bookingId) {

        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() ->
                        new BookingNotFoundException("Booking not found with ID: " + bookingId)
                );

        List<Passenger> passengers = booking.getPassengers();

        ResponseStructure<List<Passenger>> response = new ResponseStructure<>();

        response.setStatusCode(HttpStatus.OK.value());
        response.setMessage("Passengers fetched successfully for Booking ID: " + bookingId);
        response.setData(passengers);
        return response;
    }
    
    //Get payment details by booking
    public ResponseStructure<Payment> getPaymentByBookingId(Integer bookingId) {

        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() ->
                        new BookingNotFoundException("Booking not found with ID: " + bookingId)
                );

        Payment payment = booking.getPayment();

        if (payment == null) {
            throw new PaymentNotFoundException("Payment not found for Booking ID: " + bookingId);
        }

        ResponseStructure<Payment> response = new ResponseStructure<>();

        response.setStatusCode(HttpStatus.OK.value());
        response.setMessage("Payment details fetched successfully for Booking ID: "+ bookingId);
        response.setData(payment);
        return response;
    }
    
    //Update status of booking
    @Transactional
    public ResponseStructure<Booking> updateBookingStatus(Integer bookingId, BookingStatus status) {

        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() ->
                        new BookingNotFoundException("Booking not found with ID: " + bookingId)
                );
        
        if (booking.getStatus() == BookingStatus.CANCELLED && status == BookingStatus.CANCELLED) {
            throw new BookingAlreadyCancelledException("Booking is already cancelled");
        }
        
        if (booking.getStatus() == BookingStatus.CANCELLED && status == BookingStatus.CONFIRMED) {
            throw new IllegalStateException("Cancelled booking cannot be confirmed again");
        }

        if (booking.getStatus() == BookingStatus.CONFIRMED && status == BookingStatus.CANCELLED) {
            Flight flight = booking.getFlight();
            int passengerCount = booking.getPassengers().size();
            flight.setAvailableSeats(Math.min(flight.getAvailableSeats() + passengerCount,flight.getTotalSeats()));
            flightRepository.save(flight);
            Payment payment = booking.getPayment();
            if (payment != null) {
                payment.setStatus(PaymentStatus.REFUNDED);
            }
        }
        
        booking.setStatus(status);

        Booking updatedBooking = bookingRepository.save(booking);

        ResponseStructure<Booking> response = new ResponseStructure<>();

        response.setStatusCode(HttpStatus.OK.value());
        response.setMessage("Booking status updated successfully!");
        response.setData(updatedBooking);
        return response;
    }
    
    //Delete booking
    @Transactional
    public ResponseStructure<String> deleteBooking(Integer bookingId) {

        Booking booking = bookingRepository.findById(bookingId)
                        .orElseThrow(() ->
                                new BookingNotFoundException("Booking not found with ID: "+ bookingId)
                        );

        if (booking.getStatus() == BookingStatus.CANCELLED) {
            throw new BookingAlreadyCancelledException("Booking is already cancelled");
        }

        Flight flight = booking.getFlight();

        int passengerCount = booking.getPassengers().size();

        flight.setAvailableSeats(Math.min(flight.getAvailableSeats()+ passengerCount,flight.getTotalSeats()));

        flightRepository.save(flight);

        booking.setStatus(BookingStatus.CANCELLED);

        Payment payment = booking.getPayment();

        if (payment != null) {
            payment.setStatus(PaymentStatus.REFUNDED);
        }

        bookingRepository.save(booking);

        ResponseStructure<String> response = new ResponseStructure<>();
        response.setStatusCode(HttpStatus.OK.value());
        response.setMessage("Booking cancelled successfully!");
        response.setData("Booking with ID "+ bookingId+ " has been cancelled and payment refunded.");
        return response;
    }
    
  //Get booking history of a passenger
    public ResponseStructure<List<Booking>> getBookingHistoryByPassenger(String contact) {

        List<Booking> bookings = bookingRepository.findDistinctByPassengersContact(contact);

        ResponseStructure<List<Booking>> response = new ResponseStructure<>();

        response.setStatusCode(HttpStatus.OK.value());
        response.setMessage("Booking history fetched successfully for passenger contact: "+ contact);
        response.setData(bookings);
        return response;
    }
    
}

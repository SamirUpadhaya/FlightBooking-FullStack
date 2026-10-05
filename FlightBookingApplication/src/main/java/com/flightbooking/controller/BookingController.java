package com.flightbooking.controller;

import java.time.LocalDate;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.flightbooking.dto.ResponseStructure;
import com.flightbooking.entity.Booking;
import com.flightbooking.entity.Passenger;
import com.flightbooking.entity.Payment;
import com.flightbooking.enums.BookingStatus;
import com.flightbooking.service.BookingService;

@RestController
@RequestMapping("/bookings")
public class BookingController {
	
	@Autowired
    private BookingService bookingService;
	
	//Create booking
    @PostMapping("/flight/{flightId}")
    public ResponseEntity<ResponseStructure<Booking>> createBooking(@PathVariable Integer flightId, @RequestBody Booking booking) {
        ResponseStructure<Booking> response = bookingService.createBooking(flightId, booking);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }
    
    //Get all bookings
    @GetMapping
    public ResponseEntity<ResponseStructure<List<Booking>>> getAllBookings() {
        ResponseStructure<List<Booking>> response = bookingService.getAllBookings();
        return new ResponseEntity<>(response, HttpStatus.OK);
    }
    
    //Get booking by id
    @GetMapping("/{id}")
    public ResponseEntity<ResponseStructure<Booking>> getBookingById(@PathVariable Integer id) {
        ResponseStructure<Booking> response = bookingService.getBookingById(id);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }
    
    //Get booking by flight
    @GetMapping("/flight/{flightId}")
    public ResponseEntity<ResponseStructure<List<Booking>>> getBookingsByFlightId(@PathVariable Integer flightId) {
        ResponseStructure<List<Booking>> response = bookingService.getBookingsByFlightId(flightId);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }
    
    //Get booking by date
    @GetMapping("/date")
    public ResponseEntity<ResponseStructure<List<Booking>>> getBookingsByDate(@RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date){
        ResponseStructure<List<Booking>> response = bookingService.getBookingsByDate(date);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }
    
    //Get booking by status
    @GetMapping("/status")
    public ResponseEntity<ResponseStructure<List<Booking>>> getBookingsByStatus(@RequestParam BookingStatus status) {
        ResponseStructure<List<Booking>> response = bookingService.getBookingsByStatus(status);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }
    
    //Get passenger by booking
    @GetMapping("/{bookingId}/passengers")
    public ResponseEntity<ResponseStructure<List<Passenger>>> getPassengersByBookingId(@PathVariable Integer bookingId) {
        ResponseStructure<List<Passenger>> response = bookingService.getPassengersByBookingId(bookingId);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }
    
    //Get payment details by booking
    @GetMapping("/{bookingId}/payment")
    public ResponseEntity<ResponseStructure<Payment>> getPaymentByBookingId(@PathVariable Integer bookingId) {
        ResponseStructure<Payment> response = bookingService.getPaymentByBookingId(bookingId);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }
    
    //Update booking status
    @PutMapping("/{bookingId}/status")
    public ResponseEntity<ResponseStructure<Booking>> updateBookingStatus(@PathVariable Integer bookingId, @RequestParam BookingStatus status) {
        ResponseStructure<Booking> response = bookingService.updateBookingStatus(bookingId, status);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }
    
    //Delete booking
    @DeleteMapping("/{bookingId}")
    public ResponseEntity<ResponseStructure<String>> deleteBooking(@PathVariable Integer bookingId) {
        ResponseStructure<String> response = bookingService.deleteBooking(bookingId);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }
    
    //Get booking history of a passenger
    @GetMapping("/history/passenger")
    public ResponseEntity<ResponseStructure<List<Booking>>> getBookingHistoryByPassenger(@RequestParam String contact) {
        ResponseStructure<List<Booking>> response = bookingService.getBookingHistoryByPassenger(contact);
        return new ResponseEntity<>(response,  HttpStatus.OK);
    }
}

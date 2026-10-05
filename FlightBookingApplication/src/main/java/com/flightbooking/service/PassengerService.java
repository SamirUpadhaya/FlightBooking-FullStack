package com.flightbooking.service;

import java.math.BigDecimal;
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
import com.flightbooking.enums.Gender;
import com.flightbooking.enums.PaymentStatus;
import com.flightbooking.exception.DuplicateContactNumberException;
import com.flightbooking.exception.FlightNotFoundException;
import com.flightbooking.exception.InvalidContactNumberException;
import com.flightbooking.exception.PassengerNotFoundException;
import com.flightbooking.repository.BookingRepository;
import com.flightbooking.repository.FlightRepository;
import com.flightbooking.repository.PassengerRepository;

import jakarta.transaction.Transactional;

@Service
public class PassengerService {

	@Autowired
	private PassengerRepository passengerRepository;
	
	@Autowired
	private FlightRepository flightRepository;
	
	@Autowired
	private BookingRepository bookingRepository;
	
	//Get all passenger
	public ResponseStructure<List<Passenger>> getAllPassengers(){
		
		List<Passenger> passengers = passengerRepository.findAll();
		
		ResponseStructure<List<Passenger>> response = new ResponseStructure<>();
		response.setStatusCode(HttpStatus.OK.value());
		response.setMessage("All passenger fetched successfully!");
		response.setData(passengers);
		return response;
	}
	
	//Get passenger by id
	public ResponseStructure<Passenger> getPassengerById(Integer id) {

	    Passenger passenger = passengerRepository.findById(id)
	            .orElseThrow(() ->
	                    new PassengerNotFoundException("Passenger not found with ID: " + id)
	            );

	    ResponseStructure<Passenger> response = new ResponseStructure<>();
	    response.setStatusCode(HttpStatus.OK.value());
	    response.setMessage("Passenger fetched successfully!");
	    response.setData(passenger);
	    return response;
	}
	
	//Get passenger by contact
	public ResponseStructure<List<Passenger>> getPassengersByContact(String contact){

	    List<Passenger> passengers = passengerRepository.findByContact(contact);

	    ResponseStructure<List<Passenger>> response = new ResponseStructure<>();

	    response.setStatusCode(HttpStatus.OK.value());
	    response.setMessage("Passengers fetched successfully for contact: " + contact);
	    response.setData(passengers);
	    return response;
	}
	
	//Get passenger by gender
	public ResponseStructure<List<Passenger>> getPassengersByGender(Gender gender) {

	    List<Passenger> passengers = passengerRepository.findByGender(gender);

	    ResponseStructure<List<Passenger>> response = new ResponseStructure<>();

	    response.setStatusCode(HttpStatus.OK.value());
	    response.setMessage("Passengers fetched successfully for gender: " + gender);
	    response.setData(passengers);
	    return response;
	}
	
	//Update passenger information
	public ResponseStructure<Passenger> updatePassenger(Integer id, Passenger updatedPassenger) {

	    Passenger existingPassenger =
	            passengerRepository.findById(id)
	                    .orElseThrow(() ->
	                            new PassengerNotFoundException("Passenger not found with ID: " + id)
	                    );
	    
	    String contact = updatedPassenger.getContact();

	    if (contact == null || !contact.matches("\\d{10}")) {
	        throw new InvalidContactNumberException("Passenger contact number must contain exactly 10 digits");
	    }

	    if (passengerRepository.existsByContactAndPassengerIdNot(contact,id)) {
	        throw new DuplicateContactNumberException("Passenger contact number already exists: "+ contact);
	    }

	    existingPassenger.setName(updatedPassenger.getName());
	    existingPassenger.setAge(updatedPassenger.getAge());
	    existingPassenger.setGender(updatedPassenger.getGender());
	    existingPassenger.setSeatNumber(updatedPassenger.getSeatNumber());
	    existingPassenger.setContact(contact);

	    Passenger savedPassenger = passengerRepository.save(existingPassenger);

	    ResponseStructure<Passenger> response = new ResponseStructure<>();
	    response.setStatusCode(HttpStatus.OK.value());
	    response.setMessage("Passenger information updated successfully!");
	    response.setData(savedPassenger);
	    return response;
	}
	
	//Remove passenger from booking
	@Transactional
	public ResponseStructure<String> removePassengerFromBooking(Integer passengerId) {

	    Passenger passenger = passengerRepository.findById(passengerId)
	            .orElseThrow(() ->
	                    new PassengerNotFoundException("Passenger not found with ID: " + passengerId)
	            );

	    Booking booking = passenger.getBooking();

	    if (booking == null) {
	        throw new IllegalStateException("Passenger is not associated with any booking");
	    }

	    Flight flight = booking.getFlight();

	    // IMPORTANT:
	    // Remove passenger from booking collection BEFORE deleting it
	    booking.getPassengers().remove(passenger);

	    int remainingPassengerCount = booking.getPassengers().size();

	    // Delete passenger
	    passengerRepository.delete(passenger);

	    // Increase available seat
	    if (booking.getStatus() == BookingStatus.CONFIRMED) {
	        flight.setAvailableSeats(Math.min(flight.getAvailableSeats() + 1, flight.getTotalSeats())
	        );

	        flightRepository.save(flight);
	    }

	    Payment payment = booking.getPayment();

	    if (remainingPassengerCount == 0) {

	        // No passengers left
	        booking.setStatus(BookingStatus.CANCELLED);

	        if (payment != null) {
	            payment.setAmount(BigDecimal.ZERO);
	            payment.setStatus(PaymentStatus.REFUNDED);
	        }

	    } else {

	        // Recalculate payment
	        if (payment != null) {
	            BigDecimal newAmount = flight.getPrice().multiply(BigDecimal.valueOf(remainingPassengerCount));
	            payment.setAmount(newAmount);
	        }
	    }

	    // Save booking AFTER removing passenger from collection
	    bookingRepository.save(booking);

	    ResponseStructure<String> response = new ResponseStructure<>();
	    response.setStatusCode(HttpStatus.OK.value());

	    if (remainingPassengerCount == 0) {

	        response.setMessage("Passenger removed and booking cancelled because no passengers remain.");

	    } else {

	        response.setMessage("Passenger removed and payment amount updated successfully!");
	    }

	    response.setData("Passenger with ID " + passengerId + " has been removed.");

	    return response;
	}
	
	//Get passenger by flight
	public ResponseStructure<List<Passenger>> getPassengersByFlight(Integer flightId) {

	    flightRepository.findById(flightId)
	            .orElseThrow(() ->
	                    new FlightNotFoundException("Flight not found with ID: " + flightId)
	            );

	    List<Passenger> passengers = passengerRepository.findByBookingFlightFlightId(flightId);

	    ResponseStructure<List<Passenger>> response = new ResponseStructure<>();

	    response.setStatusCode(HttpStatus.OK.value());
	    response.setMessage("Passengers fetched successfully for Flight ID: " + flightId);
	    response.setData(passengers);
	    return response;
	}
}

package com.flightbooking.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import com.flightbooking.dto.ResponseStructure;

@RestControllerAdvice
public class GlobalExceptionHandler {

	@ExceptionHandler(FlightNotFoundException.class)
	public ResponseEntity<ResponseStructure<String>> handleFlightNotFound(
			FlightNotFoundException exception){
		
		ResponseStructure<String> response = new ResponseStructure<>();
		response.setStatusCode(HttpStatus.NOT_FOUND.value());
		response.setMessage(exception.getMessage());
		response.setData(null);
		return new ResponseEntity<>(response,HttpStatus.NOT_FOUND);
	}
	
	@ExceptionHandler(FlightHasBookingsException.class)
	public ResponseEntity<ResponseStructure<String>> handleFlightHasBookings(
	                FlightHasBookingsException exception) {

	    ResponseStructure<String> response = new ResponseStructure<>();
	    response.setStatusCode(HttpStatus.CONFLICT.value());
	    response.setMessage(exception.getMessage());
	    response.setData(null);
	    return new ResponseEntity<>(response, HttpStatus.CONFLICT);
	}
	
	@ExceptionHandler(InvalidPriceRangeException.class)
	public ResponseEntity<ResponseStructure<String>> handleInvalidPriceRange(
	                InvalidPriceRangeException exception) {

	    ResponseStructure<String> response = new ResponseStructure<>();
	    response.setStatusCode(HttpStatus.BAD_REQUEST.value());
	    response.setMessage(exception.getMessage());
	    response.setData(null);
	    return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
	}
	
	@ExceptionHandler(InvalidSeatCountException.class)
	public ResponseEntity<ResponseStructure<String>> handleInvalidSeatCount(
	                InvalidSeatCountException exception) {

	    ResponseStructure<String> response = new ResponseStructure<>();

	    response.setStatusCode(HttpStatus.BAD_REQUEST.value());
	    response.setMessage(exception.getMessage());
	    response.setData(null);
	    return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
	}
	
	@ExceptionHandler(InsufficientSeatsException.class)
	public ResponseEntity<ResponseStructure<String>> handleInsufficientSeats(
	                InsufficientSeatsException exception) {

	    ResponseStructure<String> response = new ResponseStructure<>();

	    response.setStatusCode(HttpStatus.CONFLICT.value());
	    response.setMessage(exception.getMessage());
	    response.setData(null);
	    return new ResponseEntity<>(response, HttpStatus.CONFLICT);
	}
	
	@ExceptionHandler(BookingNotFoundException.class)
	public ResponseEntity<ResponseStructure<String>> handleBookingNotFound(
	        BookingNotFoundException exception) {

	    ResponseStructure<String> response = new ResponseStructure<>();

	    response.setStatusCode(HttpStatus.NOT_FOUND.value());
	    response.setMessage(exception.getMessage());
	    response.setData(null);
	    return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
	}
	
	@ExceptionHandler(PaymentNotFoundException.class)
	public ResponseEntity<ResponseStructure<String>> handlePaymentNotFound(
	                PaymentNotFoundException exception) {

	    ResponseStructure<String> response = new ResponseStructure<>();

	    response.setStatusCode(HttpStatus.NOT_FOUND.value());
	    response.setMessage(exception.getMessage());
	    response.setData(null);
	    return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
	}
	
	@ExceptionHandler(PassengerNotFoundException.class)
	public ResponseEntity<ResponseStructure<String>> handlePassengerNotFound(PassengerNotFoundException exception) {

	    ResponseStructure<String> response = new ResponseStructure<>();

	    response.setStatusCode(HttpStatus.NOT_FOUND.value());
	    response.setMessage(exception.getMessage());
	    response.setData(null);
	    return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
	}
	
	@ExceptionHandler(InvalidContactNumberException.class)
	public ResponseEntity<ResponseStructure<String>> handleInvalidContactNumber(
	                InvalidContactNumberException exception) {

	    ResponseStructure<String> response = new ResponseStructure<>();

	    response.setStatusCode(HttpStatus.BAD_REQUEST.value());
	    response.setMessage(exception.getMessage());
	    response.setData(null);
	    return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
	}
	
	@ExceptionHandler(DuplicateContactNumberException.class)
	public ResponseEntity<ResponseStructure<String>> handleDuplicateContactNumber(
	                DuplicateContactNumberException exception) {

	    ResponseStructure<String> response = new ResponseStructure<>();

	    response.setStatusCode(HttpStatus.CONFLICT.value());
	    response.setMessage(exception.getMessage());
	    response.setData(null);
	    return new ResponseEntity<>(response, HttpStatus.CONFLICT);
	}
	
	@ExceptionHandler(BookingAlreadyCancelledException.class)
	public ResponseEntity<ResponseStructure<String>> handleBookingAlreadyCancelled(
	                BookingAlreadyCancelledException exception) {

	    ResponseStructure<String> response = new ResponseStructure<>();

	    response.setStatusCode(HttpStatus.CONFLICT.value());
	    response.setMessage(exception.getMessage());
	    response.setData(null);
	    return new ResponseEntity<>(response, HttpStatus.CONFLICT);
	}
	
	@ExceptionHandler(InvalidPaymentStatusException.class)
	public ResponseEntity<ResponseStructure<String>> handleInvalidPaymentStatus(
	                InvalidPaymentStatusException exception) {

	    ResponseStructure<String> response = new ResponseStructure<>();

	    response.setStatusCode(HttpStatus.BAD_REQUEST.value());
	    response.setMessage(exception.getMessage());
	    response.setData(null);
	    return new ResponseEntity<>(response,HttpStatus.BAD_REQUEST);
	}
}

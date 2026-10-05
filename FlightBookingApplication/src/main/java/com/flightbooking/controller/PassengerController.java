package com.flightbooking.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.flightbooking.dto.ResponseStructure;
import com.flightbooking.entity.Passenger;
import com.flightbooking.enums.Gender;
import com.flightbooking.service.PassengerService;

@RestController
@RequestMapping("/passengers")
public class PassengerController {

	 @Autowired
	 private PassengerService passengerService;
	 
	 //Get all passengers
	 @GetMapping
	 public ResponseEntity<ResponseStructure<List<Passenger>>> getAllPassengers() {
		 ResponseStructure<List<Passenger>> response = passengerService.getAllPassengers();
		 return new ResponseEntity<>(response, HttpStatus.OK);
	 }
	 
	 //Get passenger by id
	 @GetMapping("/{id}")
	 public ResponseEntity<ResponseStructure<Passenger>> getPassengerById(@PathVariable Integer id) {
	     ResponseStructure<Passenger> response = passengerService.getPassengerById(id);
	     return new ResponseEntity<>(response, HttpStatus.OK);
	 }
	 
	 //Get passenger by contact
	 @GetMapping("/contact")
	 public ResponseEntity<ResponseStructure<List<Passenger>>> getPassengersByContact(@RequestParam String contact) {
	     ResponseStructure<List<Passenger>> response = passengerService.getPassengersByContact(contact);
	     return new ResponseEntity<>(response, HttpStatus.OK);
	 }
	 
	 //Get passenger by gender
	 @GetMapping("/gender")
	 public ResponseEntity<ResponseStructure<List<Passenger>>> getPassengersByGender(@RequestParam Gender gender) {
	     ResponseStructure<List<Passenger>> response = passengerService.getPassengersByGender(gender);
	     return new ResponseEntity<>(response, HttpStatus.OK);
	 }
	 
	 //Update passenger info
	 @PutMapping("/{id}")
	 public ResponseEntity<ResponseStructure<Passenger>> updatePassenger(@PathVariable Integer id,@RequestBody Passenger passenger) {
	     ResponseStructure<Passenger> response = passengerService.updatePassenger(id, passenger);
	     return new ResponseEntity<>(response, HttpStatus.OK);
	 }
	 
	 //Remove passenger from booking
	 @DeleteMapping("/{passengerId}/booking")
	 public ResponseEntity<ResponseStructure<String>> removePassengerFromBooking(@PathVariable Integer passengerId) {
	     ResponseStructure<String> response = passengerService.removePassengerFromBooking(passengerId);
	     return new ResponseEntity<>(response,HttpStatus.OK);
	 }
	 
	 //Get passenger by flight
	 @GetMapping("/flight/{flightId}")
	 public ResponseEntity<ResponseStructure<List<Passenger>>> getPassengersByFlight(@PathVariable Integer flightId) {
	     ResponseStructure<List<Passenger>> response = passengerService.getPassengersByFlight(flightId);
	     return new ResponseEntity<>(response, HttpStatus.OK);
	 }
}

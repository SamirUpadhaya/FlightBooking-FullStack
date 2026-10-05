package com.flightbooking.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.flightbooking.entity.Passenger;
import com.flightbooking.enums.Gender;

public interface PassengerRepository extends JpaRepository<Passenger, Integer> {
	
	List<Passenger> findByContact(String contact);
	List<Passenger> findByGender(Gender gender);
	List<Passenger> findByBookingFlightFlightId(Integer flightId);
	boolean existsByContact(String contact);
	boolean existsByContactAndPassengerIdNot(String contact, Integer passengerId);
}

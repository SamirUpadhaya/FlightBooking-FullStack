package com.flightbooking.repository;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.flightbooking.entity.Booking;
import com.flightbooking.enums.BookingStatus;

public interface BookingRepository extends JpaRepository<Booking, Integer>{

	boolean existsByFlightFlightId(Integer flightId);
	List<Booking> findByFlightFlightId(Integer flightId);
	List<Booking> findByBookingDateTimeGreaterThanEqualAndBookingDateTimeLessThan(LocalDateTime startDateTime, LocalDateTime endDateTime);
	List<Booking> findByStatus(BookingStatus status);
	List<Booking> findDistinctByPassengersContact(String contact);
}

package com.flightbooking.repository;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.flightbooking.entity.Flight;

public interface FlightRepository extends JpaRepository<Flight, Integer>{
	
	List<Flight> findBySourceIgnoreCaseAndDestinationIgnoreCaseAndDepartureDateTimeGreaterThanEqualAndDepartureDateTimeLessThan(
	        String source,
	        String destination,
	        LocalDateTime startDateTime,
	        LocalDateTime endDateTime
	);
	List<Flight> findByAirlineIgnoreCase(String airline);
	List<Flight> findByPriceBetween(BigDecimal minPrice, BigDecimal maxPrice);
	Optional<Flight> findFirstBySourceIgnoreCaseAndDestinationIgnoreCaseOrderByPriceAsc(String source, String destination);
	List<Flight> findByAvailableSeatsGreaterThanEqual(Integer seats);
}

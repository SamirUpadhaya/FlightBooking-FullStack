package com.flightbooking.service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import com.flightbooking.dto.ResponseStructure;
import com.flightbooking.entity.Flight;
import com.flightbooking.exception.FlightHasBookingsException;
import com.flightbooking.exception.FlightNotFoundException;
import com.flightbooking.exception.InvalidPriceRangeException;
import com.flightbooking.exception.InvalidSeatCountException;
import com.flightbooking.repository.BookingRepository;
import com.flightbooking.repository.FlightRepository;

@Service
public class FlightService {
	
	@Autowired
	private FlightRepository flightRepository;
	
	@Autowired
	private BookingRepository bookingRepository;
	
	//Add Flights
	public ResponseStructure<Flight> saveFlight(Flight flight) {

		flight.setAvailableSeats(flight.getTotalSeats());
		
        Flight savedFlight = flightRepository.save(flight);

        ResponseStructure<Flight> response = new ResponseStructure<>();

        response.setStatusCode(HttpStatus.CREATED.value());
        response.setMessage("Flight saved successfully!");
        response.setData(savedFlight);
        return response;
    }
	
	//Get all flight
	public ResponseStructure<List<Flight>> getAllFlights() {

	    List<Flight> flights = flightRepository.findAll();

	    ResponseStructure<List<Flight>> response = new ResponseStructure<>();

	    response.setStatusCode(HttpStatus.OK.value());
	    response.setMessage("All flights fetched successfully!");
	    response.setData(flights);
	    return response;
	}
	
	//Get flight by Id
	public ResponseStructure<Flight> getFlightById(Integer id) {

	    Flight flight = flightRepository.findById(id)
	            .orElseThrow(() ->
	                    new FlightNotFoundException("Flight not found with ID: " + id)
	            );

	    ResponseStructure<Flight> response = new ResponseStructure<>();
	    response.setStatusCode(HttpStatus.OK.value());
	    response.setMessage("Flight fetched successfully!");
	    response.setData(flight);
	    return response;
	}
	
	//Search by source, destination and date
	public ResponseStructure<List<Flight>> searchFlights(String source, String destination, LocalDate date){

	    LocalDateTime startDateTime = date.atStartOfDay();

	    LocalDateTime endDateTime = date.plusDays(1).atStartOfDay();

	    List<Flight> flights = flightRepository.findBySourceIgnoreCaseAndDestinationIgnoreCaseAndDepartureDateTimeGreaterThanEqualAndDepartureDateTimeLessThan(
	                            source,
	                            destination,
	                            startDateTime,
	                            endDateTime);

	    ResponseStructure<List<Flight>> response = new ResponseStructure<>();
	    response.setStatusCode(HttpStatus.OK.value());
	    response.setMessage("Flights fetched successfully!");
	    response.setData(flights);
	    return response;
	}
	
	//get flight by airline
	public ResponseStructure<List<Flight>> getFlightsByAirline(String airline) {

	    List<Flight> flights = flightRepository.findByAirlineIgnoreCase(airline);

	    ResponseStructure<List<Flight>> response = new ResponseStructure<>();
	    response.setStatusCode(HttpStatus.OK.value());
	    response.setMessage("Flights fetched successfully for airline: " + airline);
	    response.setData(flights);
	    return response;
	}
	
	//update flight by id
	public ResponseStructure<Flight> updateFlight(Integer id, Flight updatedFlight) {

	    Flight existingFlight = flightRepository.findById(id)
	            .orElseThrow(() ->
	                    new FlightNotFoundException("Flight not found with ID: " + id)
	            );

	    existingFlight.setAirline(updatedFlight.getAirline());
	    existingFlight.setSource(updatedFlight.getSource());
	    existingFlight.setDestination(updatedFlight.getDestination());
	    existingFlight.setDepartureDateTime(updatedFlight.getDepartureDateTime());
	    existingFlight.setArrivalDateTime(updatedFlight.getArrivalDateTime());
	    existingFlight.setPrice(updatedFlight.getPrice());

	    Flight savedFlight = flightRepository.save(existingFlight);

	    ResponseStructure<Flight> response = new ResponseStructure<>();
	    response.setStatusCode(HttpStatus.OK.value());
	    response.setMessage("Flight updated successfully!");
	    response.setData(savedFlight);
	    return response;
	}
	
	//delete flight 
	public ResponseStructure<String> deleteFlight(Integer id) {

	    Flight flight = flightRepository.findById(id)
	            .orElseThrow(() ->
	                    new FlightNotFoundException("Flight not found with ID: " + id)
	            );

	    boolean hasBookings = bookingRepository.existsByFlightFlightId(id);

	    if (hasBookings) {
	        throw new FlightHasBookingsException("Flight cannot be deleted because bookings exist for Flight ID: "+ id);
	    }

	    flightRepository.delete(flight);

	    ResponseStructure<String> response = new ResponseStructure<>();

	    response.setStatusCode(HttpStatus.OK.value());
	    response.setMessage("Flight deleted successfully!");
	    response.setData("Flight with ID " + id + " has been deleted.");
	    return response;
	}
	
	//Get flight by price range
	public ResponseStructure<List<Flight>> getFlightsByPriceRange(BigDecimal minPrice, BigDecimal maxPrice) {
		
		if (minPrice.compareTo(maxPrice) > 0) {
	        throw new InvalidPriceRangeException("Minimum price cannot be greater than maximum price");
	    }
		
	    List<Flight> flights = flightRepository.findByPriceBetween(minPrice, maxPrice);

	    ResponseStructure<List<Flight>> response = new ResponseStructure<>();
	    response.setStatusCode(HttpStatus.OK.value());
	    response.setMessage("Flights fetched successfully between price "+ minPrice + " and " + maxPrice);
	    response.setData(flights);
	    return response;
	}
	
	//Get Cheapest flight between source and destination
	public ResponseStructure<Flight> getCheapestFlight(String source, String destination) {

	    Flight flight = flightRepository.findFirstBySourceIgnoreCaseAndDestinationIgnoreCaseOrderByPriceAsc(source,destination)
	            .orElseThrow(() ->
	                    new FlightNotFoundException("No flight found from "+ source + " to " + destination)
	            );

	    ResponseStructure<Flight> response = new ResponseStructure<>();
	    response.setStatusCode(HttpStatus.OK.value());
	    response.setMessage("Cheapest flight fetched successfully!");
	    response.setData(flight);
	    return response;
	}
	
	//Get flight by available seats
	public ResponseStructure<List<Flight>> getFlightsByAvailableSeats(Integer seats) {

		if (seats == null || seats <= 0) {
	        throw new InvalidSeatCountException("Required seats must be greater than 0");
	    }
		
	    List<Flight> flights = flightRepository.findByAvailableSeatsGreaterThanEqual(seats);

	    ResponseStructure<List<Flight>> response = new ResponseStructure<>();
	    response.setStatusCode(HttpStatus.OK.value());
	    response.setMessage("Flights with at least " + seats + " available seats fetched successfully!");
	    response.setData(flights);
	    return response;
	}
	
	//Get flight by pagination and sorting
	public ResponseStructure<Page<Flight>> getFlightsWithPaginationAndSorting(int page, int size, String sortBy, String direction) {

	    Sort sort;

	    if (direction.equalsIgnoreCase("desc")) {
	        sort = Sort.by(sortBy).descending();
	    } else {
	        sort = Sort.by(sortBy).ascending();
	    }

	    Pageable pageable = PageRequest.of(page, size, sort);

	    Page<Flight> flights = flightRepository.findAll(pageable);

	    ResponseStructure<Page<Flight>> response = new ResponseStructure<>();

	    response.setStatusCode(HttpStatus.OK.value());
	    response.setMessage("Flights fetched successfully with pagination and sorting!");
	    response.setData(flights);
	    return response;
	}
	
}

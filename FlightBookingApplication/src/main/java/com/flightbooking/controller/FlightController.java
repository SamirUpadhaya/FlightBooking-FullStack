package com.flightbooking.controller;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
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
import com.flightbooking.entity.Flight;
import com.flightbooking.service.FlightService;

@RestController
@RequestMapping("/flights")
public class FlightController {
	
	@Autowired
    private FlightService flightService;

	//Add flights
    @PostMapping
    public ResponseEntity<ResponseStructure<Flight>> saveFlight(@RequestBody Flight flight) {
        ResponseStructure<Flight> response = flightService.saveFlight(flight);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }
    
    //Get all flight
    @GetMapping
    public ResponseEntity<ResponseStructure<List<Flight>>> getAllFlights() {
        ResponseStructure<List<Flight>> response = flightService.getAllFlights();
        return new ResponseEntity<>(response, HttpStatus.OK);
    }
    
    //Get flight by Id
    @GetMapping("/{id}")
    public ResponseEntity<ResponseStructure<Flight>> getFlightById(@PathVariable Integer id) {
        ResponseStructure<Flight> response = flightService.getFlightById(id);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }
    
    //Search by source, destination and date
    @GetMapping("/search")
    public ResponseEntity<ResponseStructure<List<Flight>>> searchFlights(@RequestParam String source, @RequestParam String destination, @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date){
        ResponseStructure<List<Flight>> response = flightService.searchFlights(source, destination, date);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }
    
    //Get flight by airline
    @GetMapping("/airline")
    public ResponseEntity<ResponseStructure<List<Flight>>> getFlightsByAirline(@RequestParam String airline) {
        ResponseStructure<List<Flight>> response = flightService.getFlightsByAirline(airline);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }
    
    //Update flight by id
    @PutMapping("/{id}")
    public ResponseEntity<ResponseStructure<Flight>> updateFlight(@PathVariable Integer id, @RequestBody Flight flight){
        ResponseStructure<Flight> response = flightService.updateFlight(id, flight);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }
    
    //delete flight
    @DeleteMapping("/{id}")
    public ResponseEntity<ResponseStructure<String>> deleteFlight(@PathVariable Integer id){
        ResponseStructure<String> response = flightService.deleteFlight(id);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }
    
    //Get flight by price range
    @GetMapping("/price-range")
    public ResponseEntity<ResponseStructure<List<Flight>>> getFlightsByPriceRange(@RequestParam BigDecimal minPrice, @RequestParam BigDecimal maxPrice){
    	ResponseStructure<List<Flight>> response = flightService.getFlightsByPriceRange(minPrice, maxPrice);
    	return new ResponseEntity<>(response,HttpStatus.OK);
    }
    
    //Get cheapest flight by source and destination
    @GetMapping("/cheapest")
    public ResponseEntity<ResponseStructure<Flight>> getCheapestFlight(@RequestParam String source, @RequestParam String destination) {
        ResponseStructure<Flight> response = flightService.getCheapestFlight(source, destination);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }
    
    //Get flight by available seats
    @GetMapping("/available-seats")
    public ResponseEntity<ResponseStructure<List<Flight>>> getFlightsByAvailableSeats(@RequestParam Integer seats) {
        ResponseStructure<List<Flight>> response = flightService.getFlightsByAvailableSeats(seats);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }
    
    //Get flight by pagination and sorting
    @GetMapping("/page")
    public ResponseEntity<ResponseStructure<Page<Flight>>>
            getFlightsWithPaginationAndSorting(
                    @RequestParam(defaultValue = "0") int page,
                    @RequestParam(defaultValue = "5") int size,
                    @RequestParam(defaultValue = "flightId") String sortBy,
                    @RequestParam(defaultValue = "asc") String direction) {

        ResponseStructure<Page<Flight>> response = flightService.getFlightsWithPaginationAndSorting(page, size, sortBy,direction);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }
}

package com.flightbooking.entity;



import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Flight {
	
	 	@Id
	 	@GeneratedValue(strategy = GenerationType.IDENTITY)
	    private Integer flightId;

	    private String airline;

	    private String source;

	    private String destination;

	    private LocalDateTime departureDateTime;

	    private LocalDateTime arrivalDateTime;

	    private Integer totalSeats;

	    private Integer availableSeats;

	    private BigDecimal price;

	    @OneToMany(mappedBy = "flight")
	    @JsonIgnore
	    private List<Booking> bookings;
}

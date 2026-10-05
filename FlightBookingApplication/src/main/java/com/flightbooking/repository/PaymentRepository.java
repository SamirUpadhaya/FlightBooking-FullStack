package com.flightbooking.repository;

import java.math.BigDecimal;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.flightbooking.entity.Payment;
import com.flightbooking.enums.PaymentMode;
import com.flightbooking.enums.PaymentStatus;

public interface PaymentRepository extends JpaRepository<Payment, Integer>{
	
	List<Payment> findByStatus(PaymentStatus status);
	List<Payment> findByModeOfPayment(PaymentMode modeOfPayment);
	@Query("""
	        SELECT COALESCE(SUM(p.amount), 0)
	        FROM Booking b
	        JOIN b.payment p
	        WHERE b.flight.flightId = :flightId
	        AND p.status = :status""")
	BigDecimal getTotalAmountByFlightIdAndStatus(@Param("flightId") Integer flightId, @Param("status") PaymentStatus status);
}

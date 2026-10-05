package com.flightbooking.controller;

import java.math.BigDecimal;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.flightbooking.dto.ResponseStructure;
import com.flightbooking.entity.Payment;
import com.flightbooking.enums.PaymentMode;
import com.flightbooking.enums.PaymentStatus;
import com.flightbooking.service.PaymentService;

@RestController
@RequestMapping("/payments")
public class PaymentController {
	
	@Autowired
	private PaymentService paymentService;

	//Get all payments
	@GetMapping
	public ResponseEntity<ResponseStructure<List<Payment>>> getAllPayments() {
		ResponseStructure<List<Payment>> response = paymentService.getAllPayments();
		return new ResponseEntity<>(response, HttpStatus.OK);
	}
	
	//Get payment by id
	@GetMapping("/{paymentId}")
	public ResponseEntity<ResponseStructure<Payment>> getPaymentById(@PathVariable Integer paymentId) {
	    ResponseStructure<Payment> response = paymentService.getPaymentById(paymentId);
	    return new ResponseEntity<>(response, HttpStatus.OK);
	}
	
	//Update payment status
	@PutMapping("/{paymentId}/status")
	public ResponseEntity<ResponseStructure<Payment>> updatePaymentStatus(@PathVariable Integer paymentId, @RequestParam PaymentStatus status) {
	    ResponseStructure<Payment> response = paymentService.updatePaymentStatus(paymentId,status);
	    return new ResponseEntity<>(response, HttpStatus.OK);
	}
	
	//Get payment by status
	@GetMapping("/status")
	public ResponseEntity<ResponseStructure<List<Payment>>> getPaymentsByStatus(@RequestParam PaymentStatus status) {
	    ResponseStructure<List<Payment>> response = paymentService.getPaymentsByStatus(status);
	    return new ResponseEntity<>(response, HttpStatus.OK);
	}
	
	//Get payment by mode of payment
	@GetMapping("/mode")
	public ResponseEntity<ResponseStructure<List<Payment>>> getPaymentsByMode(@RequestParam PaymentMode mode) {
	    ResponseStructure<List<Payment>> response = paymentService.getPaymentsByMode(mode);
	    return new ResponseEntity<>(response, HttpStatus.OK);
	}
	
	//Get total amount paid on flight based on booking
	@GetMapping("/flight/{flightId}/total")
	public ResponseEntity<ResponseStructure<BigDecimal>> getTotalAmountPaidByFlight(@PathVariable Integer flightId) {
	    ResponseStructure<BigDecimal> response = paymentService.getTotalAmountPaidByFlight(flightId);
	    return new ResponseEntity<>(response, HttpStatus.OK);
	}
}

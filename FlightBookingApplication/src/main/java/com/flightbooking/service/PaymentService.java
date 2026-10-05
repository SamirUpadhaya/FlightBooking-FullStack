 package com.flightbooking.service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import com.flightbooking.dto.ResponseStructure;
import com.flightbooking.entity.Payment;
import com.flightbooking.enums.PaymentMode;
import com.flightbooking.enums.PaymentStatus;
import com.flightbooking.exception.FlightNotFoundException;
import com.flightbooking.exception.InvalidPaymentStatusException;
import com.flightbooking.exception.PaymentNotFoundException;
import com.flightbooking.repository.FlightRepository;
import com.flightbooking.repository.PaymentRepository;


@Service
public class PaymentService {

	@Autowired
    private PaymentRepository paymentRepository;
	
	@Autowired
	private FlightRepository flightRepository;

	
	//Get all payments
    public ResponseStructure<List<Payment>> getAllPayments() {

        List<Payment> payments = paymentRepository.findAll();

        ResponseStructure<List<Payment>> response = new ResponseStructure<>();
        response.setStatusCode(HttpStatus.OK.value());
        response.setMessage("All payments fetched successfully!");
        response.setData(payments);
        return response;
    }
    
    //Get payment by id
    public ResponseStructure<Payment> getPaymentById(Integer paymentId) {

        Payment payment = paymentRepository.findById(paymentId)
                        .orElseThrow(() ->
                                new PaymentNotFoundException("Payment not found with ID: " + paymentId)
                        );

        ResponseStructure<Payment> response = new ResponseStructure<>();
        response.setStatusCode(HttpStatus.OK.value());
        response.setMessage("Payment fetched successfully!");
        response.setData(payment);
        return response;
    }
    
    //Update payment status
    public ResponseStructure<Payment> updatePaymentStatus(Integer paymentId, PaymentStatus status) {

        Payment payment = paymentRepository.findById(paymentId)
                        .orElseThrow(() ->
                                new PaymentNotFoundException("Payment not found with ID: "+ paymentId)
                        );

        if (status == PaymentStatus.REFUNDED) {
            throw new InvalidPaymentStatusException("Payment cannot be refunded directly. " +"Cancel the booking to refund the payment.");
        }

        payment.setStatus(status);

        Payment updatedPayment = paymentRepository.save(payment);

        ResponseStructure<Payment> response = new ResponseStructure<>();
        response.setStatusCode(HttpStatus.OK.value());
        response.setMessage("Payment status updated successfully!");
        response.setData(updatedPayment);
        return response;
    }
    
    //Get payment by status
    public ResponseStructure<List<Payment>> getPaymentsByStatus(PaymentStatus status) {

        List<Payment> payments = paymentRepository.findByStatus(status);

        ResponseStructure<List<Payment>> response = new ResponseStructure<>();

        response.setStatusCode(HttpStatus.OK.value());
        response.setMessage("Payments fetched successfully for status: "+ status);
        response.setData(payments);
        return response;
    }
    
    //Get payment by mode of payment
    public ResponseStructure<List<Payment>> getPaymentsByMode(PaymentMode mode) {

        List<Payment> payments = paymentRepository.findByModeOfPayment(mode);

        ResponseStructure<List<Payment>> response = new ResponseStructure<>();

        response.setStatusCode(HttpStatus.OK.value());
        response.setMessage("Payments fetched successfully for payment mode: "+ mode);
        response.setData(payments);
        return response;
    }
    
    //Get total amount paid on flight based on booking
    public ResponseStructure<BigDecimal> getTotalAmountPaidByFlight(Integer flightId) {

    	if (!flightRepository.existsById(flightId)) {
    		throw new FlightNotFoundException("Flight not found with ID: " + flightId);
    	}

    	BigDecimal totalAmount = paymentRepository.getTotalAmountByFlightIdAndStatus(flightId, PaymentStatus.SUCCESS);

    	ResponseStructure<BigDecimal> response = new ResponseStructure<>();
    	response.setStatusCode(HttpStatus.OK.value());
    	response.setMessage("Total amount paid for flight fetched successfully!");
    	response.setData(totalAmount);
    	return response;
    }
    
}

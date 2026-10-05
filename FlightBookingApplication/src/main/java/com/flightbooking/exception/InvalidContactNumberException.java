package com.flightbooking.exception;

public class InvalidContactNumberException extends RuntimeException {

    public InvalidContactNumberException(String message) {
        super(message);
    }
}
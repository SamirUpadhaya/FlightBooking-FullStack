import api from './api';

// ============================================
// PaymentController - 6 APIs
// ============================================

// 1. GET /payments
export const getAllPayments = () =>
    api.get('/payments');

// 2. GET /payments/{paymentId}
export const getPaymentById = (paymentId) =>
    api.get(`/payments/${paymentId}`);

// 3. PUT /payments/{paymentId}/status
export const updatePaymentStatus = (paymentId, status) =>
    api.put(`/payments/${paymentId}/status`, null, {
        params: { status }
    });

// 4. GET /payments/status
export const getPaymentsByStatus = (status) =>
    api.get('/payments/status', {
        params: { status }
    });

// 5. GET /payments/mode
export const getPaymentsByMode = (mode) =>
    api.get('/payments/mode', {
        params: { mode }
    });

// 6. GET /payments/flight/{flightId}/total
export const getTotalAmountPaidByFlight = (flightId) =>
    api.get(`/payments/flight/${flightId}/total`);
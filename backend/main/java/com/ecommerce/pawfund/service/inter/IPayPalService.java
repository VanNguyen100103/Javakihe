package com.ecommerce.pawfund.service.inter;

import java.util.Map;

public interface IPayPalService {
    
    /**
     * Get PayPal client ID for frontend
     */
    Map<String, String> getClientId();
    
    /**
     * Create PayPal order
     */
    Map<String, Object> createOrder(Map<String, Object> orderData);
    
    /**
     * Capture PayPal payment
     */
    Map<String, Object> capturePayment(String orderId);
    
    /**
     * Verify PayPal payment
     */
    boolean verifyPayment(Map<String, Object> paymentData);
} 
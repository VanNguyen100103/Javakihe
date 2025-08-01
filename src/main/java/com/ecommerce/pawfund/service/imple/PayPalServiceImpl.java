package com.ecommerce.pawfund.service.imple;

import com.ecommerce.pawfund.service.inter.IPayPalService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.*;
import java.util.*;

@Service
public class PayPalServiceImpl implements IPayPalService {
    
    @Value("${paypal.client.id}")
    private String paypalClientId;
    
    @Value("${paypal.client.secret}")
    private String paypalClientSecret;
    
    @Value("${paypal.mode:sandbox}")
    private String paypalMode;
    
    private final RestTemplate restTemplate = new RestTemplate();
    
    private String getBaseUrl() {
        return paypalMode.equals("live") 
            ? "https://api-m.paypal.com" 
            : "https://api-m.sandbox.paypal.com";
    }
    
    private String getAccessToken() {
        String url = getBaseUrl() + "/v1/oauth2/token";
        
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);
        headers.setBasicAuth(paypalClientId, paypalClientSecret);
        
        String body = "grant_type=client_credentials";
        HttpEntity<String> request = new HttpEntity<>(body, headers);
        
        ResponseEntity<Map> response = restTemplate.postForEntity(url, request, Map.class);
        
        if (response.getBody() != null) {
            return (String) response.getBody().get("access_token");
        }
        
        throw new RuntimeException("Failed to get PayPal access token");
    }
    
    @Override
    public Map<String, String> getClientId() {
        Map<String, String> result = new HashMap<>();
        result.put("clientId", paypalClientId);
        result.put("mode", paypalMode);
        return result;
    }
    
    @Override
    public Map<String, Object> createOrder(Map<String, Object> orderData) {
        String url = getBaseUrl() + "/v2/checkout/orders";
        
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(getAccessToken());
        
        // Build PayPal order request
        Map<String, Object> requestBody = new HashMap<>();
        requestBody.put("intent", "CAPTURE");
        
        Map<String, Object> applicationContext = new HashMap<>();
        applicationContext.put("return_url", "https://pawfund.org/donation/success");
        applicationContext.put("cancel_url", "https://pawfund.org/donation/cancel");
        requestBody.put("application_context", applicationContext);
        
        List<Map<String, Object>> purchaseUnits = new ArrayList<>();
        Map<String, Object> purchaseUnit = new HashMap<>();
        
        Map<String, Object> amount = new HashMap<>();
        amount.put("currency_code", "USD");
        amount.put("value", orderData.get("amount")); // Use USD amount from frontend
        purchaseUnit.put("amount", amount);
        
        purchaseUnit.put("description", "Donation to PawFund - " + orderData.get("category"));
        purchaseUnits.add(purchaseUnit);
        requestBody.put("purchase_units", purchaseUnits);
        
        HttpEntity<Map<String, Object>> request = new HttpEntity<>(requestBody, headers);
        
        ResponseEntity<Map> response = restTemplate.postForEntity(url, request, Map.class);
        
        if (response.getBody() != null) {
            Map<String, Object> result = new HashMap<>();
            result.put("orderId", response.getBody().get("id"));
            result.put("status", response.getBody().get("status"));
            return result;
        }
        
        throw new RuntimeException("Failed to create PayPal order");
    }
    
    @Override
    public Map<String, Object> capturePayment(String orderId) {
        String url = getBaseUrl() + "/v2/checkout/orders/" + orderId + "/capture";
        
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(getAccessToken());
        
        HttpEntity<String> request = new HttpEntity<>(headers);
        
        ResponseEntity<Map> response = restTemplate.postForEntity(url, request, Map.class);
        
        if (response.getBody() != null) {
            Map<String, Object> result = new HashMap<>();
            result.put("transactionId", response.getBody().get("id"));
            result.put("status", response.getBody().get("status"));
            
            // Extract payment details
            List<Map<String, Object>> purchaseUnits = (List<Map<String, Object>>) response.getBody().get("purchase_units");
            if (purchaseUnits != null && !purchaseUnits.isEmpty()) {
                Map<String, Object> payments = (Map<String, Object>) purchaseUnits.get(0).get("payments");
                if (payments != null) {
                    List<Map<String, Object>> captures = (List<Map<String, Object>>) payments.get("captures");
                    if (captures != null && !captures.isEmpty()) {
                        Map<String, Object> capture = captures.get(0);
                        result.put("transactionId", capture.get("id"));
                        result.put("status", capture.get("status"));
                    }
                }
            }
            
            return result;
        }
        
        throw new RuntimeException("Failed to capture PayPal payment");
    }
    
    @Override
    public boolean verifyPayment(Map<String, Object> paymentData) {
        // Implement payment verification logic
        // This could involve checking the payment status with PayPal
        // For now, we'll assume the payment is verified if we have a transaction ID
        return paymentData.containsKey("transactionId") && 
               paymentData.get("status").equals("COMPLETED");
    }
} 
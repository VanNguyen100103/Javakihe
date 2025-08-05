import React, { useState, useEffect } from 'react';
import { PayPalButtons, PayPalScriptProvider } from '@paypal/react-paypal-js';
import { donationAPI } from '../../api/donation';
import { useAppDispatch } from '../../hook';
import { createDonation } from '../../store/asyncAction/donationAsyncAction';
import { toast } from 'react-toastify';
import { FaPaypal, FaSpinner } from 'react-icons/fa';
import { useAuth } from '../../hook';

const PayPalButton = ({ 
  amount, 
  currency = 'USD', 
  donationData, 
  onSuccess, 
  onError, 
  onCancel,
  disabled = false 
}) => {
  const dispatch = useAppDispatch();
  const { user, isAuthenticated } = useAuth();
  const [clientId, setClientId] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [paypalLoaded, setPaypalLoaded] = useState(false);

  useEffect(() => {
    const fetchClientId = async () => {
      try {
        const response = await donationAPI.getPayPalClientId();
        setClientId(response.clientId);
        setPaypalLoaded(true);
      } catch (error) {
        console.error('Failed to fetch PayPal client ID:', error);
        toast.error('Không thể kết nối với PayPal. Vui lòng thử lại sau.');
      }
    };

    fetchClientId();
  }, []);

  const createOrder = async (data, actions) => {
    try {
      setIsLoading(true);
      
      // Convert VND to USD for PayPal
      const vndAmount = parseFloat(amount);
      const usdAmount = vndAmount / 24000.0; // 1 USD = 24,000 VND
      
      const orderData = {
        ...donationData,
        amount: usdAmount.toFixed(2), // Send USD amount
        currency: 'USD', // Force USD currency
        paymentMethod: 'paypal'
      };

      const response = await donationAPI.createPayPalOrder(orderData);
      return response.orderId;
    } catch (error) {
      console.error('Failed to create PayPal order:', error);
      toast.error('Không thể tạo đơn hàng PayPal. Vui lòng thử lại.');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const onApprove = async (data, actions) => {
    try {
      setIsLoading(true);
      
      // Debug logging
      console.log('=== PayPal onApprove Debug ===');
      console.log('isAuthenticated:', isAuthenticated);
      console.log('user object:', user);
      console.log('user.id:', user?.id);
      console.log('user.userId:', user?.userId);
      console.log('user._id:', user?._id);
      
      // Get user ID from localStorage or user object
      let userId = null;
      if (isAuthenticated && user) {
        // Try different ways to get user ID
        userId = user.id || user.userId || user._id;
        console.log('Found userId:', userId);
        
        // If still null, try to get from auth state
        if (!userId) {
          console.log('User object keys:', Object.keys(user));
          console.log('Full user object:', JSON.stringify(user, null, 2));
          console.log('⚠️ User object does not have id field! Please login again.');
        }
      }
      
      // Capture the payment
      const captureResponse = await donationAPI.capturePayPalPayment(data.orderID);
      
      // Convert VND to USD for donation record
      const vndAmount = parseFloat(amount);
      const usdAmount = vndAmount / 24000.0;
      
      // Create donation record with correct USD amount
      const donationResponse = await dispatch(createDonation({
        ...donationData,
        amount: usdAmount.toFixed(2), // Send USD amount
        currency: 'USD', // Use USD currency
        method: 'paypal', // Use method instead of paymentMethod
        userId: userId, // Add user ID if authenticated
        paypalOrderId: data.orderID,
        paypalPayerId: data.payerID,
        transactionId: captureResponse.transactionId,
        status: 'completed'
      })).unwrap();

      toast.success('Quyên góp thành công! Cảm ơn sự đóng góp của bạn.');
      
      if (onSuccess) {
        onSuccess(donationResponse, captureResponse);
      }
    } catch (error) {
      console.error('Payment failed:', error);
      toast.error('Thanh toán thất bại. Vui lòng thử lại.');
      
      if (onError) {
        onError(error);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleError = (err) => {
    console.error('PayPal error:', err);
    toast.error('Có lỗi xảy ra với PayPal. Vui lòng thử lại.');
    
    if (onError) {
      onError(err);
    }
  };

  const handleCancel = () => {
    toast.info('Thanh toán đã bị hủy.');
    
    if (onCancel) {
      onCancel();
    }
  };

  if (!paypalLoaded) {
    return (
      <div className="paypal-loading">
        <FaSpinner className="spinner" />
        <span>Đang tải PayPal...</span>
      </div>
    );
  }

  if (!clientId) {
    return (
      <div className="paypal-error">
        <span>Không thể kết nối với PayPal</span>
      </div>
    );
  }

  return (
    <PayPalScriptProvider
      options={{
        'client-id': clientId,
        currency: 'USD',
        intent: 'capture'
      }}>
      <div className="paypal-button-container">
        {isLoading && (
          <div className="paypal-loading-overlay">
            <FaSpinner className="spinner" />
            <span>Đang xử lý thanh toán...</span>
          </div>
        )}
        
        <PayPalButtons
          style={{
            layout: 'vertical',
            color: 'blue',
            shape: 'rect',
            label: 'pay'
          }}
          createOrder={createOrder}
          onApprove={onApprove}
          onError={handleError}
          onCancel={handleCancel}
          disabled={disabled || isLoading}
        />
      </div>
    </PayPalScriptProvider>
  );
};

export default PayPalButton; 
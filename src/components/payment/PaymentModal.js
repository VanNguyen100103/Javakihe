import React, { useState } from 'react';
import { FaCreditCard, FaPaypal, FaMoneyBillWave, FaTimes } from 'react-icons/fa';
import PayPalButton from './PayPalButton';

const PaymentModal = ({ 
  isOpen, 
  onClose, 
  amount, 
  currency = 'USD',
  donationData,
  onSuccess 
}) => {
  const [selectedMethod, setSelectedMethod] = useState('paypal');
  const [isProcessing, setIsProcessing] = useState(false);

  const paymentMethods = [
    {
      id: 'paypal',
      name: 'PayPal',
      icon: FaPaypal,
      description: 'Thanh toán an toàn qua PayPal',
      color: '#0070ba'
    },
    {
      id: 'credit-card',
      name: 'Thẻ tín dụng',
      icon: FaCreditCard,
      description: 'Thanh toán bằng thẻ Visa/Mastercard',
      color: '#2c3e50'
    },
    {
      id: 'bank-transfer',
      name: 'Chuyển khoản ngân hàng',
      icon: FaMoneyBillWave,
      description: 'Chuyển khoản trực tiếp',
      color: '#27ae60'
    }
  ];

  const formatAmount = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: currency
    }).format(amount);
  };

  const handlePaymentSuccess = (donationResponse, paymentResponse) => {
    setIsProcessing(false);
    if (onSuccess) {
      onSuccess(donationResponse, paymentResponse);
    }
    onClose();
  };

  const handlePaymentError = (error) => {
    setIsProcessing(false);
    console.error('Payment error:', error);
  };

  const handlePaymentCancel = () => {
    setIsProcessing(false);
  };

  const handleCreditCardPayment = async () => {
    setIsProcessing(true);
    // Implement credit card payment logic here
    // This would typically integrate with a payment gateway like Stripe
    setTimeout(() => {
      setIsProcessing(false);
      // Simulate success
      handlePaymentSuccess({ id: 'temp-id' }, {});
    }, 2000);
  };

  const handleBankTransfer = () => {
    // Show bank transfer information
    const bankInfo = {
      bankName: 'Vietcombank',
      accountNumber: '1234567890',
      accountName: 'PawFund Organization',
      transferContent: `DONATION_${Date.now()}`
    };

    const message = `
Thông tin chuyển khoản:
Ngân hàng: ${bankInfo.bankName}
Số tài khoản: ${bankInfo.accountNumber}
Tên tài khoản: ${bankInfo.accountName}
Nội dung: ${bankInfo.transferContent}
Số tiền: ${formatAmount(amount)}
    `;

    alert(message);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b border-secondary-200">
          <h3 className="text-2xl font-bold text-secondary-800">Chọn phương thức thanh toán</h3>
          <button 
            className="text-secondary-500 hover:text-secondary-700 transition-colors duration-300"
            onClick={onClose}
          >
            <FaTimes className="text-xl" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="bg-secondary-50 rounded-lg p-6">
            <h4 className="text-lg font-bold text-secondary-800 mb-4">Tổng quan quyên góp</h4>
            <div className="space-y-3">
              <div className="flex justify-between items-center py-2 border-b border-secondary-200">
                <span className="text-secondary-600">Số tiền:</span>
                <span className="font-bold text-primary-500 text-lg">{formatAmount(amount)}</span>
              </div>
              {donationData.category && (
                <div className="flex justify-between items-center py-2 border-b border-secondary-200">
                  <span className="text-secondary-600">Danh mục:</span>
                  <span>{donationData.category}</span>
                </div>
              )}
              {donationData.message && (
                <div className="flex justify-between items-center py-2">
                  <span className="text-secondary-600">Lời nhắn:</span>
                  <span className="text-right max-w-xs">{donationData.message}</span>
                </div>
              )}
            </div>
          </div>

          <div>
            <h4 className="text-lg font-bold text-secondary-800 mb-4">Phương thức thanh toán</h4>
            <div className="space-y-4">
              {paymentMethods.map((method) => (
                <div
                  key={method.id}
                  className={`flex items-center gap-4 p-4 border-2 rounded-lg cursor-pointer transition-all duration-300 ${
                    selectedMethod === method.id 
                      ? 'border-primary-500 bg-red-50' 
                      : 'border-secondary-200 bg-white hover:border-primary-300'
                  }`}
                  onClick={() => setSelectedMethod(method.id)}
                >
                  <div className="text-2xl min-w-10 text-center" style={{ color: method.color }}>
                    <method.icon />
                  </div>
                  <div className="flex-1">
                    <h5 className="font-bold text-secondary-800 mb-1">{method.name}</h5>
                    <p className="text-secondary-600 text-sm">{method.description}</p>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value={method.id}
                      checked={selectedMethod === method.id}
                      onChange={() => setSelectedMethod(method.id)}
                      className="w-5 h-5 text-primary-500 border-secondary-300 focus:ring-primary-500"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            {selectedMethod === 'paypal' && (
              <PayPalButton
                amount={amount}
                currency={currency}
                donationData={donationData}
                onSuccess={handlePaymentSuccess}
                onError={handlePaymentError}
                onCancel={handlePaymentCancel}
                disabled={isProcessing}
              />
            )}

            {selectedMethod === 'credit-card' && (
              <button
                className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-primary-500 hover:bg-primary-600 text-white rounded-lg font-medium transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={handleCreditCardPayment}
                disabled={isProcessing}
              >
                {isProcessing ? (
                  <>
                    <FaCreditCard />
                    Đang xử lý...
                  </>
                ) : (
                  <>
                    <FaCreditCard />
                    Thanh toán bằng thẻ tín dụng
                  </>
                )}
              </button>
            )}

            {selectedMethod === 'bank-transfer' && (
              <button
                className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-primary-500 hover:bg-primary-600 text-white rounded-lg font-medium transition-colors duration-300"
                onClick={handleBankTransfer}
              >
                <FaMoneyBillWave />
                Xem thông tin chuyển khoản
              </button>
            )}
          </div>

          <div className="bg-secondary-50 rounded-lg p-6 border-l-4 border-green-500">
            <div>
              <h5 className="font-bold text-secondary-800 mb-4">🔒 Bảo mật thanh toán</h5>
              <ul className="space-y-2">
                <li className="flex items-start gap-2 text-secondary-600 text-sm">
                  <span className="text-green-500 font-bold">✓</span>
                  <span>Thông tin thanh toán được mã hóa SSL</span>
                </li>
                <li className="flex items-start gap-2 text-secondary-600 text-sm">
                  <span className="text-green-500 font-bold">✓</span>
                  <span>Không lưu trữ thông tin thẻ tín dụng</span>
                </li>
                <li className="flex items-start gap-2 text-secondary-600 text-sm">
                  <span className="text-green-500 font-bold">✓</span>
                  <span>Tuân thủ tiêu chuẩn PCI DSS</span>
                </li>
                <li className="flex items-start gap-2 text-secondary-600 text-sm">
                  <span className="text-green-500 font-bold">✓</span>
                  <span>Hỗ trợ hoàn tiền trong 30 ngày</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentModal; 
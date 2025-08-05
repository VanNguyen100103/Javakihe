import React from 'react';
import { FaCheckCircle, FaDownload, FaTimes, FaHandHoldingHeart, FaCalendarAlt, FaMoneyBillWave } from 'react-icons/fa';

const DonationSuccess = ({ donation, onClose, onDownloadReceipt }) => {
  const formatAmount = (amount) => {
    // Check if amount is USD (from PayPal) or VND
    const isUSD = donation.currency === 'USD';
    
    if (isUSD) {
      // Convert USD back to VND for display
      const usdAmount = parseFloat(amount);
      const vndAmount = usdAmount * 24000; // 1 USD = 24,000 VND
      return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND'
      }).format(vndAmount);
    } else {
      // Display as VND
      return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND'
      }).format(amount);
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="text-center">
      {/* Success Icon */}
      <div className="mb-6">
        <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
          <FaCheckCircle className="text-4xl text-green-500" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Quyên góp thành công!</h2>
        <p className="text-gray-600">Cảm ơn sự đóng góp của bạn</p>
      </div>

      {/* Donation Details */}
      <div className="bg-gray-50 rounded-xl p-6 mb-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Mã quyên góp:</span>
            <span className="font-semibold text-gray-800">#{donation.id}</span>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Số tiền:</span>
            <span className="font-bold text-primary-500 text-lg">
              {formatAmount(donation.amount)}
            </span>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Danh mục:</span>
            <span className="font-semibold text-gray-800 capitalize">
              {donation.category || 'Chung'}
            </span>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Phương thức:</span>
            <span className="font-semibold text-gray-800">
              {donation.method || 'PayPal'}
            </span>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Thời gian:</span>
            <span className="font-semibold text-gray-800">
              {formatDate(donation.donatedAt || new Date())}
            </span>
          </div>
        </div>
      </div>

      {/* Message */}
      {donation.message && (
        <div className="mb-6">
          <h3 className="font-semibold text-gray-800 mb-2">Lời nhắn của bạn:</h3>
          <p className="text-gray-600 italic">"{donation.message}"</p>
        </div>
      )}

      {/* Impact */}
      <div className="bg-primary-50 rounded-xl p-6 mb-6">
        <div className="flex items-center gap-3 mb-3">
          <FaHandHoldingHeart className="text-2xl text-primary-500" />
          <h3 className="font-semibold text-gray-800">Tác động của quyên góp</h3>
        </div>
        <div className="text-sm text-gray-600 space-y-2">
          <p>• Hỗ trợ chăm sóc y tế cho thú cưng bị bỏ rơi</p>
          <p>• Cung cấp thức ăn và nơi trú ẩn</p>
          <p>• Tìm kiếm gia đình mới cho thú cưng</p>
          <p>• Nâng cao nhận thức về bảo vệ động vật</p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <button
          onClick={onDownloadReceipt}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-primary-500 hover:bg-primary-600 text-white font-medium rounded-lg transition-colors duration-300"
        >
          <FaDownload />
          Tải biên lai
        </button>
        
        <button
          onClick={onClose}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors duration-300"
        >
          <FaTimes />
          Đóng
        </button>
      </div>

      {/* Additional Info */}
      <div className="mt-6 text-xs text-gray-500">
        <p>Bạn sẽ nhận được email xác nhận trong vòng 24 giờ.</p>
        <p>Mọi thắc mắc vui lòng liên hệ: support@pawfund.org</p>
      </div>
    </div>
  );
};

export default DonationSuccess; 
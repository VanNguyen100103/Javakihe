import React, { useState, useEffect } from 'react';
import { useDonation } from '../hook';
import { fetchDonations } from '../store/asyncAction/donationAsyncAction';
import { useAppDispatch } from '../hook';
import { toast } from 'react-toastify';
import { FaHandHoldingHeart, FaCalendarAlt, FaMoneyBillWave, FaSpinner, FaCreditCard, FaPaypal, FaShieldAlt, FaCheck } from 'react-icons/fa';
import LoadingSpinner from '../components/common/LoadingSpinner';
import PaymentModal from '../components/payment/PaymentModal';
import DonationSuccess from '../components/payment/DonationSuccess';

const DonationPage = () => {
  const dispatch = useAppDispatch();
  const { donations, isLoading } = useDonation();
  
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successDonation, setSuccessDonation] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    amount: '',
    message: '',
    anonymous: false,
    category: 'medical'
  });

  useEffect(() => {
    dispatch(fetchDonations());
  }, [dispatch]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      toast.error('Vui lòng nhập số tiền hợp lệ!');
      return;
    }

    if (!formData.message.trim()) {
      toast.error('Vui lòng nhập lời nhắn!');
      return;
    }

    // Show payment modal
    setShowPaymentModal(true);
  };

  const handlePaymentSuccess = (donationResponse, paymentResponse) => {
    setSuccessDonation(donationResponse);
    setShowPaymentModal(false);
    setShowSuccessModal(true);
    setFormData({
      amount: '',
      message: '',
      anonymous: false,
      category: 'medical'
    });
    toast.success('Quyên góp thành công! Cảm ơn sự đóng góp của bạn.');
  };

  const handleSuccessClose = () => {
    setShowSuccessModal(false);
    setSuccessDonation(null);
  };

  const handleDownloadReceipt = () => {
    // Implement receipt download
    toast.info('Tính năng tải biên lai sẽ được phát triển sau');
  };

  const formatAmount = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  const categories = [
    { value: 'medical', label: 'Y tế thú cưng', icon: '🏥' },
    { value: 'food', label: 'Thức ăn', icon: '🍖' },
    { value: 'shelter', label: 'Nơi trú ẩn', icon: '🏠' },
    { value: 'education', label: 'Giáo dục', icon: '📚' },
    { value: 'emergency', label: 'Khẩn cấp', icon: '🚨' },
    { value: 'general', label: 'Chung', icon: '💝' }
  ];

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl lg:text-4xl font-bold text-gray-800 mb-4">Quyên góp</h1>
          <p className="text-xl text-gray-600">Hỗ trợ thú cưng bị bỏ rơi</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Donation Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <div className="flex items-center gap-3 mb-6">
                <FaHandHoldingHeart className="text-3xl text-primary-500" />
                <h2 className="text-2xl font-bold text-gray-800">Quyên góp ngay</h2>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Amount */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Số tiền quyên góp *
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      name="amount"
                      value={formData.amount}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="Nhập số tiền..."
                      min="1000"
                      step="1000"
                      required
                    />
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                      VND
                    </div>
                  </div>
                  {formData.amount && (
                    <p className="text-sm text-gray-600 mt-1">
                      Số tiền: {formatAmount(parseFloat(formData.amount) || 0)}
                    </p>
                  )}
                </div>

                {/* Category */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Danh mục quyên góp *
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    required
                  >
                    {categories.map(category => (
                      <option key={category.value} value={category.value}>
                        {category.icon} {category.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Message */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Lời nhắn *
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    rows="4"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Hãy chia sẻ lý do bạn muốn quyên góp..."
                    required
                  />
                </div>

                {/* Anonymous */}
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="anonymous"
                    checked={formData.anonymous}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-primary-500 focus:ring-primary-500 border-gray-300 rounded"
                  />
                  <label className="ml-2 text-sm text-gray-700">
                    Quyên góp ẩn danh
                  </label>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-primary-500 hover:bg-primary-600 text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <FaSpinner className="animate-spin inline mr-2" />
                      Đang xử lý...
                    </>
                  ) : (
                    <>
                      <FaHandHoldingHeart className="inline mr-2" />
                      Tiếp tục thanh toán
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* Donation Info */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-8">
              <h3 className="text-xl font-bold text-gray-800 mb-6">Thông tin quyên góp</h3>
              
              <div className="space-y-4 mb-6">
                <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                  <FaCheck className="text-green-500" />
                  <span className="text-sm text-green-700">Quyên góp được miễn thuế</span>
                </div>
                
                <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                  <FaShieldAlt className="text-blue-500" />
                  <span className="text-sm text-blue-700">Bảo mật thông tin</span>
                </div>
                
                <div className="flex items-center gap-3 p-3 bg-yellow-50 rounded-lg">
                  <FaMoneyBillWave className="text-yellow-500" />
                  <span className="text-sm text-yellow-700">Thanh toán an toàn</span>
                </div>
              </div>

              <div className="border-t pt-6">
                <h4 className="font-semibold text-gray-800 mb-3">Phương thức thanh toán</h4>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <FaPaypal className="text-blue-500" />
                    <span className="text-sm">PayPal</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FaCreditCard className="text-gray-500" />
                    <span className="text-sm">Thẻ tín dụng</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FaMoneyBillWave className="text-green-500" />
                    <span className="text-sm">Chuyển khoản ngân hàng</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Donations */}
        {donations && donations.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Quyên góp gần đây</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {donations.slice(0, 6).map((donation) => (
                <div key={donation.id} className="bg-white rounded-xl shadow-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <FaHandHoldingHeart className="text-primary-500" />
                      <span className="font-semibold text-gray-800">
                        {donation.anonymous ? 'Người quyên góp ẩn danh' : donation.user?.username || 'Khách'}
                      </span>
                    </div>
                    <span className="text-sm text-gray-500">
                      <FaCalendarAlt className="inline mr-1" />
                      {new Date(donation.donatedAt).toLocaleDateString('vi-VN')}
                    </span>
                  </div>
                  <p className="text-gray-600 mb-3">{donation.message}</p>
                  <div className="text-lg font-bold text-primary-500">
                    {formatAmount(donation.amount)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Payment Modal */}
        <PaymentModal
          isOpen={showPaymentModal}
          onClose={() => setShowPaymentModal(false)}
          amount={parseFloat(formData.amount) || 0}
          currency="VND"
          donationData={formData}
          onSuccess={handlePaymentSuccess}
        />

        {/* Success Modal */}
        {showSuccessModal && successDonation && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4">
              <DonationSuccess
                donation={successDonation}
                onClose={handleSuccessClose}
                onDownloadReceipt={handleDownloadReceipt}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DonationPage; 

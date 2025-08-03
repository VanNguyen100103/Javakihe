import React, { useState, useEffect } from 'react';
import { useUser, useAuth } from '../hook';
import { fetchCurrentUser, updateUserProfile, changePassword } from '../store/asyncAction/userAsyncAction';
import { useAppDispatch } from '../hook';
import { setUser } from '../store/slice/authSlice';
import { toast } from 'react-toastify';
import { FaUser, FaEye, FaEyeSlash, FaSpinner } from 'react-icons/fa';
import LoadingSpinner from '../components/common/LoadingSpinner';

const ProfilePage = () => {
  const dispatch = useAppDispatch();
  const { user, isLoading } = useUser();
  const { user: authUser } = useAuth();
  
  const [activeTab, setActiveTab] = useState('profile');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [profileData, setProfileData] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: ''
  });
  
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    dispatch(fetchCurrentUser());
  }, [dispatch]);

  useEffect(() => {
    if (user) {
      setProfileData({
        fullName: user.fullName || '',
        email: user.email || '',
        phone: user.phone || '',
        address: user.address || ''
      });
    }
  }, [user]);

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!profileData.fullName.trim()) {
      toast.error('Vui lòng nhập họ và tên!');
      return;
    }
    
    if (!profileData.email.trim()) {
      toast.error('Vui lòng nhập email!');
      return;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(profileData.email)) {
      toast.error('Email không hợp lệ!');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const updatedUser = await dispatch(updateUserProfile(profileData)).unwrap();
      toast.success('Cập nhật thông tin thành công!');
      
      // Refresh user data
      dispatch(fetchCurrentUser());
      
      // Update auth state
      dispatch(setUser(updatedUser));
      
      // Update localStorage with new user data
      localStorage.setItem('user', JSON.stringify(updatedUser));
    } catch (error) {
      toast.error(error || 'Cập nhật thất bại!');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    
    if (passwordData.newPassword.length < 6) {
      toast.error('Mật khẩu mới phải có ít nhất 6 ký tự!');
      return;
    }
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('Mật khẩu xác nhận không khớp!');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      await dispatch(changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      })).unwrap();
      toast.success('Đổi mật khẩu thành công!');
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (error) {
      toast.error(error || 'Đổi mật khẩu thất bại!');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  const currentUser = user || authUser;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Page Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Hồ sơ cá nhân</h1>
            <p className="text-gray-600">Quản lý thông tin tài khoản của bạn</p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            {/* User Info Card */}
            <div className="bg-gradient-to-r from-primary-500 to-primary-600 p-8 text-white">
              <div className="flex items-center space-x-6">
                <div className="w-20 h-20 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                  <FaUser className="text-3xl" />
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold mb-2">
                    {currentUser?.fullName || currentUser?.username}
                  </h2>
                  <p className="text-primary-100 mb-4">{currentUser?.email}</p>
                  <div className="flex space-x-8">
                    <div className="text-center">
                      <div className="text-2xl font-bold">5</div>
                      <div className="text-sm text-primary-100">Thú cưng đã nhận nuôi</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold">3</div>
                      <div className="text-sm text-primary-100">Lần quyên góp</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold">12</div>
                      <div className="text-sm text-primary-100">Sự kiện tham gia</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="border-b border-gray-200">
              <div className="flex">
                <button
                  className={`flex-1 py-4 px-6 text-center font-medium transition-colors duration-300 ${
                    activeTab === 'profile'
                      ? 'text-primary-600 border-b-2 border-primary-600'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                  onClick={() => setActiveTab('profile')}
                >
                  Thông tin cá nhân
                </button>
                <button
                  className={`flex-1 py-4 px-6 text-center font-medium transition-colors duration-300 ${
                    activeTab === 'password'
                      ? 'text-primary-600 border-b-2 border-primary-600'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                  onClick={() => setActiveTab('password')}
                >
                  Đổi mật khẩu
                </button>
              </div>
            </div>

            {/* Tab Content */}
            <div className="p-8">
              {activeTab === 'profile' && (
                <div>
                  <h3 className="text-xl font-bold text-gray-800 mb-6">Cập nhật thông tin cá nhân</h3>
                  <form onSubmit={handleProfileSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-2">
                          Họ và tên
                        </label>
                        <input
                          type="text"
                          id="fullName"
                          name="fullName"
                          value={profileData.fullName}
                          onChange={handleProfileChange}
                          placeholder="Nhập họ và tên"
                          disabled={isSubmitting}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-300 disabled:bg-gray-100"
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                          Email
                        </label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={profileData.email}
                          onChange={handleProfileChange}
                          placeholder="Nhập email"
                          disabled={isSubmitting}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-300 disabled:bg-gray-100"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                          Số điện thoại
                        </label>
                        <input
                          type="tel"
                          id="phone"
                          name="phone"
                          value={profileData.phone}
                          onChange={handleProfileChange}
                          placeholder="Nhập số điện thoại"
                          disabled={isSubmitting}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-300 disabled:bg-gray-100"
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
                          Địa chỉ
                        </label>
                        <input
                          type="text"
                          id="address"
                          name="address"
                          value={profileData.address}
                          onChange={handleProfileChange}
                          placeholder="Nhập địa chỉ"
                          disabled={isSubmitting}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-300 disabled:bg-gray-100"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full md:w-auto px-8 py-3 bg-primary-600 text-white font-bold rounded-xl hover:bg-primary-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                    >
                      {isSubmitting ? (
                        <>
                          <FaSpinner className="animate-spin" />
                          <span>Đang cập nhật...</span>
                        </>
                      ) : (
                        'Cập nhật thông tin'
                      )}
                    </button>
                  </form>
                </div>
              )}

              {activeTab === 'password' && (
                <div>
                  <h3 className="text-xl font-bold text-gray-800 mb-6">Đổi mật khẩu</h3>
                  <form onSubmit={handlePasswordSubmit} className="space-y-6">
                    <div>
                      <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 mb-2">
                        Mật khẩu hiện tại
                      </label>
                      <div className="relative">
                        <input
                          type={showCurrentPassword ? 'text' : 'password'}
                          id="currentPassword"
                          name="currentPassword"
                          value={passwordData.currentPassword}
                          onChange={handlePasswordChange}
                          placeholder="Nhập mật khẩu hiện tại"
                          required
                          disabled={isSubmitting}
                          className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-300 disabled:bg-gray-100"
                        />
                        <button
                          type="button"
                          onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                          disabled={isSubmitting}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          {showCurrentPassword ? <FaEyeSlash /> : <FaEye />}
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-2">
                          Mật khẩu mới
                        </label>
                        <div className="relative">
                          <input
                            type={showNewPassword ? 'text' : 'password'}
                            id="newPassword"
                            name="newPassword"
                            value={passwordData.newPassword}
                            onChange={handlePasswordChange}
                            placeholder="Nhập mật khẩu mới"
                            required
                            disabled={isSubmitting}
                            className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-300 disabled:bg-gray-100"
                          />
                          <button
                            type="button"
                            onClick={() => setShowNewPassword(!showNewPassword)}
                            disabled={isSubmitting}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                          >
                            {showNewPassword ? <FaEyeSlash /> : <FaEye />}
                          </button>
                        </div>
                      </div>
                      
                      <div>
                        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                          Xác nhận mật khẩu mới
                        </label>
                        <div className="relative">
                          <input
                            type={showConfirmPassword ? 'text' : 'password'}
                            id="confirmPassword"
                            name="confirmPassword"
                            value={passwordData.confirmPassword}
                            onChange={handlePasswordChange}
                            placeholder="Nhập lại mật khẩu mới"
                            required
                            disabled={isSubmitting}
                            className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-300 disabled:bg-gray-100"
                          />
                          <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            disabled={isSubmitting}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                          >
                            {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                          </button>
                        </div>
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full md:w-auto px-8 py-3 bg-primary-600 text-white font-bold rounded-xl hover:bg-primary-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                    >
                      {isSubmitting ? (
                        <>
                          <FaSpinner className="animate-spin" />
                          <span>Đang đổi mật khẩu...</span>
                        </>
                      ) : (
                        'Đổi mật khẩu'
                      )}
                    </button>
                  </form>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage; 

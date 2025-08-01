import React, { useState, useEffect } from 'react';
import { FaHandHoldingHeart, FaUsers, FaMoneyBillWave, FaPaw } from 'react-icons/fa';
import { donationAPI } from '../../api/donation';
import { useAuth } from '../../hook';

const DonationStats = () => {
  const { isAuthenticated } = useAuth();
  const [stats, setStats] = useState({
    totalDonations: 0,
    totalAmount: 0,
    totalDonors: 0,
    monthlyGoal: 50000000, // 50M VND
    monthlyRaised: 0
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setIsLoading(true);
        
        // If not authenticated, show mock data
        if (!isAuthenticated) {
          setStats({
            totalDonations: 1250,
            totalAmount: 45000000,
            totalDonors: 320,
            monthlyGoal: 50000000,
            monthlyRaised: 18000000
          });
          return;
        }

        // Fetch donation statistics only if authenticated
        const response = await donationAPI.getDonations({ size: 1000 });
        
        if (response && response.content) {
          const donations = response.content;
          const totalAmount = donations.reduce((sum, donation) => sum + donation.amount, 0);
          const uniqueDonors = new Set(donations.map(d => d.user?.id)).size;
          
          // Calculate monthly raised (last 30 days)
          const thirtyDaysAgo = new Date();
          thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
          const monthlyDonations = donations.filter(donation => 
            new Date(donation.createdAt) >= thirtyDaysAgo
          );
          const monthlyRaised = monthlyDonations.reduce((sum, donation) => sum + donation.amount, 0);

          setStats({
            totalDonations: donations.length,
            totalAmount,
            totalDonors: uniqueDonors,
            monthlyGoal: 50000000,
            monthlyRaised
          });
        }
      } catch (error) {
        console.error('Failed to fetch donation stats:', error);
        // Fallback to mock data on error
        setStats({
          totalDonations: 1250,
          totalAmount: 45000000,
          totalDonors: 320,
          monthlyGoal: 50000000,
          monthlyRaised: 18000000
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, [isAuthenticated]);

  const formatAmount = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  const calculateProgress = () => {
    return Math.min((stats.monthlyRaised / stats.monthlyGoal) * 100, 100);
  };

  if (isLoading) {
    return (
      <div className="py-16 bg-secondary-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white rounded-xl p-8 text-center shadow-md animate-pulse">
                <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-4"></div>
                <div className="space-y-2">
                  <div className="w-20 h-8 bg-gray-200 rounded mx-auto"></div>
                  <div className="w-24 h-4 bg-gray-200 rounded mx-auto"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-16 bg-secondary-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-secondary-800 mb-4">Thống kê quyên góp</h2>
          <p className="text-secondary-600 text-lg">Những con số ấn tượng về sự đóng góp của cộng đồng</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div className="bg-white rounded-xl p-8 text-center shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <FaHandHoldingHeart className="text-5xl text-primary-500 mx-auto mb-4" />
            <div className="space-y-2">
              <span className="text-4xl font-bold text-secondary-800 block">{stats.totalDonations.toLocaleString()}</span>
              <span className="text-secondary-600 text-sm uppercase tracking-wider">Lần quyên góp</span>
            </div>
          </div>

          <div className="bg-white rounded-xl p-8 text-center shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <FaMoneyBillWave className="text-5xl text-green-500 mx-auto mb-4" />
            <div className="space-y-2">
              <span className="text-4xl font-bold text-secondary-800 block">{formatAmount(stats.totalAmount)}</span>
              <span className="text-secondary-600 text-sm uppercase tracking-wider">Tổng số tiền</span>
            </div>
          </div>

          <div className="bg-white rounded-xl p-8 text-center shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <FaUsers className="text-5xl text-blue-500 mx-auto mb-4" />
            <div className="space-y-2">
              <span className="text-4xl font-bold text-secondary-800 block">{stats.totalDonors.toLocaleString()}</span>
              <span className="text-secondary-600 text-sm uppercase tracking-wider">Người quyên góp</span>
            </div>
          </div>

          <div className="bg-white rounded-xl p-8 text-center shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <FaPaw className="text-5xl text-purple-500 mx-auto mb-4" />
            <div className="space-y-2">
              <span className="text-4xl font-bold text-secondary-800 block">{formatAmount(stats.monthlyRaised)}</span>
              <span className="text-secondary-600 text-sm uppercase tracking-wider">Tháng này</span>
            </div>
          </div>
        </div>

        {/* Monthly Goal Progress */}
        <div className="bg-white rounded-xl p-8 shadow-md">
          <div className="text-center mb-6">
            <h3 className="text-2xl font-bold text-secondary-800 mb-2">Mục tiêu tháng này</h3>
            <p className="text-secondary-600">Chúng tôi đang cố gắng đạt được mục tiêu {formatAmount(stats.monthlyGoal)}</p>
          </div>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-secondary-700">Tiến độ</span>
              <span className="text-sm font-medium text-secondary-700">
                {formatAmount(stats.monthlyRaised)} / {formatAmount(stats.monthlyGoal)}
              </span>
            </div>
            
            <div className="w-full bg-secondary-200 rounded-full h-4">
              <div 
                className="bg-gradient-to-r from-primary-500 to-primary-600 h-4 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${calculateProgress()}%` }}
              ></div>
            </div>
            
            <div className="text-center">
              <span className="text-2xl font-bold text-primary-600">
                {calculateProgress().toFixed(1)}%
              </span>
              <span className="text-secondary-600 text-sm ml-2">hoàn thành</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DonationStats; 
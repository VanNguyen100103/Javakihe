import React, { useState, useEffect } from 'react';
import { useAuthContext } from '../../contexts/AuthContext';
import { donationAPI } from '../../api/donation';

const DonationStatistics = () => {
  const { isAdmin } = useAuthContext();
  const [stats, setStats] = useState({
    totalDonations: 0,
    totalAmount: 0,
    uniqueDonors: 0,
    thisMonthAmount: 0,
    monthlyGoal: 10000,
    progressPercentage: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDonationStats = async () => {
    try {
      setLoading(true);
      setError(null);

      console.log('Fetching real donation statistics from backend...');

      const response = await donationAPI.getDonationStatistics();
      console.log('Donation statistics response:', response);

      setStats({
        totalDonations: response.totalDonations || 0,
        totalAmount: response.totalAmount || 0,
        uniqueDonors: response.uniqueDonors || 0,
        thisMonthAmount: response.thisMonthAmount || 0,
        monthlyGoal: 10000,
        progressPercentage: response.progressPercentage || 0
      });

    } catch (err) {
      console.error('Error fetching donation statistics:', err);
      setError(err.message || 'Failed to fetch donation statistics');
      
      // Set empty stats on error
      setStats({
        totalDonations: 0,
        totalAmount: 0,
        uniqueDonors: 0,
        thisMonthAmount: 0,
        monthlyGoal: 10000,
        progressPercentage: 0
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAdmin) {
      fetchDonationStats();
    }
  }, [isAdmin]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  if (!isAdmin) {
    return null;
  }

  if (loading) {
    return (
      <div className="bg-white rounded-xl p-6 shadow-md mb-8">
        <h2 className="text-xl font-bold text-secondary-800 mb-6">Thống kê quyên góp</h2>
        <div className="flex justify-center items-center py-10">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-xl p-6 shadow-md mb-8">
        <h2 className="text-xl font-bold text-secondary-800 mb-6">Thống kê quyên góp</h2>
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600">Lỗi tải dữ liệu: {error}</p>
          <button 
            onClick={fetchDonationStats}
            className="mt-2 text-sm text-red-600 hover:text-red-800 underline"
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl p-6 shadow-md mb-8">
      <h2 className="text-xl font-bold text-secondary-800 mb-6">Thống kê quyên góp</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <div className="text-center">
          <div className="text-3xl font-bold text-blue-600">{stats.totalDonations}</div>
          <div className="text-sm text-secondary-600">Tổng lượt quyên góp</div>
        </div>
        <div className="text-center">
          <div className="text-3xl font-bold text-green-600">{formatCurrency(stats.totalAmount)}</div>
          <div className="text-sm text-secondary-600">Tổng số tiền</div>
        </div>
        <div className="text-center">
          <div className="text-3xl font-bold text-purple-600">{stats.uniqueDonors}</div>
          <div className="text-sm text-secondary-600">Người quyên góp</div>
        </div>
        <div className="text-center">
          <div className="text-3xl font-bold text-orange-600">{formatCurrency(stats.thisMonthAmount)}</div>
          <div className="text-sm text-secondary-600">Tháng này</div>
        </div>
      </div>

      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-secondary-700">Mục tiêu tháng này</span>
          <span className="text-sm text-secondary-600">{formatCurrency(stats.thisMonthAmount)} / {formatCurrency(stats.monthlyGoal)}</span>
        </div>
        <div className="w-full bg-secondary-200 rounded-full h-2">
          <div 
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${Math.min(stats.progressPercentage, 100)}%` }}
          ></div>
        </div>
        <div className="text-right mt-1">
          <span className="text-sm text-secondary-600">{stats.progressPercentage.toFixed(1)}%</span>
        </div>
      </div>
    </div>
  );
};

export default DonationStatistics; 
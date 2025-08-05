import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../../contexts/AuthContext';
import { FaUsers, FaPaw, FaHandHoldingHeart, FaChartLine, FaCog } from 'react-icons/fa';
import DonationStatistics from '../../components/admin/DonationStatistics';
import PieChart from '../../components/admin/PieChart';
import Histogram from '../../components/admin/Histogram';
import { useAdminStats } from '../../hook/useAdminStats';
import { useRecentActivities } from '../../hook/useRecentActivities';
import { useChartData } from '../../hook/useChartData';

const DashboardPage = () => {
  const { user, isAdmin } = useAuthContext();
  const navigate = useNavigate();
  const { stats, loading, error, refreshStats } = useAdminStats();
  const { activities, loading: activitiesLoading, formatTimeAgo } = useRecentActivities();
  const { chartData, loading: chartLoading, error: chartError, refreshChartData } = useChartData();

  // Check if user is admin
  useEffect(() => {
    if (user && !isAdmin) {
      console.log('User is not admin, redirecting...');
      navigate('/');
    }
  }, [user, isAdmin, navigate]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatNumber = (num) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  const statsData = [
    {
      title: 'Tổng người dùng',
      value: formatNumber(stats.totalUsers),
      icon: FaUsers,
      color: 'bg-blue-500',
      change: stats.userChange,
      changeType: 'positive'
    },
    {
      title: 'Thú cưng',
      value: formatNumber(stats.totalPets),
      icon: FaPaw,
      color: 'bg-green-500',
      change: stats.petChange,
      changeType: 'positive'
    },
    {
      title: 'Lượt nhận nuôi',
      value: formatNumber(stats.totalAdoptions),
      icon: FaHandHoldingHeart,
      color: 'bg-purple-500',
      change: stats.adoptionChange,
      changeType: 'positive'
    },
    {
      title: 'Quyên góp (USD)',
      value: formatCurrency(stats.totalDonations),
      icon: FaChartLine,
      color: 'bg-orange-500',
      change: stats.donationChange,
      changeType: 'positive'
    }
  ];

  const quickActions = [
    {
      title: 'Quản lý người dùng',
      description: 'Xem và quản lý tất cả người dùng',
      icon: FaUsers,
      path: '/admin/users',
      color: 'bg-blue-500 hover:bg-blue-600'
    },
    {
      title: 'Quản lý thú cưng',
      description: 'Thêm, sửa, xóa thú cưng',
      icon: FaPaw,
      path: '/admin/pets',
      color: 'bg-green-500 hover:bg-green-600'
    },
    {
      title: 'Quản lý nhận nuôi',
      description: 'Duyệt đơn nhận nuôi',
      icon: FaHandHoldingHeart,
      path: '/admin/adoptions',
      color: 'bg-purple-500 hover:bg-purple-600'
    },
    {
      title: 'Cài đặt hệ thống',
      description: 'Cấu hình hệ thống',
      icon: FaCog,
      path: '/admin/settings',
      color: 'bg-gray-500 hover:bg-gray-600'
    }
  ];

  if (loading) {
    return (
      <div className="py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-secondary-800 mb-2">
            Dashboard Admin
          </h1>
          <p className="text-secondary-600">
            Chào mừng {user?.fullname || user?.username}, đây là tổng quan hệ thống
          </p>
          {error && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600">Lỗi tải dữ liệu: {error}</p>
              <button 
                onClick={refreshStats}
                className="mt-2 text-sm text-red-600 hover:text-red-800 underline"
              >
                Thử lại
              </button>
            </div>
          )}
          {!error && !loading && (
            <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-yellow-700">
                <span className="font-semibold">Lưu ý:</span> Đang hiển thị dữ liệu mẫu vì backend chưa khả dụng. 
                Vui lòng khởi động backend server để xem dữ liệu thật.
              </p>
            </div>
          )}
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statsData.map((stat, index) => (
            <div key={index} className="bg-white rounded-xl p-6 shadow-md">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-secondary-600 text-sm">{stat.title}</p>
                  <p className="text-3xl font-bold text-secondary-800">{stat.value}</p>
                  <p className={`text-sm ${stat.changeType === 'positive' ? 'text-green-500' : 'text-red-500'}`}>
                    {stat.change} so với tháng trước
                  </p>
                </div>
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <stat.icon className="text-white text-2xl" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Donation Statistics - Admin Only */}
        <DonationStatistics />

        {/* Charts Section */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-secondary-800 mb-6">Biểu đồ thống kê</h2>
          
          {chartLoading ? (
            <div className="flex justify-center items-center py-10">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
            </div>
          ) : chartError ? (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600">Lỗi tải biểu đồ: {chartError}</p>
              <button 
                onClick={refreshChartData}
                className="mt-2 text-sm text-red-600 hover:text-red-800 underline"
              >
                Thử lại
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Pie Charts */}
              <div className="lg:col-span-2 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <PieChart 
                    data={chartData.petStatusData}
                    title="Trạng thái thú cưng"
                  />
                  <PieChart 
                    data={chartData.adoptionStatusData}
                    title="Trạng thái đơn nhận nuôi"
                  />
                </div>
              </div>
              
              {/* Histogram */}
              <div className="lg:col-span-1">
                <Histogram 
                  data={chartData.monthlyDonations}
                  title="Quyên góp theo tháng (USD)"
                />
              </div>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl p-6 shadow-md mb-8">
          <h2 className="text-xl font-bold text-secondary-800 mb-6">Thao tác nhanh</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map((action, index) => (
              <div 
                key={index} 
                className="group cursor-pointer"
                onClick={() => navigate(action.path)}
              >
                <div className={`${action.color} p-6 rounded-lg text-white transition-all duration-300 transform group-hover:scale-105`}>
                  <action.icon className="text-3xl mb-4" />
                  <h3 className="text-lg font-bold mb-2">{action.title}</h3>
                  <p className="text-sm opacity-90">{action.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-xl p-6 shadow-md">
          <h2 className="text-xl font-bold text-secondary-800 mb-6">Hoạt động gần đây</h2>
          <div className="space-y-4">
            {activitiesLoading ? (
              <div className="flex justify-center items-center py-10">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
              </div>
            ) : activities.length === 0 ? (
              <p className="text-secondary-600 text-center py-10">Không có hoạt động gần đây.</p>
            ) : (
              activities.map((activity, index) => (
                <div key={index} className="flex items-center gap-4 p-4 bg-secondary-50 rounded-lg">
                  <div className={`w-3 h-3 bg-${activity.color}-500 rounded-full`}></div>
                  <div className="flex-1">
                    <p className="font-medium text-secondary-800">{activity.title}</p>
                    <p className="text-sm text-secondary-600">
                      {activity.description}
                    </p>
                  </div>
                  <span className="text-sm text-secondary-500">{formatTimeAgo(activity.timestamp)}</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage; 
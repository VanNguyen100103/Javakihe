import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../../contexts/AuthContext';
import { FaUsers, FaPaw, FaHandHoldingHeart, FaChartLine, FaCog } from 'react-icons/fa';

const DashboardPage = () => {
  const { user, isAdmin } = useAuthContext();
  const navigate = useNavigate();

  const stats = [
    {
      title: 'Tổng người dùng',
      value: '1,234',
      icon: FaUsers,
      color: 'bg-blue-500',
      change: '+12%',
      changeType: 'positive'
    },
    {
      title: 'Thú cưng',
      value: '567',
      icon: FaPaw,
      color: 'bg-green-500',
      change: '+8%',
      changeType: 'positive'
    },
    {
      title: 'Lượt nhận nuôi',
      value: '89',
      icon: FaHandHoldingHeart,
      color: 'bg-purple-500',
      change: '+15%',
      changeType: 'positive'
    },
    {
      title: 'Quyên góp (VNĐ)',
      value: '45.2M',
      icon: FaChartLine,
      color: 'bg-orange-500',
      change: '+23%',
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
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
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
            <div className="flex items-center gap-4 p-4 bg-secondary-50 rounded-lg">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <div className="flex-1">
                <p className="font-medium text-secondary-800">Người dùng mới đăng ký</p>
                <p className="text-sm text-secondary-600">user123 đã đăng ký tài khoản</p>
              </div>
              <span className="text-sm text-secondary-500">2 phút trước</span>
            </div>
            <div className="flex items-center gap-4 p-4 bg-secondary-50 rounded-lg">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <div className="flex-1">
                <p className="font-medium text-secondary-800">Đơn nhận nuôi mới</p>
                <p className="text-sm text-secondary-600">Đơn nhận nuôi cho thú cưng #123</p>
              </div>
              <span className="text-sm text-secondary-500">15 phút trước</span>
            </div>
            <div className="flex items-center gap-4 p-4 bg-secondary-50 rounded-lg">
              <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
              <div className="flex-1">
                <p className="font-medium text-secondary-800">Quyên góp mới</p>
                <p className="text-sm text-secondary-600">Quyên góp 500,000 VNĐ từ donor456</p>
              </div>
              <span className="text-sm text-secondary-500">1 giờ trước</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage; 
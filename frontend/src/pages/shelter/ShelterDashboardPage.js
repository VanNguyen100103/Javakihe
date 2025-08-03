import React from 'react';
import { useAuthContext } from '../../contexts/AuthContext';
import { FaPaw, FaHandHoldingHeart, FaUsers, FaChartLine, FaPlus } from 'react-icons/fa';

const ShelterDashboardPage = () => {
  const { user } = useAuthContext();

  const stats = [
    {
      title: 'Thú cưng hiện có',
      value: '45',
      icon: FaPaw,
      color: 'bg-green-500',
      change: '+3',
      changeType: 'positive'
    },
    {
      title: 'Đơn nhận nuôi',
      value: '12',
      icon: FaHandHoldingHeart,
      color: 'bg-purple-500',
      change: '+2',
      changeType: 'positive'
    },
    {
      title: 'Đã nhận nuôi',
      value: '8',
      icon: FaUsers,
      color: 'bg-blue-500',
      change: '+1',
      changeType: 'positive'
    },
    {
      title: 'Quyên góp (VNĐ)',
      value: '2.5M',
      icon: FaChartLine,
      color: 'bg-orange-500',
      change: '+15%',
      changeType: 'positive'
    }
  ];

  const quickActions = [
    {
      title: 'Thêm thú cưng',
      description: 'Đăng ký thú cưng mới',
      icon: FaPlus,
      path: '/shelter/pets/add',
      color: 'bg-green-500 hover:bg-green-600'
    },
    {
      title: 'Quản lý thú cưng',
      description: 'Xem và chỉnh sửa thông tin',
      icon: FaPaw,
      path: '/shelter/pets',
      color: 'bg-blue-500 hover:bg-blue-600'
    },
    {
      title: 'Quản lý người dùng',
      description: 'Xem và quản lý người dùng',
      icon: FaUsers,
      path: '/shelter/users',
      color: 'bg-purple-500 hover:bg-purple-600'
    },
    {
      title: 'Duyệt đơn nhận nuôi',
      description: 'Xem và phê duyệt đơn',
      icon: FaHandHoldingHeart,
      path: '/shelter/adoptions',
      color: 'bg-orange-500 hover:bg-orange-600'
    }
  ];

  const recentPets = [
    {
      id: 1,
      name: 'Lucky',
      breed: 'Golden Retriever',
      age: 2,
      status: 'available',
      image: 'https://example.com/lucky.jpg'
    },
    {
      id: 2,
      name: 'Milo',
      breed: 'Persian Cat',
      age: 1,
      status: 'pending',
      image: 'https://example.com/milo.jpg'
    },
    {
      id: 3,
      name: 'Buddy',
      breed: 'Labrador',
      age: 3,
      status: 'adopted',
      image: 'https://example.com/buddy.jpg'
    }
  ];

  return (
    <div className="py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-secondary-800 mb-2">
            Dashboard Shelter
          </h1>
          <p className="text-secondary-600">
            Chào mừng {user?.fullname || user?.username}, quản lý thú cưng của bạn
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
                    {stat.change} so với tuần trước
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
              <div key={index} className="group cursor-pointer">
                <div className={`${action.color} p-6 rounded-lg text-white transition-all duration-300 transform group-hover:scale-105`}>
                  <action.icon className="text-3xl mb-4" />
                  <h3 className="text-lg font-bold mb-2">{action.title}</h3>
                  <p className="text-sm opacity-90">{action.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Pets */}
        <div className="bg-white rounded-xl p-6 shadow-md mb-8">
          <h2 className="text-xl font-bold text-secondary-800 mb-6">Thú cưng gần đây</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {recentPets.map((pet) => (
              <div key={pet.id} className="border border-secondary-200 rounded-lg p-4">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-secondary-200 rounded-lg flex items-center justify-center">
                    <FaPaw className="text-2xl text-secondary-500" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-secondary-800">{pet.name}</h3>
                    <p className="text-sm text-secondary-600">{pet.breed}</p>
                    <p className="text-sm text-secondary-600">{pet.age} tuổi</p>
                    <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                      pet.status === 'available' ? 'bg-green-100 text-green-800' :
                      pet.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {pet.status === 'available' ? 'Có sẵn' :
                       pet.status === 'pending' ? 'Đang xử lý' : 'Đã nhận nuôi'}
                    </span>
                  </div>
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
                <p className="font-medium text-secondary-800">Thú cưng mới được thêm</p>
                <p className="text-sm text-secondary-600">Lucky (Golden Retriever) đã được đăng ký</p>
              </div>
              <span className="text-sm text-secondary-500">1 giờ trước</span>
            </div>
            <div className="flex items-center gap-4 p-4 bg-secondary-50 rounded-lg">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <div className="flex-1">
                <p className="font-medium text-secondary-800">Đơn nhận nuôi mới</p>
                <p className="text-sm text-secondary-600">Đơn nhận nuôi cho Milo từ user123</p>
              </div>
              <span className="text-sm text-secondary-500">3 giờ trước</span>
            </div>
            <div className="flex items-center gap-4 p-4 bg-secondary-50 rounded-lg">
              <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
              <div className="flex-1">
                <p className="font-medium text-secondary-800">Quyên góp mới</p>
                <p className="text-sm text-secondary-600">Quyên góp 200,000 VNĐ cho thú cưng</p>
              </div>
              <span className="text-sm text-secondary-500">5 giờ trước</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShelterDashboardPage; 

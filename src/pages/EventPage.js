import React, { useState, useEffect } from 'react';
import { useEvent } from '../hook';
import { fetchEvents } from '../store/asyncAction/eventAsyncAction';
import { useAppDispatch } from '../hook';
import { FaCalendarAlt, FaMapMarkerAlt, FaUsers, FaClock, FaHeart, FaSearch, FaHandHoldingHeart, FaGraduationCap, FaHandsHelping, FaDollarSign } from 'react-icons/fa';
import LoadingSpinner from '../components/common/LoadingSpinner';

const EventPage = () => {
  const dispatch = useAppDispatch();
  const { events, isLoading } = useEvent();
  
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const params = {};
    if (selectedCategory !== 'all') {
      params.category = selectedCategory.toUpperCase();
    }
    if (searchTerm) {
      params.search = searchTerm;
    }
    dispatch(fetchEvents(params));
  }, [dispatch, selectedCategory, searchTerm]);

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Use events directly since filtering is now done on server-side
  const filteredEvents = events || [];

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'upcoming':
        return 'bg-blue-500 text-white';
      case 'ongoing':
        return 'bg-green-500 text-white';
      case 'completed':
        return 'bg-gray-500 text-white';
      case 'cancelled':
        return 'bg-red-500 text-white';
      default:
        return 'bg-gray-400 text-white';
    }
  };

  const getStatusText = (status) => {
    switch (status?.toLowerCase()) {
      case 'upcoming':
        return 'Sắp diễn ra';
      case 'ongoing':
        return 'Đang diễn ra';
      case 'completed':
        return 'Đã kết thúc';
      case 'cancelled':
        return 'Đã hủy';
      default:
        return 'Không xác định';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  const formatTime = (timeString) => {
    return new Date(`2000-01-01T${timeString}`).toLocaleTimeString('vi-VN', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const categories = [
    { value: 'all', label: 'Tất cả', icon: FaCalendarAlt },
    { value: 'adoption', label: 'Nhận nuôi', icon: FaHeart },
    { value: 'donation', label: 'Quyên góp', icon: FaHandHoldingHeart },
    { value: 'volunteer', label: 'Tình nguyện', icon: FaHandsHelping },
    { value: 'education', label: 'Giáo dục', icon: FaGraduationCap },
    { value: 'fundraising', label: 'Gây quỹ', icon: FaDollarSign }
  ];

  const eventTypes = [
    {
      icon: FaHeart,
      title: 'Nhận nuôi',
      description: 'Sự kiện kết nối thú cưng với người nhận nuôi',
      color: 'text-red-500'
    },
    {
      icon: FaHandHoldingHeart,
      title: 'Quyên góp',
      description: 'Sự kiện gây quỹ để chăm sóc thú cưng',
      color: 'text-green-500'
    },
    {
      icon: FaHandsHelping,
      title: 'Tình nguyện',
      description: 'Cơ hội tình nguyện chăm sóc thú cưng',
      color: 'text-blue-500'
    },
    {
      icon: FaGraduationCap,
      title: 'Giáo dục',
      description: 'Hội thảo về chăm sóc và bảo vệ thú cưng',
      color: 'text-purple-500'
    }
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-600 to-primary-700 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl lg:text-5xl font-bold mb-4">
            Sự kiện
          </h1>
          <p className="text-xl lg:text-2xl opacity-90 max-w-3xl mx-auto">
            Tham gia các sự kiện ý nghĩa để giúp đỡ thú cưng
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-8">
        {/* Search and Filters */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Search Bar */}
            <div className="flex-1">
              <div className="relative">
                <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Tìm kiếm sự kiện..."
                  value={searchTerm}
                  onChange={handleSearchChange}
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-300"
                />
              </div>
            </div>

            {/* Category Filters */}
            <div className="flex flex-wrap gap-2">
              {categories.map(category => (
                <button
                  key={category.value}
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-full font-medium transition-all duration-300 ${
                    selectedCategory === category.value
                      ? 'bg-primary-500 text-white shadow-lg'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                  onClick={() => handleCategoryChange(category.value)}
                >
                  <category.icon className="text-sm" />
                  {category.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Events Content */}
        {filteredEvents.length === 0 ? (
          <div className="text-center py-16">
            <div className="bg-white rounded-2xl shadow-lg p-12 max-w-md mx-auto">
              <FaCalendarAlt className="text-6xl text-gray-300 mx-auto mb-6" />
              <h3 className="text-2xl font-bold text-gray-800 mb-4">
                Không tìm thấy sự kiện
              </h3>
              <p className="text-gray-600 mb-8">
                Không có sự kiện nào phù hợp với bộ lọc của bạn.
              </p>
              <button
                className="inline-flex items-center px-6 py-3 bg-primary-500 text-white font-bold rounded-full hover:bg-primary-600 transition-all duration-300 transform hover:scale-105 shadow-lg"
                onClick={() => {
                  setSelectedCategory('all');
                  setSearchTerm('');
                }}
              >
                Xem tất cả sự kiện
              </button>
            </div>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {filteredEvents.map((event) => (
              <div key={event.id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
                <div className="relative bg-gradient-to-br from-primary-500 to-primary-600 p-8">
                  <div className="text-center">
                    <FaCalendarAlt className="text-4xl text-white mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-white mb-2">{event.title}</h3>
                  </div>
                  <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(event.status)}`}>
                    {getStatusText(event.status)}
                  </div>
                </div>

                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <span className="px-3 py-1 bg-primary-100 text-primary-600 rounded-full text-sm font-medium">
                      {event.category}
                    </span>
                  </div>

                  <p className="text-gray-600 mb-6 leading-relaxed">
                    {event.description?.length > 120 
                      ? `${event.description.substring(0, 120)}...` 
                      : event.description}
                  </p>

                  <div className="space-y-3 mb-6">
                    <div className="flex items-center gap-3 text-gray-600">
                      <FaCalendarAlt className="text-primary-500" />
                      <span className="text-sm">{formatDate(event.date)}</span>
                    </div>
                    
                    <div className="flex items-center gap-3 text-gray-600">
                      <FaClock className="text-primary-500" />
                      <span className="text-sm">
                        {formatTime(event.startTime)} - {formatTime(event.endTime)}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-3 text-gray-600">
                      <FaMapMarkerAlt className="text-primary-500" />
                      <span className="text-sm">{event.location}</span>
                    </div>
                    
                    <div className="flex items-center gap-3 text-gray-600">
                      <FaUsers className="text-primary-500" />
                      <span className="text-sm">{event.maxParticipants} người tham gia</span>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 bg-primary-500 text-white font-medium rounded-lg hover:bg-primary-600 transition-all duration-300">
                      <FaHeart />
                      Tham gia
                    </button>
                    <button className="flex-1 inline-flex items-center justify-center px-4 py-2 border border-primary-500 text-primary-500 font-medium rounded-lg hover:bg-primary-50 transition-all duration-300">
                      Chi tiết
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Upcoming Events Section */}
        <section className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Sự kiện sắp diễn ra</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {events
              .filter(event => event.status === 'upcoming')
              .slice(0, 3)
              .map((event) => (
                <div key={event.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-all duration-300">
                  <div className="text-center min-w-[80px]">
                    <div className="text-2xl font-bold text-primary-500">
                      {new Date(event.date).getDate()}
                    </div>
                    <div className="text-sm text-gray-600">
                      {new Date(event.date).toLocaleDateString('vi-VN', { month: 'short' })}
                    </div>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-gray-800 mb-1">{event.title}</h4>
                    <p className="text-sm text-gray-600 mb-1">{event.location}</p>
                    <span className="text-xs text-primary-500">
                      {formatTime(event.startTime)} - {formatTime(event.endTime)}
                    </span>
                  </div>
                </div>
              ))}
          </div>
        </section>

        {/* Event Categories Info */}
        <section className="bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-8 text-center">Loại sự kiện</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {eventTypes.map((type, index) => (
              <div key={index} className="text-center group">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4 group-hover:bg-primary-100 transition-all duration-300">
                  <type.icon className={`text-2xl ${type.color}`} />
                </div>
                <h3 className="text-lg font-bold text-gray-800 mb-2">{type.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{type.description}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default EventPage; 
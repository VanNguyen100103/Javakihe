import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { usePet } from '../hook';
import { fetchPets } from '../store/asyncAction/petAsyncAction';
import { useAppDispatch } from '../hook';
import { FaHeart, FaPaw, FaUsers, FaHandHoldingHeart, FaArrowRight, FaSearch, FaPhone, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa';
import PetCard from '../components/pet/PetCard';
import LoadingSpinner from '../components/common/LoadingSpinner';
import DonationStatistics from '../components/admin/DonationStatistics';

const HomePage = () => {
  const dispatch = useAppDispatch();
  const { pets, isLoading } = usePet();

  useEffect(() => {
    // Fetch featured pets on component mount
    dispatch(fetchPets({ page: 0, size: 6, status: 'available' }));
  }, [dispatch]);

  const featuredPets = pets.slice(0, 6);

  const stats = [
    { icon: FaPaw, number: '500+', label: 'Thú cưng được nhận nuôi', color: 'text-primary-500' },
    { icon: FaUsers, number: '1000+', label: 'Thành viên cộng đồng', color: 'text-secondary-500' },
    { icon: FaHandHoldingHeart, number: '50+', label: 'Sự kiện từ thiện', color: 'text-green-500' },
  ];

  const steps = [
    {
      number: '1',
      title: 'Khám phá',
      description: 'Duyệt qua danh sách thú cưng đang cần nhận nuôi',
      icon: FaSearch
    },
    {
      number: '2',
      title: 'Kết nối',
      description: 'Liên hệ với chúng tôi để tìm hiểu thêm về thú cưng',
      icon: FaPhone
    },
    {
      number: '3',
      title: 'Gặp gỡ',
      description: 'Sắp xếp cuộc gặp gỡ để làm quen với thú cưng',
      icon: FaEnvelope
    },
    {
      number: '4',
      title: 'Nhận nuôi',
      description: 'Hoàn tất thủ tục và đưa thú cưng về nhà mới',
      icon: FaHeart
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-500 via-primary-600 to-primary-700 text-white overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-72 h-72 bg-white rounded-full -translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full translate-x-1/2 translate-y-1/2"></div>
        </div>
        
        <div className="relative container mx-auto px-4 py-20 lg:py-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <h1 className="text-4xl lg:text-6xl font-bold leading-tight">
                Tìm ngôi nhà yêu thương cho những chú{' '}
                <span className="text-yellow-300">thú cưng</span>
              </h1>
              <p className="text-xl lg:text-2xl text-gray-100 leading-relaxed">
                PawFund kết nối những người yêu thú cưng với những chú thú cưng cần một mái ấm. 
                Hãy cùng chúng tôi tạo nên những câu chuyện đẹp.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link 
                  to="/pets" 
                  className="inline-flex items-center justify-center px-8 py-4 bg-white text-primary-600 font-bold rounded-full hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-lg"
                >
                  Xem thú cưng
                  <FaArrowRight className="ml-2" />
                </Link>
                <Link 
                  to="/register" 
                  className="inline-flex items-center justify-center px-8 py-4 border-2 border-white text-white font-bold rounded-full hover:bg-white hover:text-primary-600 transition-all duration-300"
                >
                  Tham gia ngay
                </Link>
              </div>
            </div>
            
            <div className="relative">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6 text-center">
                    <FaPaw className="text-4xl mx-auto mb-4 text-yellow-300" />
                    <h3 className="font-bold text-lg">Thú cưng</h3>
                    <p className="text-sm opacity-90">Đang chờ nhận nuôi</p>
                  </div>
                  <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6 text-center">
                    <FaHeart className="text-4xl mx-auto mb-4 text-red-300" />
                    <h3 className="font-bold text-lg">Tình yêu</h3>
                    <p className="text-sm opacity-90">Vô điều kiện</p>
                  </div>
                </div>
                <div className="space-y-4 pt-8">
                  <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6 text-center">
                    <FaUsers className="text-4xl mx-auto mb-4 text-blue-300" />
                    <h3 className="font-bold text-lg">Cộng đồng</h3>
                    <p className="text-sm opacity-90">Đoàn kết</p>
                  </div>
                  <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6 text-center">
                    <FaHandHoldingHeart className="text-4xl mx-auto mb-4 text-green-300" />
                    <h3 className="font-bold text-lg">Từ thiện</h3>
                    <p className="text-sm opacity-90">Chia sẻ yêu thương</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center group">
                <div className={`inline-flex items-center justify-center w-20 h-20 rounded-full bg-gray-100 group-hover:bg-primary-100 transition-all duration-300 mb-6`}>
                  <stat.icon className={`text-3xl ${stat.color}`} />
                </div>
                <div className="text-4xl font-bold text-gray-800 mb-2">{stat.number}</div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Donation Stats Section */}
      <DonationStatistics />

      {/* Featured Pets Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-800 mb-4">
              Thú cưng nổi bật
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Những chú thú cưng đang tìm kiếm một mái ấm yêu thương
            </p>
          </div>
          
          {isLoading ? (
            <div className="flex justify-center py-12">
              <LoadingSpinner />
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {featuredPets.map((pet) => (
                <PetCard key={pet.id} pet={pet} />
              ))}
            </div>
          )}
          
          <div className="text-center">
            <Link 
              to="/pets" 
              className="inline-flex items-center px-8 py-4 bg-primary-500 text-white font-bold rounded-full hover:bg-primary-600 transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              Xem tất cả thú cưng
              <FaArrowRight className="ml-2" />
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-800 mb-4">
              Cách thức hoạt động
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Quy trình đơn giản để tìm thú cưng phù hợp
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="text-center group">
                <div className="relative mb-6">
                  <div className="w-16 h-16 bg-primary-500 rounded-full flex items-center justify-center text-white font-bold text-xl mx-auto group-hover:bg-primary-600 transition-all duration-300">
                    {step.number}
                  </div>
                  {index < steps.length - 1 && (
                    <div className="hidden lg:block absolute top-8 left-full w-full h-0.5 bg-gray-200 transform -translate-y-1/2 z-0"></div>
                  )}
                </div>
                <div className="inline-flex items-center justify-center w-12 h-12 bg-gray-100 rounded-full mb-4 group-hover:bg-primary-100 transition-all duration-300">
                  <step.icon className="text-primary-500 text-xl" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-3">{step.title}</h3>
                <p className="text-gray-600 leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-red-600 text-white relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-64 h-64 bg-white rounded-full -translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 right-0 w-80 h-80 bg-white rounded-full translate-x-1/2 translate-y-1/2"></div>
        </div>
        
        <div className="relative container mx-auto px-4 text-center">
          <h2 className="text-4xl lg:text-5xl font-bold mb-6">
            Hãy bắt đầu hành trình của bạn
          </h2>
          <p className="text-xl mb-10 max-w-3xl mx-auto opacity-95 leading-relaxed">
            Mỗi thú cưng đều xứng đáng có một mái ấm yêu thương. Hãy cùng chúng tôi tạo nên sự khác biệt.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link 
              to="/pets" 
              className="inline-flex items-center justify-center px-10 py-4 bg-white text-red-600 font-bold rounded-full hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-xl border-2 border-white"
            >
              Tìm thú cưng
            </Link>
            <Link 
              to="/donations" 
              className="inline-flex items-center justify-center px-10 py-4 border-2 border-white text-white font-bold rounded-full hover:bg-white hover:text-red-600 transition-all duration-300 transform hover:scale-105 shadow-xl"
            >
              Quyên góp
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage; 
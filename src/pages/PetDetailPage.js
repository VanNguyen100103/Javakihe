import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { usePet } from '../hook';
import { fetchPetById } from '../store/asyncAction/petAsyncAction';
import { addToCart, fetchGuestCart } from '../store/asyncAction/cartAsyncAction';
import { addItemToGuestCart } from '../store/slice/cartSlice';
import { useAppDispatch } from '../hook';
import { useAuthContext } from '../contexts/AuthContext';
import { useCart } from '../hook';
import { toast } from 'react-toastify';
import { FaMapMarkerAlt, FaCalendarAlt, FaVenusMars, FaSearch, FaPhone, FaEnvelope, FaHeart } from 'react-icons/fa';
import LoadingSpinner from '../components/common/LoadingSpinner';
import AdoptionForm from '../components/adoption/AdoptionForm';
import Zoom from 'react-medium-image-zoom';
import 'react-medium-image-zoom/dist/styles.css';

const PetDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { selectedPet, pets, isLoading } = usePet();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const { isAdopter, isAuthenticated } = useAuthContext();
  const { userCart } = useCart();
  const [isAdding, setIsAdding] = useState(false);
  const [isAdoptionFormOpen, setIsAdoptionFormOpen] = useState(false);

  // Get pet from selectedPet (if set by management page) or find in pets array
  const pet = selectedPet || pets.find(p => p.id === parseInt(id));

  // Kiểm tra pet đã có trong giỏ chưa
  const isInCart = userCart?.items?.some(item => item.pet?.id === pet?.id);

  const handleAddToCart = async () => {
    if (!pet?.id) return;
    setIsAdding(true);
    try {
      // For guests, get the token from localStorage
      const guestToken = !isAuthenticated ? localStorage.getItem('guestCartToken') : null;
      await dispatch(addToCart({ petId: pet.id, token: guestToken })).unwrap();
      
      // Manual update guest cart state for immediate UI feedback
      if (!isAuthenticated) {
        dispatch(addItemToGuestCart({ pet }));
      }
      
      // Force refresh cart state for guests
      if (!isAuthenticated) {
        const updatedToken = localStorage.getItem('guestCartToken');
        if (updatedToken) {
          console.log('Refreshing guest cart after add...');
          dispatch(fetchGuestCart(updatedToken));
        }
      }
      
      if (!isAuthenticated) {
        toast.success('Đã thêm vào giỏ hàng! Đăng nhập để tiến hành nhận nuôi.');
      } else {
        toast.success('Đã thêm vào giỏ hàng!');
      }
    } catch (error) {
      toast.error(error || 'Có lỗi xảy ra khi thêm vào giỏ hàng');
    } finally {
      setIsAdding(false);
    }
  };

  useEffect(() => {
    if (id && !pet) {
      dispatch(fetchPetById(id));
    }
  }, [dispatch, id, pet]);

  const handleImageError = (e) => {
    e.target.style.display = 'none';
    e.target.nextSibling.style.display = 'flex';
  };

  const renderMainImage = () => (
    <div className="relative w-full h-full cursor-pointer group">
      <img
        src={pet?.imageUrls?.split(',')[currentImageIndex] || pet?.imageUrl}
        alt={pet?.name}
        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        onError={handleImageError}
      />
      <div className="absolute inset-0 bg-black bg-opacity-30 flex flex-col items-center justify-center text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100 pointer-events-none">
        <FaSearch className="text-4xl mb-2" />
        <span className="text-lg text-center">Click để phóng to</span>
      </div>
      <div 
        className="absolute inset-0 bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-white text-6xl hidden"
        style={{ display: 'none' }}
      >
        🐾
      </div>
    </div>
  );

  const renderThumbnail = (imageUrl, index) => (
    <div 
      key={index}
      className={`relative min-w-20 h-20 rounded-lg overflow-hidden cursor-pointer border-2 transition-colors duration-300 ${
        currentImageIndex === index ? 'border-primary-500' : 'border-transparent'
      }`}
      onClick={() => setCurrentImageIndex(index)}
    >
      <img
        src={imageUrl}
        alt={`${pet?.name} ${index + 1}`}
        className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
        onError={handleImageError}
      />
      <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center text-white opacity-0 transition-opacity duration-300 hover:opacity-100 pointer-events-none">
        <FaSearch className="text-lg" />
      </div>
      <div 
        className="absolute inset-0 bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-white text-2xl hidden"
        style={{ display: 'none' }}
      >
        🐾
      </div>
    </div>
  );

  if (isLoading) {
    return <LoadingSpinner size="large" text="Đang tải thông tin thú cưng..." />;
  }

  if (!pet) {
    return (
      <div className="text-center py-16">
        <h2 className="text-2xl font-bold text-secondary-800 mb-4">Không tìm thấy thú cưng</h2>
        <p className="text-secondary-600 mb-8">Thú cưng bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.</p>
        <button
          onClick={() => navigate('/pets')}
          className="bg-primary-500 hover:bg-primary-600 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-300"
        >
          Quay lại danh sách
        </button>
      </div>
    );
  }

  const imageUrls = pet.imageUrls ? pet.imageUrls.split(',') : [pet.imageUrl];

  return (
    <div className="py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Main Image */}
          <div className="space-y-4">
            <div className="relative h-96 overflow-hidden rounded-2xl">
              <Zoom>
                {renderMainImage()}
              </Zoom>
            </div>
            
            {imageUrls.length > 1 && (
              <div className="flex gap-2 overflow-x-auto py-2">
                {imageUrls.map((imageUrl, index) => (
                  <Zoom key={index}>
                    {renderThumbnail(imageUrl, index)}
                  </Zoom>
                ))}
              </div>
            )}
          </div>

          {/* Pet Information */}
          <div className="flex flex-col gap-8">
            <div className="flex justify-between items-start gap-4">
              <div className="flex-1">
                <h1 className="text-4xl font-bold text-secondary-800 mb-4 leading-tight">{pet.name}</h1>
                <div className={`inline-block px-4 py-2 rounded-lg text-sm font-bold text-white ${
                  pet.status === 'AVAILABLE' ? 'bg-green-500' :
                  pet.status === 'ADOPTED' ? 'bg-blue-500' :
                  pet.status === 'PENDING' ? 'bg-yellow-500' :
                  'bg-gray-500'
                }`}>
                  {pet.status === 'AVAILABLE' ? 'Có sẵn' :
                   pet.status === 'ADOPTED' ? 'Đã nhận nuôi' :
                   pet.status === 'PENDING' ? 'Đang xử lý' :
                   'Không xác định'}
                </div>
              </div>
              <span className="text-5xl text-primary-500">
                {pet.gender === 'MALE' ? '♂' : '♀'}
              </span>
            </div>

            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-4 p-4 bg-secondary-50 rounded-lg">
                <FaMapMarkerAlt className="text-primary-500 text-xl min-w-5" />
                <span className="text-secondary-800">{pet.location}</span>
              </div>
              <div className="flex items-center gap-4 p-4 bg-secondary-50 rounded-lg">
                <FaCalendarAlt className="text-primary-500 text-xl min-w-5" />
                <span className="text-secondary-800">{pet.age} tuổi</span>
              </div>
              <div className="flex items-center gap-4 p-4 bg-secondary-50 rounded-lg">
                <FaVenusMars className="text-primary-500 text-xl min-w-5" />
                <span className="text-secondary-800">{pet.breed}</span>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-bold text-secondary-800 mb-4">Mô tả</h3>
              <p className="text-secondary-600 leading-relaxed">{pet.description}</p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-bold text-secondary-800 mb-4">Tình trạng sức khỏe</h3>
              <div className="flex flex-col gap-3">
                <div className="p-3 bg-secondary-50 rounded-md text-secondary-800">
                  <strong>Tiêm chủng:</strong> {pet.vaccinated ? 'Đã tiêm' : 'Chưa tiêm'}
                </div>
                <div className="p-3 bg-secondary-50 rounded-md text-secondary-800">
                  <strong>Tẩy giun:</strong> {pet.dewormed ? 'Đã tẩy' : 'Chưa tẩy'}
                </div>
              </div>
            </div>

            <div className="flex gap-4 flex-wrap">
              {pet.status === 'AVAILABLE' ? (
                <>
                  <button 
                    className="flex-1 min-w-48 bg-primary-500 hover:bg-primary-600 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-300 flex items-center justify-center gap-2"
                    onClick={() => setIsAdoptionFormOpen(true)}
                  >
                    <FaHeart />
                    Gửi đơn nhận nuôi
                  </button>
                  {(isAdopter() || !isAuthenticated) && (
                    <button
                      className="flex-1 min-w-48 bg-secondary-500 hover:bg-secondary-600 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-300 disabled:opacity-60"
                      onClick={handleAddToCart}
                      disabled={isAdding || isInCart}
                    >
                      {isInCart ? 'Đã có trong giỏ' : isAdding ? 'Đang thêm...' : 'Thêm vào giỏ'}
                    </button>
                  )}
                </>
              ) : (
                <div className="w-full bg-red-50 border border-red-200 rounded-lg p-6 text-center text-red-600">
                  Thú cưng này hiện không có sẵn để nhận nuôi
                </div>
              )}
            </div>

            {/* Adoption Form Modal */}
            {isAdoptionFormOpen && (
              <AdoptionForm
                pet={pet}
                onClose={() => setIsAdoptionFormOpen(false)}
                onSuccess={() => {
                  toast.success('Đơn nhận nuôi đã được gửi thành công!');
                }}
              />
            )}

            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-bold text-secondary-800 mb-4">Thông tin liên hệ</h3>
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-4 p-4 bg-secondary-50 rounded-lg">
                  <FaPhone className="text-primary-500 text-xl min-w-5" />
                  <span className="text-secondary-800">0123 456 789</span>
                </div>
                <div className="flex items-center gap-4 p-4 bg-secondary-50 rounded-lg">
                  <FaEnvelope className="text-primary-500 text-xl min-w-5" />
                  <span className="text-secondary-800">adoption@pawfund.vn</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PetDetailPage; 
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaMapMarkerAlt, FaCalendarAlt, FaVenusMars, FaSearch, FaImage, FaTrash, FaShoppingCart } from 'react-icons/fa';
import Zoom from 'react-medium-image-zoom';
import 'react-medium-image-zoom/dist/styles.css';
import AddImagesModal from './AddImagesModal';
import RemoveImagesModal from './RemoveImagesModal';
import { useAuthContext } from '../../contexts/AuthContext';
import { useAppDispatch } from '../../hook';
import { addToCart, fetchGuestCart } from '../../store/asyncAction/cartAsyncAction';
import { addItemToGuestCart } from '../../store/slice/cartSlice';
import { toast } from 'react-toastify';

const PetCard = ({ pet }) => {
  const { userRole, isAdmin, isShelterStaff, isAdopter, isAuthenticated } = useAuthContext();
  const dispatch = useAppDispatch();
  const [showAddImagesModal, setShowAddImagesModal] = useState(false);
  const [showRemoveImagesModal, setShowRemoveImagesModal] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  // Check if user has permission to manage this pet
  const canManagePet = () => {
    // Admin can manage all pets
    if (isAdmin()) return true;
    
    // Shelter staff can only manage their own pets
    if (isShelterStaff() && pet.shelter && userRole === 'SHELTER') {
      // Check if the current user is the shelter that owns this pet
      // This would need to be implemented based on how you identify the current user's shelter
      return true; // For now, allow all shelter staff to manage pets
    }
    
    return false;
  };

  const handleAddToCart = async () => {
    if (!pet?.id) return;
    setIsAddingToCart(true);
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
      setIsAddingToCart(false);
    }
  };

  const handleImageError = (e) => {
    e.target.style.display = 'none';
    e.target.nextSibling.style.display = 'flex';
  };

  // Get first image from imageUrls or fallback to imageUrl
  const getPetImage = () => {
    if (pet.imageUrls) {
      const urls = pet.imageUrls.split(',').filter(url => url.trim());
      return urls[0] || pet.imageUrl || 'https://via.placeholder.com/400x300?text=No+Image';
    }
    return pet.imageUrl || 'https://via.placeholder.com/400x300?text=No+Image';
  };

  const renderPetImage = () => (
    <div className="relative w-full h-full cursor-pointer group">
      <img
        src={getPetImage()}
        alt={pet.name}
        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        onError={handleImageError}
      />
      <div className="absolute inset-0 bg-black bg-opacity-30 flex flex-col items-center justify-center text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100 pointer-events-none">
        <FaSearch className="text-2xl mb-2" />
        <span className="text-sm text-center">Click để phóng to</span>
      </div>
      <div 
        className="absolute inset-0 bg-gradient-to-br from-primary-500 to-primary-700 justify-center items-center text-white text-4xl"
        style={{ display: 'none' }}
      >
        🐾
      </div>
    </div>
  );

  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 h-full flex flex-col">
      <div className="relative h-80 overflow-hidden">
        <Zoom>
          {renderPetImage()}
        </Zoom>
        <div className={`absolute top-2 right-2 px-2 py-1 rounded text-xs font-bold text-white ${
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

      <div className="p-6 flex-1 flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-secondary-800 m-0">{pet.name}</h3>
          <span className="text-2xl text-primary-500">
            {pet.gender === 'MALE' ? '♂' : '♀'}
          </span>
        </div>

        <div className="mb-4">
          <div className="flex items-center gap-2 mb-2 text-secondary-600 text-sm">
            <FaMapMarkerAlt className="text-primary-500 text-xs" />
            <span>{pet.location}</span>
          </div>
          <div className="flex items-center gap-2 mb-2 text-secondary-600 text-sm">
            <FaCalendarAlt className="text-primary-500 text-xs" />
            <span>{pet.age} tuổi</span>
          </div>
          <div className="flex items-center gap-2 mb-2 text-secondary-600 text-sm">
            <FaVenusMars className="text-primary-500 text-xs" />
            <span>{pet.breed}</span>
          </div>
          <span className="inline-block bg-secondary-100 px-2 py-1 rounded text-xs text-secondary-800 mb-2">
            {pet.breed}
          </span>
        </div>

        <p className="text-secondary-600 text-sm leading-relaxed mb-6 flex-1">
          {pet.description}
        </p>

        <div className="flex gap-2 mt-auto">
          <Link
            to={`/pets/${pet.id}`}
            className="flex-1 bg-primary-500 hover:bg-primary-600 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-300 text-center"
          >
            Xem chi tiết
          </Link>
          
          {/* Add to cart button for adopter or guest */}
          {(isAdopter() || !isAuthenticated) && pet.status === 'AVAILABLE' && (
            <button
              onClick={handleAddToCart}
              disabled={isAddingToCart}
              className="bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-3 rounded-lg transition-colors duration-300 flex items-center gap-1 disabled:opacity-50"
              title="Thêm vào giỏ hàng"
            >
              {isAddingToCart ? (
                <FaSearch className="animate-spin" />
              ) : (
                <FaShoppingCart />
              )}
            </button>
          )}
          
          {canManagePet() && (
            <div className="flex gap-1">
              <button 
                onClick={() => setShowAddImagesModal(true)}
                className="bg-secondary-500 hover:bg-secondary-600 text-white font-medium py-2 px-3 rounded-lg transition-colors duration-300 flex items-center gap-1"
                title="Thêm ảnh"
              >
                <FaImage />
              </button>
              <button 
                onClick={() => setShowRemoveImagesModal(true)}
                className="bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-3 rounded-lg transition-colors duration-300 flex items-center gap-1"
                title="Xóa ảnh"
              >
                <FaTrash />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Add Images Modal */}
      {showAddImagesModal && (
        <AddImagesModal
          pet={pet}
          onSuccess={() => {
            setShowAddImagesModal(false);
            // Refresh pet data if needed
          }}
          onCancel={() => setShowAddImagesModal(false)}
        />
      )}

      {/* Remove Images Modal */}
      {showRemoveImagesModal && (
        <RemoveImagesModal
          pet={pet}
          onSuccess={() => {
            setShowRemoveImagesModal(false);
            // Refresh pet data if needed
          }}
          onCancel={() => setShowRemoveImagesModal(false)}
        />
      )}
    </div>
  );
};

export default PetCard; 

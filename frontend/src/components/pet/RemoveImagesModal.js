import React, { useState } from 'react';
import { useAppDispatch } from '../../hook';
import { toast } from 'react-toastify';
import { FaTrash, FaTimes, FaSpinner, FaImage } from 'react-icons/fa';
import { removeImagesFromPet } from '../../store/asyncAction/petAsyncAction';

const RemoveImagesModal = ({ pet, onSuccess, onCancel }) => {
  const dispatch = useAppDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedUrls, setSelectedUrls] = useState([]);

  // Parse image URLs from pet
  const getPetImages = () => {
    if (pet.imageUrls) {
      // Split by comma and filter out empty strings, also trim whitespace
      return pet.imageUrls.split(',')
        .map(url => url.trim())
        .filter(url => url && url.length > 0);
    }
    return [];
  };

  const handleImageSelect = (url) => {
    setSelectedUrls(prev => {
      if (prev.includes(url)) {
        return prev.filter(u => u !== url);
      } else {
        return [...prev, url];
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (selectedUrls.length === 0) {
      toast.error('Vui lòng chọn ít nhất 1 ảnh để xóa!');
      return;
    }

    setIsLoading(true);
    
    try {
      await dispatch(removeImagesFromPet({
        petId: pet.id,
        urls: selectedUrls
      })).unwrap();
      
      toast.success(`Đã xóa ${selectedUrls.length} ảnh khỏi ${pet.name}!`);
      onSuccess();
    } catch (error) {
      console.error('Remove images error:', error);
      toast.error(error || 'Có lỗi xảy ra khi xóa ảnh!');
    } finally {
      setIsLoading(false);
    }
  };

  const petImages = getPetImages();
  
  // Debug log
  console.log('Pet imageUrls:', pet.imageUrls);
  console.log('Parsed images:', petImages);

  if (petImages.length === 0) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl p-6 w-full max-w-md">
          <div className="text-center">
            <FaImage className="mx-auto text-4xl text-gray-400 mb-4" />
            <h3 className="text-lg font-bold mb-2">Không có ảnh</h3>
            <p className="text-gray-600 mb-4">{pet.name} chưa có ảnh nào để xóa.</p>
            <button
              onClick={onCancel}
              className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors duration-200"
            >
              Đóng
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto relative">
        {/* Close Button */}
        <button
          onClick={onCancel}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors duration-300"
        >
          <FaTimes className="text-xl" />
        </button>
        
        <h3 className="text-lg font-bold mb-4 pr-8">
          Xóa ảnh của {pet.name}
        </h3>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Image Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Chọn ảnh để xóa ({selectedUrls.length} đã chọn)
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {petImages.map((url, index) => (
                <div key={index} className="relative group">
                  <input
                    type="checkbox"
                    id={`image-${index}`}
                    checked={selectedUrls.includes(url)}
                    onChange={() => handleImageSelect(url)}
                    className="absolute top-2 left-2 z-10 w-4 h-4 text-primary-600 bg-gray-100 border-gray-300 rounded focus:ring-primary-500"
                  />
                  <label htmlFor={`image-${index}`} className="cursor-pointer block">
                    <img
                      src={url}
                      alt={`Pet ${index + 1}`}
                      className="w-full h-24 object-cover rounded-lg border-2 border-gray-300 hover:border-primary-500 transition-colors duration-200"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200 rounded-lg"></div>
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Warning */}
          {selectedUrls.length > 0 && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex">
                <FaTrash className="text-yellow-400 mt-0.5 mr-2" />
                <div>
                  <h4 className="text-sm font-medium text-yellow-800">
                    Cảnh báo
                  </h4>
                  <p className="text-sm text-yellow-700 mt-1">
                    Ảnh đã chọn sẽ bị xóa vĩnh viễn khỏi Cloudinary và không thể khôi phục.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200"
              disabled={isLoading}
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={isLoading || selectedUrls.length === 0}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 flex items-center space-x-2"
            >
              {isLoading ? (
                <>
                  <FaSpinner className="animate-spin" />
                  <span>Đang xóa...</span>
                </>
              ) : (
                <>
                  <FaTrash />
                  <span>Xóa ảnh ({selectedUrls.length})</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RemoveImagesModal; 

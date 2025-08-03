import React, { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../hook';
import { toast } from 'react-toastify';
import { FaUpload, FaTimes, FaSpinner } from 'react-icons/fa';
import { createPet, updatePet, fetchSheltersForPet } from '../../store/asyncAction/petAsyncAction';
import { useAuthContext } from '../../contexts/AuthContext';

const PetForm = ({ pet = null, onSuccess, onCancel }) => {
  const dispatch = useAppDispatch();
  const { isAdmin } = useAuthContext();
  const { shelters } = useAppSelector(state => state.pet);
  const [isLoading, setIsLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    name: pet?.name || '',
    age: pet?.age || '',
    breed: pet?.breed || '',
    description: pet?.description || '',
    location: pet?.location || '',
    status: pet?.status || 'AVAILABLE',
    gender: pet?.gender || 'MALE',
    vaccinated: pet?.vaccinated || false,
    dewormed: pet?.dewormed || false,
    shelterId: pet?.shelter?.id || ''
  });

  const [images, setImages] = useState([]);
  const [previewImages, setPreviewImages] = useState(pet?.imageUrls ? pet.imageUrls.split(',').filter(url => url.trim()) : []);

  // Load shelters for admin
  useEffect(() => {
    if (isAdmin) {
      dispatch(fetchSheltersForPet());
    }
  }, [isAdmin, dispatch]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    
    // Validate file types
    const validFiles = files.filter(file => {
      if (!file.type.startsWith('image/')) {
        toast.error(`${file.name} không phải là file ảnh`);
        return false;
      }
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast.error(`${file.name} quá lớn (tối đa 5MB)`);
        return false;
      }
      return true;
    });

    if (validFiles.length + images.length > 5) {
      toast.error('Tối đa 5 ảnh cho mỗi thú cưng');
      return;
    }

    setImages(prev => [...prev, ...validFiles]);

    // Create preview URLs
    validFiles.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewImages(prev => [...prev, e.target.result]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index) => {
    setImages(prev => prev.filter((_, i) => i !== index));
    setPreviewImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.name.trim()) {
      toast.error('Vui lòng nhập tên thú cưng!');
      return;
    }
    
    if (!formData.age || formData.age < 0) {
      toast.error('Vui lòng nhập tuổi hợp lệ!');
      return;
    }
    
    if (!formData.breed.trim()) {
      toast.error('Vui lòng nhập giống thú cưng!');
      return;
    }
    
    if (!formData.location.trim()) {
      toast.error('Vui lòng nhập địa điểm!');
      return;
    }

    setIsLoading(true);
    
    try {
      if (pet) {
        // Update existing pet
        await dispatch(updatePet({
          id: pet.id,
          petData: formData,
          images: images,
          shelterId: formData.shelterId || null
        })).unwrap();
        toast.success('Cập nhật thú cưng thành công!');
      } else {
        // Create new pet
        await dispatch(createPet({
          petData: formData,
          images: images,
          shelterId: formData.shelterId || null
        })).unwrap();
        toast.success('Thêm thú cưng thành công!');
      }
      
      onSuccess();
    } catch (error) {
      console.error('Pet form error:', error);
      toast.error(error || 'Có lỗi xảy ra!');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto relative">
        {/* Close Button */}
        <button
          onClick={onCancel}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors duration-300"
        >
          <FaTimes className="text-xl" />
        </button>
        
        <h3 className="text-lg font-bold mb-4 pr-8">
          {pet ? 'Chỉnh sửa thú cưng' : 'Thêm thú cưng mới'}
        </h3>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tên thú cưng *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tuổi *
              </label>
              <input
                type="number"
                name="age"
                value={formData.age}
                onChange={handleInputChange}
                min="0"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                required
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Giống *
              </label>
              <input
                type="text"
                name="breed"
                value={formData.breed}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Trạng thái
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="AVAILABLE">Có sẵn</option>
                <option value="PENDING">Đang xử lý</option>
                <option value="ADOPTED">Đã nhận nuôi</option>
              </select>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Giới tính
              </label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="MALE">Đực</option>
                <option value="FEMALE">Cái</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Địa điểm *
              </label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                required
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                name="vaccinated"
                checked={formData.vaccinated}
                onChange={(e) => setFormData(prev => ({ ...prev, vaccinated: e.target.checked }))}
                className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
              />
              <label className="text-sm font-medium text-gray-700">
                Đã tiêm chủng
              </label>
            </div>
            
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                name="dewormed"
                checked={formData.dewormed}
                onChange={(e) => setFormData(prev => ({ ...prev, dewormed: e.target.checked }))}
                className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
              />
              <label className="text-sm font-medium text-gray-700">
                Đã tẩy giun
              </label>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Mô tả
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows="4"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="Mô tả về thú cưng..."
            />
          </div>
          
          {/* Shelter Selection for Admin */}
          {isAdmin && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Shelter đảm nhiệm
              </label>
              <select
                name="shelterId"
                value={formData.shelterId || ''}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                size="4"
              >
                <option value="">Chọn shelter...</option>
                {shelters.map(shelter => (
                  <option key={shelter.id} value={shelter.id}>
                    {shelter.fullName} ({shelter.username})
                  </option>
                ))}
              </select>
              <p className="mt-1 text-xs text-gray-500">Chọn shelter để gán cho thú cưng này</p>
            </div>
          )}
          
          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Ảnh thú cưng (tối đa 5 ảnh)
            </label>
            
            {/* Image Upload Area */}
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
                id="image-upload"
                disabled={images.length >= 5}
              />
              <label
                htmlFor="image-upload"
                className={`cursor-pointer flex flex-col items-center ${
                  images.length >= 5 ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                <FaUpload className="text-3xl text-gray-400 mb-2" />
                <span className="text-sm text-gray-600">
                  Click để chọn ảnh hoặc kéo thả vào đây
                </span>
                <span className="text-xs text-gray-500 mt-1">
                  PNG, JPG, GIF tối đa 5MB
                </span>
              </label>
            </div>
            
            {/* Image Preview */}
            {previewImages.length > 0 && (
              <div className="mt-4">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Ảnh đã chọn:</h4>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {previewImages.map((image, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={image}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-24 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <FaTimes className="text-xs" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          {/* Action Buttons */}
          <div className="flex space-x-3 pt-4">
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 bg-primary-600 text-white py-2 px-4 rounded-lg hover:bg-primary-700 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isLoading ? (
                <>
                  <FaSpinner className="animate-spin mr-2" />
                  Đang xử lý...
                </>
              ) : (
                pet ? 'Cập nhật' : 'Thêm thú cưng'
              )}
            </button>
            <button
              type="button"
              onClick={onCancel}
              disabled={isLoading}
              className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400 transition-colors duration-300 disabled:opacity-50"
            >
              Hủy
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PetForm; 

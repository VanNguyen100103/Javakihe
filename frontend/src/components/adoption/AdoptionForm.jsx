import React, { useState } from 'react';
import { useAppDispatch } from '../../hook';
import { createAdoption } from '../../store/asyncAction/adoptionAsyncAction';
import { toast } from 'react-toastify';
import { FaSpinner, FaTimes } from 'react-icons/fa';

const AdoptionForm = ({ pet, onClose, onSuccess }) => {
  const dispatch = useAppDispatch();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    petId: pet?.id || '',
    reason: '',
    experience: '',
    livingCondition: '',
    familyMembers: '',
    otherPets: '',
    timeAvailable: '',
    phone: '',
    address: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.reason.trim()) {
      toast.error('Vui lòng điền lý do nhận nuôi!');
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Prepare adoption data with pet object
      const adoptionData = {
        ...formData,
        pet: pet // Send the full pet object
      };
      
      await dispatch(createAdoption(adoptionData)).unwrap();
      toast.success('Gửi đơn nhận nuôi thành công!');
      onSuccess && onSuccess();
      onClose();
    } catch (error) {
      toast.error(error || 'Gửi đơn nhận nuôi thất bại!');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-secondary-800">
            Đơn nhận nuôi {pet?.name}
          </h2>
          <button
            onClick={onClose}
            className="text-secondary-500 hover:text-secondary-700"
            disabled={isSubmitting}
          >
            <FaTimes size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-secondary-700 mb-2">
              Lý do nhận nuôi *
            </label>
            <textarea
              name="reason"
              value={formData.reason}
              onChange={handleInputChange}
              placeholder="Mô tả lý do bạn muốn nhận nuôi thú cưng này..."
              rows="4"
              required
              disabled={isSubmitting}
              className="w-full border border-secondary-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-secondary-700 mb-2">
              Kinh nghiệm nuôi thú cưng
            </label>
            <textarea
              name="experience"
              value={formData.experience}
              onChange={handleInputChange}
              placeholder="Mô tả kinh nghiệm nuôi thú cưng của bạn..."
              rows="3"
              disabled={isSubmitting}
              className="w-full border border-secondary-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-2">
                Điều kiện sống
              </label>
              <select
                name="livingCondition"
                value={formData.livingCondition}
                onChange={handleInputChange}
                disabled={isSubmitting}
                className="w-full border border-secondary-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Chọn điều kiện...</option>
                <option value="apartment">Chung cư</option>
                <option value="house">Nhà riêng</option>
                <option value="villa">Biệt thự</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-2">
                Số thành viên gia đình
              </label>
              <input
                type="number"
                name="familyMembers"
                value={formData.familyMembers}
                onChange={handleInputChange}
                placeholder="Số người"
                disabled={isSubmitting}
                className="w-full border border-secondary-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-2">
                Thú cưng khác
              </label>
              <input
                type="text"
                name="otherPets"
                value={formData.otherPets}
                onChange={handleInputChange}
                placeholder="Mô tả thú cưng khác nếu có..."
                disabled={isSubmitting}
                className="w-full border border-secondary-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-2">
                Thời gian chăm sóc
              </label>
              <select
                name="timeAvailable"
                value={formData.timeAvailable}
                onChange={handleInputChange}
                disabled={isSubmitting}
                className="w-full border border-secondary-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Chọn thời gian...</option>
                <option value="full-time">Toàn thời gian</option>
                <option value="part-time">Bán thời gian</option>
                <option value="weekends">Cuối tuần</option>
              </select>
            </div>
          </div>

          <div className="flex items-center justify-end space-x-3 pt-4 border-t border-secondary-200">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="btn btn-outline"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn btn-primary"
            >
              {isSubmitting ? (
                <>
                  <FaSpinner className="animate-spin mr-2" />
                  Đang gửi...
                </>
              ) : (
                'Gửi đơn nhận nuôi'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdoptionForm; 
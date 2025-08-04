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
    message: ''
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
    
    if (!formData.message.trim()) {
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
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-secondary-200">
          <h2 className="text-xl font-semibold text-secondary-800">
            Đơn nhận nuôi {pet?.name}
          </h2>
          <button
            onClick={onClose}
            className="text-secondary-400 hover:text-secondary-600 transition-colors"
            disabled={isSubmitting}
          >
            <FaTimes size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-secondary-700 mb-2">
              Lý do nhận nuôi <span className="text-red-500">*</span>
            </label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleInputChange}
              placeholder="Hãy chia sẻ lý do bạn muốn nhận nuôi thú cưng này..."
              rows="4"
              disabled={isSubmitting}
              className="w-full border border-secondary-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              required
            />
          </div>

          <div className="flex items-center justify-end space-x-3 pt-4 border-t border-secondary-200">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2 text-secondary-600 border border-secondary-300 rounded-lg hover:bg-secondary-50 transition-colors disabled:opacity-50"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center space-x-2"
            >
              {isSubmitting ? (
                <>
                  <FaSpinner className="animate-spin" />
                  <span>Đang gửi...</span>
                </>
              ) : (
                <span>Gửi đơn</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdoptionForm; 

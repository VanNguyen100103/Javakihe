import React from 'react';
import { FaTimes } from 'react-icons/fa';
import PetForm from './PetForm';

const PetFormModal = ({ 
  isOpen, 
  onClose, 
  pet = null, 
  onSubmit, 
  isLoading = false,
  isAdmin = false,
  shelterOptions = []
}) => {
  if (!isOpen) return null;

  const handleClose = () => {
    if (!isLoading) {
      onClose();
    }
  };

  const handleSubmit = async (formData) => {
    await onSubmit(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-secondary-200 p-6 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-secondary-800">
            {pet ? 'Chỉnh sửa thú cưng' : 'Thêm thú cưng mới'}
          </h2>
          <button
            onClick={handleClose}
            disabled={isLoading}
            className="text-secondary-500 hover:text-secondary-700 transition-colors duration-300 disabled:opacity-50"
          >
            <FaTimes className="text-xl" />
          </button>
        </div>
        
        <div className="p-6">
          <PetForm
            pet={pet}
            onSubmit={handleSubmit}
            onCancel={handleClose}
            isLoading={isLoading}
            isAdmin={isAdmin}
            shelterOptions={shelterOptions}
          />
        </div>
      </div>
    </div>
  );
};

export default PetFormModal; 
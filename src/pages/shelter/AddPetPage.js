import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FaPlus, FaArrowLeft } from 'react-icons/fa';
import PetForm from '../../components/pet/PetForm';

const AddPetPage = () => {
  const navigate = useNavigate();
  const [showForm, setShowForm] = useState(false);

  const handleSuccess = () => {
    toast.success('Thêm thú cưng thành công!');
    navigate('/shelter/pets');
  };

  const handleCancel = () => {
    navigate('/shelter/pets');
  };

  return (
    <div className="py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <button
              onClick={() => navigate('/shelter/pets')}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors duration-300"
            >
              <FaArrowLeft />
              Quay lại
            </button>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-secondary-800 mb-2">
                Thêm thú cưng mới
              </h1>
              <p className="text-secondary-600">
                Đăng ký thú cưng mới vào hệ thống
              </p>
            </div>
            
            <button
              onClick={() => setShowForm(true)}
              className="flex items-center gap-2 bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors duration-300"
            >
              <FaPlus />
              Thêm thú cưng
            </button>
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-8">
          <h3 className="text-lg font-semibold text-blue-800 mb-3">
            Hướng dẫn thêm thú cưng
          </h3>
          <div className="space-y-2 text-blue-700">
            <p>• <strong>Tên thú cưng:</strong> Nhập tên của thú cưng</p>
            <p>• <strong>Tuổi:</strong> Tuổi của thú cưng (tính bằng năm)</p>
            <p>• <strong>Giống:</strong> Loại giống của thú cưng (VD: Golden Retriever, Persian Cat)</p>
            <p>• <strong>Địa điểm:</strong> Nơi thú cưng hiện tại</p>
            <p>• <strong>Mô tả:</strong> Thông tin chi tiết về thú cưng</p>
            <p>• <strong>Ảnh:</strong> Tối đa 5 ảnh, mỗi ảnh tối đa 5MB</p>
            <p>• <strong>Trạng thái:</strong> Có sẵn, Đang xử lý, hoặc Đã nhận nuôi</p>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-secondary-600 text-sm">Thú cưng hiện có</p>
                <p className="text-2xl font-bold text-secondary-800">45</p>
              </div>
              <div className="bg-green-100 p-3 rounded-lg">
                <FaPlus className="text-green-600 text-xl" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-secondary-600 text-sm">Đang chờ nhận nuôi</p>
                <p className="text-2xl font-bold text-secondary-800">12</p>
              </div>
              <div className="bg-yellow-100 p-3 rounded-lg">
                <FaPlus className="text-yellow-600 text-xl" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-secondary-600 text-sm">Đã nhận nuôi</p>
                <p className="text-2xl font-bold text-secondary-800">8</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-lg">
                <FaPlus className="text-blue-600 text-xl" />
              </div>
            </div>
          </div>
        </div>

        {/* Form Modal */}
        {showForm && (
          <PetForm
            onSuccess={handleSuccess}
            onCancel={handleCancel}
          />
        )}
      </div>
    </div>
  );
};

export default AddPetPage; 
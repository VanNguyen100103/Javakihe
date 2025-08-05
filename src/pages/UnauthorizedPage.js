import React from 'react';
import { Link } from 'react-router-dom';
import { FaLock, FaHome, FaArrowLeft } from 'react-icons/fa';

const UnauthorizedPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-secondary-50">
      <div className="max-w-md w-full mx-auto text-center">
        <div className="bg-white rounded-xl p-8 shadow-lg">
          <div className="mb-6">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaLock className="text-3xl text-red-500" />
            </div>
            <h1 className="text-2xl font-bold text-secondary-800 mb-2">
              Không có quyền truy cập
            </h1>
            <p className="text-secondary-600">
              Bạn không có quyền truy cập vào trang này. Vui lòng liên hệ quản trị viên nếu bạn nghĩ đây là lỗi.
            </p>
          </div>

          <div className="space-y-4">
            <Link
              to="/"
              className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-primary-500 hover:bg-primary-600 text-white rounded-lg font-medium transition-colors duration-300"
            >
              <FaHome />
              Về trang chủ
            </Link>
            
            <button
              onClick={() => window.history.back()}
              className="w-full flex items-center justify-center gap-2 px-6 py-3 border-2 border-secondary-300 text-secondary-600 bg-transparent rounded-lg font-medium transition-colors duration-300 hover:bg-secondary-300 hover:text-white"
            >
              <FaArrowLeft />
              Quay lại
            </button>
          </div>

          <div className="mt-8 pt-6 border-t border-secondary-200">
            <p className="text-sm text-secondary-500">
              Mã lỗi: 403 - Forbidden
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UnauthorizedPage; 
import React, { useState, useRef } from 'react';
import { FaCloudUploadAlt, FaTimes, FaEye, FaTrash } from 'react-icons/fa';

const ImageUpload = ({ 
  images = [], 
  onImagesChange, 
  maxImages = 5, 
  maxSize = 5 * 1024 * 1024, // 5MB
  acceptedTypes = ['image/jpeg', 'image/png', 'image/webp'],
  className = ''
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [errors, setErrors] = useState([]);
  const fileInputRef = useRef(null);

  const validateFile = (file) => {
    const errors = [];
    
    if (!acceptedTypes.includes(file.type)) {
      errors.push(`File ${file.name} không đúng định dạng. Chỉ chấp nhận: ${acceptedTypes.join(', ')}`);
    }
    
    if (file.size > maxSize) {
      errors.push(`File ${file.name} quá lớn. Kích thước tối đa: ${Math.round(maxSize / 1024 / 1024)}MB`);
    }
    
    return errors;
  };

  const handleFiles = (files) => {
    const newErrors = [];
    const validFiles = [];
    
    Array.from(files).forEach(file => {
      const fileErrors = validateFile(file);
      if (fileErrors.length > 0) {
        newErrors.push(...fileErrors);
      } else {
        validFiles.push(file);
      }
    });

    if (newErrors.length > 0) {
      setErrors(newErrors);
      setTimeout(() => setErrors([]), 5000);
    }

    if (validFiles.length > 0) {
      const newImages = [...images, ...validFiles].slice(0, maxImages);
      onImagesChange(newImages);
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleFileInput = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFiles(e.target.files);
    }
  };

  const removeImage = (index) => {
    const newImages = images.filter((_, i) => i !== index);
    onImagesChange(newImages);
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  const getImagePreview = (file) => {
    if (typeof file === 'string') {
      return file; // URL string
    }
    return URL.createObjectURL(file);
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Error Messages */}
      {errors.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h4 className="text-sm font-medium text-red-800 mb-2">Lỗi upload:</h4>
          <ul className="text-sm text-red-700 space-y-1">
            {errors.map((error, index) => (
              <li key={index}>• {error}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Upload Area */}
      <div
        className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors duration-300 ${
          dragActive
            ? 'border-primary-500 bg-primary-50'
            : 'border-secondary-300 hover:border-primary-400'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept={acceptedTypes.join(',')}
          onChange={handleFileInput}
          className="hidden"
        />
        
        <div className="space-y-4">
          <FaCloudUploadAlt className="mx-auto text-4xl text-secondary-400" />
          <div>
            <p className="text-lg font-medium text-secondary-800 mb-2">
              Kéo thả ảnh vào đây hoặc click để chọn
            </p>
            <p className="text-sm text-secondary-600">
              Hỗ trợ: {acceptedTypes.map(type => type.split('/')[1].toUpperCase()).join(', ')} 
              (Tối đa {Math.round(maxSize / 1024 / 1024)}MB mỗi file)
            </p>
            <p className="text-sm text-secondary-600">
              Tối đa {maxImages} ảnh
            </p>
          </div>
          <button
            type="button"
            onClick={openFileDialog}
            disabled={images.length >= maxImages}
            className="bg-primary-500 hover:bg-primary-600 disabled:bg-secondary-300 disabled:cursor-not-allowed text-white px-6 py-2 rounded-lg transition-colors duration-300"
          >
            Chọn ảnh
          </button>
        </div>
      </div>

      {/* Image Previews */}
      {images.length > 0 && (
        <div className="space-y-4">
          <h4 className="text-sm font-medium text-secondary-700">
            Ảnh đã chọn ({images.length}/{maxImages})
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {images.map((image, index) => (
              <div key={index} className="relative group">
                <div className="aspect-square rounded-lg overflow-hidden bg-secondary-100">
                  <img
                    src={getImagePreview(image)}
                    alt={`Preview ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
                
                {/* Overlay with actions */}
                <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => window.open(getImagePreview(image), '_blank')}
                      className="p-2 bg-blue-500 hover:bg-blue-600 text-white rounded-full transition-colors duration-300"
                      title="Xem ảnh"
                    >
                      <FaEye className="text-sm" />
                    </button>
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="p-2 bg-red-500 hover:bg-red-600 text-white rounded-full transition-colors duration-300"
                      title="Xóa ảnh"
                    >
                      <FaTrash className="text-sm" />
                    </button>
                  </div>
                </div>
                
                {/* File info */}
                <div className="mt-2 text-xs text-secondary-600">
                  {typeof image === 'string' ? 'URL' : image.name}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageUpload; 
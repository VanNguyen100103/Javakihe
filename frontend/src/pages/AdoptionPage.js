import { useAdoption } from '../hook';
import React, { useState, useEffect } from 'react';
import { useAppDispatch } from '../hook';
import { fetchAdoptions, createAdoption } from '../store/asyncAction/adoptionAsyncAction';
import { toast } from 'react-toastify';
import { FaHeart, FaCalendarAlt, FaMapMarkerAlt, FaSpinner, FaPlus } from 'react-icons/fa';
import LoadingSpinner from '../components/common/LoadingSpinner';

const AdoptionPage = () => {
  const dispatch = useAppDispatch();
  const { adoptions = [], isLoading = false } = useAdoption();
  
  // Modal chi tiết
  const [selectedAdoption, setSelectedAdoption] = useState(null);
  
  console.log('=== AdoptionPage render ===');
  console.log('adoptions:', adoptions);
  console.log('isLoading:', isLoading);
  console.log('adoptions length:', adoptions?.length);
  
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    petId: '',
    message: ''
  });

  useEffect(() => {
    dispatch(fetchAdoptions());
  }, [dispatch]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.petId || !formData.message) {
      toast.error('Vui lòng điền đầy đủ thông tin bắt buộc!');
      return;
    }

    setIsSubmitting(true);
    
    try {
      await dispatch(createAdoption(formData)).unwrap();
      toast.success('Gửi yêu cầu nhận nuôi thành công!');
      setShowCreateForm(false);
      setFormData({
        petId: '',
        message: ''
      });
      dispatch(fetchAdoptions()); // Refresh list
    } catch (error) {
      toast.error(error || 'Gửi yêu cầu thất bại!');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toUpperCase()) {
      case 'PENDING':
        return 'status-pending';
      case 'APPROVED':
        return 'status-approved';
      case 'REJECTED':
        return 'status-rejected';
      case 'COMPLETED':
        return 'status-completed';
      default:
        return 'status-unknown';
    }
  };

  const getStatusText = (status) => {
    switch (status?.toUpperCase()) {
      case 'PENDING':
        return 'Đang xử lý';
      case 'APPROVED':
        return 'Đã chấp thuận';
      case 'REJECTED':
        return 'Từ chối';
      case 'COMPLETED':
        return 'Hoàn thành';
      default:
        return 'Không xác định';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('vi-VN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      return 'N/A';
    }
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="adoption-page">
      <div className="page-header">
        <h1>Quản lý đơn nhận nuôi</h1>
        
      </div>

      <div className="adoption-list">
        {adoptions.length === 0 ? (
          <div className="empty-state">
            <FaHeart className="empty-icon" />
            <h3>Chưa có đơn nhận nuôi nào</h3>
            <p>Bạn chưa gửi đơn nhận nuôi nào. Hãy tạo yêu cầu đầu tiên!</p>
          </div>
        ) : (
          adoptions.map((adoption) => (
            <div key={adoption.id} className="adoption-card">
              <div className="adoption-header">
                <div className="pet-info">
                  <h3>{adoption.pet?.name || 'Thú cưng không xác định'}</h3>
                  <p className="pet-type">{adoption.pet?.type || 'Không xác định'}</p>
                </div>
                <div className={`status-badge ${getStatusColor(adoption.status)}`}>
                  {getStatusText(adoption.status)}
                </div>
              </div>

              <div className="adoption-details">
                <div className="detail-item">
                  <FaCalendarAlt className="icon" />
                  <span>Ngày tạo: {formatDate(adoption.appliedAt)}</span>
                </div>
                {adoption.pet?.shelter && (
                  <div className="detail-item">
                    <FaMapMarkerAlt className="icon" />
                    <span>Shelter: {adoption.pet.shelter.name}</span>
                  </div>
                )}
              </div>

              <div className="adoption-message">
                <strong>Lý do nhận nuôi:</strong>
                <p>{adoption.message || 'Không có thông tin chi tiết'}</p>
              </div>

              <div className="adoption-actions">
                <button
                  className="btn btn-outline"
                  onClick={() => setSelectedAdoption(adoption)}
                >
                  Xem chi tiết
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal chi tiết */}
      {selectedAdoption && (
        <div className="modal-overlay" onClick={() => setSelectedAdoption(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Chi tiết đơn nhận nuôi</h3>
              <button
                className="modal-close"
                onClick={() => setSelectedAdoption(null)}
              >
                ×
              </button>
            </div>

            <div className="modal-body">
              <div className="detail-section">
                <h4>Thông tin thú cưng</h4>
                <p><strong>Tên:</strong> {selectedAdoption.pet?.name || 'N/A'}</p>
                <p><strong>Loại:</strong> {selectedAdoption.pet?.type || 'N/A'}</p>
                <p><strong>Shelter:</strong> {selectedAdoption.pet?.shelter?.name || 'N/A'}</p>
              </div>

              <div className="detail-section">
                <h4>Thông tin đơn</h4>
                <p><strong>Trạng thái:</strong> {getStatusText(selectedAdoption.status)}</p>
                <p><strong>Ngày tạo:</strong> {formatDate(selectedAdoption.appliedAt)}</p>
                <p><strong>Lý do nhận nuôi:</strong></p>
                <p className="message-text">{selectedAdoption.message || 'Không có thông tin chi tiết'}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal tạo đơn */}
      {showCreateForm && (
        <div className="modal-overlay" onClick={() => setShowCreateForm(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Tạo yêu cầu nhận nuôi</h3>
              <button
                className="modal-close"
                onClick={() => setShowCreateForm(false)}
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit} className="adoption-form">
              <div className="form-group">
                <label htmlFor="petId">Chọn thú cưng *</label>
                <select
                  id="petId"
                  name="petId"
                  value={formData.petId}
                  onChange={handleInputChange}
                  required
                  disabled={isSubmitting}
                >
                  <option value="">Chọn thú cưng...</option>
                  {/* Pet options will be loaded here */}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="message">Lý do nhận nuôi *</label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  placeholder="Mô tả lý do bạn muốn nhận nuôi thú cưng này..."
                  rows="4"
                  required
                  disabled={isSubmitting}
                />
              </div>

              <div className="form-actions">
                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={() => setShowCreateForm(false)}
                  disabled={isSubmitting}
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <FaSpinner className="spinner" />
                      Đang gửi...
                    </>
                  ) : (
                    'Gửi yêu cầu'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdoptionPage; 

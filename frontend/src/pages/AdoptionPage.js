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
    message: '',
    experience: '',
    livingCondition: '',
    familyMembers: '',
    otherPets: '',
    timeAvailable: ''
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
        message: '',
        experience: '',
        livingCondition: '',
        familyMembers: '',
        otherPets: '',
        timeAvailable: ''
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
    if (!dateString) return 'Không có thông tin';
    try {
      return new Date(dateString).toLocaleDateString('vi-VN');
    } catch (error) {
      return 'Không có thông tin';
    }
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="adoption-page">
      <div className="container">
        <div className="page-header">
          <h1>Quản lý nhận nuôi</h1>
          <p>Theo dõi các yêu cầu nhận nuôi thú cưng của bạn</p>
        </div>

        <div className="adoption-content">
        

          {(!adoptions || adoptions.length === 0) ? (
            <div className="empty-adoptions">
              <FaHeart className="empty-icon" />
              <h3>Chưa có yêu cầu nhận nuôi</h3>
              <p>Bạn chưa có yêu cầu nhận nuôi nào. Hãy tạo yêu cầu mới!</p>
            
            </div>
          ) : (
            <div className="adoptions-list">
              {Array.isArray(adoptions) && adoptions.map((adoption) => (
                <div key={adoption.id} className="adoption-card" style={{
                  border: '1px solid #eee',
                  borderRadius: 8,
                  padding: 16,
                  marginBottom: 16,
                  background: '#fff',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.03)'
                }}>
                  <div className="adoption-header" style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                    <div className="adoption-info">
                      <h3 style={{margin: 0}}>{adoption.pet?.name}</h3>
                      <p className="adoption-breed" style={{margin: 0, color: '#888'}}>{adoption.pet?.breed}</p>
                    </div>
                    <span className={`adoption-status ${getStatusColor(adoption.status)}`}>
                      {getStatusText(adoption.status)}
                    </span>
                  </div>

                  <div className="adoption-details" style={{marginTop: 8}}>
                    <p style={{margin: 0}}><b>Ngày yêu cầu:</b> {formatDate(adoption.appliedAt)}</p>
                    <p style={{margin: 0}}><b>Địa điểm:</b> {adoption.pet?.location}</p>
                    <p style={{margin: 0}}><b>Lý do nhận nuôi:</b> {adoption.message}</p>
                    {adoption.adminNotes && (
                      <p style={{margin: 0}}><b>Ghi chú từ admin:</b> {adoption.adminNotes}</p>
                    )}
                  </div>

                  <div className="adoption-actions" style={{marginTop: 8}}>
                    <button className="btn btn-outline btn-sm" onClick={() => setSelectedAdoption(adoption)}>
                      Xem chi tiết
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Modal chi tiết đơn nhận nuôi */}
        {selectedAdoption && (
          <div className="modal-overlay" style={{position: 'fixed', top:0, left:0, right:0, bottom:0, background: 'rgba(0,0,0,0.3)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
            <div className="modal-content" style={{background: '#fff', borderRadius: 8, padding: 24, minWidth: 320, maxWidth: 400, boxShadow: '0 4px 24px rgba(0,0,0,0.15)'}}>
              <h3>Chi tiết đơn nhận nuôi</h3>
              <p><b>Thú cưng:</b> {selectedAdoption.pet?.name}</p>
              <p><b>Giống:</b> {selectedAdoption.pet?.breed}</p>
              <p><b>Trạng thái:</b> {getStatusText(selectedAdoption.status)}</p>
              <p><b>Ngày yêu cầu:</b> {formatDate(selectedAdoption.appliedAt)}</p>
              <p><b>Địa điểm:</b> {selectedAdoption.pet?.location}</p>
              <p><b>Lý do nhận nuôi:</b> {selectedAdoption.message}</p>
              {selectedAdoption.adminNotes && (
                <p><b>Ghi chú từ admin:</b> {selectedAdoption.adminNotes}</p>
              )}
              <button className="btn btn-outline" style={{marginTop: 16}} onClick={() => setSelectedAdoption(null)}>Đóng</button>
            </div>
          </div>
        )}

        {/* Create Adoption Modal */}
        {showCreateForm && (
          <div className="modal-overlay">
            <div className="modal-content">
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

                <div className="form-group">
                  <label htmlFor="experience">Kinh nghiệm nuôi thú cưng</label>
                  <textarea
                    id="experience"
                    name="experience"
                    value={formData.experience}
                    onChange={handleInputChange}
                    placeholder="Mô tả kinh nghiệm nuôi thú cưng của bạn..."
                    rows="3"
                    disabled={isSubmitting}
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="livingCondition">Điều kiện sống</label>
                    <select
                      id="livingCondition"
                      name="livingCondition"
                      value={formData.livingCondition}
                      onChange={handleInputChange}
                      disabled={isSubmitting}
                    >
                      <option value="">Chọn điều kiện...</option>
                      <option value="apartment">Chung cư</option>
                      <option value="house">Nhà riêng</option>
                      <option value="villa">Biệt thự</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label htmlFor="familyMembers">Số thành viên gia đình</label>
                    <input
                      type="number"
                      id="familyMembers"
                      name="familyMembers"
                      value={formData.familyMembers}
                      onChange={handleInputChange}
                      placeholder="Số người"
                      disabled={isSubmitting}
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="otherPets">Thú cưng khác</label>
                    <input
                      type="text"
                      id="otherPets"
                      name="otherPets"
                      value={formData.otherPets}
                      onChange={handleInputChange}
                      placeholder="Mô tả thú cưng khác nếu có..."
                      disabled={isSubmitting}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="timeAvailable">Thời gian chăm sóc</label>
                    <select
                      id="timeAvailable"
                      name="timeAvailable"
                      value={formData.timeAvailable}
                      onChange={handleInputChange}
                      disabled={isSubmitting}
                    >
                      <option value="">Chọn thời gian...</option>
                      <option value="full-time">Toàn thời gian</option>
                      <option value="part-time">Bán thời gian</option>
                      <option value="weekends">Cuối tuần</option>
                    </select>
                  </div>
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
    </div>
  );
};

export default AdoptionPage; 
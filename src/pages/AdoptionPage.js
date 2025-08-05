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
  
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    petId: '',
    reason: '',
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
    
    if (!formData.petId || !formData.reason) {
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
        reason: '',
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
    switch (status?.toLowerCase()) {
      case 'pending':
        return 'status-pending';
      case 'approved':
        return 'status-approved';
      case 'rejected':
        return 'status-rejected';
      case 'completed':
        return 'status-completed';
      default:
        return 'status-unknown';
    }
  };

  const getStatusText = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending':
        return 'Đang xử lý';
      case 'approved':
        return 'Đã chấp thuận';
      case 'rejected':
        return 'Từ chối';
      case 'completed':
        return 'Hoàn thành';
      default:
        return 'Không xác định';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('vi-VN');
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
          <div className="adoption-header">
            <h2>Danh sách yêu cầu nhận nuôi</h2>
            <button
              className="btn btn-primary"
              onClick={() => setShowCreateForm(true)}
            >
              <FaPlus />
              Tạo yêu cầu mới
            </button>
          </div>

          {!adoptions || adoptions.length === 0 ? (
            <div className="empty-adoptions">
              <FaHeart className="empty-icon" />
              <h3>Chưa có yêu cầu nhận nuôi</h3>
              <p>Bạn chưa có yêu cầu nhận nuôi nào. Hãy tạo yêu cầu mới!</p>
              <button
                className="btn btn-primary"
                onClick={() => setShowCreateForm(true)}
              >
                Tạo yêu cầu đầu tiên
              </button>
            </div>
          ) : (
            <div className="adoptions-list">
              {Array.isArray(adoptions) && adoptions.map((adoption) => (
                <div key={adoption.id} className="adoption-card">
                  <div className="adoption-header">
                    <div className="adoption-info">
                      <h3>{adoption.pet?.name}</h3>
                      <p className="adoption-breed">{adoption.pet?.breed}</p>
                    </div>
                    <span className={`adoption-status ${getStatusColor(adoption.status)}`}>
                      {getStatusText(adoption.status)}
                    </span>
                  </div>

                  <div className="adoption-details">
                    <div className="detail-item">
                      <FaCalendarAlt />
                      <span>Ngày yêu cầu: {formatDate(adoption.createdAt)}</span>
                    </div>
                    
                    <div className="detail-item">
                      <FaMapMarkerAlt />
                      <span>Địa điểm: {adoption.pet?.location}</span>
                    </div>
                  </div>

                  <div className="adoption-reason">
                    <h4>Lý do nhận nuôi:</h4>
                    <p>{adoption.reason}</p>
                  </div>

                  {adoption.adminNotes && (
                    <div className="admin-notes">
                      <h4>Ghi chú từ admin:</h4>
                      <p>{adoption.adminNotes}</p>
                    </div>
                  )}

                  <div className="adoption-actions">
                    <button className="btn btn-outline btn-sm">
                      Xem chi tiết
                    </button>
                    {adoption.status === 'pending' && (
                      <button className="btn btn-outline btn-sm">
                        Hủy yêu cầu
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

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
                  <label htmlFor="reason">Lý do nhận nuôi *</label>
                  <textarea
                    id="reason"
                    name="reason"
                    value={formData.reason}
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
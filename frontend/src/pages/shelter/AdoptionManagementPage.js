import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../../contexts/AuthContext';
import { useAppDispatch } from '../../hook';
import { fetchAllAdoptions, updateAdoptionStatus } from '../../store/asyncAction/adoptionAsyncAction';
import { toast } from 'react-toastify';
import { FaCheck, FaTimes, FaEye, FaSpinner, FaFilter, FaSync } from 'react-icons/fa';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const ShelterAdoptionManagementPage = () => {
  const { user, isShelter } = useAuthContext();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  
  const [adoptions, setAdoptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState(null);
  const [filter, setFilter] = useState('all'); // all, pending, approved, rejected
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAdoption, setSelectedAdoption] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  // Check if user is shelter
  useEffect(() => {
    if (user && !isShelter) {
      console.log('User is not shelter, redirecting...');
      navigate('/');
    }
  }, [user, isShelter, navigate]);

  const fetchAdoptions = useCallback(async () => {
    try {
      setLoading(true);
      const response = await dispatch(fetchAllAdoptions()).unwrap();
      console.log('Fetched adoptions:', response);
      
      // Filter adoptions for this shelter only
      const shelterAdoptions = response?.filter(adoption => 
        adoption.pet?.shelter?.id === user?.shelter?.id
      ) || [];
      
      setAdoptions(shelterAdoptions);
    } catch (error) {
      console.error('Error fetching adoptions:', error);
      toast.error('Lỗi tải danh sách đơn nhận nuôi');
    } finally {
      setLoading(false);
    }
  }, [dispatch, user?.shelter?.id]);

  useEffect(() => {
    fetchAdoptions();
  }, [fetchAdoptions]);

  const handleStatusUpdate = async (adoptionId, newStatus, shelterNotes = '') => {
    try {
      setProcessingId(adoptionId);
      await dispatch(updateAdoptionStatus({ 
        adoptionId, 
        status: newStatus, 
        shelterNotes 
      })).unwrap();
      
      toast.success(`Đã ${newStatus === 'approved' ? 'chấp thuận' : 'từ chối'} đơn nhận nuôi`);
      fetchAdoptions(); // Refresh list
    } catch (error) {
      console.error('Error updating adoption status:', error);
      toast.error('Lỗi cập nhật trạng thái đơn nhận nuôi');
    } finally {
      setProcessingId(null);
    }
  };

  const handleViewDetails = (adoption) => {
    setSelectedAdoption(adoption);
    setShowDetailsModal(true);
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'approved':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'rejected':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
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
      default:
        return 'Không xác định';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Không có';
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const filteredAdoptions = adoptions.filter(adoption => {
    const matchesFilter = filter === 'all' || adoption.status?.toLowerCase() === filter;
    const matchesSearch = searchTerm === '' || 
      adoption.pet?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      adoption.user?.fullname?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      adoption.user?.username?.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesFilter && matchesSearch;
  });

  const getStats = () => {
    const total = adoptions.length;
    const pending = adoptions.filter(a => a.status?.toLowerCase() === 'pending').length;
    const approved = adoptions.filter(a => a.status?.toLowerCase() === 'approved').length;
    const rejected = adoptions.filter(a => a.status?.toLowerCase() === 'rejected').length;
    
    return { total, pending, approved, rejected };
  };

  const stats = getStats();

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-secondary-800 mb-2">
                Duyệt đơn nhận nuôi
              </h1>
              <p className="text-secondary-600">
                Duyệt và xử lý các đơn nhận nuôi cho thú cưng của shelter
              </p>
              {user?.shelter?.name && (
                <p className="text-sm text-secondary-500 mt-1">
                  Shelter: {user.shelter.name}
                </p>
              )}
            </div>
            <button
              onClick={fetchAdoptions}
              className="btn btn-outline"
              disabled={loading}
            >
              <FaSync className={`mr-2 ${loading ? 'animate-spin' : ''}`} />
              Làm mới
            </button>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl p-4 shadow-md">
            <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
            <div className="text-sm text-secondary-600">Tổng đơn</div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-md">
            <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
            <div className="text-sm text-secondary-600">Đang xử lý</div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-md">
            <div className="text-2xl font-bold text-green-600">{stats.approved}</div>
            <div className="text-sm text-secondary-600">Đã chấp thuận</div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-md">
            <div className="text-2xl font-bold text-red-600">{stats.rejected}</div>
            <div className="text-sm text-secondary-600">Từ chối</div>
          </div>
        </div>

        {/* Filter Controls */}
        <div className="bg-white rounded-xl p-6 shadow-md mb-6">
          <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
            <div className="flex items-center space-x-4">
              <FaFilter className="text-secondary-500" />
              <span className="text-secondary-700 font-medium">Lọc theo trạng thái:</span>
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="border border-secondary-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">Tất cả</option>
                <option value="pending">Đang xử lý</option>
                <option value="approved">Đã chấp thuận</option>
                <option value="rejected">Từ chối</option>
              </select>
            </div>
            
            <div className="flex items-center space-x-4">
              <input
                type="text"
                placeholder="Tìm kiếm theo tên thú cưng hoặc người dùng..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="border border-secondary-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <div className="text-sm text-secondary-600">
                Hiển thị: {filteredAdoptions.length}/{stats.total} đơn
              </div>
            </div>
          </div>
        </div>

        {/* Adoptions List */}
        <div className="space-y-6">
          {filteredAdoptions.length === 0 ? (
            <div className="bg-white rounded-xl p-8 shadow-md text-center">
              <div className="text-secondary-400 text-6xl mb-4">📋</div>
              <h3 className="text-xl font-semibold text-secondary-800 mb-2">
                Không có đơn nhận nuôi
              </h3>
              <p className="text-secondary-600">
                {filter === 'all' && searchTerm === ''
                  ? 'Chưa có đơn nhận nuôi nào cho thú cưng của shelter này.'
                  : `Không tìm thấy đơn nhận nuôi phù hợp với bộ lọc hiện tại.`
                }
              </p>
            </div>
          ) : (
            filteredAdoptions.map((adoption) => (
              <div key={adoption.id} className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-4 mb-2">
                      <h3 className="text-xl font-bold text-secondary-800">
                        {adoption.pet?.name || 'Thú cưng không xác định'}
                      </h3>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(adoption.status)}`}>
                        {getStatusText(adoption.status)}
                      </span>
                    </div>
                    <p className="text-secondary-600 mb-2">
                      Giống: {adoption.pet?.breed || 'Không xác định'} | 
                      Địa điểm: {adoption.pet?.location || 'Không xác định'}
                    </p>
                    <p className="text-sm text-secondary-500">
                      Người yêu cầu: {adoption.user?.fullname || adoption.user?.username || 'Không xác định'} | 
                      Ngày yêu cầu: {formatDate(adoption.createdAt)}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-4">
                  <div>
                    <h4 className="font-semibold text-secondary-800 mb-2">Lý do nhận nuôi:</h4>
                    <p className="text-secondary-700 bg-secondary-50 p-3 rounded-lg">
                      {adoption.message || 'Không có thông tin chi tiết về lý do nhận nuôi'}
                    </p>
                  </div>
                  
                
                </div>

                {adoption.shelterNotes && (
                  <div className="mb-4">
                    <h4 className="font-semibold text-secondary-800 mb-2">Ghi chú từ shelter:</h4>
                    <p className="text-secondary-700 bg-blue-50 p-3 rounded-lg border-l-4 border-blue-400">
                      {adoption.shelterNotes}
                    </p>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex items-center justify-end space-x-3 pt-4 border-t border-secondary-200">
                  <button
                    className="btn btn-outline btn-sm"
                    onClick={() => handleViewDetails(adoption)}
                  >
                    <FaEye className="mr-1" />
                    Xem chi tiết
                  </button>
                  
                  {adoption.status === 'pending' && (
                    <>
                      <button
                        className="btn btn-success btn-sm"
                        onClick={() => handleStatusUpdate(adoption.id, 'approved')}
                        disabled={processingId === adoption.id}
                      >
                        {processingId === adoption.id ? (
                          <FaSpinner className="animate-spin mr-1" />
                        ) : (
                          <FaCheck className="mr-1" />
                        )}
                        Chấp thuận
                      </button>
                      
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => {
                          const notes = prompt('Nhập lý do từ chối (tùy chọn):');
                          if (notes !== null) {
                            handleStatusUpdate(adoption.id, 'rejected', notes);
                          }
                        }}
                        disabled={processingId === adoption.id}
                      >
                        {processingId === adoption.id ? (
                          <FaSpinner className="animate-spin mr-1" />
                        ) : (
                          <FaTimes className="mr-1" />
                        )}
                        Từ chối
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Details Modal */}
      {showDetailsModal && selectedAdoption && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-secondary-800">
                Chi tiết đơn nhận nuôi
              </h2>
              <button
                onClick={() => setShowDetailsModal(false)}
                className="text-secondary-500 hover:text-secondary-700"
              >
                <FaTimes size={20} />
              </button>
            </div>
            
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-secondary-800 mb-3">Thông tin thú cưng</h3>
                  <div className="space-y-2">
                    <p><strong>Tên:</strong> {selectedAdoption.pet?.name}</p>
                    <p><strong>Giống:</strong> {selectedAdoption.pet?.breed}</p>
                    <p><strong>Địa điểm:</strong> {selectedAdoption.pet?.location}</p>
                    <p><strong>Tuổi:</strong> {selectedAdoption.pet?.age}</p>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-semibold text-secondary-800 mb-3">Thông tin người nhận nuôi</h3>
                  <div className="space-y-2">
                    <p><strong>Tên:</strong> {selectedAdoption.user?.fullname || selectedAdoption.user?.username}</p>
                    <p><strong>Email:</strong> {selectedAdoption.user?.email}</p>
                    <p><strong>Số điện thoại:</strong> {selectedAdoption?.user?.phone || 'Không có'}</p>
                    <p><strong>Địa chỉ:</strong> {selectedAdoption?.user?.address || 'Không có'}</p>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="font-semibold text-secondary-800 mb-3">Lý do nhận nuôi</h3>
                <p className="text-secondary-700 bg-secondary-50 p-4 rounded-lg">
                  {selectedAdoption.message || 'Không có thông tin chi tiết về lý do nhận nuôi'}
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
                
                <div>
                  <h3 className="font-semibold text-secondary-800 mb-3">Thông tin đơn</h3>
                  <div className="space-y-2">
                    <p><strong>Trạng thái:</strong> 
                      <span className={`ml-2 px-2 py-1 rounded-full text-sm font-medium border ${getStatusColor(selectedAdoption.status)}`}>
                        {getStatusText(selectedAdoption.status)}
                      </span>
                    </p>
                    <p><strong>Ngày tạo:</strong> {formatDate(selectedAdoption.createdAt)}</p>
                    <p><strong>Ngày cập nhật:</strong> {formatDate(selectedAdoption.updatedAt)}</p>
                  </div>
                </div>
              </div>
              
              {selectedAdoption.shelterNotes && (
                <div>
                  <h3 className="font-semibold text-secondary-800 mb-3">Ghi chú từ shelter</h3>
                  <p className="text-secondary-700 bg-blue-50 p-4 rounded-lg border-l-4 border-blue-400">
                    {selectedAdoption.shelterNotes}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShelterAdoptionManagementPage; 

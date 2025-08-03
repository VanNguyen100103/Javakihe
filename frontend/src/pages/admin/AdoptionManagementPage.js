import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../../contexts/AuthContext';
import { useAppDispatch } from '../../hook';
import { fetchAllAdoptions, updateAdoptionStatus } from '../../store/asyncAction/adoptionAsyncAction';
import { toast } from 'react-toastify';
import { FaCheck, FaTimes, FaEye, FaSpinner, FaFilter, FaSync  } from 'react-icons/fa';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const AdoptionManagementPage = () => {
  const { user, isAdmin } = useAuthContext();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  
  const [adoptions, setAdoptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState(null);
  const [filter, setFilter] = useState('all'); // all, pending, approved, rejected
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAdoption, setSelectedAdoption] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showNotesModal, setShowNotesModal] = useState(false);
  const [notesAction, setNotesAction] = useState({ type: '', adoptionId: null, currentNotes: '' });

  // Check if user is admin
  useEffect(() => {
    if (user && !isAdmin) {
      console.log('User is not admin, redirecting...');
      navigate('/');
    }
  }, [user, isAdmin, navigate]);

  const fetchAdoptions = useCallback(async () => {
    try {
      setLoading(true);
      console.log('=== Fetching adoptions for admin ===');
      console.log('=== User info ===', { user, isAdmin });
      
      const response = await dispatch(fetchAllAdoptions()).unwrap();
      console.log('=== Fetched adoptions response ===', response);
      console.log('=== Response type ===', typeof response);
      console.log('=== Response length ===', Array.isArray(response) ? response.length : 'Not an array');
      console.log('=== Response structure ===', JSON.stringify(response, null, 2));
      
      if (Array.isArray(response)) {
        setAdoptions(response);
        console.log('=== Set adoptions state ===', response.length, 'items');
        console.log('=== First adoption ===', response[0]);
      } else {
        console.error('=== Response is not an array ===', response);
        setAdoptions([]);
        toast.error('Dữ liệu không đúng định dạng');
      }
    } catch (error) {
      console.error('=== Fetch adoptions error ===', error);
      console.error('=== Error details ===', {
        message: error.message,
        response: error.response,
        status: error.response?.status,
        data: error.response?.data
      });
      
      if (error.response?.status === 403) {
        toast.error('Không có quyền truy cập dữ liệu adoption');
      } else {
        toast.error('Lỗi tải danh sách đơn nhận nuôi');
      }
      setAdoptions([]);
    } finally {
      setLoading(false);
    }
  }, [dispatch, user, isAdmin]);

  useEffect(() => {
    fetchAdoptions();
  }, [fetchAdoptions]);

  const handleStatusUpdate = async (adoptionId, newStatus, notes = '') => {
    try {
      setProcessingId(adoptionId);
      await dispatch(updateAdoptionStatus({ 
        adoptionId, 
        status: newStatus, 
        adminNotes: notes 
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
    console.log('=== Filtering adoption ===', {
      id: adoption.id,
      status: adoption.status,
      petName: adoption.pet?.name,
      userName: adoption.user?.fullname || adoption.user?.username,
      filter: filter,
      searchTerm: searchTerm
    });
    
    const matchesFilter = filter === 'all' || adoption.status?.toLowerCase() === filter;
    const matchesSearch = searchTerm === '' || 
      adoption.pet?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      adoption.user?.fullname?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      adoption.user?.username?.toLowerCase().includes(searchTerm.toLowerCase());
    
    console.log('=== Filter results ===', {
      matchesFilter,
      matchesSearch,
      finalResult: matchesFilter && matchesSearch
    });
    
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

  console.log('=== Render debug ===', {
    adoptions: adoptions,
    adoptionsLength: adoptions.length,
    filteredAdoptions: filteredAdoptions,
    filteredLength: filteredAdoptions.length,
    loading: loading,
    stats: stats
  });

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
                Quản lý đơn nhận nuôi
              </h1>
              <p className="text-secondary-600">
                Duyệt và xử lý các đơn nhận nuôi từ người dùng
              </p>
            </div>
            <button
              onClick={fetchAdoptions}
              className="btn btn-outline"
              disabled={loading}
            >
              <FaSync className={`mr-2 ${loading ? 'animate-spin' : ''}`} />
              Làm mới
            </button>
            
            {/* Test button for development */}
            <button
              onClick={async () => {
                try {
                  const response = await fetch('/api/adoptions/test-create', {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json',
                      'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                  });
                  
                  if (response.ok) {
                    toast.success('Đã tạo dữ liệu test!');
                    fetchAdoptions(); // Refresh data
                  } else {
                    toast.error('Không thể tạo dữ liệu test');
                  }
                } catch (error) {
                  toast.error('Lỗi tạo dữ liệu test');
                }
              }}
              className="btn btn-secondary ml-2"
            >
              Tạo dữ liệu test
            </button>
            
            {/* Direct API test button */}
            <button
              onClick={async () => {
                try {
                  console.log('=== Testing direct API call ===');
                  const token = localStorage.getItem('token');
                  console.log('Token:', token ? 'Present' : 'Missing');
                  
                  const response = await fetch('/api/adoptions/all', {
                    method: 'GET',
                    headers: {
                      'Authorization': `Bearer ${token}`,
                      'Content-Type': 'application/json'
                    }
                  });
                  
                  console.log('=== Direct API response status ===', response.status);
                  console.log('=== Direct API response headers ===', response.headers);
                  
                  const data = await response.json();
                  console.log('=== Direct API response data ===', data);
                  
                  if (response.ok) {
                    toast.success(`API call successful! Found ${Array.isArray(data) ? data.length : 0} adoptions`);
                    setAdoptions(Array.isArray(data) ? data : []);
                  } else {
                    toast.error(`API call failed: ${response.status} - ${data.message || 'Unknown error'}`);
                  }
                } catch (error) {
                  console.error('=== Direct API test error ===', error);
                  toast.error('Lỗi test API trực tiếp');
                }
              }}
              className="btn btn-warning ml-2"
            >
              Test API trực tiếp
            </button>
            
            {/* Raw API test button */}
            <button
              onClick={async () => {
                try {
                  console.log('=== Testing raw API call ===');
                  const token = localStorage.getItem('accessToken');
                  console.log('Access Token:', token ? 'Present' : 'Missing');
                  
                  const response = await fetch('http://localhost:8888/api/adoptions/all', {
                    method: 'GET',
                    headers: {
                      'Authorization': `Bearer ${token}`,
                      'Content-Type': 'application/json'
                    }
                  });
                  
                  console.log('=== Raw API response status ===', response.status);
                  console.log('=== Raw API response headers ===', response.headers);
                  
                  const text = await response.text();
                  console.log('=== Raw API response text ===', text);
                  
                  try {
                    const data = JSON.parse(text);
                    console.log('=== Raw API response parsed ===', data);
                    toast.success(`Raw API successful! Found ${Array.isArray(data) ? data.length : 0} adoptions`);
                  } catch (parseError) {
                    console.error('=== JSON parse error ===', parseError);
                    toast.error('Response không phải JSON hợp lệ');
                  }
                } catch (error) {
                  console.error('=== Raw API test error ===', error);
                  toast.error('Lỗi test raw API');
                }
              }}
              className="btn btn-error ml-2"
            >
              Test Raw API
            </button>

            {/* Test User Data button */}
            <button
              onClick={async () => {
                try {
                  console.log('=== Testing user data ===');
                  const token = localStorage.getItem('accessToken');
                  console.log('Access Token:', token ? 'Present' : 'Missing');
                  
                  const response = await fetch('http://localhost:8888/api/adoptions/test-user/1', {
                    method: 'GET',
                    headers: {
                      'Authorization': `Bearer ${token}`,
                      'Content-Type': 'application/json'
                    }
                  });
                  
                  console.log('=== User data response status ===', response.status);
                  
                  const data = await response.json();
                  console.log('=== User data response ===', data);
                  
                  if (response.ok) {
                    toast.success(`User data retrieved! Phone: ${data.phone}, Address: ${data.address}`);
                    console.log('=== User details ===', {
                      id: data.id,
                      username: data.username,
                      email: data.email,
                      fullName: data.fullName,
                      phone: data.phone,
                      address: data.address,
                      role: data.role
                    });
                  } else {
                    toast.error(`User data failed: ${response.status} - ${data.message || 'Unknown error'}`);
                  }
                } catch (error) {
                  console.error('=== User data test error ===', error);
                  toast.error('Lỗi test user data');
                }
              }}
              className="btn btn-info ml-2"
            >
              Test User Data
            </button>

            {/* Update User Data button */}
            <button
              onClick={async () => {
                try {
                  console.log('=== Updating user data ===');
                  const token = localStorage.getItem('accessToken');
                  console.log('Access Token:', token ? 'Present' : 'Missing');
                  
                  const updateData = {
                    phone: "0123456789",
                    address: "123 Test Street, Test City"
                  };
                  
                  const response = await fetch('http://localhost:8888/api/adoptions/test-user/1', {
                    method: 'PUT',
                    headers: {
                      'Authorization': `Bearer ${token}`,
                      'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(updateData)
                  });
                  
                  console.log('=== Update user response status ===', response.status);
                  
                  const data = await response.json();
                  console.log('=== Update user response ===', data);
                  
                  if (response.ok) {
                    toast.success(`User data updated! Phone: ${data.phone}, Address: ${data.address}`);
                    console.log('=== Updated user details ===', {
                      id: data.id,
                      username: data.username,
                      email: data.email,
                      fullName: data.fullName,
                      phone: data.phone,
                      address: data.address,
                      role: data.role
                    });
                  } else {
                    toast.error(`Update failed: ${response.status} - ${data.message || 'Unknown error'}`);
                  }
                } catch (error) {
                  console.error('=== Update user data error ===', error);
                  toast.error('Lỗi update user data');
                }
              }}
              className="btn btn-success ml-2"
            >
              Update User Data
            </button>

            {/* Test Update Adoption Status button */}
            <button
              onClick={async () => {
                try {
                  console.log('=== Testing update adoption status ===');
                  const token = localStorage.getItem('accessToken');
                  console.log('Access Token:', token ? 'Present' : 'Missing');
                  
                  const updateData = {
                    status: "approved",
                    adminNotes: "Test approval from admin"
                  };
                  
                  const response = await fetch('http://localhost:8888/api/adoptions/62/status', {
                    method: 'PUT',
                    headers: {
                      'Authorization': `Bearer ${token}`,
                      'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(updateData)
                  });
                  
                  console.log('=== Update adoption status response status ===', response.status);
                  
                  const data = await response.json();
                  console.log('=== Update adoption status response ===', data);
                  
                  if (response.ok) {
                    toast.success(`Adoption status updated! Status: ${data.status}, ID: ${data.id}`);
                    console.log('=== Updated adoption details ===', {
                      id: data.id,
                      status: data.status,
                      adminNotes: data.adminNotes,
                      user: data.user,
                      pet: data.pet
                    });
                  } else {
                    toast.error(`Update failed: ${response.status} - ${data.message || 'Unknown error'}`);
                  }
                } catch (error) {
                  console.error('=== Update adoption status error ===', error);
                  toast.error('Lỗi update adoption status');
                }
              }}
              className="btn btn-warning ml-2"
            >
              Test Update Status
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
                  ? 'Chưa có đơn nhận nuôi nào trong hệ thống.'
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
                      Ngày yêu cầu: {formatDate(adoption?.appliedAt)}
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
                  
                  <div>
                    <h4 className="font-semibold text-secondary-800 mb-2">Thông tin liên hệ:</h4>
                    <div className="space-y-2 text-sm text-secondary-700">
                      <p><strong>Số điện thoại:</strong> {adoption.user?.phone || 'Không có'}</p>
                      <p><strong>Địa chỉ:</strong> {adoption.user?.address || 'Không có'}</p>
                    </div>
                  </div>
                </div>

                {adoption.adminNotes && (
                  <div className="mb-4">
                    <h4 className="font-semibold text-secondary-800 mb-2">Ghi chú từ admin:</h4>
                    <p className="text-secondary-700 bg-blue-50 p-3 rounded-lg border-l-4 border-blue-400">
                      {adoption.adminNotes}
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
                  <h3 className="font-semibold text-secondary-800 mb-3">Lý do nhận nuôi</h3>
                  <p className="text-secondary-700 bg-secondary-50 p-4 rounded-lg">
                    {selectedAdoption.message || 'Không có thông tin chi tiết về lý do nhận nuôi'}
                  </p>
                </div>
                
                <div>
                  <h3 className="font-semibold text-secondary-800 mb-3">Thông tin liên hệ</h3>
                  <div className="space-y-2">
                    <p><strong>Số điện thoại:</strong> {selectedAdoption?.user.phone || 'Không có'}</p>
                    <p><strong>Địa chỉ:</strong> {selectedAdoption?.user.address || 'Không có'}</p>
                  </div>
                </div>
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
                  </div>
                </div>
              </div>
              
              {selectedAdoption.adminNotes && (
                <div>
                  <h3 className="font-semibold text-secondary-800 mb-3">Ghi chú từ admin</h3>
                  <p className="text-secondary-700 bg-blue-50 p-4 rounded-lg border-l-4 border-blue-400">
                    {selectedAdoption.adminNotes}
                  </p>
                </div>
              )}
              
              {/* Status Update Section */}
              {(selectedAdoption.status === 'pending' || selectedAdoption.status === 'PENDING') && (
                <div className="border-t border-secondary-200 pt-6">
                  <h3 className="font-semibold text-secondary-800 mb-4">Cập nhật trạng thái</h3>
                  <div className="flex items-center space-x-4">
                    <button
                      className="btn btn-success"
                      onClick={() => {
                        setNotesAction({
                          type: 'approve',
                          adoptionId: selectedAdoption.id,
                          currentNotes: selectedAdoption.adminNotes || ''
                        });
                        setShowNotesModal(true);
                      }}
                      disabled={processingId === selectedAdoption.id}
                    >
                      {processingId === selectedAdoption.id ? (
                        <FaSpinner className="animate-spin mr-2" />
                      ) : (
                        <FaCheck className="mr-2" />
                      )}
                      Chấp thuận đơn
                    </button>
                    
                    <button
                      className="btn btn-danger"
                      onClick={() => {
                        setNotesAction({
                          type: 'reject',
                          adoptionId: selectedAdoption.id,
                          currentNotes: selectedAdoption.adminNotes || ''
                        });
                        setShowNotesModal(true);
                      }}
                      disabled={processingId === selectedAdoption.id}
                    >
                      {processingId === selectedAdoption.id ? (
                        <FaSpinner className="animate-spin mr-2" />
                      ) : (
                        <FaTimes className="mr-2" />
                      )}
                      Từ chối đơn
                    </button>
                  </div>
                </div>
              )}
              
              {/* Debug Status */}
              <div className="border-t border-secondary-200 pt-4">
                <p className="text-sm text-gray-500">
                  Debug: Status = "{selectedAdoption.status}" (Type: {typeof selectedAdoption.status})
                </p>
                <p className="text-sm text-gray-500">
                  Is Pending: {(selectedAdoption.status === 'pending' || selectedAdoption.status === 'PENDING') ? 'Yes' : 'No'}
                </p>
                
                {/* Force Show Status Buttons for Testing */}
                <div className="mt-4">
                  <button
                    className="btn btn-warning btn-sm"
                    onClick={() => {
                      setNotesAction({
                        type: 'approve',
                        adoptionId: selectedAdoption.id,
                        currentNotes: selectedAdoption.adminNotes || ''
                      });
                      setShowNotesModal(true);
                    }}
                  >
                    Test: Chấp thuận đơn
                  </button>
                  <button
                    className="btn btn-error btn-sm ml-2"
                    onClick={() => {
                      setNotesAction({
                        type: 'reject',
                        adoptionId: selectedAdoption.id,
                        currentNotes: selectedAdoption.adminNotes || ''
                      });
                      setShowNotesModal(true);
                    }}
                  >
                    Test: Từ chối đơn
                  </button>
                  
                  {/* Direct API test */}
                  <button
                    className="btn btn-info btn-sm ml-2"
                    onClick={async () => {
                      try {
                        console.log('=== Testing direct status update API ===');
                        const token = localStorage.getItem('accessToken');
                        console.log('Token:', token ? 'Present' : 'Missing');
                        
                        const response = await fetch(`/api/adoptions/${selectedAdoption.id}/status`, {
                          method: 'PUT',
                          headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json'
                          },
                          body: JSON.stringify({
                            status: 'approved',
                            adminNotes: 'Test approval via direct API call',
                            shelterNotes: ''
                          })
                        });
                        
                        console.log('=== Direct API response status ===', response.status);
                        
                        if (response.ok) {
                          const data = await response.json();
                          console.log('=== Direct API response data ===', data);
                          toast.success('Direct API call successful!');
                          fetchAdoptions(); // Refresh data
                        } else {
                          const errorText = await response.text();
                          console.error('=== Direct API error ===', errorText);
                          toast.error(`Direct API failed: ${response.status}`);
                        }
                      } catch (error) {
                        console.error('=== Direct API test error ===', error);
                        toast.error('Lỗi test direct API');
                      }
                    }}
                  >
                    Test Direct API
                  </button>
                </div>
              </div>
              
              {/* Current Status Display */}
              {selectedAdoption.status !== 'pending' && selectedAdoption.status !== 'PENDING' && (
                <div className="border-t border-secondary-200 pt-6">
                  <h3 className="font-semibold text-secondary-800 mb-3">Trạng thái hiện tại</h3>
                  <div className="flex items-center space-x-4">
                    <span className={`px-3 py-2 rounded-full text-sm font-medium border ${getStatusColor(selectedAdoption.status)}`}>
                      {getStatusText(selectedAdoption.status)}
                    </span>
                    {selectedAdoption.status === 'approved' && (
                      <span className="text-green-600 text-sm">
                        ✓ Đơn đã được chấp thuận
                      </span>
                    )}
                    {selectedAdoption.status === 'rejected' && (
                      <span className="text-red-600 text-sm">
                        ✗ Đơn đã bị từ chối
                      </span>
                    )}
                  </div>
                  
                  {/* Update Admin Notes */}
                  <div className="mt-4">
                    <button
                      className="btn btn-outline btn-sm"
                      onClick={() => {
                        setNotesAction({
                          type: 'update',
                          adoptionId: selectedAdoption.id,
                          currentNotes: selectedAdoption.adminNotes || ''
                        });
                        setShowNotesModal(true);
                      }}
                      disabled={processingId === selectedAdoption.id}
                    >
                      {processingId === selectedAdoption.id ? (
                        <FaSpinner className="animate-spin mr-2" />
                      ) : (
                        'Cập nhật ghi chú'
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      
      {/* Notes Modal */}
      {showNotesModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-secondary-800">
                {notesAction.type === 'approve' ? 'Chấp thuận đơn' : 
                 notesAction.type === 'reject' ? 'Từ chối đơn' : 'Cập nhật ghi chú'}
              </h3>
              <button
                onClick={() => setShowNotesModal(false)}
                className="text-secondary-500 hover:text-secondary-700"
              >
                <FaTimes size={20} />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">
                  {notesAction.type === 'approve' ? 'Ghi chú (tùy chọn):' :
                   notesAction.type === 'reject' ? 'Lý do từ chối:' : 'Ghi chú admin:'}
                </label>
                <textarea
                  className="w-full p-3 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={4}
                  placeholder={notesAction.type === 'approve' ? 'Nhập ghi chú cho đơn này...' :
                             notesAction.type === 'reject' ? 'Nhập lý do từ chối...' : 'Nhập ghi chú...'}
                  defaultValue={notesAction.currentNotes}
                />
              </div>
              
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowNotesModal(false)}
                  className="btn btn-outline"
                >
                  Hủy
                </button>
                <button
                  onClick={() => {
                    const notes = document.querySelector('textarea').value;
                    if (notesAction.type === 'reject' && !notes.trim()) {
                      alert('Vui lòng nhập lý do từ chối!');
                      return;
                    }
                    
                    handleStatusUpdate(notesAction.adoptionId, 
                      notesAction.type === 'approve' ? 'approved' : 
                      notesAction.type === 'reject' ? 'rejected' : 
                      selectedAdoption.status, notes);
                    
                    setShowNotesModal(false);
                    setShowDetailsModal(false);
                  }}
                  className={`btn ${notesAction.type === 'approve' ? 'btn-success' : 
                             notesAction.type === 'reject' ? 'btn-danger' : 'btn-primary'}`}
                >
                  {notesAction.type === 'approve' ? 'Chấp thuận' :
                   notesAction.type === 'reject' ? 'Từ chối' : 'Cập nhật'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdoptionManagementPage; 


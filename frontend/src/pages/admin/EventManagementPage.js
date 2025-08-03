import React, { useState, useEffect, useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '../../hook';
import { useAuthContext } from '../../contexts/AuthContext';
import { toast } from 'react-toastify';
import { FaPlus, FaEdit, FaTrash, FaSearch, FaFilter, FaTimes, FaMapMarkerAlt, FaUsers } from 'react-icons/fa';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Pagination from '../../components/common/Pagination';
import EventForm from '../../components/event/EventForm';
import { 
  fetchEvents, 
  createEvent, 
  updateEvent, 
  deleteEvent
} from '../../store/asyncAction/eventAsyncAction';
import { 
  clearError,
  clearMessage,
  setFilters,
  clearFilters
} from '../../store/slice/eventSlice';

const EventManagementPage = () => {
  const dispatch = useAppDispatch();
  const { isAdmin, canManageEvents } = useAuthContext();
  const { events, pagination, filters, isLoading, error, message } = useAppSelector(state => state.event);
  
  const [showFilters, setShowFilters] = useState(false);
  const [selectedEvents, setSelectedEvents] = useState([]);
  
  // Form modal states
  const [showFormModal, setShowFormModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loadEvents = useCallback(async (page = 0) => {
    const params = {
      page,
      size: pagination.size,
      ...filters
    };
    dispatch(fetchEvents(params));
  }, [dispatch, pagination.size, filters]);

  useEffect(() => {
    if (isAdmin || canManageEvents) {
      loadEvents();
    }
  }, [isAdmin, canManageEvents, loadEvents]);

  // Handle error and message toasts
  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearError());
    }
    if (message) {
      toast.success(message);
      dispatch(clearMessage());
    }
  }, [error, message, dispatch]);

  const handleFilterChange = (name, value) => {
    dispatch(setFilters({ [name]: value }));
  };

  const handleSearch = () => {
    loadEvents(0);
  };

  const handleClearFilters = () => {
    dispatch(clearFilters());
    loadEvents(0);
  };

  const handlePageChange = (page) => {
    loadEvents(page);
  };

  const handleDeleteEvent = async (eventId) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa sự kiện này?')) {
      try {
        await dispatch(deleteEvent(eventId)).unwrap();
        loadEvents(pagination.page);
      } catch (error) {
        console.error('Error deleting event:', error);
      }
    }
  };

  const handleStatusChange = async (eventId, newStatus) => {
    try {
      const eventToUpdate = events.find(event => event.id === eventId);
      if (eventToUpdate) {
        await dispatch(updateEvent({ 
          id: eventId, 
          eventData: { ...eventToUpdate, status: newStatus } 
        })).unwrap();
        loadEvents(pagination.page);
      }
    } catch (error) {
      console.error('Error updating event status:', error);
    }
  };

  const handleSelectEvent = (eventId) => {
    setSelectedEvents(prev => 
      prev.includes(eventId) 
        ? prev.filter(id => id !== eventId)
        : [...prev, eventId]
    );
  };

  const handleSelectAll = () => {
    if (selectedEvents.length === events.length) {
      setSelectedEvents([]);
    } else {
      setSelectedEvents(events.map(event => event.id));
    }
  };

  const handleBulkDelete = async () => {
    if (selectedEvents.length === 0) {
      toast.warning('Vui lòng chọn sự kiện để xóa');
      return;
    }

    if (window.confirm(`Bạn có chắc chắn muốn xóa ${selectedEvents.length} sự kiện?`)) {
      try {
        await Promise.all(selectedEvents.map(id => dispatch(deleteEvent(id)).unwrap()));
        setSelectedEvents([]);
        loadEvents(pagination.page);
      } catch (error) {
        console.error('Error bulk deleting events:', error);
      }
    }
  };

  const handleAddEvent = () => {
    setEditingEvent(null);
    setShowFormModal(true);
  };

  const handleEditEvent = (event) => {
    setEditingEvent(event);
    setShowFormModal(true);
  };

  const handleSubmitEvent = async (formData) => {
    setIsSubmitting(true);
    try {
      if (editingEvent) {
        await dispatch(updateEvent({ id: editingEvent.id, eventData: formData })).unwrap();
      } else {
        await dispatch(createEvent(formData)).unwrap();
      }
      setShowFormModal(false);
      loadEvents(pagination.page);
    } catch (error) {
      console.error('Error submitting event:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'UPCOMING': return 'bg-blue-100 text-blue-800';
      case 'ONGOING': return 'bg-green-100 text-green-800';
      case 'COMPLETED': return 'bg-gray-100 text-gray-800';
      case 'CANCELLED': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

 

  const getCategoryText = (category) => {
    switch (category) {
      case 'ADOPTION': return 'Nhận nuôi';
      case 'FUNDRAISING': return 'Gây quỹ';
      case 'VOLUNTEER': return 'Tình nguyện';
      case 'EDUCATION': return 'Giáo dục';
      case 'OTHER': return 'Khác';
      default: return category;
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Không có quyền truy cập</h1>
          <p className="text-gray-600">Chỉ Admin mới có quyền quản lý sự kiện.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Quản lý sự kiện</h1>
          <p className="mt-2 text-gray-600">Quản lý tất cả sự kiện trong hệ thống</p>
        </div>

        {/* Actions Bar */}
        <div className="bg-white rounded-lg shadow mb-6 p-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
            <div className="flex items-center space-x-4">
              <button
                onClick={handleAddEvent}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center space-x-2"
              >
                <FaPlus className="w-4 h-4" />
                <span>Thêm sự kiện</span>
              </button>
              
              {selectedEvents.length > 0 && (
                <button
                  onClick={handleBulkDelete}
                  className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 flex items-center space-x-2"
                >
                  <FaTrash className="w-4 h-4" />
                  <span>Xóa đã chọn ({selectedEvents.length})</span>
                </button>
              )}
            </div>

            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
              >
                <FaFilter className="w-4 h-4" />
                <span>Bộ lọc</span>
              </button>
            </div>
          </div>

          {/* Filters */}
          {showFilters && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <input
                  type="text"
                  placeholder="Tìm kiếm sự kiện..."
                  value={filters.search || ''}
                  onChange={(e) => handleFilterChange('search', e.target.value)}
                  className="border border-gray-300 rounded-md px-3 py-2"
                />
                
                <select
                  value={filters.status || ''}
                  onChange={(e) => handleFilterChange('status', e.target.value)}
                  className="border border-gray-300 rounded-md px-3 py-2"
                >
                  <option value="">Tất cả trạng thái</option>
                  <option value="UPCOMING">Sắp diễn ra</option>
                  <option value="ONGOING">Đang diễn ra</option>
                  <option value="COMPLETED">Đã hoàn thành</option>
                  <option value="CANCELLED">Đã hủy</option>
                </select>

                <select
                  value={filters.category || ''}
                  onChange={(e) => handleFilterChange('category', e.target.value)}
                  className="border border-gray-300 rounded-md px-3 py-2"
                >
                  <option value="">Tất cả danh mục</option>
                  <option value="ADOPTION">Nhận nuôi</option>
                  <option value="FUNDRAISING">Gây quỹ</option>
                  <option value="VOLUNTEER">Tình nguyện</option>
                  <option value="EDUCATION">Giáo dục</option>
                  <option value="OTHER">Khác</option>
                </select>

                <div className="flex space-x-2">
                  <button
                    onClick={handleSearch}
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                  >
                    <FaSearch className="w-4 h-4" />
                  </button>
                  <button
                    onClick={handleClearFilters}
                    className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700"
                  >
                    <FaTimes className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Events Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <LoadingSpinner />
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        <input
                          type="checkbox"
                          checked={selectedEvents.length === events.length && events.length > 0}
                          onChange={handleSelectAll}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Sự kiện
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Ngày & Giờ
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Địa điểm
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Danh mục
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Trạng thái
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Người tham gia
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Hành động
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {events.map((event) => (
                      <tr key={event.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <input
                            type="checkbox"
                            checked={selectedEvents.includes(event.id)}
                            onChange={() => handleSelectEvent(event.id)}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div>
                              <div className="text-sm font-medium text-gray-900">{event.title}</div>
                              <div className="text-sm text-gray-500">{event.description}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{formatDate(event.date)}</div>
                          <div className="text-sm text-gray-500">
                            {event.startTime} - {event.endTime}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center text-sm text-gray-900">
                            <FaMapMarkerAlt className="w-4 h-4 mr-1 text-gray-400" />
                            {event.location}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {getCategoryText(event.category)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <select
                            value={event.status}
                            onChange={(e) => handleStatusChange(event.id, e.target.value)}
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(event.status)}`}
                          >
                            <option value="UPCOMING">Sắp diễn ra</option>
                            <option value="ONGOING">Đang diễn ra</option>
                            <option value="COMPLETED">Đã hoàn thành</option>
                            <option value="CANCELLED">Đã hủy</option>
                          </select>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center text-sm text-gray-900">
                            <FaUsers className="w-4 h-4 mr-1 text-gray-400" />
                            {event.maxParticipants}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => handleEditEvent(event)}
                              className="text-blue-600 hover:text-blue-900"
                            >
                              <FaEdit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteEvent(event.id)}
                              className="text-red-600 hover:text-red-900"
                            >
                              <FaTrash className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {events.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-gray-500">Không tìm thấy sự kiện nào</p>
                </div>
              )}
            </>
          )}
        </div>

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="mt-6">
            <Pagination
              currentPage={pagination.currentPage}
              totalPages={pagination.totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        )}
      </div>

      {/* Event Form Modal */}
      {showFormModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">
                  {editingEvent ? 'Chỉnh sửa sự kiện' : 'Thêm sự kiện mới'}
                </h3>
                <button
                  onClick={() => setShowFormModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <FaTimes className="w-6 h-6" />
                </button>
              </div>
              
              <EventForm
                event={editingEvent}
                onSubmit={handleSubmitEvent}
                onCancel={() => setShowFormModal(false)}
                isLoading={isSubmitting}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventManagementPage; 

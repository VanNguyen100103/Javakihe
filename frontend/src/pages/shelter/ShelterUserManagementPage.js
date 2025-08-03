import React, { useState, useEffect, useCallback } from 'react';
import { useAppDispatch } from '../../hook';
import { useUserManagement } from '../../hook';
import { toast } from 'react-toastify';
import { 
  FaUsers, 
  FaEdit, 
  FaUserCheck,
  FaUserTimes
} from 'react-icons/fa';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import SearchFilter from '../../components/common/SearchFilter';
import { 
  fetchAllUsers, 
  updateUser, 
  toggleUserStatus 
} from '../../store/asyncAction/userManagementAsyncAction';

const ShelterUserManagementPage = () => {
  const dispatch = useAppDispatch();
  const { users, isLoading, error, message } = useUserManagement();
  
  const [selectedUser, setSelectedUser] = useState(null);
  const [showUserModal, setShowUserModal] = useState(false);
  
  // Filter state - Shelter staff can only view ADOPTER, DONOR, VOLUNTEER
  const [filters, setFilters] = useState({
    search: '',
    role: '',
    enabled: '',
    sortBy: 'id',
    sortOrder: 'desc'
  });

  const fetchUsers = useCallback(async () => {
    try {
      // Shelter staff can only view non-admin users
      const shelterFilters = {
        ...filters,
        excludeRoles: ['ADMIN'] // Exclude admin users
      };
      await dispatch(fetchAllUsers(shelterFilters)).unwrap();
    } catch (error) {
      toast.error('Lỗi khi tải danh sách người dùng');
    }
  }, [dispatch, filters]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
    if (message) {
      toast.success(message);
    }
  }, [error, message]);

  const handleFilterChange = (newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const handleEditUser = (user) => {
    // Shelter staff can only edit non-admin users
    if (user.role === 'ADMIN') {
      toast.error('Không có quyền chỉnh sửa tài khoản Admin');
      return;
    }
    setSelectedUser(user);
    setShowUserModal(true);
  };

  const handleToggleUserStatus = async (userId, enabled) => {
    try {
      const user = users.find(u => u.id === userId);
      if (user && user.role === 'ADMIN') {
        toast.error('Không có quyền thay đổi trạng thái tài khoản Admin');
        return;
      }
      
      await dispatch(toggleUserStatus({ id: userId, enabled })).unwrap();
      toast.success(`Đã ${enabled ? 'kích hoạt' : 'vô hiệu hóa'} người dùng`);
    } catch (error) {
      toast.error('Lỗi khi cập nhật trạng thái người dùng');
    }
  };

  const handleSaveUser = async (userData) => {
    try {
      // Shelter staff can only update non-admin users
      if (selectedUser && selectedUser.role === 'ADMIN') {
        toast.error('Không có quyền chỉnh sửa tài khoản Admin');
        return;
      }
      
      // Prevent changing role to ADMIN
      if (userData.role === 'ADMIN') {
        toast.error('Không có quyền thay đổi role thành Admin');
        return;
      }
      
      await dispatch(updateUser({ id: selectedUser.id, userData })).unwrap();
      toast.success('Cập nhật người dùng thành công');
      
      setShowUserModal(false);
      setSelectedUser(null);
    } catch (error) {
      toast.error('Lỗi khi lưu người dùng');
    }
  };

  const getRoleColor = (role) => {
    const colors = {
      ADOPTER: 'bg-green-100 text-green-800',
      DONOR: 'bg-purple-100 text-purple-800',
      VOLUNTEER: 'bg-orange-100 text-orange-800',
      SHELTER: 'bg-blue-100 text-blue-800'
    };
    return colors[role] || 'bg-gray-100 text-gray-800';
  };

  const getStatusColor = (enabled) => {
    return enabled 
      ? 'bg-green-100 text-green-800' 
      : 'bg-red-100 text-red-800';
  };

  // Filter users to exclude ADMIN and show only relevant roles
  const filteredUsers = users.filter(user => user.role !== 'ADMIN');

  if (isLoading && users.length === 0) {
    return <LoadingSpinner />;
  }

  return (
    <div className="py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-secondary-800 mb-2">
            Quản lý người dùng - Shelter
          </h1>
          <p className="text-secondary-600">
            Quản lý người dùng (không bao gồm Admin)
          </p>
        </div>

        {/* Search and Filter */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <SearchFilter
            searchValue={filters.search}
            onSearchChange={(e) => handleFilterChange({ search: e.target.value })}
            placeholder="Tìm kiếm theo tên, email, username..."
            showFilters={true}
            onToggleFilters={() => {}}
            filters={[
              {
                name: 'role',
                label: 'Vai trò',
                type: 'select',
                value: filters.role,
                options: [
                  { value: '', label: 'Tất cả vai trò' },
                  { value: 'ADOPTER', label: 'Adopter' },
                  { value: 'DONOR', label: 'Donor' },
                  { value: 'VOLUNTEER', label: 'Volunteer' },
                  { value: 'SHELTER', label: 'Shelter' }
                ]
              },
              {
                name: 'enabled',
                label: 'Trạng thái',
                type: 'select',
                value: filters.enabled,
                options: [
                  { value: '', label: 'Tất cả trạng thái' },
                  { value: 'true', label: 'Đã kích hoạt' },
                  { value: 'false', label: 'Chưa kích hoạt' }
                ]
              }
            ]}
            onFilterChange={(name, value) => handleFilterChange({ [name]: value })}
            onClearFilters={() => handleFilterChange({ role: '', enabled: '' })}
            activeFilters={[
              ...(filters.role ? [{ key: 'role', label: `Vai trò: ${filters.role}` }] : []),
              ...(filters.enabled ? [{ key: 'enabled', label: `Trạng thái: ${filters.enabled === 'true' ? 'Đã kích hoạt' : 'Chưa kích hoạt'}` }] : [])
            ]}
            onRemoveFilter={(key) => handleFilterChange({ [key]: '' })}
          />
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Người dùng
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Vai trò
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Trạng thái
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Đăng nhập cuối
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ngày tạo
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center">
                            <FaUsers className="text-primary-600" />
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {user.fullName}
                          </div>
                          <div className="text-sm text-gray-500">
                            {user.username}
                          </div>
                          <div className="text-sm text-gray-500">
                            {user.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRoleColor(user.role)}`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(user.enabled)}`}>
                        {user.enabled ? 'Đã kích hoạt' : 'Chưa kích hoạt'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {user.lastLogin 
                        ? new Date(user.lastLogin).toLocaleDateString('vi-VN')
                        : 'Chưa đăng nhập'
                      }
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(user.createdAt).toLocaleDateString('vi-VN')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => handleToggleUserStatus(user.id, !user.enabled)}
                          className="text-gray-400 hover:text-gray-600 transition-colors duration-300"
                          title={user.enabled ? 'Vô hiệu hóa' : 'Kích hoạt'}
                        >
                          {user.enabled ? <FaUserTimes /> : <FaUserCheck />}
                        </button>
                        <button
                          onClick={() => handleEditUser(user)}
                          className="text-blue-600 hover:text-blue-900 transition-colors duration-300"
                          title="Chỉnh sửa"
                        >
                          <FaEdit />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Empty State */}
        {filteredUsers.length === 0 && !isLoading && (
          <div className="text-center py-12">
            <FaUsers className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">Không có người dùng</h3>
            <p className="mt-1 text-sm text-gray-500">
              Không tìm thấy người dùng nào phù hợp với bộ lọc.
            </p>
          </div>
        )}
      </div>

      {/* User Modal */}
      {showUserModal && (
        <ShelterUserModal 
          user={selectedUser} 
          onSave={handleSaveUser} 
          onClose={() => {
            setShowUserModal(false);
            setSelectedUser(null);
          }} 
        />
      )}
    </div>
  );
};

// Shelter User Modal Component (Limited permissions)
const ShelterUserModal = ({ user, onSave, onClose }) => {
  const [formData, setFormData] = useState({
    username: user?.username || '',
    fullName: user?.fullName || '',
    email: user?.email || '',
    phone: user?.phone || '',
    role: user?.role || 'ADOPTER',
    enabled: user?.enabled ?? true
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.username.trim()) {
      toast.error('Vui lòng nhập username!');
      return;
    }
    
    if (!formData.fullName.trim()) {
      toast.error('Vui lòng nhập họ và tên!');
      return;
    }
    
    if (!formData.email.trim()) {
      toast.error('Vui lòng nhập email!');
      return;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error('Email không hợp lệ!');
      return;
    }
    
    // Prevent changing role to ADMIN
    if (formData.role === 'ADMIN') {
      toast.error('Không có quyền thay đổi role thành Admin');
      return;
    }
    
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <h3 className="text-lg font-bold mb-4">
          Chỉnh sửa người dùng
        </h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Username *
            </label>
            <input
              type="text"
              value={formData.username}
              onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              required
              disabled={true} // Username cannot be changed
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Họ và tên *
            </label>
            <input
              type="text"
              value={formData.fullName}
              onChange={(e) => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email *
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Số điện thoại
            </label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Vai trò
            </label>
            <select
              value={formData.role}
              onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="ADOPTER">Adopter</option>
              <option value="DONOR">Donor</option>
              <option value="VOLUNTEER">Volunteer</option>
              <option value="SHELTER">Shelter</option>
            </select>
          </div>
          
          <div className="flex items-center">
            <input
              type="checkbox"
              id="enabled"
              checked={formData.enabled}
              onChange={(e) => setFormData(prev => ({ ...prev, enabled: e.target.checked }))}
              className="mr-2"
            />
            <label htmlFor="enabled" className="text-sm font-medium text-gray-700">
              Kích hoạt tài khoản
            </label>
          </div>
          
          <div className="flex space-x-3 pt-4">
            <button
              type="submit"
              className="flex-1 bg-primary-600 text-white py-2 px-4 rounded-lg hover:bg-primary-700 transition-colors duration-300"
            >
              Cập nhật
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400 transition-colors duration-300"
            >
              Hủy
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ShelterUserManagementPage;

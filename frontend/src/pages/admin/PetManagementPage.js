import React, { useState, useEffect, useCallback } from 'react';
import { useAppDispatch } from '../../hook';
import { usePetManagement } from '../../hook';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { 
  FaPaw, 
  FaEdit, 
  FaTrash, 
  FaPlus,
  FaEye
} from 'react-icons/fa';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import SearchFilter from '../../components/common/SearchFilter';
import PetForm from '../../components/pet/PetForm';
import { fetchPetsForManagement, deletePet } from '../../store/asyncAction/petManagementAsyncAction';

const PetManagementPage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { pets, isLoading, error } = usePetManagement();
  
  const [selectedPet, setSelectedPet] = useState(null);
  const [showPetModal, setShowPetModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  
  // Filter state
  const [filters, setFilters] = useState({
    search: '',
    status: '',
    breed: '',
    ageMin: '',
    ageMax: '',
    location: '',
    page: 0,
    size: 10,
    sortBy: 'id',
    sortOrder: 'desc'
  });

  const fetchPetsData = useCallback(async () => {
    try {
      await dispatch(fetchPetsForManagement(filters)).unwrap();
    } catch (error) {
      toast.error('Lỗi khi tải danh sách thú cưng');
    }
  }, [dispatch, filters]);

  useEffect(() => {
    console.log('PetManagementPage useEffect - fetching pets with filters:', filters);
    fetchPetsData();
  }, [fetchPetsData]);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  const handleFilterChange = (newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const handleEditPet = (pet) => {
    setSelectedPet(pet);
    setShowPetModal(true);
  };

  const handleDeletePet = (pet) => {
    setSelectedPet(pet);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await dispatch(deletePet(selectedPet.id)).unwrap();
      toast.success('Xóa thú cưng thành công');
      setShowDeleteModal(false);
      setSelectedPet(null);
      fetchPetsData();
    } catch (error) {
      toast.error('Lỗi khi xóa thú cưng');
    }
  };

  const handlePetSuccess = () => {
    setShowPetModal(false);
    setSelectedPet(null);
    fetchPetsData();
  };

  const getStatusColor = (status) => {
    const colors = {
      AVAILABLE: 'bg-green-100 text-green-800',
      PENDING: 'bg-yellow-100 text-yellow-800',
      ADOPTED: 'bg-blue-100 text-blue-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getStatusText = (status) => {
    const texts = {
      AVAILABLE: 'Có sẵn',
      PENDING: 'Đang xử lý',
      ADOPTED: 'Đã nhận nuôi'
    };
    return texts[status] || status;
  };

  // Debug state
  console.log('PetManagementPage state:', {
    isLoading,
    petsLength: pets.length,
    pets,
    error
  });

  if (isLoading && pets.length === 0) {
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
                Quản lý thú cưng
              </h1>
              <p className="text-secondary-600">
                Quản lý tất cả thú cưng trong hệ thống
              </p>
            </div>
            
            <button
              onClick={() => setShowPetModal(true)}
              className="flex items-center gap-2 bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors duration-300"
            >
              <FaPlus />
              + Thêm thú cưng
            </button>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <SearchFilter
            searchValue={filters.search}
            onSearchChange={(e) => handleFilterChange({ search: e.target.value })}
            placeholder="Tìm kiếm thú cưng..."
            showFilters={true}
            filters={[
              {
                name: 'status',
                label: 'Trạng thái',
                type: 'select',
                value: filters.status,
                options: [
                  { value: '', label: 'Tất cả trạng thái' },
                  { value: 'AVAILABLE', label: 'Có sẵn' },
                  { value: 'PENDING', label: 'Đang xử lý' },
                  { value: 'ADOPTED', label: 'Đã nhận nuôi' }
                ]
              },
              {
                name: 'breed',
                label: 'Giống',
                type: 'select',
                value: filters.breed,
                options: [
                  { value: '', label: 'Tất cả giống' },
                  { value: 'Persian', label: 'Persian' },
                  { value: 'Golden Retriever', label: 'Golden Retriever' },
                  { value: 'Labrador', label: 'Labrador' },
                  { value: 'Siamese', label: 'Siamese' },
                  { value: 'Corgi', label: 'Corgi' }
                ]
              },
              {
                name: 'ageMin',
                label: 'Tuổi từ',
                type: 'number',
                value: filters.ageMin,
                placeholder: 'Tuổi tối thiểu',
                min: 0,
                max: 20
              },
              {
                name: 'ageMax',
                label: 'Tuổi đến',
                type: 'number',
                value: filters.ageMax,
                placeholder: 'Tuổi tối đa',
                min: 0,
                max: 20
              },
              {
                name: 'location',
                label: 'Địa điểm',
                type: 'text',
                value: filters.location,
                placeholder: 'Nhập địa điểm'
              }
            ]}
            onFilterChange={(name, value) => handleFilterChange({ [name]: value })}
            onClearFilters={() => handleFilterChange({ status: '', breed: '', search: '', ageMin: '', ageMax: '', location: '' })}
            activeFilters={[
              ...(filters.status ? [{ key: 'status', label: `Trạng thái: ${getStatusText(filters.status)}` }] : []),
              ...(filters.breed ? [{ key: 'breed', label: `Giống: ${filters.breed}` }] : []),
              ...(filters.ageMin ? [{ key: 'ageMin', label: `Tuổi: ${filters.ageMin} - ${filters.ageMax || ''}` }] : []),
              ...(filters.location ? [{ key: 'location', label: `Địa điểm: ${filters.location}` }] : [])
            ]}
            onRemoveFilter={(key) => handleFilterChange({ [key]: '' })}
          />
        </div>

        {/* Pets Table */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <input type="checkbox" className="rounded border-gray-300" />
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    THÚ CƯNG
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    GIỐNG
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    TUỔI
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    TRẠNG THÁI
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    SHELTER
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    THAO TÁC
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {pets.map((pet) => (
                  <tr key={pet.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input type="checkbox" className="rounded border-gray-300" />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-12 w-12">
                          {pet.imageUrls ? (
                            <img
                              className="h-12 w-12 rounded-lg object-cover"
                              src={pet.imageUrls.split(',')[0]}
                              alt={pet.name}
                            />
                          ) : (
                            <div className="h-12 w-12 rounded-lg bg-gray-200 flex items-center justify-center">
                              <FaPaw className="text-gray-400" />
                            </div>
                          )}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {pet.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {pet.location}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {pet.breed}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {pet.age} tuổi
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(pet.status)}`}>
                        {getStatusText(pet.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {pet.shelter?.fullName || pet.shelter?.username || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => {
                            navigate(`/pets/${pet.id}`);
                          }}
                          className="text-blue-600 hover:text-blue-900 transition-colors duration-300"
                          title="Xem chi tiết"
                        >
                          <FaEye />
                        </button>
                        <button
                          onClick={() => handleEditPet(pet)}
                          className="text-green-600 hover:text-green-900 transition-colors duration-300"
                          title="Chỉnh sửa"
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => handleDeletePet(pet)}
                          className="text-red-600 hover:text-red-900 transition-colors duration-300"
                          title="Xóa"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        {pets.length > 0 && (
          <div className="mt-6 flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Hiển thị {pets.length} thú cưng
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => handleFilterChange({ page: Math.max(0, (filters.page || 0) - 1) })}
                disabled={filters.page === 0}
                className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Trước
              </button>
              <span className="px-3 py-2 text-sm font-medium text-gray-700">
                Trang {filters.page + 1}
              </span>
              <button
                onClick={() => handleFilterChange({ page: (filters.page || 0) + 1 })}
                className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Sau
              </button>
            </div>
          </div>
        )}

        {/* Empty State */}
        {pets.length === 0 && !isLoading && (
          <div className="text-center py-12">
            <div className="flex justify-center mb-4">
              <FaPaw className="text-6xl text-purple-400" />
              <FaPaw className="text-6xl text-purple-400 -ml-4" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Không có thú cưng nào
            </h3>
            <p className="text-gray-500">
              Chưa có thú cưng nào trong hệ thống
            </p>
            <button
              onClick={() => setShowPetModal(true)}
              className="mt-4 flex items-center gap-2 bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors duration-300 mx-auto"
            >
              <FaPlus />
              Thêm thú cưng đầu tiên
            </button>
          </div>
        )}
      </div>

      {/* Pet Modal */}
      {showPetModal && (
        <PetForm
          pet={selectedPet}
          onSuccess={handlePetSuccess}
          onCancel={() => {
            setShowPetModal(false);
            setSelectedPet(null);
          }}
        />
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h3 className="text-lg font-bold mb-4">Xác nhận xóa</h3>
            <p className="text-gray-600 mb-6">
              Bạn có chắc chắn muốn xóa thú cưng "{selectedPet?.name}"? Hành động này không thể hoàn tác.
            </p>
            <div className="flex space-x-3">
              <button
                onClick={handleDeleteConfirm}
                className="flex-1 bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors duration-300"
              >
                Xóa
              </button>
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setSelectedPet(null);
                }}
                className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400 transition-colors duration-300"
              >
                Hủy
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PetManagementPage; 

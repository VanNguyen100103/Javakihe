import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { usePet } from '../hook';
import { fetchPets } from '../store/asyncAction/petAsyncAction';
import { useAppDispatch } from '../hook';
import { FaSearch, FaFilter, FaTimes } from 'react-icons/fa';
import PetCard from '../components/pet/PetCard';
import LoadingSpinner from '../components/common/LoadingSpinner';
import Pagination from '../components/common/Pagination';
import { fetchGuestCart } from '../store/asyncAction/cartAsyncAction';
import { useAuthContext } from '../contexts/AuthContext';

const PetListPage = () => {
  const dispatch = useAppDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  const { pets, pagination, isLoading } = usePet();
  const { isAuthenticated } = useAuthContext();
  
  const timeoutRef = useRef(null);
  const [showFilters, setShowFilters] = useState(false);
  const [localFilters, setLocalFilters] = useState({
    search: searchParams.get('search') || '',
    status: searchParams.get('status') || '',
    gender: searchParams.get('gender') || '',
    breed: searchParams.get('breed') || '',
    ageMin: searchParams.get('ageMin') || '',
    ageMax: searchParams.get('ageMax') || '',
    location: searchParams.get('location') || '',
    health: searchParams.get('health') || ''
  });

  const handleFilterChange = useCallback((name, value) => {
    const newFilters = {
      ...localFilters,
      [name]: value
    };
    setLocalFilters(newFilters);
    
    // Update URL params
    const params = new URLSearchParams(searchParams);
    if (value) {
      params.set(name, value);
    } else {
      params.delete(name);
    }
    params.delete('page'); // Reset to first page when filter changes
    setSearchParams(params);
  }, [localFilters, searchParams, setSearchParams]);

  // Debounced search function
  const debouncedSearch = useCallback((searchTerm) => {
    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      handleFilterChange('search', searchTerm);
    }, 500); // 500ms delay
  }, [handleFilterChange]);

  // Sync URL params with local filters
  useEffect(() => {
    const urlFilters = {
      search: searchParams.get('search') || '',
      status: searchParams.get('status') || '',
      gender: searchParams.get('gender') || '',
      breed: searchParams.get('breed') || '',
      ageMin: searchParams.get('ageMin') || '',
      ageMax: searchParams.get('ageMax') || '',
      location: searchParams.get('location') || '',
      health: searchParams.get('health') || ''
    };
    
    setLocalFilters(urlFilters);
  }, [searchParams]);

  // Fetch pets when filters change
  useEffect(() => {
    const currentPage = parseInt(searchParams.get('page')) || 0;
    
    dispatch(fetchPets({ 
      page: currentPage,
      size: 2,
      ...localFilters
    }));
  }, [dispatch, localFilters, searchParams]);

  // Load guest cart when user is not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      const guestToken = localStorage.getItem('guestCartToken');
      if (guestToken) {
        console.log('Loading guest cart in PetListPage...');
        dispatch(fetchGuestCart(guestToken));
      }
    }
  }, [isAuthenticated, dispatch]);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setLocalFilters(prev => ({ ...prev, search: value }));
    debouncedSearch(value);
  };

  const handleClearFilters = () => {
    const emptyFilters = {
      search: '',
      status: '',
      gender: '',
      breed: '',
      ageMin: '',
      ageMax: '',
      location: '',
      health: ''
    };
    setLocalFilters(emptyFilters);
    
    // Clear URL params
    setSearchParams({});
  };

  const handleRemoveFilter = (filterName) => {
    handleFilterChange(filterName, '');
  };

  const handlePageChange = (page) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', page);
    setSearchParams(params);
  };

  const getActiveFilters = () => {
    const active = [];
    Object.entries(localFilters).forEach(([key, value]) => {
      if (value && key !== 'search') {
        active.push({ key, value, label: getFilterLabel(key, value) });
      }
    });
    return active;
  };

  const getFilterLabel = (key, value) => {
    switch (key) {
      case 'status':
        return statusOptions.find(opt => opt.value === value)?.label || value;
      case 'gender':
        return genderOptions.find(opt => opt.value === value)?.label || value;
      case 'breed':
        return value; // Return actual breed name from database
      case 'ageMin':
        return `Tuổi từ ${value}`;
      case 'ageMax':
        return `Tuổi đến ${value}`;
      case 'location':
        return `Địa điểm: ${value}`;
      case 'health':
        return healthOptions.find(opt => opt.value === value)?.label || value;
      default:
        return value;
    }
  };

  const statusOptions = [
    { value: 'AVAILABLE', label: 'Có sẵn' },
    { value: 'ADOPTED', label: 'Đã nhận nuôi' },
    { value: 'PENDING', label: 'Đang xử lý' }
  ];

  const genderOptions = [
    { value: 'MALE', label: 'Đực' },
    { value: 'FEMALE', label: 'Cái' }
  ];

  const healthOptions = [
    { value: 'vaccinated', label: 'Đã tiêm chủng' },
    { value: 'dewormed', label: 'Đã tẩy giun' }
  ];

  // Get unique breeds from pets data
  const getUniqueBreeds = () => {
    const breeds = [...new Set(pets.map(pet => pet.breed).filter(Boolean))];
    return breeds.map(breed => ({ value: breed, label: breed }));
  };

  const breedOptions = getUniqueBreeds();

  const filterConfigs = [
    {
      name: 'status',
      label: 'Trạng thái',
      type: 'select',
      value: localFilters.status,
      options: [{ value: '', label: 'Tất cả' }, ...statusOptions]
    },
    {
      name: 'gender',
      label: 'Giới tính',
      type: 'select',
      value: localFilters.gender,
      options: [{ value: '', label: 'Tất cả' }, ...genderOptions]
    },
    {
      name: 'breed',
      label: 'Giống',
      type: 'select',
      value: localFilters.breed,
      options: [{ value: '', label: 'Tất cả' }, ...breedOptions]
    },
    {
      name: 'ageMin',
      label: 'Tuổi từ',
      type: 'number',
      value: localFilters.ageMin,
      placeholder: 'Tuổi tối thiểu',
      min: 0,
      max: 20
    },
    {
      name: 'ageMax',
      label: 'Tuổi đến',
      type: 'number',
      value: localFilters.ageMax,
      placeholder: 'Tuổi tối đa',
      min: 0,
      max: 20
    },
    {
      name: 'location',
      label: 'Địa điểm',
      type: 'text',
      value: localFilters.location,
      placeholder: 'Nhập địa điểm'
    },
    {
      name: 'health',
      label: 'Tình trạng sức khỏe',
      type: 'select',
      value: localFilters.health,
      options: [{ value: '', label: 'Tất cả' }, ...healthOptions]
    }
  ];

  const activeFilters = getActiveFilters();

  if (isLoading && !pets.length) {
    return <LoadingSpinner size="large" text="Đang tải danh sách thú cưng..." />;
  }

  return (
    <div className="py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-secondary-800 mb-4">Tìm thú cưng yêu thích</h1>
          <p className="text-secondary-600 text-lg">Khám phá những người bạn bốn chân đang chờ được nhận nuôi</p>
        </div>

        {/* Search and Filters */}
        <div className="flex gap-4 mb-8 items-center flex-wrap">
          <div className={`flex-1 min-w-80 relative ${isLoading ? 'loading' : ''}`}>
            <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-secondary-500 text-lg" />
            <input
              type="text"
              placeholder="Tìm kiếm thú cưng..."
              value={localFilters.search}
              onChange={handleSearchChange}
              className="w-full pl-12 pr-4 py-3 border-2 border-secondary-200 rounded-lg text-base transition-colors duration-300 bg-white focus:outline-none focus:border-primary-500 focus:shadow-lg focus:shadow-primary-100 placeholder-secondary-400 hover:border-secondary-300"
            />
          </div>

          <button
            className="flex items-center gap-2 px-6 py-3 border-2 border-primary-500 text-primary-500 bg-transparent rounded-lg font-medium transition-all duration-300 hover:bg-primary-500 hover:text-white whitespace-nowrap"
            onClick={() => setShowFilters(!showFilters)}
          >
            <FaFilter />
            Bộ lọc {activeFilters.length > 0 && `(${activeFilters.length})`}
          </button>
        </div>

        {/* Active Filters */}
        {activeFilters.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6 items-center">
            {activeFilters.map((filter) => (
              <div key={filter.key} className="flex items-center gap-2 px-4 py-2 bg-primary-500 text-white rounded-full text-sm font-medium">
                <span>{filter.label}</span>
                <button
                  className="bg-transparent border-none text-white cursor-pointer p-0 text-base flex items-center justify-center w-5 h-5 rounded-full transition-colors duration-300 hover:bg-white hover:bg-opacity-20"
                  onClick={() => handleRemoveFilter(filter.key)}
                  title="Xóa bộ lọc"
                >
                  <FaTimes />
                </button>
              </div>
            ))}
            <button
              className="px-4 py-2 border-2 border-secondary-300 text-secondary-600 bg-transparent rounded-lg text-sm font-medium transition-colors duration-300 hover:bg-secondary-300 hover:text-white"
              onClick={handleClearFilters}
            >
              Xóa tất cả
            </button>
          </div>
        )}

        {/* Advanced Filters */}
        {showFilters && (
          <div className="bg-white rounded-xl p-8 mb-8 shadow-md border border-secondary-200 animate-slide-down">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 items-end">
              {filterConfigs.map((filter) => (
                <div key={filter.name} className="flex flex-col gap-2">
                  <label className="font-medium text-secondary-800 text-sm">{filter.label}</label>
                  {filter.type === 'select' ? (
                    <select
                      value={filter.value}
                      onChange={(e) => handleFilterChange(filter.name, e.target.value)}
                      className="px-3 py-2 border-2 border-secondary-200 rounded-md text-sm transition-colors duration-300 bg-white focus:outline-none focus:border-primary-500 focus:shadow-lg focus:shadow-primary-100 hover:border-secondary-300"
                    >
                      {filter.options.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  ) : filter.type === 'number' ? (
                    <input
                      type="number"
                      placeholder={filter.placeholder}
                      value={filter.value}
                      onChange={(e) => handleFilterChange(filter.name, e.target.value)}
                      min={filter.min}
                      max={filter.max}
                      className="px-3 py-2 border-2 border-secondary-200 rounded-md text-sm transition-colors duration-300 bg-white focus:outline-none focus:border-primary-500 focus:shadow-lg focus:shadow-primary-100 hover:border-secondary-300"
                    />
                  ) : (
                    <input
                      type="text"
                      placeholder={filter.placeholder}
                      value={filter.value}
                      onChange={(e) => handleFilterChange(filter.name, e.target.value)}
                      className="px-3 py-2 border-2 border-secondary-200 rounded-md text-sm transition-colors duration-300 bg-white focus:outline-none focus:border-primary-500 focus:shadow-lg focus:shadow-primary-100 hover:border-secondary-300"
                    />
                  )}
                </div>
              ))}

              <div className="flex items-end">
                <button
                  className="flex items-center gap-2 px-6 py-2 border-2 border-secondary-300 text-secondary-600 bg-transparent rounded-lg text-sm font-medium transition-colors duration-300 hover:bg-secondary-300 hover:text-white"
                  onClick={handleClearFilters}
                >
                  <FaTimes />
                  Xóa bộ lọc
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Results Summary */}
        <div className="mb-8 p-4 bg-secondary-50 rounded-lg border-l-4 border-primary-500">
          <p className="text-secondary-800 text-base">
            Tìm thấy <strong className="text-primary-500">{pagination?.totalElements || 0}</strong> thú cưng
            {activeFilters.length > 0 && (
              <> với <strong className="text-primary-500">{activeFilters.length}</strong> bộ lọc đang áp dụng</>
            )}
          </p>
        </div>

        {/* Pets Grid */}
        {pets.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
              {pets.map((pet) => (
                <PetCard key={pet.id} pet={pet} />
              ))}
            </div>

            {/* Pagination */}
            {pagination && pagination.totalPages > 1 && (
              <div className="flex justify-center">
                <Pagination
                  currentPage={pagination.currentPage}
                  totalPages={pagination.totalPages}
                  onPageChange={handlePageChange}
                />
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-16 bg-white rounded-xl shadow-md">
            <div className="text-6xl text-secondary-300 mb-4">🐾</div>
            <h3 className="text-2xl font-bold text-secondary-800 mb-4">Không tìm thấy thú cưng</h3>
            <p className="text-secondary-600 mb-8 text-lg">Hãy thử điều chỉnh bộ lọc hoặc từ khóa tìm kiếm</p>
            <button
              onClick={handleClearFilters}
              className="bg-primary-500 hover:bg-primary-600 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-300"
            >
              Xóa tất cả bộ lọc
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PetListPage; 

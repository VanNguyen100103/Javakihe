import React from 'react';
import { FaSearch, FaFilter, FaTimes } from 'react-icons/fa';

const SearchFilter = ({
  searchValue,
  onSearchChange,
  placeholder = "Tìm kiếm...",
  showFilters = false,
  onToggleFilters,
  filters = [],
  onFilterChange,
  onClearFilters,
  activeFilters = [],
  onRemoveFilter,
  isLoading = false,
  children
}) => {
  return (
    <div className="mb-8">
      {/* Search Bar */}
      <div className="flex gap-4 mb-4 items-center flex-wrap">
        <div className={`flex-1 min-w-80 relative ${isLoading ? 'loading' : ''}`}>
          <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-secondary-500 text-lg" />
          <input
            type="text"
            placeholder={placeholder}
            value={searchValue}
            onChange={onSearchChange}
            className="w-full pl-12 pr-4 py-3 border-2 border-secondary-200 rounded-lg text-base transition-colors duration-300 bg-white focus:outline-none focus:border-primary-500 focus:shadow-lg focus:shadow-primary-100 placeholder-secondary-400 hover:border-secondary-300"
          />
        </div>

        {onToggleFilters && (
          <button
            className="flex items-center gap-2 px-6 py-3 border-2 border-primary-500 text-primary-500 bg-transparent rounded-lg font-medium transition-all duration-300 hover:bg-primary-500 hover:text-white whitespace-nowrap"
            onClick={onToggleFilters}
          >
            <FaFilter />
            Bộ lọc {activeFilters.length > 0 && `(${activeFilters.length})`}
          </button>
        )}
      </div>

      {/* Active Filters */}
      {activeFilters.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4 items-center">
          {activeFilters.map((filter) => (
            <div key={filter.key} className="flex items-center gap-2 px-4 py-2 bg-primary-500 text-white rounded-full text-sm font-medium">
              <span>{filter.label}</span>
              <button
                className="bg-transparent border-none text-white cursor-pointer p-0 text-base flex items-center justify-center w-5 h-5 rounded-full transition-colors duration-300 hover:bg-white hover:bg-opacity-20"
                onClick={() => onRemoveFilter(filter.key)}
                title="Xóa bộ lọc"
              >
                <FaTimes />
              </button>
            </div>
          ))}
          <button
            className="px-4 py-2 border-2 border-secondary-300 text-secondary-600 bg-transparent rounded-lg text-sm font-medium transition-colors duration-300 hover:bg-secondary-300 hover:text-white"
            onClick={onClearFilters}
          >
            Xóa tất cả
          </button>
        </div>
      )}

      {/* Advanced Filters */}
      {showFilters && (
        <div className="bg-white rounded-xl p-8 mb-4 shadow-md border border-secondary-200 animate-slide-down">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 items-end">
            {filters.map((filter) => (
              <div key={filter.name} className="flex flex-col gap-2">
                <label className="font-medium text-secondary-800 text-sm">{filter.label}</label>
                {filter.type === 'select' ? (
                  <select
                    value={filter.value}
                    onChange={(e) => onFilterChange(filter.name, e.target.value)}
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
                    onChange={(e) => onFilterChange(filter.name, e.target.value)}
                    min={filter.min}
                    max={filter.max}
                    className="px-3 py-2 border-2 border-secondary-200 rounded-md text-sm transition-colors duration-300 bg-white focus:outline-none focus:border-primary-500 focus:shadow-lg focus:shadow-primary-100 hover:border-secondary-300"
                  />
                ) : (
                  <input
                    type="text"
                    placeholder={filter.placeholder}
                    value={filter.value}
                    onChange={(e) => onFilterChange(filter.name, e.target.value)}
                    className="px-3 py-2 border-2 border-secondary-200 rounded-md text-sm transition-colors duration-300 bg-white focus:outline-none focus:border-primary-500 focus:shadow-lg focus:shadow-primary-100 hover:border-secondary-300"
                  />
                )}
              </div>
            ))}

            <div className="flex items-end">
              <button
                className="flex items-center gap-2 px-6 py-2 border-2 border-secondary-300 text-secondary-600 bg-transparent rounded-lg text-sm font-medium transition-colors duration-300 hover:bg-secondary-300 hover:text-white"
                onClick={onClearFilters}
              >
                <FaTimes />
                Xóa bộ lọc
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Custom Filter Content */}
      {children}
    </div>
  );
};

export default SearchFilter; 
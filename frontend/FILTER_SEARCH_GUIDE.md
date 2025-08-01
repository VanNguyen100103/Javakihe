# Filter & Search Integration Guide

## Tổng quan

Frontend đã được tích hợp hệ thống filter và search hoàn chỉnh cho các trang danh sách. Hệ thống bao gồm:

### Components đã tạo:

1. **PetListPage** - Filter và search cho thú cưng
2. **EventPage** - Filter và search cho sự kiện
3. **SearchFilter** - Component tái sử dụng cho filter/search

### Features:

✅ **Search Functionality**
- Real-time search với debounce
- Search theo tên, mô tả
- Loading states

✅ **Advanced Filters**
- Filter theo trạng thái, giống, tuổi, địa điểm
- Multiple filter combinations
- URL-based filtering

✅ **Active Filters Display**
- Hiển thị filters đang active
- Remove individual filters
- Clear all filters

✅ **Responsive Design**
- Mobile-friendly
- Touch gestures support
- Adaptive layout

## Cách sử dụng:

### 1. PetListPage Filter:

```jsx
// Filter options
const filters = {
  search: '',           // Tìm kiếm theo tên
  status: '',          // Trạng thái (available, adopted, pending)
  breed: '',           // Giống thú cưng
  ageMin: '',          // Tuổi tối thiểu
  ageMax: '',          // Tuổi tối đa
  location: ''         // Địa điểm
};

// URL parameters
const searchParams = useSearchParams();
const page = searchParams.get('page') || 0;
const search = searchParams.get('search') || '';
```

### 2. EventPage Filter:

```jsx
// Filter options
const categories = [
  { value: 'all', label: 'Tất cả' },
  { value: 'adoption', label: 'Nhận nuôi' },
  { value: 'donation', label: 'Quyên góp' },
  { value: 'volunteer', label: 'Tình nguyện' },
  { value: 'education', label: 'Giáo dục' },
  { value: 'fundraising', label: 'Gây quỹ' }
];

// Search và filter
const filteredEvents = events.filter(event => {
  const matchesCategory = selectedCategory === 'all' || event.category === selectedCategory;
  const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase());
  return matchesCategory && matchesSearch;
});
```

### 3. SearchFilter Component:

```jsx
import SearchFilter from '../components/common/SearchFilter';

<SearchFilter
  searchValue={searchTerm}
  onSearchChange={(e) => setSearchTerm(e.target.value)}
  placeholder="Tìm kiếm thú cưng..."
  showFilters={showFilters}
  onToggleFilters={() => setShowFilters(!showFilters)}
  filters={filterConfig}
  onFilterChange={handleFilterChange}
  onClearFilters={handleClearFilters}
  activeFilters={activeFilters}
  onRemoveFilter={handleRemoveFilter}
  isLoading={isLoading}
>
  {/* Custom filter content */}
</SearchFilter>
```

### 4. Filter Configuration:

```jsx
const filterConfig = [
  {
    name: 'status',
    label: 'Trạng thái',
    type: 'select',
    value: filters.status,
    options: [
      { value: '', label: 'Tất cả trạng thái' },
      { value: 'available', label: 'Có sẵn' },
      { value: 'adopted', label: 'Đã nhận nuôi' },
      { value: 'pending', label: 'Đang xử lý' }
    ]
  },
  {
    name: 'breed',
    label: 'Giống',
    type: 'select',
    value: filters.breed,
    options: breedOptions
  },
  {
    name: 'ageMin',
    label: 'Tuổi tối thiểu',
    type: 'number',
    value: filters.ageMin,
    placeholder: '0',
    min: 0,
    max: 20
  },
  {
    name: 'ageMax',
    label: 'Tuổi tối đa',
    type: 'number',
    value: filters.ageMax,
    placeholder: '20',
    min: 0,
    max: 20
  },
  {
    name: 'location',
    label: 'Địa điểm',
    type: 'text',
    value: filters.location,
    placeholder: 'Nhập địa điểm...'
  }
];
```

## API Integration:

### 1. Pet API:

```javascript
// Fetch pets with filters
const fetchPets = async (params) => {
  const queryParams = new URLSearchParams();
  
  if (params.page !== undefined) queryParams.append('page', params.page);
  if (params.size !== undefined) queryParams.append('size', params.size);
  if (params.search) queryParams.append('search', params.search);
  if (params.status) queryParams.append('status', params.status);
  if (params.breed) queryParams.append('breed', params.breed);
  if (params.ageMin) queryParams.append('ageMin', params.ageMin);
  if (params.ageMax) queryParams.append('ageMax', params.ageMax);
  if (params.location) queryParams.append('location', params.location);

  return api.get(`/pets?${queryParams.toString()}`);
};
```

### 2. Event API:

```javascript
// Fetch events with filters
const fetchEvents = async (params) => {
  const queryParams = new URLSearchParams();
  
  if (params.category) queryParams.append('category', params.category);
  if (params.search) queryParams.append('search', params.search);
  if (params.status) queryParams.append('status', params.status);

  return api.get(`/events?${queryParams.toString()}`);
};
```

## URL State Management:

### 1. URL Parameters:

```jsx
// PetListPage URL structure
/pets?search=golden&status=available&breed=Golden%20Retriever&ageMin=1&ageMax=5&page=0

// EventPage URL structure
/events?category=adoption&search=nhận%20nuôi&page=0
```

### 2. State Synchronization:

```jsx
const [searchParams, setSearchParams] = useSearchParams();

// Sync filters with URL
useEffect(() => {
  const params = {};
  Object.entries(localFilters).forEach(([key, value]) => {
    if (value) params[key] = value;
  });
  setSearchParams(params);
}, [localFilters]);

// Load filters from URL
useEffect(() => {
  const search = searchParams.get('search') || '';
  const status = searchParams.get('status') || '';
  // ... load other filters
}, [searchParams]);
```

## CSS Styling:

### 1. Search Bar:

```css
.search-bar {
  flex: 1;
  min-width: 300px;
  position: relative;
}

.search-bar input {
  width: 100%;
  padding: 12px 12px 12px 3rem;
  border: 2px solid #e9ecef;
  border-radius: 8px;
  transition: border-color 0.3s ease;
}

.search-bar input:focus {
  border-color: #e74c3c;
  box-shadow: 0 0 0 3px rgba(231, 76, 60, 0.1);
}
```

### 2. Filter Tags:

```css
.filter-tag {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background-color: #e74c3c;
  color: white;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 500;
}
```

### 3. Advanced Filters:

```css
.advanced-filters {
  background-color: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  animation: slideDown 0.3s ease-out;
}
```

## Performance Optimization:

### 1. Debounced Search:

```jsx
import { useDebounce } from '../hooks/useDebounce';

const debouncedSearch = useDebounce(searchTerm, 300);

useEffect(() => {
  if (debouncedSearch !== searchTerm) {
    // Trigger search API call
    dispatch(fetchPets({ search: debouncedSearch }));
  }
}, [debouncedSearch]);
```

### 2. Memoized Filters:

```jsx
const filteredData = useMemo(() => {
  return data.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = selectedFilter === 'all' || item.category === selectedFilter;
    return matchesSearch && matchesFilter;
  });
}, [data, searchTerm, selectedFilter]);
```

## Accessibility:

### 1. Keyboard Navigation:

```jsx
<input
  type="text"
  placeholder="Tìm kiếm..."
  onKeyDown={(e) => {
    if (e.key === 'Enter') {
      // Trigger search
    }
  }}
  aria-label="Tìm kiếm thú cưng"
/>
```

### 2. Screen Reader Support:

```jsx
<button
  onClick={handleRemoveFilter}
  aria-label={`Xóa bộ lọc ${filterName}`}
>
  <FaTimes />
</button>
```

## Error Handling:

### 1. Search Errors:

```jsx
const handleSearch = async (searchTerm) => {
  try {
    setIsLoading(true);
    const results = await api.search(searchTerm);
    setSearchResults(results);
  } catch (error) {
    toast.error('Tìm kiếm thất bại. Vui lòng thử lại.');
  } finally {
    setIsLoading(false);
  }
};
```

### 2. Filter Validation:

```jsx
const validateFilters = (filters) => {
  const errors = [];
  
  if (filters.ageMin && filters.ageMax && 
      parseInt(filters.ageMin) > parseInt(filters.ageMax)) {
    errors.push('Tuổi tối thiểu không thể lớn hơn tuổi tối đa');
  }
  
  return errors;
};
```

## Mobile Optimization:

### 1. Touch-Friendly:

```css
@media (max-width: 768px) {
  .search-filters {
    flex-direction: column;
  }
  
  .filter-tag {
    min-height: 44px; /* Touch target size */
  }
}
```

### 2. iOS Zoom Prevention:

```css
@media (max-width: 480px) {
  .search-bar input {
    font-size: 16px; /* Prevent zoom on iOS */
  }
}
```

## Testing:

### 1. Unit Tests:

```jsx
test('should filter pets by status', () => {
  const pets = [
    { id: 1, status: 'available' },
    { id: 2, status: 'adopted' }
  ];
  
  const filtered = filterPets(pets, { status: 'available' });
  expect(filtered).toHaveLength(1);
  expect(filtered[0].id).toBe(1);
});
```

### 2. Integration Tests:

```jsx
test('should update URL when filters change', () => {
  render(<PetListPage />);
  
  fireEvent.change(screen.getByPlaceholderText('Tìm kiếm...'), {
    target: { value: 'golden' }
  });
  
  expect(window.location.search).toContain('search=golden');
});
```

## Best Practices:

1. **Debounce search** để tránh quá nhiều API calls
2. **URL state management** để bookmark và share
3. **Loading states** cho user feedback
4. **Error handling** cho network failures
5. **Accessibility** cho screen readers
6. **Mobile optimization** cho touch devices
7. **Performance optimization** với memoization
8. **Validation** cho filter inputs 
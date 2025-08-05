# PawFund Frontend

Frontend application cho platform nhận nuôi thú cưng PawFund.

## Cài đặt

```bash
npm install
```

## Chạy ứng dụng

```bash
npm start
```

## Cấu trúc API

### Authentication API
- `POST /api/auth/login` - Đăng nhập
- `POST /api/auth/register` - Đăng ký
- `POST /api/auth/refresh` - Refresh token
- `GET /api/auth/verify` - Xác thực email

### Pet API
- `GET /api/pets` - Lấy danh sách thú cưng
- `GET /api/pets/{id}` - Lấy thông tin thú cưng
- `POST /api/pets` - Tạo thú cưng mới
- `PUT /api/pets/{id}` - Cập nhật thú cưng
- `DELETE /api/pets/{id}` - Xóa thú cưng

### Adoption API
- `GET /api/adoptions` - Lấy danh sách yêu cầu nhận nuôi
- `GET /api/adoptions/{id}` - Lấy thông tin yêu cầu nhận nuôi
- `POST /api/adoptions` - Tạo yêu cầu nhận nuôi
- `PUT /api/adoptions/{id}/status` - Cập nhật trạng thái
- `DELETE /api/adoptions/{id}` - Xóa yêu cầu nhận nuôi

### Donation API
- `GET /api/donations` - Lấy danh sách quyên góp
- `GET /api/donations/{id}` - Lấy thông tin quyên góp
- `POST /api/donations` - Tạo quyên góp mới
- `PUT /api/donations/{id}` - Cập nhật quyên góp
- `DELETE /api/donations/{id}` - Xóa quyên góp

### Event API
- `GET /api/events` - Lấy danh sách sự kiện
- `GET /api/events/{id}` - Lấy thông tin sự kiện
- `POST /api/events` - Tạo sự kiện mới
- `PUT /api/events/{id}` - Cập nhật sự kiện
- `DELETE /api/events/{id}` - Xóa sự kiện

### Cart API
- `GET /api/user-cart` - Lấy giỏ hàng user
- `POST /api/user-cart/items` - Thêm item vào giỏ hàng
- `PUT /api/user-cart/items/{id}` - Cập nhật số lượng
- `DELETE /api/user-cart/items/{id}` - Xóa item khỏi giỏ hàng
- `DELETE /api/user-cart` - Xóa toàn bộ giỏ hàng

### User API
- `GET /api/user/profile` - Lấy thông tin user
- `PUT /api/user/profile` - Cập nhật thông tin user
- `PUT /api/user/password` - Đổi mật khẩu
- `GET /api/user/adoptions` - Lấy adoptions của user
- `GET /api/user/donations` - Lấy donations của user

## Redux Store

### Auth Async Actions
```javascript
import { login, register, logout } from '../store/asyncAction/authAsyncAction';

// Sử dụng trong component
const dispatch = useAppDispatch();
dispatch(login({ username: 'user', password: 'pass' }));
```

### Pet Async Actions
```javascript
import { fetchPets, createPet, updatePet, deletePet } from '../store/asyncAction/petAsyncAction';

// Sử dụng trong component
const dispatch = useAppDispatch();
dispatch(fetchPets({ page: 0, size: 10, status: 'available' }));
```

### Adoption Async Actions
```javascript
import { fetchAdoptions, createAdoption, updateAdoptionStatus } from '../store/asyncAction/adoptionAsyncAction';

// Sử dụng trong component
const dispatch = useAppDispatch();
dispatch(createAdoption({ petId: 1, userId: 1, reason: 'I love pets' }));
```

### Cart Async Actions
```javascript
import { fetchUserCart, addToCart, removeFromCart } from '../store/asyncAction/cartAsyncAction';

// Sử dụng trong component
const dispatch = useAppDispatch();
dispatch(addToCart({ petId: 1, quantity: 1 }));
```

## Custom Hooks

```javascript
import { useAuth, usePet, useCart } from '../store/hooks';

function MyComponent() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const { pets, currentPet } = usePet();
  const { userCart } = useCart();
  
  // Component logic
}
```

## Axios Interceptor

Interceptor đã được cấu hình để:
- Tự động thêm token vào header
- Xử lý refresh token khi token hết hạn
- Trả về data trực tiếp thay vì response object
- Xử lý lỗi và logout khi cần thiết

## Redux Persist

Các state sau được persist:
- `auth` - Thông tin đăng nhập
- `user` - Thông tin user
- `cart` - Giỏ hàng

Các state không persist:
- `pet` - Danh sách thú cưng
- `adoption` - Danh sách nhận nuôi
- `donation` - Danh sách quyên góp
- `event` - Danh sách sự kiện

## Cấu trúc thư mục

```
src/
├── api/                 # API services
│   ├── auth.js         # Authentication API
│   ├── user.js         # User API
│   ├── pet.js          # Pet API
│   ├── adoption.js     # Adoption API
│   ├── donation.js     # Donation API
│   ├── event.js        # Event API
│   ├── cart.js         # Cart API
│   └── index.js        # Export all APIs
├── store/              # Redux store
│   ├── asyncAction/    # Async actions (createAsyncThunk)
│   │   ├── authAsyncAction.js
│   │   ├── userAsyncAction.js
│   │   ├── petAsyncAction.js
│   │   ├── adoptionAsyncAction.js
│   │   ├── donationAsyncAction.js
│   │   ├── eventAsyncAction.js
│   │   └── cartAsyncAction.js
│   ├── slice/          # Redux slices
│   │   ├── authSlice.js
│   │   ├── userSlice.js
│   │   ├── petSlice.js
│   │   ├── adoptionSlice.js
│   │   ├── donationSlice.js
│   │   ├── eventSlice.js
│   │   └── cartSlice.js
│   ├── store.js        # Store configuration
│   └── hooks.js        # Custom hooks
└── util/
    └── axios.js        # Axios configuration
```

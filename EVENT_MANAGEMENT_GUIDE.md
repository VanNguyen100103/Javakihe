# Event Management Guide - PawFund

## Tổng quan
Trang quản lý events đã được tạo với đầy đủ tính năng CRUD và upload ảnh. Trang này cho phép admin quản lý tất cả events trong hệ thống.

## Truy cập trang quản lý

### URL: `/admin/events`

### Quyền truy cập:
- **ADMIN**: Có thể truy cập đầy đủ
- **SHELTER**: Có thể quản lý events của shelter mình
- **VOLUNTEER**: Có thể xem và tham gia events

## Tính năng chính

### 1. Xem danh sách events
- Hiển thị tất cả events với thông tin chi tiết
- Hỗ trợ phân trang
- Hiển thị ảnh thumbnail của event
- Hiển thị trạng thái, danh mục, thời gian, địa điểm

### 2. Tìm kiếm và lọc
- **Tìm kiếm theo tên**: Nhập từ khóa để tìm event
- **Lọc theo trạng thái**: Upcoming, Ongoing, Completed, Cancelled
- **Lọc theo danh mục**: Adoption, Fundraising, Volunteer, Education, Other
- **Lọc theo shelter**: Xem events của shelter cụ thể

### 3. Thêm event mới
- Click nút "Add Event" để mở form
- Form hỗ trợ upload ảnh với preview
- Validation đầy đủ cho các trường bắt buộc
- Hỗ trợ cả URL ảnh có sẵn và file upload

### 4. Chỉnh sửa event
- Click icon edit để mở form chỉnh sửa
- Có thể thay đổi ảnh event
- Cập nhật thông tin event
- Thay đổi trạng thái event

### 5. Xóa event
- Click icon delete để xóa event
- Xác nhận trước khi xóa
- Hỗ trợ xóa hàng loạt (bulk delete)

### 6. Quản lý trạng thái
- Dropdown để thay đổi trạng thái event
- Các trạng thái: Upcoming, Ongoing, Completed, Cancelled

## Giao diện

### Header
- Logo PawFund
- Navigation menu
- User menu với quyền admin

### Actions Bar
- Nút "Add Event" để thêm event mới
- Nút "Delete Selected" khi có event được chọn
- Toggle "Filters" để hiển thị/ẩn bộ lọc

### Filters Panel
- Ô tìm kiếm
- Dropdown lọc theo trạng thái
- Dropdown lọc theo danh mục
- Nút Search và Clear

### Events Table
- Checkbox để chọn event
- Thông tin event: ảnh, tên, mô tả
- Thời gian và địa điểm
- Danh mục và trạng thái
- Số lượng người tham gia tối đa
- Các action: Edit, Delete

### Pagination
- Hiển thị khi có nhiều events
- Navigation giữa các trang

## Upload ảnh

### Hỗ trợ định dạng:
- JPG, PNG, GIF
- Kích thước tối đa: 5MB
- Kích thước khuyến nghị: 800x600 pixels

### Tính năng upload:
- Preview ảnh trước khi upload
- Validation file type và size
- Nút Remove để xóa ảnh đã chọn
- Upload lên Cloudinary tự động

## Form Event

### Các trường bắt buộc:
- **Title**: Tên event
- **Description**: Mô tả event
- **Date**: Ngày và giờ event
- **Location**: Địa điểm event

### Các trường tùy chọn:
- **Category**: Danh mục event
- **Status**: Trạng thái event
- **Start Time**: Giờ bắt đầu
- **End Time**: Giờ kết thúc
- **Max Participants**: Số người tham gia tối đa
- **Image**: Ảnh event

### Validation:
- Title và Description không được để trống
- Date không được trong quá khứ
- Location không được để trống
- Max Participants phải >= 1

## API Endpoints sử dụng

### GET /api/events
- Lấy danh sách events
- Hỗ trợ query parameters: page, size, status, category, search, shelterId

### POST /api/events
- Tạo event mới
- Hỗ trợ multipart/form-data cho upload ảnh

### PUT /api/events/{id}
- Cập nhật event
- Hỗ trợ multipart/form-data cho upload ảnh

### DELETE /api/events/{id}
- Xóa event

## Quyền và bảo mật

### Role-based Access:
- **ADMIN**: Quản lý tất cả events
- **SHELTER**: Quản lý events của shelter mình
- **VOLUNTEER**: Xem và tham gia events

### Permissions:
- `manage_events`: Quyền quản lý events
- `view_events`: Quyền xem events

## Lưu ý kỹ thuật

### State Management:
- Sử dụng React hooks (useState, useEffect)
- Quản lý loading states
- Error handling với toast notifications

### Responsive Design:
- Mobile-friendly
- Responsive table
- Collapsible filters

### Performance:
- Lazy loading cho ảnh
- Pagination để tối ưu performance
- Debounced search

## Troubleshooting

### Lỗi thường gặp:

1. **Không thể upload ảnh**
   - Kiểm tra kích thước file (< 5MB)
   - Kiểm tra định dạng file (JPG, PNG, GIF)
   - Kiểm tra kết nối internet

2. **Form validation errors**
   - Điền đầy đủ các trường bắt buộc
   - Kiểm tra định dạng ngày tháng
   - Đảm bảo ngày không trong quá khứ

3. **Không thể xóa event**
   - Kiểm tra quyền admin
   - Đảm bảo event không có dữ liệu liên quan

4. **Không hiển thị events**
   - Kiểm tra kết nối API
   - Kiểm tra quyền truy cập
   - Thử refresh trang

## Tương lai

### Tính năng có thể thêm:
- Export events ra Excel/PDF
- Import events từ file
- Duplicate event
- Event templates
- Advanced filtering
- Event analytics
- Email notifications
- Event reminders 
# Event API Guide - PawFund Backend

## Tổng quan
Backend đã được cập nhật để đơn giản hóa Event API. Các thay đổi chính:

1. **EventDTO**: DTO để xử lý request/response
2. **API endpoints thống nhất**: Sử dụng endpoint gốc với JSON
3. **Loại bỏ image upload**: Không còn hỗ trợ upload ảnh

## API Endpoints

### 1. Lấy danh sách events
```
GET /api/events
GET /api/events?shelterId={shelterId}
```
**Response**: List<EventDTO>

### 2. Lấy event theo ID
```
GET /api/events/{id}
```
**Response**: EventDTO

### 3. Tạo event
```
POST /api/events
Content-Type: application/json

Parameters:
- title (optional) - default: "Default Event Title"
- description (optional) - default: "Default Event Description"
- date (optional) - default: current time
- location (optional) - default: "Default Location"
- shelterId (optional)
- category (optional) - default: "adoption"
- status (optional) - default: "upcoming"
- startTime (optional) - default: "09:00"
- endTime (optional) - default: "17:00"
- maxParticipants (optional) - default: 100
```

### 4. Cập nhật event
```
PUT /api/events/{id}
Content-Type: application/json

Parameters (tất cả optional):
- title
- description
- date
- location
- category
- status
- startTime
- endTime
- maxParticipants
```

### 5. Xóa event
```
DELETE /api/events/{id}
```

## EventDTO Structure

```json
{
  "id": 1,
  "title": "Adoption Day - Cứu hộ thú cưng",
  "description": "Sự kiện nhận nuôi thú cưng hàng tháng",
  "date": "2024-02-15T09:00:00",
  "location": "Trung tâm Cứu hộ Thú cưng Hà Nội",
  "category": "adoption",
  "status": "upcoming",
  "startTime": "09:00",
  "endTime": "17:00",
  "maxParticipants": 50,
  "shelterId": 1,
  "shelterName": "Trung tâm Cứu hộ Thú cưng Hà Nội"
}
```

## Lưu ý quan trọng

1. **Date Format**: Sử dụng ISO 8601 format (`YYYY-MM-DDTHH:mm:ss`)
2. **Time Format**: Sử dụng 24-hour format (`HH:mm`)
3. **Category Values**: `adoption`, `fundraising`, `volunteer`, `education`, `other`
4. **Status Values**: `upcoming`, `ongoing`, `completed`, `cancelled`
5. **Required Fields**: Không có trường bắt buộc, tất cả đều có giá trị mặc định
6. **Optional Fields**: `title`, `description`, `date`, `location`, `category`, `status`, `startTime`, `endTime`, `maxParticipants` 
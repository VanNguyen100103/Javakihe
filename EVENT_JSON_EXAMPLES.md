# Event JSON Examples - PawFund

## Ví dụ tạo event mới

### 1. Event cơ bản (không có ảnh)

```json
{
  "title": "Adoption Day - Cứu hộ thú cưng",
  "description": "Sự kiện nhận nuôi thú cưng hàng tháng. Có nhiều chó mèo đáng yêu đang chờ được nhận nuôi. Hãy đến và tìm người bạn đồng hành cho gia đình bạn!",
  "date": "2024-02-15T09:00:00",
  "location": "Trung tâm Cứu hộ Thú cưng Hà Nội, 123 Đường ABC, Quận XYZ",
  "category": "adoption",
  "status": "upcoming",
  "startTime": "09:00",
  "endTime": "17:00",
  "maxParticipants": 50
}
```

### 2. Event với URL ảnh có sẵn

```json
{
  "title": "Gala Dinner - Gây quỹ cứu hộ",
  "description": "Bữa tối gala hào phóng để gây quỹ cho hoạt động cứu hộ thú cưng. Bao gồm bữa tối 5 món, triển lãm ảnh, và đấu giá từ thiện.",
  "date": "2024-03-20T18:00:00",
  "location": "Khách sạn 5 sao, 456 Đường DEF, Quận GHI",
  "category": "fundraising",
  "status": "upcoming",
  "startTime": "18:00",
  "endTime": "22:00",
  "maxParticipants": 100,
  "imageUrl": "https://res.cloudinary.com/dxxdhz5f5/image/upload/v1703123456/pawfund/events/gala-dinner.jpg"
}
```

### 3. Event tình nguyện

```json
{
  "title": "Tình nguyện dọn dẹp trung tâm cứu hộ",
  "description": "Cần tình nguyện viên giúp dọn dẹp và chăm sóc thú cưng tại trung tâm cứu hộ. Hoạt động bao gồm dọn chuồng, cho ăn, và chơi với thú cưng.",
  "date": "2024-02-10T08:00:00",
  "location": "Trung tâm Cứu hộ Thú cưng TP.HCM, 789 Đường JKL, Quận MNO",
  "category": "volunteer",
  "status": "upcoming",
  "startTime": "08:00",
  "endTime": "12:00",
  "maxParticipants": 20
}
```

### 4. Event giáo dục

```json
{
  "title": "Workshop: Chăm sóc thú cưng đúng cách",
  "description": "Hội thảo về cách chăm sóc thú cưng khoa học. Bao gồm dinh dưỡng, sức khỏe, huấn luyện và phòng bệnh cho thú cưng.",
  "date": "2024-02-25T14:00:00",
  "location": "Hội trường A, Đại học ABC, 321 Đường PQR",
  "category": "education",
  "status": "upcoming",
  "startTime": "14:00",
  "endTime": "16:30",
  "maxParticipants": 80
}
```

## Ví dụ cập nhật event

### 1. Cập nhật thông tin cơ bản

```json
{
  "title": "Adoption Day - Cứu hộ thú cưng (Cập nhật)",
  "description": "Sự kiện nhận nuôi thú cưng hàng tháng đã được cập nhật. Có thêm nhiều chó mèo đáng yêu và hoạt động mới!",
  "date": "2024-02-15T09:00:00",
  "location": "Trung tâm Cứu hộ Thú cưng Hà Nội, 123 Đường ABC, Quận XYZ",
  "category": "adoption",
  "status": "ongoing",
  "startTime": "09:00",
  "endTime": "18:00",
  "maxParticipants": 75,
  "imageUrl": "https://res.cloudinary.com/dxxdhz5f5/image/upload/v1703123456/pawfund/events/adoption-day-updated.jpg"
}
```

### 2. Chỉ cập nhật trạng thái

```json
{
  "status": "completed"
}
```

### 3. Chỉ cập nhật thời gian

```json
{
  "date": "2024-02-20T10:00:00",
  "startTime": "10:00",
  "endTime": "18:00"
}
```

## Ví dụ sử dụng với cURL

### 1. Tạo event với JSON

```bash
curl -X POST http://localhost:8888/api/events \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Adoption Day - Cứu hộ thú cưng",
    "description": "Sự kiện nhận nuôi thú cưng hàng tháng. Có nhiều chó mèo đáng yêu đang chờ được nhận nuôi.",
    "date": "2024-02-15T09:00:00",
    "location": "Trung tâm Cứu hộ Thú cưng Hà Nội, 123 Đường ABC, Quận XYZ",
    "category": "adoption",
    "status": "upcoming",
    "startTime": "09:00",
    "endTime": "17:00",
    "maxParticipants": 50
  }'
```

### 2. Tạo event với ảnh upload

```bash
curl -X POST http://localhost:8888/api/events \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -F "title=Adoption Day - Cứu hộ thú cưng" \
  -F "description=Sự kiện nhận nuôi thú cưng hàng tháng" \
  -F "date=2024-02-15T09:00:00" \
  -F "location=Trung tâm Cứu hộ Thú cưng Hà Nội" \
  -F "category=adoption" \
  -F "status=upcoming" \
  -F "startTime=09:00" \
  -F "endTime=17:00" \
  -F "maxParticipants=50" \
  -F "image=@/path/to/event-image.jpg"
```

### 3. Cập nhật event

```bash
curl -X PUT http://localhost:8888/api/events/1 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Adoption Day - Cứu hộ thú cưng (Cập nhật)",
    "description": "Sự kiện đã được cập nhật với nhiều hoạt động mới!",
    "status": "ongoing",
    "maxParticipants": 75
  }'
```

## Ví dụ sử dụng với JavaScript/Frontend

### 1. Tạo event với JavaScript

```javascript
import { eventAPI } from '../api/event';

// Tạo event cơ bản
const createBasicEvent = async () => {
  const eventData = {
    title: "Adoption Day - Cứu hộ thú cưng",
    description: "Sự kiện nhận nuôi thú cưng hàng tháng",
    date: "2024-02-15T09:00:00",
    location: "Trung tâm Cứu hộ Thú cưng Hà Nội",
    category: "adoption",
    status: "upcoming",
    startTime: "09:00",
    endTime: "17:00",
    maxParticipants: 50
  };

  try {
    const response = await eventAPI.createEvent(eventData);
    console.log('Event created:', response.data);
  } catch (error) {
    console.error('Error creating event:', error);
  }
};

// Tạo event với ảnh upload
const createEventWithImage = async (file) => {
  const eventData = {
    title: "Adoption Day - Cứu hộ thú cưng",
    description: "Sự kiện nhận nuôi thú cưng hàng tháng",
    date: "2024-02-15T09:00:00",
    location: "Trung tâm Cứu hộ Thú cưng Hà Nội",
    category: "adoption",
    status: "upcoming",
    startTime: "09:00",
    endTime: "17:00",
    maxParticipants: 50,
    image: file // File object từ input
  };

  try {
    const response = await eventAPI.createEvent(eventData);
    console.log('Event created with image:', response.data);
  } catch (error) {
    console.error('Error creating event:', error);
  }
};
```

### 2. Cập nhật event

```javascript
// Cập nhật toàn bộ thông tin
const updateEvent = async (eventId) => {
  const updateData = {
    title: "Adoption Day - Cứu hộ thú cưng (Cập nhật)",
    description: "Sự kiện đã được cập nhật với nhiều hoạt động mới!",
    date: "2024-02-20T09:00:00",
    location: "Trung tâm Cứu hộ Thú cưng Hà Nội",
    category: "adoption",
    status: "ongoing",
    startTime: "09:00",
    endTime: "18:00",
    maxParticipants: 75
  };

  try {
    const response = await eventAPI.updateEvent(eventId, updateData);
    console.log('Event updated:', response.data);
  } catch (error) {
    console.error('Error updating event:', error);
  }
};

// Chỉ cập nhật trạng thái
const updateEventStatus = async (eventId, newStatus) => {
  const updateData = {
    status: newStatus
  };

  try {
    const response = await eventAPI.updateEvent(eventId, updateData);
    console.log('Event status updated:', response.data);
  } catch (error) {
    console.error('Error updating event status:', error);
  }
};
```

## Cấu trúc EventDTO Response

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
  "imageUrl": "https://res.cloudinary.com/dxxdhz5f5/image/upload/v1703123456/pawfund/events/adoption-day.jpg",
  "shelterId": 1,
  "shelterName": "Trung tâm Cứu hộ Thú cưng Hà Nội"
}
```

## Lưu ý quan trọng

1. **Date Format**: Sử dụng ISO 8601 format (`YYYY-MM-DDTHH:mm:ss`)
2. **Time Format**: Sử dụng 24-hour format (`HH:mm`)
3. **Category Values**: `adoption`, `fundraising`, `volunteer`, `education`, `other`
4. **Status Values**: `upcoming`, `ongoing`, `completed`, `cancelled`
5. **Image Upload**: Hỗ trợ cả `imageUrl` (URL có sẵn) và `image` (file upload)
6. **Required Fields**: `title`, `description`, `date`, `location`
7. **Optional Fields**: `category`, `status`, `startTime`, `endTime`, `maxParticipants`, `imageUrl`, `image` 
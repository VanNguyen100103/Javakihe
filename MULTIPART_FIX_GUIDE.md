# Multipart Upload Fix Guide

## Vấn đề đã được sửa

Lỗi `MultipartException: Failed to parse multipart servlet request` đã được khắc phục bằng cách:

1. **Tạo MultipartConfig riêng biệt** - File `src/main/java/com/ecommerce/pawfund/config/MultipartConfig.java`
2. **Cập nhật application.properties** - Thêm cấu hình multipart chi tiết hơn
3. **Thêm GlobalExceptionHandler** - Xử lý MultipartException và các exception khác
4. **Cải thiện PetController** - Thêm logging và error handling tốt hơn
5. **Tạo TestController** - Để test multipart upload

## Cách test

### 1. Test endpoint đơn giản
```bash
curl -X POST http://localhost:8888/api/test/upload \
  -F "file=@/path/to/image.jpg" \
  -F "name=test"
```

### 2. Test multipart với nhiều file
```bash
curl -X POST http://localhost:8888/api/test/multipart \
  -F "name=Ana" \
  -F "description=Đây là con mèo." \
  -F "files=@/path/to/image1.jpg" \
  -F "files=@/path/to/image2.jpg"
```

### 3. Test Pet creation
```bash
curl -X POST http://localhost:8888/api/pets \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -F "name=Ana" \
  -F "description=Đây là con mèo." \
  -F "age=5" \
  -F "breed=Persian" \
  -F "location=HCM" \
  -F "status=AVAILABLE" \
  -F "gender=MALE" \
  -F "images=@/path/to/image1.jpg" \
  -F "images=@/path/to/image2.jpg"
```

## Cấu hình đã thêm

### MultipartConfig.java
- Cấu hình MultipartResolver
- Giới hạn file size: 10MB per file, 50MB total
- Threshold: 2KB

### application.properties
```properties
spring.servlet.multipart.enabled=true
spring.servlet.multipart.max-file-size=10MB
spring.servlet.multipart.max-request-size=50MB
spring.servlet.multipart.file-size-threshold=2KB
spring.servlet.multipart.resolve-lazily=false
spring.servlet.multipart.location=${java.io.tmpdir}

logging.level.org.springframework.web.multipart=DEBUG
logging.level.org.apache.tomcat.util.http.fileupload=DEBUG
```

### GlobalExceptionHandler.java
- Xử lý MultipartException
- Xử lý generic exceptions
- Trả về JSON response thay vì stack trace

## Debugging

Nếu vẫn gặp lỗi, kiểm tra:

1. **Content-Type header** - Phải là `multipart/form-data`
2. **File size** - Không vượt quá 10MB per file
3. **Total request size** - Không vượt quá 50MB
4. **File format** - Chỉ chấp nhận image files
5. **Encoding** - UTF-8 cho text fields

## Logs

Kiểm tra console logs để xem:
- Content-Type và Content-Length của request
- Số lượng files được nhận
- Chi tiết lỗi nếu có

## Restart Application

Sau khi thay đổi, restart Spring Boot application:
```bash
./mvnw spring-boot:run
``` 
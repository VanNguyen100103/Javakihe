# PayPal Integration Guide

## Tổng quan

Frontend đã được tích hợp PayPal để xử lý thanh toán cho donations. Hệ thống bao gồm:

### Components đã tạo:

1. **PayPalButton** (`src/components/payment/PayPalButton.js`)
   - Component chính để hiển thị nút PayPal
   - Tự động lấy PayPal Client ID từ backend
   - Xử lý toàn bộ flow thanh toán PayPal

2. **PaymentModal** (`src/components/payment/PaymentModal.js`)
   - Modal hiển thị các phương thức thanh toán
   - Hỗ trợ PayPal, thẻ tín dụng, chuyển khoản ngân hàng
   - Tích hợp với PayPalButton

3. **DonationSuccess** (`src/components/payment/DonationSuccess.js`)
   - Hiển thị thông tin thành công sau khi quyên góp
   - Cho phép tải biên lai
   - Hiển thị tác động của quyên góp

4. **DonationStats** (`src/components/donation/DonationStats.js`)
   - Hiển thị thống kê quyên góp
   - Progress bar cho mục tiêu hàng tháng
   - Có thể sử dụng trên HomePage

### API Endpoints cần thiết:

Backend cần implement các endpoints sau:

```java
// PayPal endpoints
POST /api/donations/paypal/create-order
POST /api/donations/paypal/capture/{orderId}
GET /api/donations/paypal/client-id
POST /api/donations/paypal/verify

// Regular donation endpoints
GET /api/donations
POST /api/donations
GET /api/donations/{id}
PUT /api/donations/{id}
DELETE /api/donations/{id}
```

### Cấu hình PayPal:

1. **PayPal Client ID**: Backend cần trả về PayPal Client ID thông qua endpoint `/api/donations/paypal/client-id`

2. **Environment Variables**: 
   ```env
   PAYPAL_CLIENT_ID=your_paypal_client_id
   PAYPAL_CLIENT_SECRET=your_paypal_client_secret
   PAYPAL_MODE=sandbox  # hoặc 'live'
   ```

### Flow thanh toán:

1. **Tạo donation form** → User nhập thông tin quyên góp
2. **Payment Modal** → Hiển thị các phương thức thanh toán
3. **PayPal Button** → User click để thanh toán qua PayPal
4. **Backend Processing**:
   - Tạo PayPal order
   - Capture payment
   - Tạo donation record
5. **Success Modal** → Hiển thị thông tin thành công

### Cách sử dụng:

```jsx
import PaymentModal from './components/payment/PaymentModal';

// Trong component
const [showPaymentModal, setShowPaymentModal] = useState(false);

const handlePaymentSuccess = (donationResponse, paymentResponse) => {
  // Xử lý sau khi thanh toán thành công
  console.log('Payment successful:', donationResponse);
};

<PaymentModal
  isOpen={showPaymentModal}
  onClose={() => setShowPaymentModal(false)}
  amount={100000} // VND
  currency="VND"
  donationData={{
    amount: 100000,
    message: "Quyên góp cho thú cưng",
    category: "medical",
    anonymous: false
  }}
  onSuccess={handlePaymentSuccess}
/>
```

### Tính năng bảo mật:

- SSL encryption cho tất cả giao dịch
- Không lưu trữ thông tin thẻ tín dụng
- Tuân thủ PCI DSS
- Hỗ trợ hoàn tiền trong 30 ngày

### Responsive Design:

- Tất cả components đều responsive
- Hỗ trợ mobile và desktop
- Loading states và error handling

### Error Handling:

- Network errors
- PayPal API errors
- Backend validation errors
- User cancellation

### Testing:

1. **Sandbox Mode**: Sử dụng PayPal sandbox để test
2. **Test Cards**: Sử dụng test cards của PayPal
3. **Error Scenarios**: Test các trường hợp lỗi

### Deployment:

1. Cập nhật PayPal Client ID cho production
2. Chuyển sang PayPal Live mode
3. Cấu hình webhook cho real-time updates
4. Monitor payment logs

### Dependencies:

```json
{
  "@paypal/react-paypal-js": "^8.8.3",
  "react-toastify": "^11.0.5",
  "react-icons": "^5.5.0"
}
```

### Troubleshooting:

1. **PayPal không load**: Kiểm tra Client ID và network
2. **Payment failed**: Kiểm tra backend logs
3. **Modal không hiển thị**: Kiểm tra CSS và z-index
4. **Currency issues**: Đảm bảo currency được hỗ trợ

### Next Steps:

1. Implement backend PayPal endpoints
2. Add webhook handling
3. Implement receipt generation
4. Add payment analytics
5. Implement refund functionality 
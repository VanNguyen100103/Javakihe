# Image Zoom Integration Guide

## Tổng quan

Frontend đã được tích hợp `react-medium-image-zoom` để cho phép zoom ảnh thú cưng. Tính năng này giúp người dùng xem chi tiết ảnh thú cưng một cách dễ dàng.

### Components đã tích hợp:

1. **PetCard** (`src/components/pet/PetCard.js`)
   - Zoom ảnh trong card thú cưng
   - Hover overlay với icon zoom
   - Responsive design

2. **PetDetailPage** (`src/components/pages/PetDetailPage.js`)
   - Zoom ảnh chính và thumbnails
   - Gallery với multiple images
   - Smooth transitions

### Dependencies:

```json
{
  "react-medium-image-zoom": "^5.3.0"
}
```

## Cách sử dụng:

### 1. Basic Zoom Component:

```jsx
import Zoom from 'react-medium-image-zoom';
import 'react-medium-image-zoom/dist/styles.css';

<Zoom
  wrapStyle={{
    width: '100%',
    height: '100%'
  }}
  overlayBgColorEnd="rgba(0, 0, 0, 0.8)"
  zoomMargin={40}
  openText="Phóng to ảnh"
  closeText="Đóng"
>
  <img src="image-url" alt="description" />
</Zoom>
```

### 2. Với Custom Overlay:

```jsx
<Zoom
  wrapStyle={{
    width: '100%',
    height: '100%'
  }}
  overlayBgColorEnd="rgba(0, 0, 0, 0.9)"
  zoomMargin={40}
>
  <div className="image-container">
    <img src={imageUrl} alt={altText} />
    <div className="zoom-overlay">
      <FaSearch />
      <span>Click để phóng to</span>
    </div>
  </div>
</Zoom>
```

### 3. Props Configuration:

```jsx
<Zoom
  // Container styling
  wrapStyle={{
    width: '100%',
    height: '100%'
  }}
  
  // Overlay configuration
  overlayBgColorStart="rgba(0, 0, 0, 0)"
  overlayBgColorEnd="rgba(0, 0, 0, 0.8)"
  
  // Zoom behavior
  zoomMargin={40}
  zoomImg={{
    src: 'high-res-image-url',
    alt: 'High resolution image'
  }}
  
  // Accessibility
  openText="Phóng to ảnh"
  closeText="Đóng"
  
  // Animation
  animationDuration={300}
  animationEasing="ease"
/>
```

## CSS Styling:

### 1. Image Container:

```css
.image-container {
  position: relative;
  width: 100%;
  height: 100%;
  cursor: pointer;
}

.image-container img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.image-container:hover img {
  transform: scale(1.05);
}
```

### 2. Zoom Overlay:

```css
.zoom-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.3);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: white;
  opacity: 0;
  transition: opacity 0.3s ease;
  pointer-events: none;
}

.image-container:hover .zoom-overlay {
  opacity: 1;
}
```

### 3. Thumbnail Styling:

```css
.thumbnail-container {
  position: relative;
  min-width: 80px;
  height: 80px;
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
  border: 2px solid transparent;
  transition: border-color 0.3s ease;
}

.thumbnail-container.active {
  border-color: #e74c3c;
}
```

## Features:

### ✅ **Zoom Functionality**
- Click để phóng to ảnh
- ESC hoặc click để đóng
- Smooth animations

### ✅ **Responsive Design**
- Hoạt động trên mobile và desktop
- Touch gestures support
- Adaptive zoom levels

### ✅ **Accessibility**
- Keyboard navigation (ESC to close)
- Screen reader support
- Custom open/close text

### ✅ **Performance**
- Lazy loading support
- Optimized image loading
- Memory efficient

### ✅ **Customization**
- Custom overlay colors
- Configurable zoom margin
- Custom animations

## Best Practices:

### 1. Image Optimization:

```jsx
// Sử dụng different resolutions
<Zoom
  zoomImg={{
    src: highResImage,
    alt: 'High resolution image'
  }}
>
  <img src={lowResImage} alt="Thumbnail" />
</Zoom>
```

### 2. Error Handling:

```jsx
const handleImageError = (e) => {
  e.target.src = '/images/default-pet.jpg';
};

<img 
  src={imageUrl} 
  alt={altText}
  onError={handleImageError}
/>
```

### 3. Loading States:

```jsx
{isLoading ? (
  <div className="image-skeleton">
    <FaSpinner className="spinner" />
  </div>
) : (
  <Zoom>
    <img src={imageUrl} alt={altText} />
  </Zoom>
)}
```

## Troubleshooting:

### 1. Zoom không hoạt động:
- Kiểm tra CSS imports
- Đảm bảo image có src hợp lệ
- Kiểm tra console errors

### 2. Performance issues:
- Optimize image sizes
- Sử dụng lazy loading
- Implement proper error handling

### 3. Mobile issues:
- Test touch gestures
- Kiểm tra viewport settings
- Optimize for mobile performance

## Advanced Usage:

### 1. Multiple Images Gallery:

```jsx
const [selectedImage, setSelectedImage] = useState(0);

const renderMainImage = () => {
  const currentImage = images[selectedImage];
  
  return (
    <Zoom>
      <img src={currentImage} alt="Main image" />
    </Zoom>
  );
};

const renderThumbnails = () => {
  return images.map((image, index) => (
    <Zoom key={index}>
      <img 
        src={image} 
        alt={`Thumbnail ${index + 1}`}
        onClick={() => setSelectedImage(index)}
      />
    </Zoom>
  ));
};
```

### 2. Custom Zoom Behavior:

```jsx
<Zoom
  onOpen={() => console.log('Image opened')}
  onClose={() => console.log('Image closed')}
  onZoomChange={(shouldZoom) => {
    console.log('Zoom state:', shouldZoom);
  }}
>
  <img src={imageUrl} alt={altText} />
</Zoom>
```

### 3. Conditional Zoom:

```jsx
{enableZoom ? (
  <Zoom>
    <img src={imageUrl} alt={altText} />
  </Zoom>
) : (
  <img src={imageUrl} alt={altText} />
)}
```

## Browser Support:

- ✅ Chrome (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Edge (latest)
- ✅ Mobile browsers

## Performance Tips:

1. **Image Optimization**: Sử dụng WebP format khi có thể
2. **Lazy Loading**: Implement lazy loading cho images
3. **Caching**: Cache zoomed images
4. **Memory Management**: Cleanup zoom instances khi component unmount

## Security Considerations:

1. **Image Validation**: Validate image URLs
2. **CORS**: Handle cross-origin images
3. **File Size**: Limit maximum image size
4. **Content Security**: Sanitize image sources 
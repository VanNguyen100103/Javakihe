// Script test endpoint shelter events
// Chạy trong browser console sau khi đăng nhập shelter1

const testShelterEvents = async () => {
  try {
    // Test endpoint trực tiếp
    const response = await fetch('/api/events/shelter-events', {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
      }
    });
    
    console.log('Response status:', response.status);
    console.log('Response headers:', response.headers);
    
    if (response.ok) {
      const data = await response.json();
      console.log('Shelter events data:', data);
      return data;
    } else {
      const errorText = await response.text();
      console.error('Error response:', errorText);
      return null;
    }
  } catch (error) {
    console.error('Error testing shelter events:', error);
    return null;
  }
};

// Test notifications endpoint
const testNotifications = async () => {
  try {
    const response = await fetch('/api/notifications', {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
      }
    });
    
    console.log('Notifications response status:', response.status);
    
    if (response.ok) {
      const data = await response.json();
      console.log('Notifications data:', data);
      return data;
    } else {
      const errorText = await response.text();
      console.error('Notifications error:', errorText);
      return null;
    }
  } catch (error) {
    console.error('Error testing notifications:', error);
    return null;
  }
};

// Chạy tests
console.log('=== Testing Shelter Events ===');
testShelterEvents();

console.log('=== Testing Notifications ===');
testNotifications(); 
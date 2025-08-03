// Script test volunteer events
// Chạy trong browser console sau khi đăng nhập volunteer1

const testVolunteerEvents = async () => {
  try {
    console.log('=== Testing Volunteer Events API ===');
    
    // Test 1: Gọi trực tiếp với fetch
    console.log('Test 1: Direct fetch call');
    const response = await fetch('http://localhost:8888/api/events/volunteer-events', {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
        'Content-Type': 'application/json'
      }
    });
    
    console.log('Response status:', response.status);
    console.log('Response headers:', response.headers);
    
    if (response.ok) {
      const data = await response.json();
      console.log('Volunteer events data:', data);
      return data;
    } else {
      const errorText = await response.text();
      console.error('Error response:', errorText);
      return null;
    }
  } catch (error) {
    console.error('Error testing volunteer events:', error);
    return null;
  }
};

// Test 2: Gọi qua axios instance
const testVolunteerEventsAxios = async () => {
  try {
    console.log('Test 2: Axios call');
    
    // Import axios nếu cần
    const axios = window.axios || (await import('axios')).default;
    
    const response = await axios.get('http://localhost:8888/api/events/volunteer-events', {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
      }
    });
    
    console.log('Axios response:', response);
    return response.data;
  } catch (error) {
    console.error('Axios error:', error);
    return null;
  }
};

// Chạy tests
console.log('=== Testing Volunteer Events ===');
testVolunteerEvents();
// testVolunteerEventsAxios(); 
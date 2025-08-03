// Script debug admin pets
// Chạy trong browser console sau khi đăng nhập admin1

const debugAdminPets = async () => {
  try {
    console.log('=== Debug Admin Pets ===');
    
    // Test 1: Kiểm tra Redux state
    console.log('Test 1: Check Redux state');
    console.log('Current URL:', window.location.href);
    console.log('Is admin page:', window.location.pathname.includes('/admin/pets'));
    
    // Test 2: Kiểm tra API call trực tiếp
    console.log('Test 2: Direct API call');
    const response = await fetch('http://localhost:8888/api/pets?page=0&size=10', {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
        'Content-Type': 'application/json'
      }
    });
    
    console.log('Response status:', response.status);
    
    if (response.ok) {
      const data = await response.json();
      console.log('API Response:', data);
      console.log('Total elements:', data.totalElements);
      console.log('Content length:', data.content?.length);
      console.log('Content:', data.content);
    } else {
      const errorText = await response.text();
      console.error('API Error:', errorText);
    }
    
    // Test 3: Kiểm tra localStorage
    console.log('Test 3: Check localStorage');
    console.log('Access token exists:', !!localStorage.getItem('accessToken'));
    console.log('User data:', localStorage.getItem('user'));
    
    // Test 4: Kiểm tra network requests
    console.log('Test 4: Check network requests');
    const networkRequests = performance.getEntriesByType('resource');
    const petsRequests = networkRequests.filter(req => req.name.includes('/pets'));
    console.log('Pets API requests:', petsRequests);
    
  } catch (error) {
    console.error('Debug error:', error);
  }
};

// Chạy debug
debugAdminPets(); 
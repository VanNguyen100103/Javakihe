import axios from 'axios';

// Tạo instance axios với base URL
const api = axios.create({
    baseURL: 'http://localhost:8888/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor để thêm token
api.interceptors.request.use(
    (config) => {
        console.log('Request URL:', config.url);
        console.log('Request method:', config.method);
        console.log('Request headers:', config.headers);
        console.log('Request data:', config.data);
        console.log('Is FormData:', config.data instanceof FormData);
        
        const token = localStorage.getItem('accessToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        
        // Don't set Content-Type for FormData requests
        if (config.data instanceof FormData) {
            console.log('Removing Content-Type for FormData request');
            delete config.headers['Content-Type'];
        }
        
        console.log('Final headers:', config.headers);
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor để xử lý token refresh và error
api.interceptors.response.use(
    (response) => {
        // Trả về data trực tiếp thay vì toàn bộ response
        return response.data;
    },
    async (error) => {
        const originalRequest = error.config;

        // Nếu lỗi 401 và chưa thử refresh token
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                const refreshToken = localStorage.getItem('refreshToken');
                if (refreshToken) {
                    const response = await axios.post('http://localhost:8888/api/auth/refresh', {
                        refreshToken: refreshToken
                    });
                    
                    const { accessToken } = response.data;
                    localStorage.setItem('accessToken', accessToken);
                    
                    // Thử lại request gốc với token mới
                    originalRequest.headers.Authorization = `Bearer ${accessToken}`;
                    return api(originalRequest);
                }
            } catch (refreshError) {
                // Nếu refresh token cũng hết hạn, logout user
                localStorage.removeItem('accessToken');
                localStorage.removeItem('refreshToken');
                localStorage.removeItem('user');
                window.location.href = '/login';
            }
        }

        return Promise.reject(error);
    }
);

export default api;
// GENERAL SERVER
import axios from "axios";


const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_PORT_GENERAL_SERVER,
    headers: {
        "Content-Type": "application/json",
        'ngrok-skip-browser-warning': 'true'
    },
    withCredentials: false, // ← CAMBIAR A FALSE
});

// Interceptor de REQUEST - Agregar token
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
   
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
   
    console.log('🚀 Request:', config.method?.toUpperCase(), config.url, {
      hasToken: !!token,
      authHeader: config.headers.Authorization ? '✅' : '❌'
    });
   
    return config;
  },
  (error) => {
    console.error('❌ Request error:', error);
    return Promise.reject(error);
  }
);

// Interceptor de RESPONSE - Solo logging básico
axiosInstance.interceptors.response.use(
  (response) => {
    console.log('✅ Response:', response.status, response.config.url);
    return response;
  },
  (error) => {
    console.error('❌ Response error:', {
      status: error.response?.status,
      url: error.config?.url,
      data: error.response?.data
    });
    return Promise.reject(error);
  }
);

export default axiosInstance;
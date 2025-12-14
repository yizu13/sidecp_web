import axios from "axios";

// AUTH SERVER
const axiosLog = axios.create({
    baseURL: import.meta.env.VITE_PORT_AUTH_SERVER,
    headers: {
        "Content-Type": "application/json"
    },
    withCredentials: false, // ← CAMBIAR A FALSE
});

// Logging simple para auth
axiosLog.interceptors.request.use(
  (config) => {
    console.log('🔐 Auth request:', config.method?.toUpperCase(), config.url);
    return config;
  }
);

axiosLog.interceptors.response.use(
  (response) => {
    console.log('✅ Auth response:', response.status);
    return response;
  },
  (error) => {
    console.error('❌ Auth error:', error.response?.status, error.response?.data);
    return Promise.reject(error);
  }
);

export default axiosLog;
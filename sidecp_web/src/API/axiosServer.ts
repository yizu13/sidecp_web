import axios from "axios";

// GENERAL SERVER
const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_PORT_GENERAL_SERVER,
    headers: {
        "Content-Type": "application/json",
        'ngrok-skip-browser-warning': 'true'
    }, 
    withCredentials: true,
});

export default axiosInstance;

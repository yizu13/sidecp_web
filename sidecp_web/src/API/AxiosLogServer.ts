import axios from "axios";

// AUTH SERVER
const axiosLog = axios.create({

        baseURL: import.meta.env.VITE_PORT_AUTH_SERVER,
        headers: {
            "Content-Type": "application/json"
        },
        withCredentials: true,
});

 
export default axiosLog
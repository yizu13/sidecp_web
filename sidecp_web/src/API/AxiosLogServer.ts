import axios from "axios";

const axiosLog = axios.create({

        baseURL: "http://localhost:4000",
        headers: {
            "Content-Type": "application/json"
        },
        withCredentials: true,
});

 
export default axiosLog
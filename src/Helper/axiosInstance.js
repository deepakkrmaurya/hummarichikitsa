// import axios from "axios";

// // const BASE_URL = "http://localhost:5000/api/v1";
// const BASE_URL = "https://doctor-appointment-backend-t00j.onrender.com/api/v1";
//   const { token }  = useSelector((state) => state.auth);
// const axiosInstance = axios.create();
// axiosInstance.defaults.baseURL = BASE_URL;
// axiosInstance.defaults.withCredentials = true;
// export default axiosInstance;

import axios from "axios";
import { useSelector } from "react-redux";

// const BASE_URL = "http://localhost:5000/api/v1";
const BASE_URL = "https://doctor-appointment-backend-t00j.onrender.com/api/v1";

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

// Add a request interceptor to include the token in headers
axiosInstance.interceptors.request.use(
  (config) => {
    const { token } = useSelector((state) => state.auth);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;
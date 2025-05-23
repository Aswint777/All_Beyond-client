import axios, {
  AxiosInstance,
  AxiosResponse,
  InternalAxiosRequestConfig,
  AxiosHeaders,
} from "axios";
import Cookies from "js-cookie";

const API_URL = import.meta.env.VITE_REACT_APP_API_URL;

const headers = new AxiosHeaders({
  "Content-Type": "application/json",
});

const config: InternalAxiosRequestConfig = {
  withCredentials: true,
  headers,
};

const api: AxiosInstance = axios.create({
  baseURL: API_URL,
  ...config,
});

api.interceptors.request.use(
  (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
    const token = Cookies.get("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error("Request error:", error);
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error) => {
    if (error.response) {
      const { status } = error.response;
      if (status === 401) {
        console.error("Unauthorized access - redirecting to login");
        Cookies.remove("token");
      } else if (status === 403) {
        console.error("Forbidden access");
      } else if (status >= 500) {
        console.error("Server error");
      }
    } else {
      console.error("Network error or no response:", error.message);
    }
    return Promise.reject(error);
  }
);

export default api;

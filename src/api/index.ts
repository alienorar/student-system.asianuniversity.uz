// import { getRefreshToken, logout, setAccessToken } from "@/utils/token-service";
import axios from "axios";

export const getAccessToken = () => localStorage.getItem("accessToken");

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
});

axiosInstance.interceptors.request.use((config) => {
  const access_token = getAccessToken();
  if (access_token) {
    config.headers["x-student-token"] = `${access_token}`; // Set Bearer token
  }
  return config;
});

// Optional: Token refresh logic (uncomment if needed)
/*
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshToken = getRefreshToken();
        if (!refreshToken) {
          throw new Error("No refresh token, logging out...");
        }

        const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/auth/refresh`, {
          refreshToken,
        });

        const newAccessToken = response.data.accessToken;
        setAccessToken(newAccessToken);
        axiosInstance.defaults.headers["Authorization"] = `Bearer ${newAccessToken}`; // Update default header
        originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`; // Update original request header

        return axiosInstance(originalRequest);
      } catch (refreshError) {
        console.log("Refresh token expired, logging out.");
        logout();
      }
    }

    return Promise.reject(error);
  }
);
*/

export default axiosInstance;
// axiosConfig.ts
import axios from "axios";
import { authApi } from '../features/auth/services/api/authApi.ts';

const apiClient = axios.create({
    baseURL: "http://localhost:8080/api",
    withCredentials: true, // Automatically send cookies
});

// Response Interceptor: Handle Token Expiration
apiClient.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true; // Prevent infinite loop
            try {
                // Trigger token refresh
                console.log("calling: authApi.refreshAccessToken()");
                await authApi.refreshAccessToken();
                console.log("worked: authApi.refreshAccessToken()");

                return apiClient(originalRequest); // Retry the original request
            } catch (refreshError) {
                console.error("Token refresh failed. Logging out...");
                window.location.href = "/login"; // Redirect to login
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export default apiClient;

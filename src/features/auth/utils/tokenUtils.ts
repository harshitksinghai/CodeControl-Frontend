import { authApi } from "../services/api/authApi";

export const refreshAccessToken = async (): Promise<string | null> => {
  try {
    const newAccessToken = await authApi.refreshAccessToken();
    localStorage.setItem("accessToken", newAccessToken); // Save the new token
    return newAccessToken;
  } catch (error) {
    console.error("Failed to refresh token. Redirecting to login...");
    // Optionally redirect to login or handle error
    return null;
  }
};
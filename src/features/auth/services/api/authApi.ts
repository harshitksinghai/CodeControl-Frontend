import apiClient from '../../../../config/axiosConfig.ts';
import {
    LoginRequest,
    RegisterRequest,
    VerifyOtpRequest,
    OnboardRequest,
    ChangePasswordAndLoginRequest
} from '../../utils/authTypes.ts';
import { CommonResponse } from '../../../../utils/commonTypes';


export const authApi = {
    verifyEmail: (email: string) =>
        apiClient.post<CommonResponse>(`/auth/verify-email`, null, {
            params: { email }
        }),

    login: (data: LoginRequest) =>
        apiClient.post<CommonResponse>(`/auth/login`, data),

    sendOtp: (email: string) =>
        apiClient.post<CommonResponse>(`/auth/send-otp`, null, {
            params: { email }
        }),

    verifyOtp: (data: VerifyOtpRequest) =>
        apiClient.post<CommonResponse>(`/auth/verify-otp`, data),

    register: (data: RegisterRequest) =>
        apiClient.post<CommonResponse>(`/auth/register`, data),

    changePasswordAndLogin: (data: ChangePasswordAndLoginRequest) =>
        apiClient.post<CommonResponse>(`/auth/change-password-and-login`, data),

    checkOnboard: () =>
        apiClient.get<CommonResponse>(`/auth/check-onboard`),

    onboard: (data: OnboardRequest) =>
        apiClient.post<CommonResponse>(`/auth/onboard`, data),

    logout: () =>
        apiClient.post<CommonResponse>(`/auth/logout`),

    refreshAccessToken: () =>
        apiClient.post('/auth/refresh-token', null, {
            withCredentials: true, // Required to include cookies in the request
        }),

}
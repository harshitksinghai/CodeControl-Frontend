export interface LoginRequest {
    email: string;
    password: string;
  }
  
  export interface RegisterRequest {
    email: string;
    password: string;
  }
  
  export interface VerifyOtpRequest {
    email: string;
    otp: string;
  }
  
  export interface OnboardRequest {
    firstName: string;
    middleName?: string;
    lastName: string;
  }
  
  export interface ChangePasswordAndLoginRequest {
    email: string;
    password: string;
  }
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authApi } from '../services/api/authApi.ts'

type AuthMode = 'verify-email' | 'otp' | 'login-password' | 'reset-password' | 'register';
type OtpMode = 'login' | 'reset-password' | 'register';

const AuthPage: React.FC<{ mode: 'login' | 'register' }> = ({ mode }) => {
    const navigate = useNavigate();

    const [authMode, setAuthMode] = useState<AuthMode>('verify-email');
    const [otpMode, setOtpMode] = useState<OtpMode>();

    const [error, setError] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [otp, setOtp] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const showLoginError = new URLSearchParams(location.search).get('error') === 'true';

    const handleGoogleOAuth = () => {
        window.location.href = 'http://localhost:8080/oauth2/authorization/google'; // Redirect to your backend's Google OAuth endpoint
    };

    const handleGithubOAuth = () => {
        window.location.href = 'http://localhost:8080/oauth2/authorization/github'; // Redirect to your backend's GitHub OAuth endpoint
    };

    const handleEmailVerification = async () => {
        try {
            console.log("calling: authApi.verifyEmail");
            const response = await authApi.verifyEmail(email);
            console.log("worked: authApi.verifyEmail");

            if (response.data.status) {
                if (response.data.util == "true") {
                    setAuthMode('login-password')
                }
                else {
                    await authApi.sendOtp(email);
                    setOtpMode('login');
                    setAuthMode('otp');
                }
            } else {
                // Email not found in login mode, or new user in register mode
                await authApi.sendOtp(email);
                setOtpMode('register');
                setAuthMode('otp');
            }
        } catch (err) {
            setError('Email verification failed!');
        }
    }

    const handleLoginPassword = async () => {
        try {
            console.log("calling: authApi.login({email, password})");
            const response = await authApi.login({ email, password });
            console.log("worked: authApi.login({email, password})");

            if (response.data.status) {
                console.log("calling: authApi.checkOnboard()");
                const checkOnboardResponse = await authApi.checkOnboard();
                console.log("worked: authApi.checkOnboard()");

                setPassword('');

                if (checkOnboardResponse.data.status) {
                    navigate('/home');
                } else {
                    navigate('/onboard');
                }
            } else {
                setError('Login failed!');
            }

        } catch (err) {
            setError('Login failed!');
        }
    }

    const handleForgotPassword = async () => {
        try {
            console.log("calling: authApi.sendOtp(email)");
            await authApi.sendOtp(email);
            console.log("worked: authApi.sendOtp(email)");

            setOtpMode('reset-password');
            setAuthMode('otp');

        } catch (err) {
            setError("Failed to send OTP!");
        }
    }

    const handleOtpVerification = async () => {
        try {
            console.log("calling: authApi.verifyOtp({email, otp})");
            const response = await authApi.verifyOtp({ email, otp });
            console.log("worked: authApi.verifyOtp({email, otp})");

            if (response.data.status) {
                if (otpMode === 'login') {
                    setOtpMode(undefined);
                    navigate('/home');
                }
                else if (otpMode === 'reset-password') {
                    setOtpMode(undefined);
                    setAuthMode('reset-password');
                }
                else if (otpMode === 'register') {
                    setOtpMode(undefined);
                    setAuthMode('register');
                }
            }
            else {
                setError("Invalid OTP!");
            }
        } catch (err) {
            setError("OTP verification failed!");
        }
    }

    const handleChangePasswordAndLogin = async () => {
        try {
            console.log("calling: authApi.changePasswordAndLogin({ email, password })");
            const response = await authApi.changePasswordAndLogin({ email, password });
            console.log("worked: authApi.changePasswordAndLogin({ email, password })");

            if(response.data.status){
                console.log("calling: authApi.checkOnboard()");
                const checkOnboardResponse = await authApi.checkOnboard();
                console.log("worked: authApi.checkOnboard()");

                setPassword('');
                setConfirmPassword('');

                if (checkOnboardResponse.data.status) {
                    navigate('/home');
                } else {
                    navigate('/onboard');
                }
            }
            else{
                setError("Password change failed!");
            }
        } catch (err) {
            setError("Password change failed!");
        }
    }

    const handleRegister = async () => {
        try {
            console.log("calling: authApi.register({email, password})");
            const response = await authApi.register({email, password});
            console.log("worked: authApi.register({email, password})");

            if(response.data.status){
                navigate('/onboard');
            }
            else{
                setError("Register failed!");
            }
        } catch (err) {
            setError("Register failed!");
        }
    }

    const renderContent = () => {
        switch (authMode) {
            case 'verify-email':
                return (
                    <div>
                        {showLoginError && (
                        <p style={{ color: 'red', marginBottom: '1em' }}>
                            We encountered an issue while logging you in. Please try again.
                        </p>
                        )}
                        <h2>{mode === 'login' ? 'Login to App' : 'Register to App'}</h2>
                        <button onClick={handleGoogleOAuth}>Continue with Google</button>
                        <button onClick={handleGithubOAuth}>Continue with GitHub</button>
                        <p>OR</p>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Email"
                        />
                        <button onClick={handleEmailVerification}>Continue</button>
                    </div>
                );

            case 'login-password':
                return (
                    <div>
                        <button onClick={handleGoogleOAuth}>Continue with Google</button>
                        <button onClick={handleGithubOAuth}>Continue with GitHub</button>
                        <p>OR</p>
                        <input
                            type="email"
                            value={email}
                            readOnly
                            onChange={(e) => {
                                if (e.target.value !== email) {
                                    setOtpMode(undefined);
                                    setAuthMode('verify-email');
                                }
                            }}
                        />
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Password"
                        />
                        <div onClick={handleForgotPassword} style={{ cursor: 'pointer' }}>
                            Forgot password?
                        </div>
                        <button onClick={handleLoginPassword}>Submit</button>
                    </div>
                );

            case 'otp':
                return (
                    <div>
                        <button onClick={handleGoogleOAuth}>Continue with Google</button>
                        <button onClick={handleGithubOAuth}>Continue with GitHub</button>
                        <p>OR</p>
                        <input
                            type="email"
                            value={email}
                            readOnly
                            onChange={(e) => {
                                if (e.target.value !== email) {
                                    setOtpMode(undefined);
                                    setAuthMode('verify-email');
                                }
                            }}
                        />
                        <input
                            type="text"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            placeholder="OTP"
                        />
                        <div onClick={() => authApi.sendOtp(email)} style={{ cursor: 'pointer' }}>
                            Resend OTP
                        </div>
                        <button onClick={handleOtpVerification}>Verify OTP</button>
                    </div>
                );

            case 'reset-password':
                return (
                    <div>
                        <button onClick={handleGoogleOAuth}>Continue with Google</button>
                        <button onClick={handleGithubOAuth}>Continue with GitHub</button>
                        <p>OR</p>
                        <input
                            type="email"
                            value={email}
                            readOnly
                        />
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="New Password"
                        />
                        <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="Confirm Password"
                        />
                        <button onClick={handleChangePasswordAndLogin} disabled={password != '' && password !== confirmPassword}>
                            Reset Password
                        </button>
                        {password !== confirmPassword && confirmPassword !== '' && (
                            <div style={{ color: 'red' }}>Passwords do not match</div>
                        )}
                    </div>
                );
            case 'register':
                return(
                    <div>
                        <button onClick={handleGoogleOAuth}>Continue with Google</button>
                        <button onClick={handleGithubOAuth}>Continue with GitHub</button>
                        <p>OR</p>
                        <input
                            type="email"
                            value={email}
                            readOnly
                            onChange={(e) => {
                                if (e.target.value !== email) {
                                    setOtpMode(undefined);
                                    setAuthMode('verify-email');
                                }
                            }}
                        />
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="New Password"
                        />
                        <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="Confirm Password"
                        />
                        <button onClick={handleRegister} disabled={password != '' && password !== confirmPassword}>
                            Reset Password
                        </button>
                        {password !== confirmPassword && confirmPassword !== '' && (
                            <div style={{ color: 'red' }}>Passwords do not match</div>
                        )}
                    </div>
                );

        }
    }
    return (
        <div>
            {error && <div style={{ color: 'red' }}>{error}</div>}
            {renderContent()}
        </div>
    );
}

export default AuthPage;
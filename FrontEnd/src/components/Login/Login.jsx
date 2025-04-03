import React, { useState } from 'react';
import { FaEnvelope, FaLock } from 'react-icons/fa';
import { FcGoogle } from 'react-icons/fc';
import { BsFacebook, BsTwitter } from 'react-icons/bs';
import { Link, useNavigate } from 'react-router-dom';
import { useGoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import '../css/login.css';
import '../css/Loading.css';
import { BACKEND_URL_HTTP, BACKEND_URL_HTTPS } from '../config.js';
import imgHolder from '../img/login-holder.jpg';
import Swal from 'sweetalert2';

function Login() {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isEmailFocused, setIsEmailFocused] = useState(false);
    const [isPasswordFocused, setIsPasswordFocused] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const googleLogin = useGoogleLogin({
        onSuccess: async (tokenResponse) => {
            try {
                const userInfo = await axios.get(
                    'https://www.googleapis.com/oauth2/v3/userinfo',
                    { headers: { Authorization: `Bearer ${tokenResponse.access_token}` } }
                );

                const { email, name, picture } = userInfo.data;
                console.log(email, name, picture);
                
                // Handle Google login with backend
                setIsLoading(true);
                try {
                    const response = await axios.post(`http://${BACKEND_URL_HTTP}/api/UserServices/login-google`, {
                        email: email,
                        userName: name
                    });
                    
                    setIsLoading(false);
                    
                    if (response.status === 200) {
                        const { token, refreshToken, userId, userName, userRole } = response.data;
                        localStorage.setItem('token', token);
                        localStorage.setItem('refreshToken', refreshToken);
                        localStorage.setItem('userId', userId);
                        localStorage.setItem('userName', userName);
                        localStorage.setItem('userRole', userRole);
                        
                        Swal.fire({
                            title: 'Login successful!',
                            icon: 'success',
                            timer: 1500,
                            showConfirmButton: false
                        }).then(() => {
                            navigate('/');
                        });
                    }
                } catch (error) {
                    setIsLoading(false);
                    Swal.fire({
                        title: 'Login failed!',
                        text: error.response?.data?.message || 'An error occurred during login',
                        icon: 'error'
                    });
                }
            } catch (err) {
                console.log(err);
            }
        },
        onError: error => console.log('Login Failed:', error)
    });
    
    const loginHandler = async (e) => {
        e.preventDefault();
        
        if (email.length === 0 || password.length === 0) {
            Swal.fire({
                title: 'Please fill in all fields',
                icon: 'warning',
                confirmButtonColor: "#3085d6",
            });
            return;
        }

        if (!validateEmail(email)) {
            Swal.fire({
                title: 'Invalid email format',
                icon: 'warning',
                confirmButtonColor: "#3085d6",
            });
            return;
        }

        setIsLoading(true);
        
        try {
            const response = await axios.post(`http://${BACKEND_URL_HTTP}/api/UserServices/login`, {
                email: email,
                password: password
            });
            
            setIsLoading(false);
            
            if (response.status === 200) {
                const { token, refreshToken, userId, userName, userRole } = response.data;
                localStorage.setItem('token', token);
                localStorage.setItem('refreshToken', refreshToken);
                localStorage.setItem('userId', userId);
                localStorage.setItem('userName', userName);
                localStorage.setItem('userRole', userRole);
                
                Swal.fire({
                    title: 'Login successful!',
                    icon: 'success',
                    timer: 1500,
                    showConfirmButton: false
                }).then(() => {
                    navigate('/');
                });
            }
        } catch (error) {
            setIsLoading(false);
            
            if (error.response?.status === 400 && error.response?.data?.message === "Tài khoản của bạn chưa được xác minh") {
                Swal.fire({
                    title: 'Account not verified',
                    text: 'Please verify your account before logging in',
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonText: 'Verify now',
                    cancelButtonText: 'Later',
                    confirmButtonColor: "#3085d6",
                    cancelButtonColor: "#d33",
                }).then((result) => {
                    if (result.isConfirmed) {
                        localStorage.setItem('email', email);
                        navigate('/verify-account');
                    }
                });
            } else {
                Swal.fire({
                    title: 'Login failed!',
                    text: error.response?.data?.message || 'Invalid email or password',
                    icon: 'error',
                    confirmButtonColor: "#3085d6",
                });
            }
        }
    };

    return (
        <div className="background-image">
            <div className='overlay'>
                <div className='main-container content'>
                    {isLoading && (
                        <div className="loading-spinner">
                            <div className="spinner"></div>
                            <div className="loading-text">Đang xử lý...</div>
                        </div>
                    )}
                    <div className='img-container'>
                        <img src={imgHolder} alt='Login img holder'></img>
                    </div>
                    <div className="login-container">
                        <h2>Đăng nhập</h2>
                        <form onSubmit={loginHandler}>
                            <div className="form-inputs">
                                <div className={`form-group ${isEmailFocused ? 'focused' : ''}`}>
                                    <label>
                                        <FaEnvelope/>
                                    </label>
                                    <input
                                        type='text'
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        onFocus={() => setIsEmailFocused(true)}
                                        onBlur={() => setIsEmailFocused(false)}
                                        placeholder='Email'
                                    />
                                </div>
                                <div className={`form-group ${isPasswordFocused ? 'focused' : ''}`}>
                                    <label>
                                        <FaLock/>
                                    </label>
                                    <input
                                        type='password'
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        onFocus={() => setIsPasswordFocused(true)}
                                        onBlur={() => setIsPasswordFocused(false)}
                                        placeholder='Mật khẩu'
                                    />
                                </div>

                                <div className='forget-pass'>
                                    <Link to="/forgot-password">Quên mật khẩu?</Link>
                                </div>

                                <button className='login-btn' type='submit' disabled={isLoading}>
                                    ĐĂNG NHẬP
                                </button>
                            </div>

                            <div className="social-section">
                                <div className='break-line'>hoặc đăng nhập với</div>

                                <div className='icon-login'>
                                    <FcGoogle size={32} onClick={() => googleLogin()} style={{cursor: 'pointer', margin: '10px'}}/>
                                    <BsFacebook size={30} color="#1877F2" style={{cursor: 'pointer', margin: '10px'}}/>
                                    <BsTwitter size={30} color="#1DA1F2" style={{cursor: 'pointer', margin: '10px'}}/>
                                </div>

                                <p className='register-here'>Bạn chưa có tài khoản? <Link to="/register">Đăng ký ngay</Link></p>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;
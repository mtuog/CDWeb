import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { BACKEND_URL_HTTP } from '../config.js';

const Profile = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const { id } = useParams();

    useEffect(() => {
        // Kiểm tra đăng nhập từ localStorage
        const token = localStorage.getItem('token');
        const userId = localStorage.getItem('userId');
        
        console.log("Profile component - Token:", token);
        console.log("Profile component - UserId from localStorage:", userId);
        console.log("Profile component - UserId from params:", id);
        
        if (!token) {
            // Nếu không có token, chuyển về trang đăng nhập
            navigate('/login');
            return;
        }
        
        // Lấy thông tin user từ backend
        const fetchUserProfile = async () => {
            try {
                // Kiểm tra xem ID trong URL có trùng với ID đăng nhập không
                if (id !== userId) {
                    console.log("User ID mismatch - Accessing another user's profile");
                    // Tùy chọn: cho phép xem profile người khác hoặc redirect về profile của mình
                    // navigate(`/profile/${userId}`);
                    // return;
                }
                
                // Gọi API để lấy thông tin user
                const response = await axios.get(`http://${BACKEND_URL_HTTP}/api/UserServices/user/${id}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                
                console.log("API Response:", response.data);
                
                if (response.status === 200) {
                    setUser(response.data);
                    setLoading(false);
                }
            } catch (error) {
                console.error('Error fetching user profile:', error);
                setLoading(false);
                
                // Nếu token hết hạn hoặc không hợp lệ
                if (error.response?.status === 401) {
                    localStorage.removeItem('token');
                    localStorage.removeItem('refreshToken');
                    localStorage.removeItem('userId');
                    localStorage.removeItem('userName');
                    localStorage.removeItem('userRole');
                    navigate('/login');
                }
            }
        };
        
        fetchUserProfile();
    }, [id, navigate]);

    const handleLogout = () => {
        // Xóa thông tin đăng nhập
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('userId');
        localStorage.removeItem('userName');
        localStorage.removeItem('userRole');
        
        // Kích hoạt sự kiện cập nhật trạng thái đăng nhập
        window.dispatchEvent(new Event('auth-change'));
        
        // Chuyển hướng về trang chủ
        navigate('/');
    };

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Đang tải...</span>
                </div>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="container mt-5">
                <div className="alert alert-warning" role="alert">
                    Không tìm thấy thông tin người dùng. <a href="/login" className="alert-link">Đăng nhập</a> để tiếp tục.
                </div>
            </div>
        );
    }

    return (
        <div>
            <section className="vh-100" style={{ backgroundColor: '#f4f5f7' }}>
                <div className="container py-5 h-100">
                    <div className="row d-flex justify-content-center align-items-center h-100">
                        <div className="col col-lg-6 mb-4 mb-lg-0">
                            <div className="card mb-3" style={{ borderRadius: '.5rem' }}>
                                <div className="row g-0">
                                    <div className="col-md-4 gradient-custom text-center text-white"
                                        style={{ borderTopLeftRadius: '.5rem', borderBottomLeftRadius: '.5rem' }}>
                                            
                                            <img 
      src={
        user.gender === '1' 
          ? 'https://startbootstrap.github.io/startbootstrap-freelancer/assets/img/avataaars.svg'
          : user.gender === '2' 
          ? 'https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava1-bg.webp' 
          : 'https://storage.timviec365.vn/timviec365/pictures/images/lgbt-la-gi(2).jpg' 
      }
      alt="Avatar" 
      className="img-fluid my-5" 
      style={{ width: '80px' }} 
    />
                                        <h5 style={{ color: '#758694' }}>{user.username || user.userName}</h5>
                                        <a href="/changePassword"><button style={{ backgroundColor: '#FFD18E'}} className="button1"> Đổi Mật Khẩu </button></a> 
                                        <button style={{ backgroundColor: '#E9FF97'}} className="button1" onClick={handleLogout}> Đăng xuất </button>

                                    </div>
                                    
                                    <div className="col-md-8">
                                        <div className="card-body p-4">
                                            <h6>Thông Tin</h6>
                                            <hr className="mt-0 mb-4" />
                                            <div className="row pt-1">
                                                <div className="col-6 mb-3">
                                                    <h6>Email</h6>
                                                    <p className="text-muted">{user.email}</p>
                                                </div>
                                                <div className="col-6 mb-3">
                                                    <h6>Ngày Sinh</h6>
                                                    <p className="text-muted">{user.dob || user.dateOfBirth || 'Chưa cập nhật'}</p>
                                                </div>
                                                <div className="col-6 mb-3">
                                                    <h6>Địa Chỉ</h6>
                                                    <p className="text-muted">{user.address || 'Chưa cập nhật'}</p>
                                                </div>
                                                <div className="col-6 mb-3">
                                                    <h6>Giới Tính</h6>
                                                    <p className="text-muted">
                                                        {user.gender === '1' || user.gender === 1 ? 'Nam' : 
                                                         user.gender === '2' || user.gender === 2 ? 'Nữ' : 'Khác'}
                                                    </p>
                                                </div>
                                                <div className="col-6 mb-3">
                                                    <h6>Số Điện Thoại</h6>
                                                    <p className="text-muted">{user.phoneNumber || user.phone || 'Chưa cập nhật'}</p>
                                                </div>
                                                <div className="col-6 mb-3">
                                                    <h6>Vai trò</h6>
                                                    <p className="text-muted">{user.role || 'Người dùng'}</p>
                                                </div>
                                            </div>

                                            <div className="d-flex justify-content-start">
                                                <a href="#!"><i className="fab fa-facebook-f fa-lg me-3"></i></a>
                                                <a href="#!"><i className="fab fa-twitter fa-lg me-3"></i></a>
                                                <a href="#!"><i className="fab fa-instagram fa-lg"></i></a>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Profile;


import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const Profile = () => {
    const [loggedIn, setLoggedIn] = useState(false);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const { id } = useParams(); 
 
    useEffect(() => {
        fetch('/session')
            .then((response) => response.json())
            .then((data) => {
                if (data.loggedIn) {
                    fetch(`/user/${id}`)
                        .then((response) => response.json())
                        .then((userData) => {
                            setUser(userData);
                            setLoading(false);
                        })
                        .catch((error) => {
                            console.error('Error fetching user data:', error);
                            setLoading(false);
                            navigate('/login');
                        });
                } else {
                    navigate('/login');
                }
            })
            .catch((error) => {
                console.error('Error fetching session data:', error);
                navigate('/login');
            });
    }, [id, navigate]);

    const handleLogout = () => {
        fetch('/logout', {
            method: 'POST',
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.message === 'Đăng xuất thành công') {
                    setLoggedIn(false);
                    window.location.reload(); // Cách đơn giản để cập nhật giao diện
                }
            });
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!user) {
        return <div>User not found</div>;
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
                                        <h5 style={{ color: '#758694' }}>{user.username}</h5>
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
                                                    <p className="text-muted">{user.dob}</p>
                                                </div>
                                                <div className="col-6 mb-3">
                                                    <h6>Địa Chỉ</h6>
                                                    <p className="text-muted">{user.address}</p>
                                                </div>
                                                <div className="col-6 mb-3">
                                                    <h6>Giới Tính</h6>
                                                    {user.gender === '1' ? 'Nam' : user.gender === '2' ? 'Nữ' : 'Giới Tính Khác'}
                                                </div>
                                                <div className="col-6 mb-3">
                                                    <h6>Số Điện Thoại</h6>
                                                    <p className="text-muted">{user.phoneNumber}</p>
                                                </div>
                                            </div>
                                            {/* <h6>Projects</h6>
                                            <hr className="mt-0 mb-4" />
                                            <div className="row pt-1">
                                                <div className="col-6 mb-3">
                                                    <h6>Recent</h6>
                                                    <p className="text-muted">Lorem ipsum</p>
                                                </div>
                                                <div className="col-6 mb-3">
                                                    <h6>Most Viewed</h6>
                                                    <p className="text-muted">Dolor sit amet</p>
                                                </div>
                                            </div> */}

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

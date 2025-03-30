import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();
    const { id } = useParams();
    const [loggedIn, setLoggedIn] = useState(false);
    const [user, setUser] = useState(null);

    useEffect(() => {
      fetch('/session')
        .then((response) => response.json())
        .then((data) => {
          if (data.loggedIn) {
            setLoggedIn(true);
            setUser(data);
            navigate(`/profile/${data.userId}`);
          } else {
            setLoggedIn(false);
          }
        })
        .catch((error) => {
          console.error('Error fetching session data:', error);
        });
    }, [navigate]);
    const handleSubmit = (e) => {
      e.preventDefault();
      const loginDetails = {
        email: email,
        password: password,
      };

      fetch('/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(loginDetails),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.message === 'Đăng nhập thành công') {
            console.log(`User ID: ${data.user.id}`);
            setMessage(`Welcome, ${data.user.username}`);
            navigate(`/profile/${data.user.id}`);
            window.location.reload(); 

          } else {
            setMessage(data.message);
          }
        })
        .catch((error) => {
          console.error('Error:', error);
          setMessage('An error occurred. Please try again.');
        });
        setEmail('');
      setPassword('');
    };
  
    return (
      <div>
         <section className="vh-100" style={{ backgroundColor: '#9A616D' }}>
      <div className="container py-5 h-100">
        <div className="row d-flex justify-content-center align-items-center h-100">
          <div className="col col-xl-10">
            <div className="card" style={{ borderRadius: '1rem' }}>
              <div className="row g-0">
                <div className="col-md-6 col-lg-5 d-none d-md-block">
                  <img
                    src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/img1.webp"
                    alt="login form"
                    className="img-fluid"
                    style={{ borderRadius: '1rem 0 0 1rem' }}
                  />
                </div>
                <div className="col-md-6 col-lg-7 d-flex align-items-center">
                  <div className="card-body p-4 p-lg-5 text-black">
                    <form onSubmit={handleSubmit}>
                      <div className="d-flex align-items-center mb-3 pb-1">
                        <i className="fas fa-cubes fa-2x me-3" style={{ color: '#ff6219' }}></i>
                        <span className="h1 fw-bold mb-0">Logo</span>
                      </div>

                      <h5 className="fw-normal mb-3 pb-3" style={{ letterSpacing: '1px' }}>
                      Đăng nhập vào tài khoản của bạn      
                                      </h5>

                      <div className="form-outline mb-4">
                        <input type="email" id="form2Example17" className="form-control form-control-lg"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required/>
                        <label className="form-label" htmlFor="form2Example17">
                          Email
                        </label>
                      </div>

                      <div className="form-outline mb-4">
                        <input  type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required id="form2Example27" className="form-control form-control-lg" />
                        <label className="form-label" htmlFor="form2Example27">
                          Mật Khẩu
                        </label>
                      </div>

                      <div className="pt-1 mb-4">
                        <button className="btn btn-dark btn-lg btn-block" type="submit">
                          Đăng Nhập
                        </button>
                          <h2 style={{ color: 'red'}}>{message && <p style={{ color: 'red'}}>{message}</p>}</h2>      

                      </div>

                      <a className="small text-muted" href="#!">
                        Quên Mật Khẩu?
                      </a>
                      <p className="mb-5 pb-lg-2" style={{ color: '#393f81' }}>
                        
Bạn chưa có tài khoản?{' '}
                        <a href="/register" style={{ color: '#393f81' }}>
                          Đăng Ký Ngay
                        </a>
                      </p>
                      <a href="#!" className="small text-muted">
                      Điều khoản sử dụng.
                      </a>
                      <a href="#!" className="small text-muted">
                      Chính sách bảo mật                      </a>
                    </form>
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
  

export default Login;
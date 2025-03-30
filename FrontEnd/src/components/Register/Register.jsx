import React, { useState } from 'react';
const Register = () => {
  const [username, setUsername] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [dob, setDob] = useState(''); 
  const [gender, setGender] = useState(''); 
  const [address, setAddress] = useState(''); 
  const [message, setMessage] = useState('');
  const validatePhoneNumber = (phoneNumber) => {
    const re = /^\d{10,11}$/; 
    return re.test(String(phoneNumber));
};
const validatePassword = (password) => {
  const re = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/;
  return re.test(password);
};    
  const handleSubmit = (e) => {
    e.preventDefault();
  if (!validatePhoneNumber(phoneNumber)) {
      setMessage('Số điện thoại không hợp lệ');
      return;
  }
  if (!validatePassword(password)) {
    setMessage('Mật khẩu phải dài 8-20 ký tự, bao gồm ít nhất một chữ hoa, một chữ thường, một số và một ký tự đặc biệt.');
    return;
}


    const newUser = {
      username,
      email,
      password,
      dob,
      gender,
      address,
      phoneNumber,
    };

    setMessage('Đăng ký thành công');
    fetch('/save-user', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newUser),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log('Success:', data);
      })
      .catch((error) => {
        console.error('Error:', error);
      });
    setUsername('');
    setEmail('');
    setPassword('');
  };
    return (
        <div>
       <div className="container1">
          	<div className="wrapper1">
			<div className="image-holder1">
				<img src="assets/images/registration-form-8.jpg" alt=""/>
			</div>
			<div className="form-inner1">
				<form onSubmit={handleSubmit}>
					<div className="form-header1">
						<h3>Đăng Ký</h3>
						<img src="assets/images/sign-up.png" alt="" className="sign-up-icon"/>
            
					</div>
          <h4 className="text-center"> {message} </h4>

					<div className="form-group1">
						<label for="">Họ Và Tên:</label>
						<input type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required className="form-control1" data-validation="length alphanumeric" data-validation-length="3-12"/>
					</div>
					<div className="form-group1">
						<label for="">E-mail:</label>
						<input  type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required className="form-control1" data-validation="email"/>
					</div>
          <div className="form-group1">
                                <label htmlFor="">Số Điện Thoại:</label>
                                <input
                                    type="tel"
                                    value={phoneNumber}
                                    onChange={(e) => setPhoneNumber(e.target.value)}
                                    required
                                    className="form-control1"
                                    pattern="^\d{10,11}$"
                                    title="Số điện thoại phải dài 10-11 chữ số."
                                />
                            </div>
                            <div className="form-group1">
                                <label htmlFor="">Mật Khẩu:</label>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    className="form-control1"
                                    data-validation="length"
                                    data-validation-length="min8"
                                />
                                <span className="form-text small text-dark">
                                Mật khẩu phải dài 8-20 ký tự, bao gồm ít nhất một chữ hoa, một chữ thường, một số và một ký tự đặc biệt.                                </span>
                            </div>
          <div className="form-group1">
            <label>Ngày Sinh:</label>
            <input
              type="date"
              value={dob}
              onChange={(e) => setDob(e.target.value)}
              required
              className="form-control1"
            />
          </div>
          <div className="form-group1">
            <label>Giới Tính:</label>
            <select
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              required
              className="form-control1"
            >
              <option className='p' value="">Chọn giới tính</option>
              <option className='p'  value="1">Nam</option>
              <option className='p'  value="2">Nữ</option>
              <option className='p'  value="3">Giới Tính Khác</option>
            </select>
            <div className="form-group1">
            <label>Địa Chỉ:</label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
              className="form-control1"
            />
          </div>
					</div>
					<button className="button1" type="submit">Tạo Tài Khoản Mới</button>
					<div className="socials">
						<p>Đăng ký với các nền tảng xã hội</p>
						<a href="" className="socials-icon">
							<i className="zmdi zmdi-facebook"></i>
						</a>
						<a href="" className="socials-icon">
							<i className="zmdi zmdi-instagram"></i>
						</a>
						<a href="" className="socials-icon">
							<i className="zmdi zmdi-twitter"></i>
						</a>
						<a href="" className="socials-icon">
							<i className="zmdi zmdi-tumblr"></i>
						</a>
					</div>
				</form>
			</div>
			
		</div>
    </div>
        </div>
    );
};

export default Register;
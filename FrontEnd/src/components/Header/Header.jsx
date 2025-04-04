import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { clearCartLocalStorage } from "../../store/Actions";

const Header = () => {
	const [loggedIn, setLoggedIn] = useState(false);
	const [username, setUsername] = useState('');
	const [id, setId] = useState('');
	const [searchTerm, setSearchTerm] = useState('');
	const [userDropdownOpen, setUserDropdownOpen] = useState(false);

	const navigate = useNavigate();
	const dispatch = useDispatch();
	const cart = useSelector(state => state.cart);

	useEffect(() => {
		// Thay thế fetch('/session') bằng kiểm tra localStorage
		const checkLoginStatus = () => {
			const token = localStorage.getItem('token');
			const userName = localStorage.getItem('userName');
			const userId = localStorage.getItem('userId');
			
			console.log("Login check - UserId:", userId);
			
			if (token && userName) {
				setLoggedIn(true);
				setUsername(userName);
				setId(userId);
			} else {
				setLoggedIn(false);
				setUsername('');
				setId('');
			}
		};

		// Kiểm tra khi component mount
		checkLoginStatus();

		// Kiểm tra mỗi khi có thay đổi trong localStorage
		window.addEventListener('storage', checkLoginStatus);

		// Kiểm tra mỗi khi user quay lại tab
		window.addEventListener('focus', checkLoginStatus);

		// Cleanup listeners
		return () => {
			window.removeEventListener('storage', checkLoginStatus);
			window.removeEventListener('focus', checkLoginStatus);
		};
	}, []);

	// Tạo event để components khác có thể thông báo đăng nhập/đăng xuất
	useEffect(() => {
		// Tạo custom event để cập nhật header khi đăng nhập/đăng xuất
		const handleAuthChange = () => {
			const token = localStorage.getItem('token');
			const userName = localStorage.getItem('userName');
			const userId = localStorage.getItem('userId');
			
			if (token && userName) {
				setLoggedIn(true);
				setUsername(userName);
				setId(userId);
			} else {
				setLoggedIn(false);
				setUsername('');
				setId('');
			}
		};

		window.addEventListener('auth-change', handleAuthChange);
		
		return () => {
			window.removeEventListener('auth-change', handleAuthChange);
		};
	}, []);

	const handleLogout = () => {
		// Xóa dữ liệu người dùng khỏi localStorage
		localStorage.removeItem('token');
		localStorage.removeItem('refreshToken');
		localStorage.removeItem('userId');
		localStorage.removeItem('userName');
		localStorage.removeItem('userRole');
		
		// Cập nhật state
		setLoggedIn(false);
		setUsername('');
		setId('');
		setUserDropdownOpen(false);
		
		// Trigger event để cập nhật header
		window.dispatchEvent(new Event('auth-change'));
		
		// Chuyển hướng về trang chủ
		navigate('/');
	};

	const toggleUserDropdown = () => {
		setUserDropdownOpen(!userDropdownOpen);
	};

	const handleClearCart = () => {
		dispatch(clearCartLocalStorage());
		localStorage.removeItem('cart');
	};

	const handleSearchChange = (event) => {
		setSearchTerm(event.target.value);
	};

	const handleSearchSubmit = (event) => {
		if (event.key === 'Enter') {
			navigate(`/search?query=${searchTerm}`);
		}
	};

	const handleSearchButtonClick = () => {
		navigate(`/search?query=${searchTerm}`);
	};

	return (
		<header className="header-v4">
			<div className="container-menu-desktop">
				<div className="top-bar">
					<div className="content-topbar flex-sb-m h-full container">
						<div className="left-top-bar">
						Miễn phí vận chuyển cho đơn hàng tiêu chuẩn trên $100
						</div>
						<div className="right-top-bar flex-w h-full">
							<a href="/home" className="flex-c-m trans-04 p-lr-25">
								Trợ giúp và câu hỏi thường gặp
							</a>
							<a href={loggedIn ? `/profile/${id}` : '/login'} className="flex-c-m trans-04 p-lr-25">
								{username ? <span>{username}</span> : <span>Tài Khoản Của Tôi</span>}
							</a>
			
							<a href="/home" className="flex-c-m trans-04 p-lr-25">
								EN
							</a>
							<a href="/home" className="flex-c-m trans-04 p-lr-25">
								VNĐ
							</a>
						</div>
					</div>
				</div>
				<div className="wrap-menu-desktop how-shadow1">
					<nav className="limiter-menu-desktop container">
						<a href="/home" className="logo">
							<img src={`${process.env.PUBLIC_URL}/assets/images/icons/logo-01.png`} alt="IMG-LOGO" />
						</a>
						<div className="menu-desktop">
							<ul className="main-menu">
								<li><a href="/home">Trang chủ</a></li>
								<li className="active-menu"><a href="/product">
								Cửa hàng</a></li>
								<li className="label1" data-label1="hot"><a href="/shoppingCart">Giỏ hàng</a></li>
								<li><a href="/aboutUs">Giới Thiệu</a></li>
								<li><a href="/contact">Liên Hệ</a></li>
								<div className="dropdown">
									<button type="button" className="btn btn-secondary dropdown-toggle" data-toggle="dropdown">
										Tính năng đặc biệt
									</button>
									<div className="dropdown-menu">
										<a className="dropdown-item" href="/camera">Chụp Hình</a>
										<a className="dropdown-item" href="video">Quay Phim</a>
									</div>
								</div>
							</ul>
						</div>
						<div className="wrap-icon-header flex-w flex-r-m">
							<div className="icon-header-item cl2 hov-cl1 trans-04 p-l-22 p-r-11 icon-header-noti js-show-cart" data-notify={cart.length}>
								<a href="/shoppingCart"><i className="zmdi zmdi-shopping-cart"></i></a>
							</div>
							<a href="#" className="icon-header-item cl2 hov-cl1 trans-04 p-l-22 p-r-11 icon-header-noti" data-notify="0">
								<i className="zmdi zmdi-favorite-outline"></i>
							</a>
							<div style={{ display: 'flex', alignItems: 'center', marginLeft: '20px' }}>
								<i className="zmdi zmdi-search" style={{ color: 'red' }} onClick={handleSearchButtonClick}></i>
								<input
									style={{ border: 'none', outline: 'none', paddingLeft: '10px' }}
									type="text"
									name="search-product"
									placeholder="Tìm kiếm"
									value={searchTerm}
									onChange={handleSearchChange}
									onKeyDown={handleSearchSubmit}
									aria-label="Search products"
								/>
							</div>
							<div className="user-dropdown-container" style={{ position: 'relative', marginLeft: '15px' }}>
								<div 
									className="icon-header-item cl2 hov-cl1 trans-04 p-l-22 p-r-11" 
									onClick={toggleUserDropdown}
									style={{ cursor: 'pointer' }}
								>
									<i className="zmdi zmdi-account"></i>
									{loggedIn && (
										<span style={{ 
											fontSize: '12px',
											backgroundColor: '#4CAF50',
											color: 'white',
											borderRadius: '50%',
											width: '8px',
											height: '8px',
											position: 'absolute',
											top: '0',
											right: '5px'
										}}></span>
									)}
								</div>
								{userDropdownOpen && (
									<div className="user-dropdown-menu" style={{
										position: 'absolute',
										top: '40px',
										right: '0',
										backgroundColor: 'white',
										boxShadow: '0 0 10px rgba(0,0,0,0.1)',
										borderRadius: '5px',
										padding: '5px 0',
										zIndex: 1000,
										minWidth: '150px'
									}}>
										{loggedIn ? (
											<>
												<div style={{
													padding: '8px 15px',
													borderBottom: '1px solid #eee',
													fontWeight: 'bold',
													color: '#333',
													fontSize: '14px'
												}}>
													Xin chào, {username}
												</div>
												<div 
													style={{
														display: 'block',
														padding: '8px 15px',
														color: '#333',
														textDecoration: 'none',
														fontSize: '14px',
														cursor: 'pointer'
													}}
													onClick={() => {
														setUserDropdownOpen(false);
														console.log("Navigating to profile with ID:", id);
														if (id) {
															navigate(`/profile/${id}`);
														} else {
															// Thử lấy lại ID từ localStorage nếu biến state không có
															const userId = localStorage.getItem('userId');
															console.log("Fetched userId from localStorage:", userId);
															if (userId) {
																navigate(`/profile/${userId}`);
															} else {
																navigate('/login');
															}
														}
													}}
												>
													<i className="zmdi zmdi-account mr-2"></i> Hồ sơ
												</div>
												<div 
													style={{
														display: 'block',
														padding: '8px 15px',
														color: '#333',
														textDecoration: 'none',
														fontSize: '14px',
														cursor: 'pointer'
													}}
													onClick={(e) => {
														e.preventDefault();
														handleLogout();
													}}
												>
													<i className="zmdi zmdi-power mr-2"></i> Đăng xuất
												</div>
											</>
										) : (
											<>
												<div 
													style={{
														display: 'block',
														padding: '8px 15px',
														color: '#333',
														textDecoration: 'none',
														fontSize: '14px',
														cursor: 'pointer'
													}}
													onClick={() => {
														setUserDropdownOpen(false);
														navigate('/login');
													}}
												>
													<i className="zmdi zmdi-account-circle mr-2"></i> Đăng nhập
												</div>
												<div 
													style={{
														display: 'block',
														padding: '8px 15px',
														color: '#333',
														textDecoration: 'none',
														fontSize: '14px',
														cursor: 'pointer'
													}}
													onClick={() => {
														setUserDropdownOpen(false);
														navigate('/register');
													}}
												>
													<i className="zmdi zmdi-account-add mr-2"></i> Đăng ký
												</div>
											</>
										)}
									</div>
								)}
							</div>
						</div>
					</nav>
				</div>
			</div>
			<div className="wrap-header-mobile">
				<div className="logo-mobile">
					<a href="/home"><img src={`${process.env.PUBLIC_URL}/assets/images/icons/logo-01.png`} alt="IMG-LOGO" /></a>
				</div>
				<div className="wrap-icon-header flex-w flex-r-m m-r-15">
					<button className="icon-header-item cl2 hov-cl1 trans-04 p-r-11 js-show-modal-search" aria-label="Search">
						<i className="zmdi zmdi-search" onClick={handleSearchButtonClick}></i>
					</button>
					<div className="icon-header-item cl2 hov-cl1 trans-04 p-r-11 p-l-10 icon-header-noti js-show-cart" data-notify={cart.length}>
						<i className="zmdi zmdi-shopping-cart"></i>
					</div>
					<a href="#" className="icon-header-item cl2 hov-cl1 trans-04 p-l-22 p-r-11 icon-header-noti" data-notify="0">
						<i className="zmdi zmdi-favorite-outline"></i>
					</a>
					<div 
						className="icon-header-item cl2 hov-cl1 trans-04 p-l-22 p-r-11" 
						onClick={toggleUserDropdown}
					>
						<i className="zmdi zmdi-account"></i>
					</div>
				</div>
				<button className="btn-show-menu-mobile hamburger hamburger--squeeze" aria-label="Menu">
                    <span className="hamburger-box">
                        <span className="hamburger-inner"></span>
                    </span>
				</button>
			</div>
			<div className="menu-mobile">
				<ul className="topbar-mobile">
					<li>
						<div className="left-top-bar">
						Miễn phí vận chuyển cho tiêu chuẩn đơn hàng trên $100						</div>
					</li>
					<li>
						<div className="right-top-bar flex-w h-full">
							<a href="/home" className="flex-c-m p-lr-10 trans-04">Help & FAQs</a>
							<a href={loggedIn ? `/profile/${id}` : '/login'} className="flex-c-m p-lr-10 trans-04">
								{username ? <span>{username}</span> : <span>Tài Khoản Của Tôi</span>}
							</a>
						
							<a href="/home" className="flex-c-m p-lr-10 trans-04">EN</a>
							<a href="/home" className="flex-c-m p-lr-10 trans-04">VNĐ</a>
						</div>
					</li>
				</ul>
				<ul className="main-menu-m">
					<li><a href="/home">Trang Chủ</a></li>
					<li><a href="/product">
					Cửa hàng</a></li>
					<li><a href="/shoppingCart" className="label1 rs1" data-label1="hot">Giỏ hàng</a></li>
					<li><a href="/aboutUs">Giới Thiệu</a></li>
					<li><a href="/contact">Liên Hệ</a></li>
					{userDropdownOpen && (
						<>
							{loggedIn ? (
								<>
									<li><div 
										style={{cursor: 'pointer', padding: '10px 20px'}}
										onClick={() => {
											setUserDropdownOpen(false);
											console.log("Navigating to profile with ID:", id);
											if (id) {
												navigate(`/profile/${id}`);
											} else {
												// Thử lấy lại ID từ localStorage nếu biến state không có
												const userId = localStorage.getItem('userId');
												console.log("Fetched userId from localStorage:", userId);
												if (userId) {
													navigate(`/profile/${userId}`);
												} else {
													navigate('/login');
												}
											}
										}}>
										<i className="zmdi zmdi-account mr-2"></i> Hồ sơ
									</div></li>
									<li><div 
										style={{cursor: 'pointer', padding: '10px 20px'}}
										onClick={(e) => {
											e.preventDefault();
											handleLogout();
										}}>
										<i className="zmdi zmdi-power mr-2"></i> Đăng xuất
									</div></li>
								</>
							) : (
								<>
									<li><div 
										style={{cursor: 'pointer', padding: '10px 20px'}}
										onClick={() => {
											setUserDropdownOpen(false);
											navigate('/login');
										}}>
										<i className="zmdi zmdi-account-circle mr-2"></i> Đăng nhập
									</div></li>
									<li><div 
										style={{cursor: 'pointer', padding: '10px 20px'}}
										onClick={() => {
											setUserDropdownOpen(false);
											navigate('/register');
										}}>
										<i className="zmdi zmdi-account-add mr-2"></i> Đăng ký
									</div></li>
								</>
							)}
						</>
					)}
				</ul>
			</div>
			{userDropdownOpen && (
				<div 
					style={{
						position: 'fixed',
						top: 0,
						left: 0,
						right: 0,
						bottom: 0,
						zIndex: 99
					}}
					onClick={toggleUserDropdown}
				/>
			)}
		</header>
	);
};

export default Header;

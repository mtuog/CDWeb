import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { clearCartLocalStorage } from "../../store/Actions";

const Header = () => {
	const [loggedIn, setLoggedIn] = useState(false);
	const [username, setUsername] = useState('');
	const [id, setId] = useState('');
	const [searchTerm, setSearchTerm] = useState('');

	const navigate = useNavigate();
	const dispatch = useDispatch();
	const cart = useSelector(state => state.cart);

	useEffect(() => {
		fetch('/session')
			.then((response) => response.json())
			.then((data) => {
				if (data.loggedIn) {
					setLoggedIn(true);
					setUsername(data.username);
					setId(data.userId);
				}
			});
	}, []);

	const handleLogout = async () => {
		const response = await fetch('/logout', { method: 'POST' });
		const data = await response.json();
		if (data.message === 'Logout successful') {
			setLoggedIn(false);
			setUsername('');
		}
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
								<div class="dropdown">
    <button type="button" class="btn btn-secondary dropdown-toggle" data-toggle="dropdown">
      Tính năng đặc biệt
    </button>
    <div class="dropdown-menu">
      <a class="dropdown-item" href="/camera">Chụp Hình</a>
      <a class="dropdown-item" href="video">Quay Phim</a>
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
					<li><a href="/contact">
Liên Hệ
</a></li>

				</ul>
			</div>
		</header>
	);
};

export default Header;

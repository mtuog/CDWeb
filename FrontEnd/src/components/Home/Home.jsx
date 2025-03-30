import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Slider from 'react-slick';
import { products } from '../../data/ProductDataFE'; // Adjust the path as necessary
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import './Home.css'; // Ensure you have a CSS file for additional styles

const Home = () => {
	const slideImages = [
		'assets/images/img.png',
		'assets/images/img_1.png',
	];

	const navigate = useNavigate();

	// Filter best-seller products
	const bestSellerProducts = products.filter(product => product.bestSeller);

	// Filter new products
	const newProducts = products.filter(product => product.newProduct);

	// Filter favorite products
	const favoriteProducts = products.filter(product => product.favorite);

	const settings = {
		dots: true,
		infinite: true,
		speed: 500,
		slidesToShow: 4,
		slidesToScroll: 1,
		draggable: true, // Enable dragging with the mouse
		autoplay: true, // Enable autoplay
		autoplaySpeed: 2000, // Autoplay speed in milliseconds
		responsive: [
			{
				breakpoint: 1024,
				settings: {
					slidesToShow: 2,
					slidesToScroll: 1,
					infinite: true,
					dots: true,
					autoplay: true, // Ensure autoplay is enabled on all breakpoints
					autoplaySpeed: 3000,
				}
			},
			{
				breakpoint: 600,
				settings: {
					slidesToShow: 1,
					slidesToScroll: 1,
					autoplay: true, // Ensure autoplay is enabled on all breakpoints
					autoplaySpeed: 3000,
				}
			}
		],
		nextArrow: <SampleNextArrow />,
		prevArrow: <SamplePrevArrow />
	};

	function SampleNextArrow(props) {
		const { className, style, onClick } = props;
		return (
			<div
				className={className}
				style={{ ...style, display: "block", right: "-25px" }}
				onClick={onClick}
			/>
		);
	}

	function SamplePrevArrow(props) {
		const { className, style, onClick } = props;
		return (
			<div
				className={className}
				style={{ ...style, display: "block", left: "-25px", zIndex: 1 }}
				onClick={onClick}
			/>
		);
	}

	const handleShopNowClick = (id) => {
		window.scrollTo(0, 0);
		navigate(`/product/${id}`);
	};

	return (
		<div>
			<section className="section-slide">
				<div className="wrap-slick1">
					<div className="slick1">
						{slideImages.map((image, index) => (
							<div className="item-slick1" style={{ backgroundImage: `url(${image})` }} key={index}>
								<div className="container h-full">
									<div className="flex-col-l-m h-full p-t-100 p-b-30 respon5">
										<div className="layer-slick1 animated visible-false" data-appear="fadeInDown" data-delay="0">
											<span className="ltext-101 cl2 respon2">Bộ sưu tập 2024</span>
										</div>
										<div className="layer-slick1 animated visible-false" data-appear="fadeInUp" data-delay="800">
											<h2 className="ltext-201 cl2 p-t-19 p-b-43 respon1">Thiết Kế Mới</h2>
										</div>
										<div className="layer-slick1 animated visible-false" data-appear="zoomIn" data-delay="1600">
											<Link to="/product" className="flex-c-m stext-101 cl0 size-101 bg1 bor1 hov-btn1 p-lr-15 trans-04">
												Vào Cửa Hàng Ngay
											</Link>
										</div>
									</div>
								</div>
							</div>
						))}
					</div>
				</div>
			</section>

			<section className="bg0 p-t-23 p-b-140">
				<div className="container">
					<div className="p-b-10">
						<h3 className="ltext-103 cl5">BÁN CHẠY NHẤT
						</h3>
					</div>
					<Slider {...settings}>
						{bestSellerProducts.map((product) => (
							<div key={product.id} className="wrap-pic-w product-item">
								<div className="block1">
									<img src={product.img} alt={product.name} />
									<button
										onClick={() => handleShopNowClick(product.id)}
										className="block1-txt ab-t-l s-full flex-col-l-sb p-lr-38 p-tb-34 trans-03 respon3"
									>
										<div className="block1-txt-child1 flex-col-l">
											<span className="block1-info stext-102 trans-04">Xu hướng mới</span>
										</div>
										<div className="block1-txt-child2 p-b-4 trans-05">
											<div className="block1-link stext-101 cl0 trans-09">Vào cửa hàng ngay</div>
										</div>
									</button>
								</div>
							</div>
						))}
					</Slider>
				</div>
			</section>

			<section className="bg0 p-t-23 p-b-140">
				<div className="container">
					<div className="p-b-10">
						<h3 className="ltext-103 cl5">Sản phẩm mới</h3>
					</div>
					<Slider {...settings}>
						{newProducts.map((product) => (
							<div key={product.id} className="wrap-pic-w product-item">
								<div className="block1">
									<img src={product.img} alt={product.name} />
									<button
										onClick={() => handleShopNowClick(product.id)}
										className="block1-txt ab-t-l s-full flex-col-l-sb p-lr-38 p-tb-34 trans-03 respon3"
									>
										<div className="block1-txt-child1 flex-col-l">
											<span className="block1-info stext-102 trans-04">Hàng mới về</span>
										</div>
										<div className="block1-txt-child2 p-b-4 trans-05">
											<div className="block1-link stext-101 cl0 trans-09">Vào cửa hàng ngay</div>
										</div>
									</button>
								</div>
							</div>
						))}
					</Slider>
				</div>
			</section>

			<section className="bg0 p-t-23 p-b-140">
				<div className="container">
					<div className="p-b-10">
						<h3 className="ltext-103 cl5">SẢN PHẨM YÊU THÍCH
						</h3>
					</div>
					<Slider {...settings}>
						{favoriteProducts.map((product) => (
							<div key={product.id} className="wrap-pic-w product-item">
								<div className="block1">
									<img src={product.img} alt={product.name} />
									<button
										onClick={() => handleShopNowClick(product.id)}
										className="block1-txt ab-t-l s-full flex-col-l-sb p-lr-38 p-tb-34 trans-03 respon3"
									>
										<div className="block1-txt-child1 flex-col-l">
											<span className="block1-info stext-102 trans-04">Top Favorite</span>
										</div>
										<div className="block1-txt-child2 p-b-4 trans-05">
											<div className="block1-link stext-101 cl0 trans-09">Shop Now</div>
										</div>
									</button>
								</div>
							</div>
						))}
					</Slider>
				</div>
			</section>
		</div>
	);
};

export default Home;

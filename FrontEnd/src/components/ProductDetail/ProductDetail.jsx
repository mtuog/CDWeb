// src/components/ProductDetail.js
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '../../store/Actions';
import { findProductSizesById, findProductColorsById } from '../../sizeColorHelpers';
import { getProductById } from '../../api/productApi';
import Swal from 'sweetalert2';

const ProductDetail = () => {
	const { id } = useParams();
	const [product, setProduct] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const dispatch = useDispatch();
	const cart = useSelector(state => state.cart);
	const [quantity, setQuantity] = useState(1);
	const [selectedSize, setSelectedSize] = useState('');
	const [selectedColor, setSelectedColor] = useState('');
	const [showZoom, setShowZoom] = useState(false);
	
	// Fetch product details from API
	useEffect(() => {
		const fetchProductDetails = async () => {
			try {
				setLoading(true);
				const data = await getProductById(parseInt(id));
				setProduct(data);
				setLoading(false);
			} catch (error) {
				setError("Không thể tải thông tin sản phẩm. Vui lòng thử lại sau.");
				setLoading(false);
				console.error("Error fetching product details:", error);
			}
		};

		fetchProductDetails();
	}, [id]);
	
	// Get available sizes and colors for this product
	const availableSizes = findProductSizesById(parseInt(id));
	const availableColors = findProductColorsById(parseInt(id));

	// Toggle zoom image modal and control header visibility
	const toggleZoom = () => {
		const newZoomState = !showZoom;
		setShowZoom(newZoomState);
		
		// Get the header element and toggle its visibility
		const header = document.querySelector('header');
		if (header) {
			if (newZoomState) {
				// Hide header when zoom is shown
				header.style.display = 'none';
				// Also lock body scrolling
				document.body.style.overflow = 'hidden';
			} else {
				// Show header when zoom is closed
				header.style.display = '';
				// Restore body scrolling
				document.body.style.overflow = '';
			}
		}
	};

	// Close modal when clicking outside image
	const handleCloseZoom = (e) => {
		if (e.target.classList.contains('zoom-modal')) {
			toggleZoom(); // Use toggleZoom to ensure header visibility is also toggled
		}
	};

	// Close modal with ESC key
	useEffect(() => {
		const handleEsc = (e) => {
			if (e.keyCode === 27 && showZoom) {
				toggleZoom(); // Use toggleZoom to ensure header visibility is also toggled
			}
		};
		window.addEventListener('keydown', handleEsc);
		
		// Cleanup function
		return () => {
			window.removeEventListener('keydown', handleEsc);
			// Ensure header is visible when component unmounts if it was hidden
			if (showZoom) {
				const header = document.querySelector('header');
				if (header) {
					header.style.display = '';
				}
				document.body.style.overflow = '';
			}
		};
	}, [showZoom]);

	const handleAddToCart = () => {
		if (!selectedSize) {
			Swal.fire({
				icon: 'warning',
				title: 'Chọn kích thước',
				text: 'Vui lòng chọn kích thước phù hợp',
				confirmButtonColor: '#e65540'
			});
			return;
		}
		
		if (!selectedColor) {
			Swal.fire({
				icon: 'warning',
				title: 'Chọn màu sắc',
				text: 'Vui lòng chọn màu sắc phù hợp',
				confirmButtonColor: '#e65540'
			});
			return;
		}
		
		const existingProduct = cart.find(item => item.id === product.id);

		dispatch(addToCart({ 
			id: product.id, 
			quantity: quantity,
			size: selectedSize,
			color: selectedColor
		}));
		
		// Hiển thị thông báo thành công kèm animation
		Swal.fire({
			title: 'Đã thêm vào giỏ hàng',
			text: `${product.name} (${selectedSize}, ${selectedColor})`,
			icon: 'success',
			showConfirmButton: true,
			confirmButtonText: 'Xem giỏ hàng',
			confirmButtonColor: '#e65540',
			showCancelButton: true,
			cancelButtonText: 'Tiếp tục mua sắm',
			cancelButtonColor: '#717fe0',
			timer: 3000,
			timerProgressBar: true,
			position: 'center',
			showClass: {
				popup: 'animate__animated animate__fadeInDown'
			},
			hideClass: {
				popup: 'animate__animated animate__fadeOutUp'
			},
			didOpen: (toast) => {
				// Thêm hiệu ứng nhấp nháy vào icon giỏ hàng
				const cartIcon = document.querySelector('.icon-header-item.cl2.hov-cl1.trans-04.p-l-22.p-r-11.icon-header-noti');
				if (cartIcon) {
					cartIcon.classList.add('shake');
					setTimeout(() => {
						cartIcon.classList.remove('shake');
					}, 1000);
				}
			}
		}).then((result) => {
			if (result.isConfirmed) {
				window.location.href = '/shoppingCart';
			}
		});
		
		setQuantity(1); // Reset quantity after adding to cart
	};

	// Show loading state
	if (loading) {
		return <div className="container text-center p-t-80 p-b-80">Loading product details...</div>;
	}

	// Show error state
	if (error) {
		return <div className="container text-center p-t-80 p-b-80">{error}</div>;
	}

	// Show "product not found" state
	if (!product) {
		return <div className="container text-center p-t-80 p-b-80">Product not found</div>;
	}

	return (
		<div>
			<section className="sec-product-detail bg0 p-t-65 p-b-60">
				<div className="container">
					<div className="row">
						<div className="col-md-6 col-lg-7 p-b-30">
							<div className="p-l-25 p-r-30 p-lr-0-lg">
								<div className="wrap-pic-w pos-relative">
									<img 
										src={product.img} 
										alt={product.name} 
										style={{ 
											height: '600px', 
											width: '100%', 
											objectFit: 'contain',
											cursor: 'pointer' 
										}} 
										onClick={toggleZoom}
									/>
									<a 
										className="flex-c-m size-108 how-pos1 bor0 fs-16 cl10 bg0 hov-btn3 trans-04" 
										onClick={toggleZoom}
										style={{ cursor: 'pointer' }}
									>
										<i className="fa fa-expand"></i>
									</a>
								</div>
							</div>
						</div>

						<div className="col-md-6 col-lg-5 p-b-30">
							<div className="p-r-50 p-t-5 p-lr-0-lg">
								<h4 className="mtext-105 cl2 js-name-detail p-b-14">
									{product.name}
								</h4>
								<span className="mtext-106 cl2">
                                    {product.price.toLocaleString()} VND
                                </span>
								<p className="stext-102 cl3 p-t-23">
									{product.des}
								</p>
								<div className="p-t-33">
									{/* Category */}
									<div className="flex-w flex-r-m p-b-10">
										<div className="size-203 flex-c-m respon6">
											Danh mục
										</div>
										<div className="size-204 respon6-next">
											<div className="rs1-select2 bor8 bg0">
												<div className="category-display">
													{typeof product.category === 'object' ? product.category.name : product.category || 'Uncategorized'}
												</div>
											</div>
										</div>
									</div>

									{/* Size Selection */}
									<div className="flex-w flex-r-m p-b-10">
										<div className="size-203 flex-c-m respon6">
											Kích thước
										</div>
										<div className="size-204 respon6-next">
											<div className="rs1-select2 bor8 bg0">
												<select 
													className="form-control" 
													value={selectedSize} 
													onChange={(e) => setSelectedSize(e.target.value)}
												>
													<option value="">Chọn kích thước</option>
													{availableSizes.map((size, index) => (
														<option key={index} value={size}>{size}</option>
													))}
												</select>
											</div>
										</div>
									</div>

									{/* Color Selection */}
									<div className="flex-w flex-r-m p-b-10">
										<div className="size-203 flex-c-m respon6">
											Màu sắc
										</div>
										<div className="size-204 respon6-next">
											<div className="rs1-select2 bor8 bg0">
												<select 
													className="form-control" 
													value={selectedColor} 
													onChange={(e) => setSelectedColor(e.target.value)}
												>
													<option value="">Chọn màu sắc</option>
													{availableColors.map((color, index) => (
														<option key={index} value={color}>{color}</option>
													))}
												</select>
											</div>
										</div>
									</div>

									{/* Quantity */}
									<div className="flex-w flex-r-m p-b-10">
										<div className="size-203 flex-c-m respon6">
											Số lượng
										</div>
										<div className="size-204 flex-w flex-m respon6-next">
											<div className="wrap-num-product flex-w m-r-20 m-tb-10">
												<div 
													className="btn-num-product-down cl8 hov-btn3 trans-04 flex-c-m"
													onClick={() => setQuantity(Math.max(1, quantity - 1))}
												>
													<i className="fs-16 zmdi zmdi-minus"></i>
												</div>

												<input 
													className="mtext-104 cl3 txt-center num-product" 
													type="number" 
													name="num-product" 
													value={quantity}
													onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
												/>

												<div 
													className="btn-num-product-up cl8 hov-btn3 trans-04 flex-c-m"
													onClick={() => setQuantity(quantity + 1)}
												>
													<i className="fs-16 zmdi zmdi-plus"></i>
												</div>
											</div>

											<button 
												className="flex-c-m stext-101 cl0 size-101 bg1 bor1 hov-btn1 p-lr-15 trans-04 js-addcart-detail"
												onClick={handleAddToCart}
											>
												Thêm vào giỏ hàng
											</button>
										</div>
									</div>
								</div>
								<div className="flex-w flex-m p-l-100 p-t-40 respon7">
									<div className="flex-m bor9 p-r-10 m-r-11">
										<a href="#" className="fs-14 cl3 hov-cl1 trans-04 lh-10 p-lr-5 p-tb-2 js-addwish-detail tooltip100" data-tooltip="Add to Wishlist">
											<i className="zmdi zmdi-favorite"></i>
										</a>
									</div>
									<a href="#" className="fs-14 cl3 hov-cl1 trans-04 lh-10 p-lr-5 p-tb-2 m-r-8 tooltip100" data-tooltip="Facebook">
										<i className="fa fa-facebook"></i>
									</a>
									<a href="#" className="fs-14 cl3 hov-cl1 trans-04 lh-10 p-lr-5 p-tb-2 m-r-8 tooltip100" data-tooltip="Twitter">
										<i className="fa fa-twitter"></i>
									</a>
									<a href="#" className="fs-14 cl3 hov-cl1 trans-04 lh-10 p-lr-5 p-tb-2 m-r-8 tooltip100" data-tooltip="Google Plus">
										<i className="fa fa-google-plus"></i>
									</a>
								</div>
							</div>
						</div>
					</div>

					<div className="bg6 flex-c-m flex-w size-302 m-t-73 p-tb-15">
                        <span className="stext-107 cl6 p-lr-25">
                            Categories: {typeof product.category === 'object' ? product.category.name : product.category || 'Uncategorized'}
                        </span>
					</div>
				</div>
			</section>

			{/* Zoom Image Modal */}
			{showZoom && (
				<div 
					className="zoom-modal" 
					onClick={handleCloseZoom}
					style={{
						position: 'fixed',
						top: 0,
						left: 0,
						width: '100%',
						height: '100%',
						backgroundColor: 'rgba(0,0,0,0.9)',
						zIndex: 1050,
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center'
					}}
				>
					<div style={{ position: 'relative', maxWidth: '90%', maxHeight: '90%' }}>
						<img 
							src={product.img} 
							alt={product.name} 
							style={{
								maxWidth: '100%',
								maxHeight: '90vh',
								objectFit: 'contain'
							}}
						/>
						<button 
							onClick={toggleZoom} 
							style={{
								position: 'absolute',
								top: '-40px',
								right: '-40px',
								background: 'transparent',
								border: 'none',
								color: '#fff',
								fontSize: '30px',
								cursor: 'pointer'
							}}
						>
							×
						</button>
					</div>
				</div>
			)}
		</div>
	);
};

export default ProductDetail;

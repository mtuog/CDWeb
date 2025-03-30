// src/components/ProductDetail.js
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '../../store/Actions';
import { products } from '../../data/ProductDataFE';
import { findProductSizesById, findProductColorsById } from '../../sizeColorHelpers';

const ProductDetail = () => {
	const { id } = useParams();
	const product = products.find(p => p.id === parseInt(id));
	const dispatch = useDispatch();
	const cart = useSelector(state => state.cart);
	const [quantity, setQuantity] = useState(1);
	const [selectedSize, setSelectedSize] = useState('');
	const [selectedColor, setSelectedColor] = useState('');
	
	// Get available sizes and colors for this product
	const availableSizes = findProductSizesById(parseInt(id));
	const availableColors = findProductColorsById(parseInt(id));

	const handleAddToCart = () => {
		if (!selectedSize) {
			alert('Vui lòng chọn kích thước');
			return;
		}
		
		if (!selectedColor) {
			alert('Vui lòng chọn màu sắc');
			return;
		}
		
		const existingProduct = cart.find(item => item.id === product.id);

		dispatch(addToCart({ 
			id: product.id, 
			quantity: quantity,
			size: selectedSize,
			color: selectedColor
		}));
		
		// Show success message
		alert('Đã thêm sản phẩm vào giỏ hàng');
		
		setQuantity(1); // Reset quantity after adding to cart
	};

	return (
		<div>
			<section className="sec-product-detail bg0 p-t-65 p-b-60">
				<div className="container">
					<div className="row">
						<div className="col-md-6 col-lg-7 p-b-30">
							<div className="p-l-25 p-r-30 p-lr-0-lg">
								<div className="wrap-pic-w pos-relative">
									<img src={process.env.PUBLIC_URL + product.img} alt="IMG-PRODUCT" />
									<a className="flex-c-m size-108 how-pos1 bor0 fs-16 cl10 bg0 hov-btn3 trans-04" href={process.env.PUBLIC_URL + product.img}>
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
									
									<div className="flex-w flex-r-m p-b-10">
										<div className="size-204 flex-w flex-m respon6-next">
											<div className="wrap-num-product flex-w m-r-20 m-tb-10">
												<div className="btn-num-product-down cl8 hov-btn3 trans-04 flex-c-m" onClick={() => setQuantity(Math.max(1, quantity - 1))}>
													<i className="fs-16 zmdi zmdi-minus"></i>
												</div>
												<input className="mtext-104 cl3 txt-center num-product" type="number" name="num-product" value={quantity} readOnly />
												<div className="btn-num-product-up cl8 hov-btn3 trans-04 flex-c-m" onClick={() => setQuantity(quantity + 1)}>
													<i className="fs-16 zmdi zmdi-plus"></i>
												</div>
											</div>
											<button className="flex-c-m stext-101 cl0 size-101 bg1 bor1 hov-btn1 p-lr-15 trans-04 js-addcart-detail" onClick={handleAddToCart}>
												Thêm giỏ hàng
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
                            Categories: {product.category}
                        </span>
					</div>
				</div>
			</section>
		</div>
	);
};

export default ProductDetail;

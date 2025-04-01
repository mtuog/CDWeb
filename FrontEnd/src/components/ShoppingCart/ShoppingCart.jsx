import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { updateQuantity, removeFromCart, loadCart } from '../../store/Actions';
import { getProductById } from '../../api/productApi';

export async function loadcart() {
	const cart = JSON.parse(localStorage.getItem('cart')) ?? [];
	return cart;
}

const ShoppingCart = () => {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const cart = useSelector((state) => state.cart);
	const [productDetails, setProductDetails] = useState({});
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		dispatch(loadCart());
	}, [dispatch]);

	useEffect(() => {
		const fetchProductDetails = async () => {
			try {
				setLoading(true);
				const detailsPromises = cart.map(item => 
					getProductById(item.id).then(product => ({
						id: item.id,
						name: product.name,
						img: product.img,
						price: product.price
					}))
				);
				
				const details = await Promise.all(detailsPromises);
				const detailsObject = details.reduce((acc, product) => {
					acc[product.id] = product;
					return acc;
				}, {});
				
				setProductDetails(detailsObject);
				setLoading(false);
			} catch (error) {
				setError("Không thể tải thông tin sản phẩm. Vui lòng thử lại sau.");
				setLoading(false);
				console.error("Error fetching product details:", error);
			}
		};

		if (cart.length > 0) {
			fetchProductDetails();
		} else {
			setLoading(false);
		}
	}, [cart]);

	const handleIncreaseQuantity = (id) => {
		const item = cart.find(item => item.id === id);
		if (item) {
			dispatch(updateQuantity(id, item.quantity + 1));
		}
	};

	const handleDecreaseQuantity = (id) => {
		const item = cart.find(item => item.id === id);
		if (item && item.quantity > 1) {
			dispatch(updateQuantity(id, item.quantity - 1));
		}
	};

	const handleRemoveItem = (id) => {
		dispatch(removeFromCart(id));
	};

	const calculateSubtotal = () => {
		return cart.reduce((total, item) => {
			const product = productDetails[item.id];
			return total + (product ? product.price * item.quantity : 0);
		}, 0);
	};

	const handleCheckout = () => {
		navigate('/payment');
	};

	// Show loading state
	if (loading) {
		return <div className="container text-center p-t-80 p-b-80">Loading cart items...</div>;
	}

	// Show error state
	if (error) {
		return <div className="container text-center p-t-80 p-b-80">{error}</div>;
	}

	return (
		<div className="container p-t-100 p-b-85">
			{cart.length === 0 ? (
				<div className="text-center p-t-50 p-b-50">
					<h2>Your cart is empty</h2>
					<p className="p-t-20">You have no items in your shopping cart.</p>
					<Link to="/product" className="flex-c-m stext-101 cl0 size-107 bg1 bor2 hov-btn1 p-lr-15 trans-04 m-tb-10 m-lr-auto" style={{ width: "200px", marginTop: "20px" }}>
						Continue Shopping
					</Link>
				</div>
			) : (
				<div className="row">
					<div className="col-lg-10 col-xl-7 m-lr-auto m-b-50">
						<div className="m-l-25 m-r--38 m-lr-0-xl">
							<div className="wrap-table-shopping-cart">
								<table className="table-shopping-cart">
									<tr className="table_head">
										<th className="column-1">Sản phẩm</th>
										<th className="column-2"></th>
										<th className="column-3">Giá</th>
										<th className="column-4">Số lượng</th>
										<th className="column-5">Tổng</th>
										<th className="column-6"></th>
									</tr>
									{cart.map(item => {
										const product = productDetails[item.id];
										if (!product) return null;
										
										return (
											<tr className="table_row" key={item.id}>
												<td className="column-1">
													<div className="how-itemcart1">
														<img src={product.img} alt={product.name} />
													</div>
												</td>
												<td className="column-2">
													<div>
														<Link to={`/product/${item.id}`} className="product-name">{product.name}</Link>
														{item.size && <div className="product-size">Size: {item.size}</div>}
														{item.color && <div className="product-color">Màu: {item.color}</div>}
													</div>
												</td>
												<td className="column-3">
													{product.price.toLocaleString()} VND
												</td>
												<td className="column-4">
													<div className="wrap-num-product flex-w">
														<div 
															className="btn-num-product-down cl8 hov-btn3 trans-04 flex-c-m"
															onClick={() => handleDecreaseQuantity(item.id)}
														>
															<i className="fs-16 zmdi zmdi-minus"></i>
														</div>

														<input className="mtext-104 cl3 txt-center num-product" type="number" name="num-product" value={item.quantity} readOnly />

														<div 
															className="btn-num-product-up cl8 hov-btn3 trans-04 flex-c-m"
															onClick={() => handleIncreaseQuantity(item.id)}
														>
															<i className="fs-16 zmdi zmdi-plus"></i>
														</div>
													</div>
												</td>
												<td className="column-5">
													{(product.price * item.quantity).toLocaleString()} VND
												</td>
												<td className="column-6">
													<button 
														className="remove-item-btn"
														onClick={() => handleRemoveItem(item.id)}
													>
														<i className="zmdi zmdi-close"></i>
													</button>
												</td>
											</tr>
										);
									})}
								</table>
							</div>

							<div className="flex-w flex-sb-m bor15 p-t-18 p-b-15 p-lr-40 p-lr-15-sm">
								<div className="flex-w flex-m m-r-20 m-tb-5">
									<input className="stext-104 cl2 plh4 size-117 bor13 p-lr-20 m-r-10 m-tb-5" type="text" name="coupon" placeholder="Coupon Code" />
									<div className="flex-c-m stext-101 cl2 size-118 bg8 bor13 hov-btn3 p-lr-15 trans-04 pointer m-tb-5">
										Apply coupon
									</div>
								</div>
							</div>
						</div>
					</div>

					<div className="col-sm-10 col-lg-7 col-xl-5 m-lr-auto m-b-50">
						<div className="bor10 p-lr-40 p-t-30 p-b-40 m-l-63 m-r-40 m-lr-0-xl p-lr-15-sm">
							<h4 className="mtext-109 cl2 p-b-30">
								Tổng Giỏ Hàng
							</h4>

							<div className="flex-w flex-t bor12 p-b-13">
								<div className="size-208">
									<span className="stext-110 cl2">
										Tổng phụ:
									</span>
								</div>

								<div className="size-209">
									<span className="mtext-110 cl2">
										{calculateSubtotal().toLocaleString()} VND
									</span>
								</div>
							</div>

							<div className="flex-w flex-t bor12 p-t-15 p-b-30">
								<div className="size-208 w-full-ssm">
									<span className="stext-110 cl2">
										Vận chuyển:
									</span>
								</div>

								<div className="size-209 p-r-18 p-r-0-sm w-full-ssm">
									<p className="stext-111 cl6 p-t-2">
										Đơn hàng sẽ được giao đến địa chỉ của bạn.
									</p>
									
									<div className="p-t-15">
										<span className="stext-112 cl8">
											Tính Phí Vận Chuyển
										</span>

										<div className="rs1-select2 rs2-select2 bor8 bg0 m-b-12 m-t-9">
											<select className="form-select" name="shipping">
												<option>Chọn quốc gia...</option>
												<option>Việt Nam</option>
											</select>
										</div>
										
										<div className="bor8 bg0 m-b-12">
											<input className="stext-111 cl8 plh3 size-111 p-lr-15" type="text" name="city" placeholder="Thành phố/Tỉnh" />
										</div>

										<div className="bor8 bg0 m-b-22">
											<input className="stext-111 cl8 plh3 size-111 p-lr-15" type="text" name="postcode" placeholder="Mã bưu điện / ZIP" />
										</div>
									</div>
								</div>
							</div>

							<div className="flex-w flex-t p-t-27 p-b-33">
								<div className="size-208">
									<span className="mtext-101 cl2">
										Tổng:
									</span>
								</div>

								<div className="size-209 p-t-1">
									<span className="mtext-110 cl2">
										{calculateSubtotal().toLocaleString()} VND
									</span>
								</div>
							</div>

							<button 
								className="flex-c-m stext-101 cl0 size-116 bg3 bor14 hov-btn3 p-lr-15 trans-04 pointer"
								onClick={handleCheckout}
							>
								Tiến Hành Thanh Toán
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
};

export default ShoppingCart;
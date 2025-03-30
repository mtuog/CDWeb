import React, {useEffect, useState} from 'react';
import Select from 'react-select';
import {loadCart, removeFromCart, updateQuantity} from "../../store/Actions";
import {useDispatch, useSelector} from "react-redux";
import {findProductImgById, findProductNameById, findProductPriceById, products} from "../../data/ProductDataFE";

export async function loadcart() {
	const cart = JSON.parse(localStorage.getItem('cart')) ?? [];
	return cart;
}

const ShoppingCart = () => {
	const [quantity, setQuantity] = useState(1);
	const dispatch = useDispatch();
	// xóa sản phẩm khỏi giỏ hàng
	const handleRemoveFromCart = (productId) => {
		dispatch(removeFromCart(productId));
	};
	useEffect(() => {
		dispatch(loadCart());
	}, [dispatch]);

	const cart = useSelector((state) => state.cart);


	const [selectedOption, setSelectedOption] = useState(null);

	const handleChange = (selectedOption) => {
		setSelectedOption(selectedOption);
	};
	const handleQuantityChange = (productId, newQuantity) => {
		dispatch(updateQuantity(productId, newQuantity));
	};
	const options = [
		{value: 'USA', label: 'USA'},
		{value: 'UK', label: 'UK'}
	];
	return (
		<div>
			<div class="wrap-header-cart js-panel-cart">
				<div class="s-full js-hide-cart"></div>

				<div class="header-cart flex-col-l p-l-65 p-r-25">
					<div class="header-cart-title flex-w flex-sb-m p-b-8">
				<span class="mtext-103 cl2">
					Your Cart
				</span>

						<div class="fs-35 lh-10 cl2 p-lr-5 pointer hov-cl1 trans-04 js-hide-cart">
							<i class="zmdi zmdi-close"></i>
						</div>
					</div>

					<div class="header-cart-content flex-w js-pscroll">
						<ul class="header-cart-wrapitem w-full">
							<li class="header-cart-item flex-w flex-t m-b-12">
								<div class="header-cart-item-img">
									<img src="assets/images/item-cart-01.jpg" alt="IMG"/>
								</div>

								<div class="header-cart-item-txt p-t-8">
									<a href="#" class="header-cart-item-name m-b-18 hov-cl1 trans-04">
										White Shirt Pleat
									</a>

									<span class="header-cart-item-info">
								1 x $19.00
							</span>
								</div>
							</li>

							<li class="header-cart-item flex-w flex-t m-b-12">
								<div class="header-cart-item-img">
									<img src="assets/images/item-cart-02.jpg" alt="IMG"/>
								</div>

								<div class="header-cart-item-txt p-t-8">
									<a href="#" class="header-cart-item-name m-b-18 hov-cl1 trans-04">
										Converse All Star
									</a>

									<span class="header-cart-item-info">
								1 x $39.00
							</span>
								</div>
							</li>

							<li class="header-cart-item flex-w flex-t m-b-12">
								<div class="header-cart-item-img">
									<img src="assets/images/item-cart-03.jpg" alt="IMG"/>
								</div>

								<div class="header-cart-item-txt p-t-8">
									<a href="#" class="header-cart-item-name m-b-18 hov-cl1 trans-04">
										Nixon Porter Leather
									</a>

									<span class="header-cart-item-info">
								1 x $17.00
							</span>
								</div>
							</li>
						</ul>

						<div class="w-full">
							<div class="header-cart-total w-full p-tb-40">
								Total: $75.00
							</div>

							<div class="header-cart-buttons flex-w w-full">
								<a href="shoping-cart.html"
								   class="flex-c-m stext-101 cl0 size-107 bg3 bor2 hov-btn3 p-lr-15 trans-04 m-r-8 m-b-10">
									View Cart
								</a>

								<a href="shoping-cart.html"
								   class="flex-c-m stext-101 cl0 size-107 bg3 bor2 hov-btn3 p-lr-15 trans-04 m-b-10">
									Check Out
								</a>
							</div>
						</div>
					</div>
				</div>
			</div>


			<div class="container">
				<div class="bread-crumb flex-w p-l-25 p-r-15 p-t-30 p-lr-0-lg">
					<a href="index.html" class="stext-109 cl8 hov-cl1 trans-04">
						Trang Chủ
						<i class="fa fa-angle-right m-l-9 m-r-10" aria-hidden="true"></i>
					</a>

					<span class="stext-109 cl4">
				Giỏ Hàng
			</span>
				</div>
			</div>


			<form class="bg0 p-t-75 p-b-85">
				<div class="container">
					<div class="row">
						<div class="col-lg-12 col-xl-10 m-lr-auto m-b-50">
							<div class="m-l-25 m-r--38 m-lr-0-xl">
								<div class="wrap-table-shopping-cart">
									<table class="table-shopping-cart">
										<tr class="table_head">
											<th className="column-1">Sản phẩm</th>
											<th className="column-2"></th>
											<th className="column-3">Kích thước</th>
											<th className="column-3">Màu sắc</th>
											<th className="column-3">Giá</th>
											<th className="column-4">Số Lượng</th>
											<th className="column-5">Tổng Tiền</th>
											<th className="column-5">Hành Động</th>
										</tr>

										{cart.map((product) => (
											<tr key={product.id} className="table_row">
												<td className="column-1">
													<div className="how-itemcart1">
														<img
															src={process.env.PUBLIC_URL + findProductImgById(product.id)}
															alt={product.name}/>
													</div>
												</td>
												<td className="column-2">{findProductNameById(product.id)}</td>
												<td className="column-3">{product.size || 'N/A'}</td>
												<td className="column-3">{product.color || 'N/A'}</td>
												<td className="column-3">{findProductPriceById(product.id).toLocaleString()} VNĐ</td>
												<td className="column-4">
													<div className="wrap-num-product flex-w m-l-auto m-r-0">
														<div
															className="btn-num-product-down cl8 hov-btn3 trans-04 flex-c-m"
															onClick={() => handleQuantityChange(product.id, Math.max(1, product.quantity - 1))}>
															<i className="fs-16 zmdi zmdi-minus"></i>
														</div>
														<input className="mtext-104 cl3 txt-center num-product"
															   type="number"
															   name="num-product" value={product.quantity} readOnly/>
														<div
															className="btn-num-product-up cl8 hov-btn3 trans-04 flex-c-m"
															onClick={() => handleQuantityChange(product.id, Math.max(1, product.quantity + 1))}>
															<i className="fs-16 zmdi zmdi-plus"></i>
														</div>
													</div>
												</td>

												<td className="column-5">{(findProductPriceById(product.id) * product.quantity).toLocaleString()} VNĐ</td>
												<td>
													<button onClick={() => handleRemoveFromCart(product.id)}
															type="submit"
															className="btn btn-primary">Xóa
													</button>
												</td>

											</tr>
										))}


									</table>
								</div>

								<div class="flex-w flex-sb-m bor15 p-t-18 p-b-15 p-lr-40 p-lr-15-sm">
									<div class="flex-w flex-m m-r-20 m-tb-5">
										<input class="stext-104 cl2 plh4 size-117 bor13 p-lr-20 m-r-10 m-tb-5"
											   type="text"
											   name="coupon" placeholder="Mã giảm giá"/>

										<div
											class="flex-c-m stext-101 cl2 size-118 bg8 bor13 hov-btn3 p-lr-15 trans-04 pointer m-tb-5">
											Áp dụng giảm giá
										</div>
									</div>

									<div
										class="flex-c-m stext-101 cl2 size-119 bg8 bor13 hov-btn3 p-lr-15 trans-04 pointer m-tb-10">
										<a href='/payment'>Thanh Toán</a>
									</div>
								</div>
							</div>
						</div>

					</div>
				</div>
			</form>


			<div class="btn-back-to-top" id="myBtn">
		<span class="symbol-btn-back-to-top">
			<i class="zmdi zmdi-chevron-up"></i>
		</span>
			</div>

		</div>
	);
};

export default ShoppingCart;
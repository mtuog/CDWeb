import React, {useEffect, useState} from 'react';
import Select from 'react-select';
import {loadCart, removeFromCart, updateQuantity} from "../../store/Actions";
import {useDispatch, useSelector} from "react-redux";
import {findProductImgById, findProductNameById, findProductPriceById, products} from "../../data/ProductDataFE";
import {Link} from "react-router-dom";
export async function loadcart() {
    const cart = JSON.parse(localStorage.getItem('cart')) ?? [];
    return cart;
}
const Payment = () => {

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
    const totalPrice = cart.reduce((total, item) => {
        const price = findProductPriceById(item.id);
        return total + price * item.quantity;
    }, 0);

    const [selectedOption, setSelectedOption] = useState(null);

    const handleChange = (selectedOption) => {
        setSelectedOption(selectedOption);
    };
    const handleQuantityChange = (productId, newQuantity) => {
        dispatch(updateQuantity(productId, newQuantity));
    };
    const options = [
        { value: 'USA', label: 'USA' },
        { value: 'UK', label: 'UK' }
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
                                <a href="shoping-cart.html" class="flex-c-m stext-101 cl0 size-107 bg3 bor2 hov-btn3 p-lr-15 trans-04 m-r-8 m-b-10">
                                    View Cart
                                </a>

                                <a href="shoping-cart.html" class="flex-c-m stext-101 cl0 size-107 bg3 bor2 hov-btn3 p-lr-15 trans-04 m-b-10">
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
                        Home
                        <i class="fa fa-angle-right m-l-9 m-r-10" aria-hidden="true"></i>
                    </a>

                    <span class="stext-109 cl4">
				Payment
			</span>
                </div>
            </div>


            <form class="bg0 p-t-75 p-b-85">
                <div class="container">
                    <div class="row">
                        <div class="col-lg-10 col-xl-7 m-lr-auto m-b-50">
                            <div className="m-l-25 m-r--38 m-lr-0-xl">
                                <div className="wrap-table-shopping-cart">
                                    <table class="table-shopping-cart">
                                        <tr class="table_head">
                                            <th className="column-1">Product</th>
                                            <th className="column-2">Name</th>
                                            <th></th>
                                            <th className="column-3">Price</th>
                                            <th className="column-4">Quantity</th>
                                            <th className="column-5">Total</th>
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
                                                <td></td>
                                                <td className="column-3">{findProductPriceById(product.id).toLocaleString()} VNĐ</td>
                                                <td className="column-4">
                                                    {product.quantity}
                                                </td>
                                                <td className="column-5">{(findProductPriceById(product.id) * product.quantity).toLocaleString()} VND</td>
                                            </tr>
                                        ))}


                                    </table>
                                </div>
                                <div className="flex-w flex-sb-m bor15 p-t-18 p-b-15 p-lr-40 p-lr-15-sm">
                                    <div className="flex-w flex-m m-r-20 m-tb-5">
                                        <input className="stext-104 cl2 plh4 size-117 bor13 p-lr-20 m-r-10 m-tb-5"
                                               type="text"
                                               name="coupon" placeholder="Coupon Code"/>

                                        <div
                                            className="flex-c-m stext-101 cl2 size-118 bg8 bor13 hov-btn3 p-lr-15 trans-04 pointer m-tb-5">
                                            Apply coupon
                                        </div>
                                    </div>

                                </div>

                            </div>
                        </div>

                        <div class="col-sm-10 col-lg-7 col-xl-5 m-lr-auto m-b-50">
                            <div class="bor10 p-lr-40 p-t-30 p-b-40 m-l-63 m-r-40 m-lr-0-xl p-lr-15-sm">
                                <h4 class="mtext-109 cl2 p-b-30">
                                    Cart Totals
                                </h4>

                                <div class="flex-w flex-t bor12 p-b-13">
                                    <div class="size-208">
								<span class="stext-110 cl2">
									Subtotal:
								</span>
                                    </div>

                                    <div class="size-209">
								<span class="mtext-110 cl2">{totalPrice.toLocaleString()} VNĐ
								</span>
                                    </div>
                                </div>

                                <div class="flex-w flex-t bor12 p-t-15 p-b-30">
                                    <div class="size-208 w-full-ssm">
								<span class="stext-110 cl2">
									Shipping:
								</span>
                                    </div>

                                    <div class="size-209 p-r-18 p-r-0-sm w-full-ssm">
                                        <p class="stext-111 cl6 p-t-2">
                                        Không có phương thức vận chuyển nào khả dụng. Vui lòng kiểm tra lại địa chỉ của bạn hoặc liên hệ với chúng tôi nếu bạn cần trợ giúp.

</p>

                                        <div class="p-t-15">
									<span class="stext-112 cl8">
                                    TÍNH TOÁN VẬN CHUYỂN
									</span>

                                            <div className="rs1-select2 rs2-select2 bor8 bg0 m-b-12 m-t-9">
                                                <Select
                                                    value={selectedOption}
                                                    onChange={handleChange}
                                                    options={options}
                                                    placeholder="Chọn quốc gia..."
                                                    classNamePrefix="react-select"
                                                />
                                                <div className="dropDownSelect2"></div>
                                            </div>

                                            <div class="bor8 bg0 m-b-12">
                                                <input class="stext-111 cl8 plh3 size-111 p-lr-15" type="text" name="state" placeholder="Thành Phố /  Quốc gia"/>
                                            </div>

                                            <div class="bor8 bg0 m-b-22">
                                                <input class="stext-111 cl8 plh3 size-111 p-lr-15" type="text" name="postcode" placeholder="Mã Bưu /Mã Zip"/>
                                            </div>

                                            <div class="flex-w">
                                                <div class="flex-c-m stext-101 cl2 size-115 bg8 bor13 hov-btn3 p-lr-15 trans-04 pointer">
                                                    Cập nhập tổng giá
                                                </div>
                                            </div>

                                        </div>
                                    </div>
                                </div>

                                <div class="flex-w flex-t p-t-27 p-b-33">
                                    <div class="size-208">
								<span class="mtext-101 cl2">
									Tổng cộng:
								</span>
                                    </div>

                                    <div class="size-209 p-t-1">
								<span class="mtext-110 cl2">
									{totalPrice.toLocaleString()} VNĐ
								</span>
                                    </div>
                                </div>

                                <Link to={'/product'}>
                                    <button className="flex-c-m stext-101 cl0 size-116 bg3 bor14 hov-btn3 p-lr-15 trans-04 pointer">
                                        Tiến hành thanh toán
                                    </button>
                                </Link>
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

export default Payment;
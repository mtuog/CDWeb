import React, {useEffect, useState} from 'react';
import Select from 'react-select';
import {loadCart, removeFromCart, updateQuantity, clearCart} from "../../store/Actions";
import {useDispatch, useSelector} from "react-redux";
import {Link, useNavigate} from "react-router-dom";
import {getProductById} from '../../api/productApi';
import axios from 'axios';
import { BACKEND_URL_HTTP } from '../../config';
import Swal from 'sweetalert2';

export async function loadcart() {
    const cart = JSON.parse(localStorage.getItem('cart')) ?? [];
    return cart;
}

const Payment = () => {
    const cartItems = useSelector(state => state.cart);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [productDetails, setProductDetails] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Customer information
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        zipCode: '',
        paymentMethod: 'cod'
    });

    // Payment methods
    const paymentMethods = [
        { id: 'cod', name: 'Thanh toán khi nhận hàng' },
        { id: 'bank', name: 'Chuyển khoản ngân hàng' },
        { id: 'credit', name: 'Thẻ tín dụng / Thẻ ghi nợ' }
    ];

    useEffect(() => {
        const fetchProductDetails = async () => {
            try {
                setLoading(true);
                const detailsPromises = cartItems.map(item => 
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

        if (cartItems.length > 0) {
            fetchProductDetails();
        } else {
            setLoading(false);
        }
    }, [cartItems]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handlePaymentMethodChange = (e) => {
        setFormData({
            ...formData,
            paymentMethod: e.target.value
        });
    };

    const calculateSubtotal = () => {
        return cartItems.reduce((total, item) => {
            const product = productDetails[item.id];
            return total + (product ? product.price * item.quantity : 0);
        }, 0);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Validate form
        if (!formData.firstName || !formData.lastName || !formData.email || !formData.phone || !formData.address || !formData.city) {
            Swal.fire({
                title: 'Thiếu thông tin',
                text: 'Vui lòng điền đầy đủ thông tin thanh toán',
                icon: 'warning',
                confirmButtonColor: '#e65540'
            });
            return;
        }

        try {
            setLoading(true);
            
            // Lấy thông tin người dùng từ localStorage
            const userId = localStorage.getItem('userId');
            const token = localStorage.getItem('token');
            
            // Chuẩn bị thông tin đơn hàng
            const orderItems = cartItems.map(item => {
                const product = productDetails[item.id];
                return {
                    product: { id: item.id },
                    quantity: item.quantity,
                    price: product.price,
                    size: item.size || "Standard",
                    color: item.color || "Default"
                };
            });
            
            const totalAmount = calculateSubtotal();
            
            // Tạo đối tượng đơn hàng
            const orderData = {
                user: userId ? { id: userId } : null,
                totalAmount: totalAmount,
                status: "PENDING",
                shippingAddress: `${formData.address}, ${formData.city}${formData.zipCode ? ', ' + formData.zipCode : ''}`,
                phone: formData.phone,
                paymentMethod: formData.paymentMethod,
                orderItems: orderItems
            };
            
            console.log('Sending order data:', orderData);
            
            // Gửi đơn hàng đến API
            const response = await axios.post(`http://${BACKEND_URL_HTTP}/api/orders`, orderData, {
                headers: {
                    'Content-Type': 'application/json',
                    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
                }
            });
            
            console.log('Order created:', response.data);
            
            if (response.status === 201) {
                // Clear cart after successful order
                dispatch(clearCart());
                
                // Hiển thị thông báo thành công
                Swal.fire({
                    title: 'Đặt hàng thành công!',
                    text: 'Cảm ơn bạn đã mua hàng. Đơn hàng của bạn đang được xử lý.',
                    icon: 'success',
                    confirmButtonColor: '#e65540'
                }).then(() => {
                    // Chuyển hướng về trang chủ
                    navigate('/');
                });
            } else {
                throw new Error('Lỗi khi tạo đơn hàng');
            }
            
        } catch (error) {
            console.error('Order submission error:', error);
            
            Swal.fire({
                title: 'Lỗi đặt hàng',
                text: error.response?.data?.message || 'Đã xảy ra lỗi khi xử lý đơn hàng. Vui lòng thử lại sau.',
                icon: 'error',
                confirmButtonColor: '#e65540'
            });
        } finally {
            setLoading(false);
        }
    };

    // Show loading state
    if (loading) {
        return <div className="container text-center p-t-80 p-b-80">Loading payment information...</div>;
    }

    // Show error state
    if (error) {
        return <div className="container text-center p-t-80 p-b-80">{error}</div>;
    }

    // Redirect to products page if cart is empty
    if (cartItems.length === 0) {
        return (
            <div className="container text-center p-t-80 p-b-80">
                <h2>Giỏ hàng của bạn đang trống</h2>
                <p className="p-t-20">Vui lòng thêm sản phẩm vào giỏ hàng trước khi thanh toán.</p>
                <button 
                    className="flex-c-m stext-101 cl0 size-116 bg3 bor14 hov-btn3 p-lr-15 trans-04 pointer m-t-20"
                    onClick={() => navigate('/product')}
                >
                    Đến trang sản phẩm
                </button>
            </div>
        );
    }

    return (
        <div className="container p-t-100 p-b-85">
            <div className="bread-crumb flex-w p-l-25 p-r-15 p-t-30 p-lr-0-lg">
                <a href="/" className="stext-109 cl8 hov-cl1 trans-04">
                    Trang Chủ
                    <i className="fa fa-angle-right m-l-9 m-r-10" aria-hidden="true"></i>
                </a>
                <a href="/cart" className="stext-109 cl8 hov-cl1 trans-04">
                    Giỏ Hàng
                    <i className="fa fa-angle-right m-l-9 m-r-10" aria-hidden="true"></i>
                </a>
                <span className="stext-109 cl4">
                    Thanh Toán
                </span>
            </div>

            <div className="row p-t-30">
                <div className="col-md-7 p-b-30">
                    <div className="payment-form p-lr-40 p-t-30 p-b-40 m-l-0-xl p-lr-15-sm">
                        <h4 className="mtext-109 cl2 p-b-30">
                            Thông Tin Thanh Toán
                        </h4>
                        <form onSubmit={handleSubmit}>
                            <div className="row">
                                <div className="col-md-6 p-b-20">
                                    <label className="stext-102 cl3 m-b-5">Họ *</label>
                                    <input 
                                        className="stext-111 cl8 plh3 size-111 p-lr-15 bor8" 
                                        type="text" 
                                        name="lastName" 
                                        value={formData.lastName}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div className="col-md-6 p-b-20">
                                    <label className="stext-102 cl3 m-b-5">Tên *</label>
                                    <input 
                                        className="stext-111 cl8 plh3 size-111 p-lr-15 bor8" 
                                        type="text" 
                                        name="firstName" 
                                        value={formData.firstName}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="p-b-20">
                                <label className="stext-102 cl3 m-b-5">Email *</label>
                                <input 
                                    className="stext-111 cl8 plh3 size-111 p-lr-15 bor8" 
                                    type="email" 
                                    name="email" 
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="p-b-20">
                                <label className="stext-102 cl3 m-b-5">Số điện thoại *</label>
                                <input 
                                    className="stext-111 cl8 plh3 size-111 p-lr-15 bor8" 
                                    type="tel" 
                                    name="phone" 
                                    value={formData.phone}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="p-b-20">
                                <label className="stext-102 cl3 m-b-5">Địa chỉ *</label>
                                <input 
                                    className="stext-111 cl8 plh3 size-111 p-lr-15 bor8" 
                                    type="text" 
                                    name="address" 
                                    value={formData.address}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="row">
                                <div className="col-md-6 p-b-20">
                                    <label className="stext-102 cl3 m-b-5">Thành phố / Tỉnh *</label>
                                    <input 
                                        className="stext-111 cl8 plh3 size-111 p-lr-15 bor8" 
                                        type="text" 
                                        name="city" 
                                        value={formData.city}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div className="col-md-6 p-b-20">
                                    <label className="stext-102 cl3 m-b-5">Mã bưu điện / ZIP</label>
                                    <input 
                                        className="stext-111 cl8 plh3 size-111 p-lr-15 bor8" 
                                        type="text" 
                                        name="zipCode" 
                                        value={formData.zipCode}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>

                            <div className="p-t-20">
                                <h4 className="mtext-109 cl2 p-b-15">
                                    Phương Thức Thanh Toán
                                </h4>
                                {paymentMethods.map(method => (
                                    <div className="radio-container" key={method.id}>
                                        <label className="custom-radio">
                                            <input 
                                                type="radio" 
                                                name="paymentMethod" 
                                                value={method.id} 
                                                checked={formData.paymentMethod === method.id}
                                                onChange={handlePaymentMethodChange}
                                            />
                                            <span className="radio-label">{method.name}</span>
                                        </label>
                                    </div>
                                ))}
                            </div>

                            <div className="p-t-30">
                                <button 
                                    type="submit" 
                                    className="flex-c-m stext-101 cl0 size-116 bg3 bor14 hov-btn3 p-lr-15 trans-04 pointer"
                                >
                                    Đặt Hàng
                                </button>
                            </div>
                        </form>
                    </div>
                </div>

                <div className="col-md-5 p-b-30">
                    <div className="order-summary bor10 p-lr-40 p-t-30 p-b-40 m-l-0 m-r-0 m-lr-0-xl p-lr-15-sm">
                        <h4 className="mtext-109 cl2 p-b-30">
                            Đơn Hàng Của Bạn
                        </h4>

                        <div className="order-products">
                            {cartItems.map(item => {
                                const product = productDetails[item.id];
                                if (!product) return null;
                                
                                return (
                                    <div className="flex-w flex-t p-b-13" key={item.id}>
                                        <div className="size-208">
                                            <img src={product.img} alt={product.name} className="order-product-img" />
                                        </div>
                                        <div className="size-209">
                                            <div className="product-details">
                                                <div className="product-name">{product.name}</div>
                                                <div className="product-variants">
                                                    {item.size && <span className="product-size">Size: {item.size}</span>}
                                                    {item.color && <span className="product-color">Màu: {item.color}</span>}
                                                </div>
                                                <div className="product-quantity">x{item.quantity}</div>
                                                <div className="product-price">{(product.price * item.quantity).toLocaleString()} VND</div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
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
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Payment;
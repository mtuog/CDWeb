import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BACKEND_URL_HTTP } from '../../config.js';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';

const OrderHistory = ({ user }) => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedOrder, setSelectedOrder] = useState(null);
    
    useEffect(() => {
        if (user && user.id) {
            fetchOrders();
        }
    }, [user]);
    
    const fetchOrders = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            
            console.log("Fetching orders for user ID:", user.id);
            
            const response = await axios.get(
                `http://${BACKEND_URL_HTTP}/api/orders/user/${user.id}`,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }
            );
            
            console.log("Orders response:", response.data);
            
            if (response.status === 200) {
                setOrders(response.data);
            }
            setError(null);
        } catch (error) {
            console.error('Error fetching orders:', error);
            console.error('Error details:', error.response?.data || error.message);
            setError('Không thể tải lịch sử đơn hàng. Vui lòng thử lại sau.');
        } finally {
            setLoading(false);
        }
    };
    
    const getStatusClass = (status) => {
        switch(status) {
            case 'PENDING':
                return 'badge bg-warning';
            case 'PROCESSING':
                return 'badge bg-info';
            case 'SHIPPED':
                return 'badge bg-primary';
            case 'DELIVERED':
                return 'badge bg-success';
            case 'CANCELLED':
                return 'badge bg-danger';
            default:
                return 'badge bg-secondary';
        }
    };
    
    const getStatusText = (status) => {
        switch(status) {
            case 'PENDING':
                return 'Chờ xác nhận';
            case 'PROCESSING':
                return 'Đang xử lý';
            case 'SHIPPED':
                return 'Đang giao hàng';
            case 'DELIVERED':
                return 'Đã giao hàng';
            case 'CANCELLED':
                return 'Đã hủy';
            default:
                return status;
        }
    };
    
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(amount);
    };
    
    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        
        const options = { 
            year: 'numeric', 
            month: '2-digit', 
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        };
        return new Date(dateString).toLocaleDateString('vi-VN', options);
    };
    
    const handleCancelOrder = async (orderId) => {
        try {
            const result = await Swal.fire({
                title: 'Xác nhận hủy đơn hàng',
                text: 'Bạn có chắc chắn muốn hủy đơn hàng này?',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Xác nhận hủy',
                cancelButtonText: 'Giữ lại',
                confirmButtonColor: '#d33',
                cancelButtonColor: '#3085d6',
            });
            
            if (result.isConfirmed) {
                const token = localStorage.getItem('token');
                
                const response = await axios.put(
                    `http://${BACKEND_URL_HTTP}/api/orders/${orderId}/status?status=CANCELLED`,
                    {},
                    {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    }
                );
                
                if (response.status === 200) {
                    Swal.fire({
                        title: 'Thành công!',
                        text: 'Đơn hàng đã được hủy',
                        icon: 'success',
                        confirmButtonText: 'Đóng'
                    });
                    
                    // Cập nhật lại danh sách đơn hàng
                    fetchOrders();
                }
            }
        } catch (error) {
            console.error('Error cancelling order:', error);
            
            Swal.fire({
                title: 'Lỗi!',
                text: error.response?.data?.message || 'Không thể hủy đơn hàng. Vui lòng thử lại sau.',
                icon: 'error',
                confirmButtonText: 'Đóng'
            });
        }
    };
    
    return (
        <div className="order-history">
            <h4 className="mb-4">Lịch sử đơn hàng</h4>
            
            {loading ? (
                <div className="text-center my-5">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Đang tải...</span>
                    </div>
                    <p className="mt-2">Đang tải đơn hàng...</p>
                </div>
            ) : error ? (
                <div className="alert alert-danger" role="alert">
                    {error}
                </div>
            ) : orders.length === 0 ? (
                <div className="text-center my-5">
                    <i className="fa fa-shopping-bag fa-3x text-muted mb-3"></i>
                    <h5>Bạn chưa có đơn hàng nào</h5>
                    <p className="text-muted">Hãy mua sắm ngay để trải nghiệm sản phẩm của chúng tôi</p>
                    <Link to="/shop" className="btn btn-primary mt-3">
                        Mua sắm ngay
                    </Link>
                </div>
            ) : (
                <div className="table-responsive">
                    <table className="table table-hover">
                        <thead className="table-light">
                            <tr>
                                <th>Mã đơn hàng</th>
                                <th>Ngày đặt</th>
                                <th>Tổng tiền</th>
                                <th>Trạng thái</th>
                                <th>Hành động</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.map(order => (
                                <React.Fragment key={order.id}>
                                    <tr>
                                        <td>{order.id}</td>
                                        <td>{formatDate(order.orderDate)}</td>
                                        <td>{formatCurrency(order.totalAmount)}</td>
                                        <td>
                                            <span className={getStatusClass(order.status)}>
                                                {getStatusText(order.status)}
                                            </span>
                                        </td>
                                        <td>
                                            <button 
                                                className="btn btn-sm btn-outline-primary me-2" 
                                                onClick={() => setSelectedOrder(selectedOrder === order.id ? null : order.id)}
                                            >
                                                {selectedOrder === order.id ? 'Ẩn chi tiết' : 'Xem chi tiết'}
                                            </button>
                                            
                                            {(order.status === 'PENDING' || order.status === 'PROCESSING') && (
                                                <button 
                                                    className="btn btn-sm btn-outline-danger"
                                                    onClick={() => handleCancelOrder(order.id)}
                                                >
                                                    Hủy đơn
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                    
                                    {selectedOrder === order.id && (
                                        <tr className="order-details">
                                            <td colSpan="5" className="p-0">
                                                <div className="order-detail-content p-3">
                                                    <div className="row">
                                                        <div className="col-md-6">
                                                            <h6>Thông tin giao hàng</h6>
                                                            <p>Họ tên: {order.shippingAddress?.fullName || user.fullName}</p>
                                                            <p>Địa chỉ: {order.shippingAddress?.addressLine || order.shippingAddress || user.address}</p>
                                                            <p>Số điện thoại: {order.shippingAddress?.phone || user.phone || user.phoneNumber}</p>
                                                        </div>
                                                        <div className="col-md-6">
                                                            <h6>Thông tin thanh toán</h6>
                                                            <p>Phương thức: {order.paymentMethod || 'Thanh toán khi nhận hàng'}</p>
                                                            <p>Trạng thái: {order.paymentStatus || 'Chưa thanh toán'}</p>
                                                            <p>Phí vận chuyển: {formatCurrency(order.shippingFee || 0)}</p>
                                                        </div>
                                                    </div>
                                                    
                                                    <h6 className="mt-3">Sản phẩm đã đặt</h6>
                                                    <div className="table-responsive">
                                                        <table className="table table-sm">
                                                            <thead className="table-light">
                                                                <tr>
                                                                    <th>Sản phẩm</th>
                                                                    <th>Đơn giá</th>
                                                                    <th>Số lượng</th>
                                                                    <th>Thành tiền</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                {order.orderItems?.map((item, index) => (
                                                                    <tr key={index}>
                                                                        <td>
                                                                            <div className="d-flex align-items-center">
                                                                                {item.product?.imageUrl && (
                                                                                    <img 
                                                                                        src={item.product.imageUrl} 
                                                                                        alt={item.product.name} 
                                                                                        className="me-2"
                                                                                        style={{ width: '40px', height: '40px', objectFit: 'cover' }}
                                                                                    />
                                                                                )}
                                                                                <div>
                                                                                    <Link to={`/product/${item.product.id}`}>
                                                                                        {item.product.name}
                                                                                    </Link>
                                                                                </div>
                                                                            </div>
                                                                        </td>
                                                                        <td>{formatCurrency(item.price)}</td>
                                                                        <td>{item.quantity}</td>
                                                                        <td>{formatCurrency(item.price * item.quantity)}</td>
                                                                    </tr>
                                                                ))}
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                    
                                                    <div className="text-end mt-3">
                                                        <p className="mb-1"><strong>Tổng sản phẩm:</strong> {formatCurrency(order.subtotal || (order.totalAmount - (order.shippingFee || 0)))}</p>
                                                        <p className="mb-1"><strong>Phí vận chuyển:</strong> {formatCurrency(order.shippingFee || 0)}</p>
                                                        <p className="mb-1"><strong>Giảm giá:</strong> {formatCurrency(order.discount || 0)}</p>
                                                        <h5><strong>Tổng thanh toán:</strong> {formatCurrency(order.totalAmount)}</h5>
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </React.Fragment>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default OrderHistory; 
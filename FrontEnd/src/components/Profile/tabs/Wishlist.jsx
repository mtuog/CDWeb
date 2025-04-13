import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BACKEND_URL_HTTP } from '../../config.js';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';

const Wishlist = ({ user }) => {
    const [wishlistItems, setWishlistItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchWishlist();
    }, [user]);

    const fetchWishlist = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            
            const response = await axios.get(
                `http://${BACKEND_URL_HTTP}/api/wishlist/user/${user.id}`,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }
            );
            
            if (response.status === 200) {
                setWishlistItems(response.data);
            }
            setError(null);
        } catch (error) {
            console.error('Error fetching wishlist:', error);
            setError('Không thể tải danh sách yêu thích. Vui lòng thử lại sau.');
        } finally {
            setLoading(false);
        }
    };

    const removeFromWishlist = async (productId) => {
        try {
            const token = localStorage.getItem('token');
            
            const response = await axios.delete(
                `http://${BACKEND_URL_HTTP}/api/wishlist/remove/${productId}`,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }
            );
            
            if (response.status === 200) {
                // Cập nhật danh sách yêu thích
                setWishlistItems(prevItems => prevItems.filter(item => item.productId !== productId));
                
                Swal.fire({
                    title: 'Đã xóa!',
                    text: 'Sản phẩm đã được xóa khỏi danh sách yêu thích',
                    icon: 'success',
                    timer: 1500,
                    showConfirmButton: false
                });
            }
        } catch (error) {
            console.error('Error removing from wishlist:', error);
            
            Swal.fire({
                title: 'Lỗi!',
                text: 'Không thể xóa sản phẩm khỏi danh sách yêu thích',
                icon: 'error',
                confirmButtonText: 'Đóng'
            });
        }
    };

    const addToCart = async (productId) => {
        try {
            const token = localStorage.getItem('token');
            
            const response = await axios.post(
                `http://${BACKEND_URL_HTTP}/api/cart/add`,
                {
                    productId,
                    quantity: 1
                },
                {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }
            );
            
            if (response.status === 200) {
                Swal.fire({
                    title: 'Thành công!',
                    text: 'Sản phẩm đã được thêm vào giỏ hàng',
                    icon: 'success',
                    timer: 1500,
                    showConfirmButton: false
                });
            }
        } catch (error) {
            console.error('Error adding to cart:', error);
            
            Swal.fire({
                title: 'Lỗi!',
                text: 'Không thể thêm sản phẩm vào giỏ hàng',
                icon: 'error',
                confirmButtonText: 'Đóng'
            });
        }
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(amount);
    };

    return (
        <div className="wishlist-tab">
            <h4 className="mb-4">Sản phẩm yêu thích</h4>
            
            {loading ? (
                <div className="text-center my-5">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Đang tải...</span>
                    </div>
                    <p className="mt-2">Đang tải danh sách yêu thích...</p>
                </div>
            ) : error ? (
                <div className="alert alert-danger" role="alert">
                    {error}
                </div>
            ) : wishlistItems.length === 0 ? (
                <div className="text-center my-5">
                    <i className="fa fa-heart fa-3x text-muted mb-3"></i>
                    <h5>Danh sách yêu thích trống</h5>
                    <p className="text-muted">Hãy thêm sản phẩm yêu thích để xem tại đây</p>
                    <Link to="/shop" className="btn btn-primary mt-3">
                        Tiếp tục mua sắm
                    </Link>
                </div>
            ) : (
                <div className="row">
                    {wishlistItems.map(item => (
                        <div className="col-md-6 col-lg-4 mb-4" key={item.id}>
                            <div className="card wishlist-item">
                                <div className="wishlist-item-img">
                                    <img 
                                        src={item.product.imageUrl || 'https://via.placeholder.com/150'} 
                                        alt={item.product.name}
                                        className="img-fluid"
                                    />
                                    <div className="wishlist-item-actions">
                                        <button 
                                            className="btn btn-sm btn-danger btn-action"
                                            onClick={() => removeFromWishlist(item.productId)}
                                            title="Xóa khỏi danh sách yêu thích"
                                        >
                                            <i className="fa fa-trash"></i>
                                        </button>
                                        <button 
                                            className="btn btn-sm btn-primary btn-action"
                                            onClick={() => addToCart(item.productId)}
                                            title="Thêm vào giỏ hàng"
                                        >
                                            <i className="fa fa-shopping-cart"></i>
                                        </button>
                                    </div>
                                </div>
                                <div className="card-body">
                                    <Link to={`/product/${item.productId}`} className="product-title">
                                        <h5 className="card-title">{item.product.name}</h5>
                                    </Link>
                                    <p className="card-text text-primary fw-bold">
                                        {formatCurrency(item.product.price)}
                                        {item.product.originalPrice && item.product.originalPrice > item.product.price && (
                                            <small className="text-muted text-decoration-line-through ms-2">
                                                {formatCurrency(item.product.originalPrice)}
                                            </small>
                                        )}
                                    </p>
                                    <div className="d-flex justify-content-between align-items-center">
                                        <div className="ratings">
                                            {[1, 2, 3, 4, 5].map(star => (
                                                <i 
                                                    key={star}
                                                    className={`fa fa-star ${star <= (item.product.rating || 0) ? 'text-warning' : 'text-muted'}`}
                                                ></i>
                                            ))}
                                            <small className="ms-1 text-muted">
                                                ({item.product.reviewCount || 0})
                                            </small>
                                        </div>
                                        <small className="text-muted">
                                            {item.dateAdded && new Date(item.dateAdded).toLocaleDateString()}
                                        </small>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Wishlist; 
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BACKEND_URL_HTTP } from '../../config.js';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';

const Reviews = ({ user }) => {
    const [reviews, setReviews] = useState([]);
    const [pendingReviews, setPendingReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState('all');
    const [currentReview, setCurrentReview] = useState(null);
    
    useEffect(() => {
        fetchReviews();
        fetchPendingReviews();
    }, [user]);
    
    const fetchReviews = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            
            const response = await axios.get(
                `http://${BACKEND_URL_HTTP}/api/reviews/user/${user.id}`,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }
            );
            
            if (response.status === 200) {
                setReviews(response.data);
            }
            
            setError(null);
        } catch (error) {
            console.error('Error fetching reviews:', error);
            setError('Không thể tải đánh giá sản phẩm. Vui lòng thử lại sau.');
            
            // Mock data nếu không có API
            setReviews([
                {
                    id: 1,
                    productId: 101,
                    productName: 'Laptop gaming ABC',
                    productImage: 'https://via.placeholder.com/150',
                    rating: 5,
                    comment: 'Sản phẩm tuyệt vời, giao hàng nhanh, đóng gói cẩn thận. Hiệu năng tốt, chơi game mượt mà.',
                    dateCreated: '2023-11-15T10:30:00',
                    status: 'APPROVED'
                },
                {
                    id: 2,
                    productId: 102,
                    productName: 'Smartphone XYZ Pro',
                    productImage: 'https://via.placeholder.com/150',
                    rating: 4,
                    comment: 'Điện thoại thiết kế đẹp, camera chụp tốt. Tuy nhiên pin hơi yếu.',
                    dateCreated: '2023-12-01T14:45:00',
                    status: 'APPROVED'
                },
                {
                    id: 3,
                    productId: 103,
                    productName: 'Tai nghe không dây',
                    productImage: 'https://via.placeholder.com/150',
                    rating: 3,
                    comment: 'Chất lượng âm thanh tạm ổn. Thời lượng pin khá tốt.',
                    dateCreated: '2023-12-10T16:20:00',
                    status: 'PENDING'
                }
            ]);
        } finally {
            setLoading(false);
        }
    };
    
    const fetchPendingReviews = async () => {
        try {
            const token = localStorage.getItem('token');
            
            const response = await axios.get(
                `http://${BACKEND_URL_HTTP}/api/orders/pending-reviews/${user.id}`,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }
            );
            
            if (response.status === 200) {
                setPendingReviews(response.data);
            }
        } catch (error) {
            console.error('Error fetching pending reviews:', error);
            
            // Mock data nếu không có API
            setPendingReviews([
                {
                    orderId: 1001,
                    orderDate: '2023-12-15T10:30:00',
                    productId: 104,
                    productName: 'Máy ảnh DSLR',
                    productImage: 'https://via.placeholder.com/150'
                },
                {
                    orderId: 1002,
                    orderDate: '2023-12-18T14:45:00',
                    productId: 105,
                    productName: 'Loa Bluetooth',
                    productImage: 'https://via.placeholder.com/150'
                }
            ]);
        }
    };
    
    const handleEditReview = (review) => {
        setCurrentReview({
            id: review.id,
            productId: review.productId,
            productName: review.productName,
            productImage: review.productImage,
            rating: review.rating,
            comment: review.comment
        });
    };
    
    const handleDeleteReview = async (reviewId) => {
        try {
            const result = await Swal.fire({
                title: 'Xác nhận xóa',
                text: 'Bạn có chắc chắn muốn xóa đánh giá này?',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Xác nhận xóa',
                cancelButtonText: 'Hủy',
                confirmButtonColor: '#d33',
                cancelButtonColor: '#3085d6',
            });
            
            if (result.isConfirmed) {
                const token = localStorage.getItem('token');
                
                const response = await axios.delete(
                    `http://${BACKEND_URL_HTTP}/api/reviews/${reviewId}`,
                    {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    }
                );
                
                if (response.status === 200 || response.status === 204) {
                    // Cập nhật lại state để loại bỏ đánh giá đã xóa
                    setReviews(prev => prev.filter(review => review.id !== reviewId));
                    
                    Swal.fire({
                        title: 'Thành công!',
                        text: 'Đã xóa đánh giá sản phẩm',
                        icon: 'success',
                        confirmButtonText: 'Đóng'
                    });
                }
            }
        } catch (error) {
            console.error('Error deleting review:', error);
            
            Swal.fire({
                title: 'Lỗi!',
                text: error.response?.data?.message || 'Không thể xóa đánh giá. Vui lòng thử lại sau.',
                icon: 'error',
                confirmButtonText: 'Đóng'
            });
            
            // Mock behavior nếu không có API
            if (reviews.find(review => review.id === reviewId)) {
                setReviews(prev => prev.filter(review => review.id !== reviewId));
            }
        }
    };
    
    const handleNewReview = (product) => {
        setCurrentReview({
            id: null,
            productId: product.productId,
            productName: product.productName,
            productImage: product.productImage,
            rating: 5,
            comment: ''
        });
    };
    
    const handleReviewSubmit = async (e) => {
        e.preventDefault();
        
        if (!currentReview.rating || !currentReview.comment.trim()) {
            Swal.fire({
                title: 'Thông tin thiếu',
                text: 'Vui lòng nhập đầy đủ thông tin đánh giá',
                icon: 'warning',
                confirmButtonText: 'Đóng'
            });
            return;
        }
        
        try {
            const token = localStorage.getItem('token');
            let response;
            
            const reviewData = {
                userId: user.id,
                productId: currentReview.productId,
                rating: currentReview.rating,
                comment: currentReview.comment
            };
            
            if (currentReview.id) {
                // Update existing review
                response = await axios.put(
                    `http://${BACKEND_URL_HTTP}/api/reviews/${currentReview.id}`,
                    reviewData,
                    {
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json'
                        }
                    }
                );
                
                if (response.status === 200) {
                    // Update the reviews list
                    setReviews(prev => prev.map(review => 
                        review.id === currentReview.id 
                            ? { ...review, rating: currentReview.rating, comment: currentReview.comment } 
                            : review
                    ));
                    
                    Swal.fire({
                        title: 'Thành công!',
                        text: 'Đã cập nhật đánh giá sản phẩm',
                        icon: 'success',
                        confirmButtonText: 'Đóng'
                    });
                }
            } else {
                // Create new review
                response = await axios.post(
                    `http://${BACKEND_URL_HTTP}/api/reviews`,
                    reviewData,
                    {
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json'
                        }
                    }
                );
                
                if (response.status === 201) {
                    // Add the new review to the list
                    const newReview = response.data;
                    setReviews(prev => [...prev, newReview]);
                    
                    // Remove from pending reviews
                    setPendingReviews(prev => prev.filter(item => item.productId !== currentReview.productId));
                    
                    Swal.fire({
                        title: 'Thành công!',
                        text: 'Đã thêm đánh giá sản phẩm',
                        icon: 'success',
                        confirmButtonText: 'Đóng'
                    });
                }
            }
            
            // Reset current review
            setCurrentReview(null);
            
        } catch (error) {
            console.error('Error submitting review:', error);
            
            Swal.fire({
                title: 'Lỗi!',
                text: error.response?.data?.message || 'Không thể lưu đánh giá. Vui lòng thử lại sau.',
                icon: 'error',
                confirmButtonText: 'Đóng'
            });
            
            // Mock behavior nếu không có API
            if (!currentReview.id) {
                const mockReview = {
                    id: Math.floor(Math.random() * 1000) + 10,
                    productId: currentReview.productId,
                    productName: currentReview.productName,
                    productImage: currentReview.productImage,
                    rating: currentReview.rating,
                    comment: currentReview.comment,
                    dateCreated: new Date().toISOString(),
                    status: 'PENDING'
                };
                
                setReviews(prev => [...prev, mockReview]);
                setPendingReviews(prev => prev.filter(item => item.productId !== currentReview.productId));
                setCurrentReview(null);
                
                Swal.fire({
                    title: 'Thành công!',
                    text: 'Đã thêm đánh giá sản phẩm',
                    icon: 'success',
                    confirmButtonText: 'Đóng'
                });
            } else {
                setReviews(prev => prev.map(review => 
                    review.id === currentReview.id 
                        ? { ...review, rating: currentReview.rating, comment: currentReview.comment } 
                        : review
                ));
                
                setCurrentReview(null);
                
                Swal.fire({
                    title: 'Thành công!',
                    text: 'Đã cập nhật đánh giá sản phẩm',
                    icon: 'success',
                    confirmButtonText: 'Đóng'
                });
            }
        }
    };
    
    const formatDate = (dateString) => {
        const options = { 
            year: 'numeric', 
            month: '2-digit', 
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        };
        return new Date(dateString).toLocaleDateString('vi-VN', options);
    };
    
    const renderStars = (rating) => {
        const stars = [];
        for (let i = 1; i <= 5; i++) {
            if (i <= rating) {
                stars.push(<i key={i} className="fa fa-star text-warning"></i>);
            } else {
                stars.push(<i key={i} className="fa fa-star text-muted"></i>);
            }
        }
        return stars;
    };
    
    const filteredReviews = activeTab === 'all' 
        ? reviews 
        : activeTab === 'pending' 
            ? reviews.filter(review => review.status === 'PENDING')
            : reviews.filter(review => review.status === 'APPROVED');
    
    return (
        <div className="reviews">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h4 className="mb-0">Đánh giá sản phẩm</h4>
            </div>
            
            {currentReview ? (
                <div className="card mb-4">
                    <div className="card-header">
                        <h5 className="mb-0">{currentReview.id ? 'Chỉnh sửa đánh giá' : 'Viết đánh giá mới'}</h5>
                    </div>
                    <div className="card-body">
                        <form onSubmit={handleReviewSubmit}>
                            <div className="d-flex align-items-center mb-3">
                                <img 
                                    src={currentReview.productImage} 
                                    alt={currentReview.productName} 
                                    className="me-3"
                                    style={{ width: '80px', height: '80px', objectFit: 'cover' }}
                                />
                                <div>
                                    <h5 className="mb-1">{currentReview.productName}</h5>
                                    <Link to={`/product/${currentReview.productId}`} className="text-primary">
                                        Xem sản phẩm <i className="fa fa-external-link-alt"></i>
                                    </Link>
                                </div>
                            </div>
                            
                            <div className="form-group mb-3">
                                <label className="form-label">Đánh giá của bạn</label>
                                <div className="rating-stars mb-2">
                                    {[1, 2, 3, 4, 5].map(star => (
                                        <i 
                                            key={star}
                                            className={`fa fa-star fs-4 me-1 ${star <= currentReview.rating ? 'text-warning' : 'text-muted'}`}
                                            style={{ cursor: 'pointer' }}
                                            onClick={() => setCurrentReview({...currentReview, rating: star})}
                                        ></i>
                                    ))}
                                </div>
                            </div>
                            
                            <div className="form-group mb-3">
                                <label htmlFor="comment" className="form-label">Nhận xét của bạn</label>
                                <textarea
                                    className="form-control"
                                    id="comment"
                                    rows="5"
                                    value={currentReview.comment}
                                    onChange={(e) => setCurrentReview({...currentReview, comment: e.target.value})}
                                    placeholder="Hãy chia sẻ trải nghiệm của bạn về sản phẩm này..."
                                    required
                                ></textarea>
                            </div>
                            
                            <div className="d-flex">
                                <button type="submit" className="btn btn-primary me-2">
                                    {currentReview.id ? 'Cập nhật đánh giá' : 'Gửi đánh giá'}
                                </button>
                                <button 
                                    type="button" 
                                    className="btn btn-secondary"
                                    onClick={() => setCurrentReview(null)}
                                >
                                    Hủy
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            ) : (
                <>
                    {pendingReviews.length > 0 && (
                        <div className="card mb-4">
                            <div className="card-header bg-light">
                                <h5 className="mb-0">Sản phẩm chờ đánh giá</h5>
                            </div>
                            <div className="card-body">
                                <div className="row">
                                    {pendingReviews.map((product, index) => (
                                        <div className="col-md-6 col-lg-4 mb-3" key={index}>
                                            <div className="card h-100">
                                                <div className="d-flex p-3">
                                                    <img 
                                                        src={product.productImage} 
                                                        alt={product.productName} 
                                                        className="me-3"
                                                        style={{ width: '60px', height: '60px', objectFit: 'cover' }}
                                                    />
                                                    <div>
                                                        <h6 className="mb-1">{product.productName}</h6>
                                                        <small className="text-muted d-block mb-2">
                                                            Đơn hàng #{product.orderId} - {formatDate(product.orderDate)}
                                                        </small>
                                                        <button 
                                                            className="btn btn-sm btn-primary"
                                                            onClick={() => handleNewReview(product)}
                                                        >
                                                            Viết đánh giá
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                    
                    <ul className="nav nav-tabs mb-4">
                        <li className="nav-item">
                            <button 
                                className={`nav-link ${activeTab === 'all' ? 'active' : ''}`}
                                onClick={() => setActiveTab('all')}
                            >
                                Tất cả ({reviews.length})
                            </button>
                        </li>
                        <li className="nav-item">
                            <button 
                                className={`nav-link ${activeTab === 'approved' ? 'active' : ''}`}
                                onClick={() => setActiveTab('approved')}
                            >
                                Đã duyệt ({reviews.filter(r => r.status === 'APPROVED').length})
                            </button>
                        </li>
                        <li className="nav-item">
                            <button 
                                className={`nav-link ${activeTab === 'pending' ? 'active' : ''}`}
                                onClick={() => setActiveTab('pending')}
                            >
                                Chờ duyệt ({reviews.filter(r => r.status === 'PENDING').length})
                            </button>
                        </li>
                    </ul>
                    
                    {loading ? (
                        <div className="text-center my-5">
                            <div className="spinner-border text-primary" role="status">
                                <span className="visually-hidden">Đang tải...</span>
                            </div>
                            <p className="mt-2">Đang tải đánh giá sản phẩm...</p>
                        </div>
                    ) : error && reviews.length === 0 ? (
                        <div className="alert alert-danger" role="alert">
                            {error}
                        </div>
                    ) : filteredReviews.length === 0 ? (
                        <div className="text-center my-5">
                            <i className="fa fa-comment fa-3x text-muted mb-3"></i>
                            <h5>Chưa có đánh giá nào</h5>
                            <p className="text-muted">Hãy mua sắm và đánh giá sản phẩm để chia sẻ ý kiến của bạn</p>
                            <Link to="/shop" className="btn btn-primary mt-3">
                                Mua sắm ngay
                            </Link>
                        </div>
                    ) : (
                        <div className="reviews-list">
                            {filteredReviews.map(review => (
                                <div className="card mb-3" key={review.id}>
                                    <div className="card-body">
                                        <div className="d-flex justify-content-between align-items-start mb-3">
                                            <div className="d-flex">
                                                <img 
                                                    src={review.productImage} 
                                                    alt={review.productName}
                                                    className="me-3"
                                                    style={{ width: '60px', height: '60px', objectFit: 'cover' }}
                                                />
                                                <div>
                                                    <h5 className="mb-1">
                                                        <Link to={`/product/${review.productId}`} className="text-decoration-none">
                                                            {review.productName}
                                                        </Link>
                                                    </h5>
                                                    <div className="mb-1">
                                                        {renderStars(review.rating)}
                                                    </div>
                                                    <small className="text-muted">
                                                        Đánh giá vào ngày {formatDate(review.dateCreated)}
                                                        {review.status === 'PENDING' && (
                                                            <span className="badge bg-warning ms-2">Chờ duyệt</span>
                                                        )}
                                                    </small>
                                                </div>
                                            </div>
                                            <div>
                                                <button 
                                                    className="btn btn-sm btn-outline-primary me-2"
                                                    onClick={() => handleEditReview(review)}
                                                >
                                                    <i className="fa fa-edit"></i>
                                                </button>
                                                <button 
                                                    className="btn btn-sm btn-outline-danger"
                                                    onClick={() => handleDeleteReview(review.id)}
                                                >
                                                    <i className="fa fa-trash"></i>
                                                </button>
                                            </div>
                                        </div>
                                        <p className="mb-0">{review.comment}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default Reviews; 
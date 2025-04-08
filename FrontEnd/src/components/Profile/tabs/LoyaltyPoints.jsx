import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BACKEND_URL_HTTP } from '../../config.js';

const LoyaltyPoints = ({ user }) => {
    const [loyaltyData, setLoyaltyData] = useState({
        points: 0,
        rank: 'Bronze',
        nextRank: 'Silver',
        pointsToNextRank: 100,
        transactions: []
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    useEffect(() => {
        fetchLoyaltyData();
    }, [user]);
    
    const fetchLoyaltyData = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            
            const response = await axios.get(
                `http://${BACKEND_URL_HTTP}/api/UserServices/loyalty/${user.id}`,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }
            );
            
            if (response.status === 200) {
                setLoyaltyData(response.data);
            }
            
            setError(null);
        } catch (error) {
            console.error('Error fetching loyalty data:', error);
            setError('Không thể tải dữ liệu điểm tích lũy. Vui lòng thử lại sau.');
            
            // Mock data nếu không có API
            setLoyaltyData({
                points: 125,
                rank: 'Silver',
                nextRank: 'Gold',
                pointsToNextRank: 175,
                transactions: [
                    {
                        id: 1,
                        date: '2023-11-15T10:30:00',
                        description: 'Đơn hàng #1234',
                        points: 25,
                        type: 'EARN'
                    },
                    {
                        id: 2,
                        date: '2023-11-20T14:45:00',
                        description: 'Đơn hàng #1235',
                        points: 50,
                        type: 'EARN'
                    },
                    {
                        id: 3,
                        date: '2023-12-05T09:15:00',
                        description: 'Đổi voucher giảm giá 50k',
                        points: -20,
                        type: 'REDEEM'
                    },
                    {
                        id: 4,
                        date: '2023-12-18T16:20:00',
                        description: 'Đơn hàng #1240',
                        points: 70,
                        type: 'EARN'
                    }
                ]
            });
        } finally {
            setLoading(false);
        }
    };
    
    const getRankDetails = (rank) => {
        switch(rank) {
            case 'Bronze':
                return {
                    color: '#cd7f32',
                    benefits: ['Tích 1 điểm cho mỗi 10.000đ chi tiêu', 'Ưu đãi sinh nhật']
                };
            case 'Silver':
                return {
                    color: '#c0c0c0',
                    benefits: ['Tích 1.2 điểm cho mỗi 10.000đ chi tiêu', 'Ưu đãi sinh nhật', 'Quà tặng hạng Silver']
                };
            case 'Gold':
                return {
                    color: '#ffd700',
                    benefits: ['Tích 1.5 điểm cho mỗi 10.000đ chi tiêu', 'Ưu đãi sinh nhật', 'Quà tặng hạng Gold', 'Ưu tiên xử lý đơn hàng']
                };
            case 'Platinum':
                return {
                    color: '#e5e4e2',
                    benefits: ['Tích 2 điểm cho mỗi 10.000đ chi tiêu', 'Ưu đãi sinh nhật', 'Quà tặng hạng Platinum', 'Ưu tiên xử lý đơn hàng', 'Giao hàng miễn phí']
                };
            default:
                return {
                    color: '#cd7f32',
                    benefits: ['Tích 1 điểm cho mỗi 10.000đ chi tiêu']
                };
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
    
    const currentRankDetails = getRankDetails(loyaltyData.rank);
    const nextRankDetails = getRankDetails(loyaltyData.nextRank);
    
    // Calculate progress percentage
    const progressPercentage = () => {
        const totalPointsForNextRank = loyaltyData.points + loyaltyData.pointsToNextRank;
        return (loyaltyData.points / totalPointsForNextRank) * 100;
    };
    
    return (
        <div className="loyalty-points">
            <h4 className="mb-4">Điểm tích lũy & Hạng thành viên</h4>
            
            {loading ? (
                <div className="text-center my-5">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Đang tải...</span>
                    </div>
                    <p className="mt-2">Đang tải dữ liệu điểm tích lũy...</p>
                </div>
            ) : error ? (
                <div className="alert alert-danger" role="alert">
                    {error}
                </div>
            ) : (
                <>
                    <div className="row">
                        <div className="col-md-6 mb-4">
                            <div className="card h-100">
                                <div className="card-body">
                                    <div className="d-flex align-items-center mb-3">
                                        <div className="loyalty-rank-badge me-3" style={{ backgroundColor: currentRankDetails.color }}>
                                            {loyaltyData.rank.charAt(0)}
                                        </div>
                                        <div>
                                            <h5 className="mb-0">Hạng thành viên: <span style={{ color: currentRankDetails.color }}>{loyaltyData.rank}</span></h5>
                                            <p className="text-muted mb-0">Thành viên từ: {formatDate(user.dateRegistered || '2023-01-01')}</p>
                                        </div>
                                    </div>
                                    
                                    <h6 className="mb-2">Quyền lợi hạng {loyaltyData.rank}:</h6>
                                    <ul className="mb-3">
                                        {currentRankDetails.benefits.map((benefit, index) => (
                                            <li key={index}>{benefit}</li>
                                        ))}
                                    </ul>
                                    
                                    {loyaltyData.nextRank && (
                                        <>
                                            <p className="mb-2">
                                                Cần thêm <strong>{loyaltyData.pointsToNextRank} điểm</strong> nữa để lên hạng {loyaltyData.nextRank}
                                            </p>
                                            <div className="progress mb-2" style={{ height: '10px' }}>
                                                <div 
                                                    className="progress-bar" 
                                                    role="progressbar" 
                                                    style={{ width: `${progressPercentage()}%`, backgroundColor: nextRankDetails.color }}
                                                    aria-valuenow={progressPercentage()} 
                                                    aria-valuemin="0" 
                                                    aria-valuemax="100"
                                                ></div>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                        
                        <div className="col-md-6 mb-4">
                            <div className="card h-100 loyalty-points-card">
                                <div className="card-body text-center">
                                    <h5 className="card-title mb-3">Điểm tích lũy hiện tại</h5>
                                    <div className="loyalty-points-circle mb-3">
                                        <span className="points-number">{loyaltyData.points}</span>
                                        <span className="points-label">điểm</span>
                                    </div>
                                    <p className="mb-3">1 điểm = 1.000đ khi đổi</p>
                                    <button className="btn btn-primary">Đổi điểm ngay</button>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div className="card mb-4">
                        <div className="card-header">
                            <h5 className="mb-0">Lịch sử điểm</h5>
                        </div>
                        <div className="card-body">
                            {loyaltyData.transactions.length === 0 ? (
                                <div className="text-center my-4">
                                    <i className="fa fa-star-half-alt fa-3x text-muted mb-3"></i>
                                    <h5>Chưa có giao dịch điểm</h5>
                                    <p className="text-muted">Hãy mua sắm để bắt đầu tích điểm</p>
                                </div>
                            ) : (
                                <div className="table-responsive">
                                    <table className="table">
                                        <thead className="table-light">
                                            <tr>
                                                <th>Ngày</th>
                                                <th>Mô tả</th>
                                                <th className="text-end">Điểm</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {loyaltyData.transactions.map(transaction => (
                                                <tr key={transaction.id}>
                                                    <td>{formatDate(transaction.date)}</td>
                                                    <td>{transaction.description}</td>
                                                    <td className={`text-end ${transaction.type === 'EARN' ? 'text-success' : 'text-danger'}`}>
                                                        {transaction.type === 'EARN' ? '+' : ''}{transaction.points}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    </div>
                    
                    <div className="row">
                        <div className="col-md-6 mb-4">
                            <div className="card h-100">
                                <div className="card-header">
                                    <h5 className="mb-0">Cách tích điểm</h5>
                                </div>
                                <div className="card-body">
                                    <ul className="list-unstyled">
                                        <li className="mb-3">
                                            <i className="fa fa-shopping-cart text-primary me-2"></i> 
                                            <strong>Mua hàng:</strong> Tích điểm theo hạng thành viên
                                        </li>
                                        <li className="mb-3">
                                            <i className="fa fa-star text-primary me-2"></i> 
                                            <strong>Đánh giá sản phẩm:</strong> +5 điểm cho mỗi đánh giá
                                        </li>
                                        <li className="mb-3">
                                            <i className="fa fa-user-plus text-primary me-2"></i> 
                                            <strong>Giới thiệu bạn bè:</strong> +20 điểm khi bạn bè đăng ký và mua hàng
                                        </li>
                                        <li>
                                            <i className="fa fa-birthday-cake text-primary me-2"></i> 
                                            <strong>Sinh nhật:</strong> Nhận x2 điểm trong tháng sinh nhật
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                        
                        <div className="col-md-6 mb-4">
                            <div className="card h-100">
                                <div className="card-header">
                                    <h5 className="mb-0">Cách sử dụng điểm</h5>
                                </div>
                                <div className="card-body">
                                    <ul className="list-unstyled">
                                        <li className="mb-3">
                                            <i className="fa fa-tag text-primary me-2"></i> 
                                            <strong>Đổi voucher giảm giá:</strong> Từ 20 điểm
                                        </li>
                                        <li className="mb-3">
                                            <i className="fa fa-truck text-primary me-2"></i> 
                                            <strong>Đổi phiếu vận chuyển miễn phí:</strong> 15 điểm
                                        </li>
                                        <li className="mb-3">
                                            <i className="fa fa-gift text-primary me-2"></i> 
                                            <strong>Đổi quà tặng:</strong> Từ 50 điểm
                                        </li>
                                        <li>
                                            <i className="fa fa-percent text-primary me-2"></i> 
                                            <strong>Thanh toán đơn hàng:</strong> Trừ điểm trực tiếp khi thanh toán
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default LoyaltyPoints; 
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';

const OrderDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Status options
  const statusOptions = ['Đã giao hàng', 'Đang vận chuyển', 'Đang xử lý', 'Đã hủy'];
  
  // Mock data for a specific order
  const mockOrder = {
    id: 'ORD-001',
    customer: 'Nguyễn Văn A',
    customerEmail: 'nguyenvana@example.com',
    customerPhone: '0912345678',
    date: '2023-03-28',
    amount: 850000,
    status: 'Đã giao hàng',
    paymentMethod: 'COD',
    shippingAddress: {
      street: '123 Đường Lê Lợi',
      district: 'Quận 1',
      city: 'TP. Hồ Chí Minh',
      postalCode: '70000'
    },
    items: [
      { id: 1, name: 'Áo thun nam', price: 250000, quantity: 2, size: 'L', color: 'Đen' },
      { id: 3, name: 'Quần jean nam', price: 350000, quantity: 1, size: 'M', color: 'Xanh' }
    ],
    subtotal: 850000,
    shippingFee: 30000,
    discount: 30000,
    total: 850000,
    notes: 'Giao hàng vào buổi chiều.',
    history: [
      { date: '2023-03-25', time: '10:30', status: 'Đang xử lý', description: 'Đơn hàng được tạo' },
      { date: '2023-03-26', time: '08:45', status: 'Đang vận chuyển', description: 'Đơn hàng đang được vận chuyển' },
      { date: '2023-03-28', time: '14:20', status: 'Đã giao hàng', description: 'Đơn hàng đã được giao thành công' }
    ]
  };
  
  useEffect(() => {
    // Simulate API call
    const fetchOrderDetails = async () => {
      try {
        setLoading(true);
        // In a real application, this would be an API call
        setTimeout(() => {
          // Check if the order ID matches our mock data
          if (id === 'ORD-001') {
            setOrder(mockOrder);
          } else {
            // For demo purposes, modify the mock data to simulate different orders
            const modifiedOrder = {
              ...mockOrder,
              id: id,
              customer: `Khách hàng ${id}`,
              customerEmail: `customer${id}@example.com`,
              status: statusOptions[Math.floor(Math.random() * statusOptions.length)]
            };
            setOrder(modifiedOrder);
          }
          setLoading(false);
        }, 500);
      } catch (error) {
        setError("Không thể tải thông tin đơn hàng. Vui lòng thử lại sau.");
        setLoading(false);
        console.error("Error fetching order details:", error);
      }
    };
    
    fetchOrderDetails();
  }, [id]);
  
  // Handle status change for the order
  const handleStatusUpdate = (newStatus) => {
    // In a real application, this would call an API to update the order status
    console.log(`Updating order ${id} status to ${newStatus}`);
    
    // Update the order state with the new status
    setOrder(prev => ({
      ...prev,
      status: newStatus,
      history: [
        {
          date: new Date().toISOString().slice(0, 10),
          time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
          status: newStatus,
          description: `Đơn hàng đã được chuyển sang trạng thái ${newStatus}`
        },
        ...prev.history
      ]
    }));
  };
  
  // Format date string to display format
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN');
  };
  
  // Format price to Vietnamese format
  const formatPrice = (price) => {
    return price.toLocaleString('vi-VN') + ' VNĐ';
  };
  
  // Handle print order
  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return <div className="loading-container">Đang tải dữ liệu...</div>;
  }

  if (error) {
    return <div className="error-container">{error}</div>;
  }

  if (!order) {
    return <div className="error-container">Không tìm thấy đơn hàng.</div>;
  }

  return (
    <div className="order-detail-container">
      {/* Header */}
      <div className="order-detail-header">
        <div className="header-left">
          <Link to="/admin/orders" className="back-button">
            <i className="fa fa-arrow-left"></i> Quay lại
          </Link>
          <h1>Chi tiết đơn hàng #{order.id}</h1>
        </div>
        <div className="header-actions">
          <button className="print-button" onClick={handlePrint}>
            <i className="fa fa-print"></i> In đơn hàng
          </button>
        </div>
      </div>
      
      {/* Status and Date */}
      <div className="order-meta">
        <div className="order-status">
          <div className="status-label">Trạng thái:</div>
          <div className="status-select-container">
            <select 
              value={order.status}
              onChange={(e) => handleStatusUpdate(e.target.value)}
              className={`status-select ${order.status === 'Đã hủy' ? 'canceled' : 
                                      order.status === 'Đã giao hàng' ? 'delivered' : 
                                      order.status === 'Đang vận chuyển' ? 'shipping' : 'processing'}`}
            >
              {statusOptions.map((status, index) => (
                <option key={index} value={status}>{status}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="order-date">
          <div className="date-label">Ngày đặt hàng:</div>
          <div className="date-value">{formatDate(order.date)}</div>
        </div>
      </div>
      
      {/* Order Content */}
      <div className="order-content">
        {/* Customer Information */}
        <div className="order-section customer-info-section">
          <h2>Thông tin khách hàng</h2>
          <div className="info-grid">
            <div className="info-item">
              <div className="info-label">Tên khách hàng:</div>
              <div className="info-value">{order.customer}</div>
            </div>
            <div className="info-item">
              <div className="info-label">Email:</div>
              <div className="info-value">{order.customerEmail}</div>
            </div>
            <div className="info-item">
              <div className="info-label">Số điện thoại:</div>
              <div className="info-value">{order.customerPhone}</div>
            </div>
            <div className="info-item">
              <div className="info-label">Phương thức thanh toán:</div>
              <div className="info-value">{order.paymentMethod === 'COD' ? 'Tiền mặt khi nhận hàng' : 'Chuyển khoản ngân hàng'}</div>
            </div>
          </div>
        </div>
        
        {/* Shipping Address */}
        <div className="order-section shipping-address-section">
          <h2>Địa chỉ giao hàng</h2>
          <div className="address-content">
            <p>{order.shippingAddress.street}</p>
            <p>{order.shippingAddress.district}, {order.shippingAddress.city}</p>
            <p>Mã bưu điện: {order.shippingAddress.postalCode}</p>
          </div>
          {order.notes && (
            <div className="order-notes">
              <h3>Ghi chú:</h3>
              <p>{order.notes}</p>
            </div>
          )}
        </div>
        
        {/* Order Items */}
        <div className="order-section order-items-section">
          <h2>Sản phẩm</h2>
          <div className="order-items-table-container">
            <table className="order-items-table">
              <thead>
                <tr>
                  <th>Sản phẩm</th>
                  <th>Kích thước</th>
                  <th>Màu sắc</th>
                  <th>Giá</th>
                  <th>Số lượng</th>
                  <th>Tổng</th>
                </tr>
              </thead>
              <tbody>
                {order.items.map((item, index) => (
                  <tr key={index}>
                    <td>{item.name}</td>
                    <td>{item.size}</td>
                    <td>{item.color}</td>
                    <td>{formatPrice(item.price)}</td>
                    <td>{item.quantity}</td>
                    <td>{formatPrice(item.price * item.quantity)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="order-summary">
            <div className="summary-row">
              <div className="summary-label">Tạm tính:</div>
              <div className="summary-value">{formatPrice(order.subtotal)}</div>
            </div>
            <div className="summary-row">
              <div className="summary-label">Phí vận chuyển:</div>
              <div className="summary-value">{formatPrice(order.shippingFee)}</div>
            </div>
            {order.discount > 0 && (
              <div className="summary-row">
                <div className="summary-label">Giảm giá:</div>
                <div className="summary-value">-{formatPrice(order.discount)}</div>
              </div>
            )}
            <div className="summary-row total-row">
              <div className="summary-label">Tổng cộng:</div>
              <div className="summary-value">{formatPrice(order.total)}</div>
            </div>
          </div>
        </div>
        
        {/* Order History */}
        <div className="order-section order-history-section">
          <h2>Lịch sử đơn hàng</h2>
          <div className="history-timeline">
            {order.history.map((event, index) => (
              <div key={index} className="timeline-item">
                <div className="timeline-point"></div>
                <div className="timeline-content">
                  <div className="timeline-date">
                    {event.date} {event.time}
                  </div>
                  <div className="timeline-status">
                    <span
                      className={`status-badge ${
                        event.status === 'Đã hủy' ? 'canceled' : 
                        event.status === 'Đã giao hàng' ? 'delivered' : 
                        event.status === 'Đang vận chuyển' ? 'shipping' : 'processing'
                      }`}
                    >
                      {event.status}
                    </span>
                  </div>
                  <div className="timeline-description">
                    {event.description}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <style jsx>{`
        .order-detail-container {
          padding: 20px;
          background-color: #fff;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        
        .order-detail-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
        }
        
        .header-left {
          display: flex;
          align-items: center;
        }
        
        .back-button {
          display: flex;
          align-items: center;
          margin-right: 16px;
          color: #6c757d;
          text-decoration: none;
          transition: color 0.3s;
        }
        
        .back-button:hover {
          color: #495057;
        }
        
        .back-button i {
          margin-right: 8px;
        }
        
        .order-detail-header h1 {
          font-size: 24px;
          margin: 0;
          color: #333;
        }
        
        .print-button {
          display: flex;
          align-items: center;
          padding: 8px 16px;
          background-color: #6c757d;
          color: white;
          border: none;
          border-radius: 4px;
          font-size: 14px;
          cursor: pointer;
          transition: background-color 0.3s;
        }
        
        .print-button:hover {
          background-color: #5a6268;
        }
        
        .print-button i {
          margin-right: 8px;
        }
        
        .order-meta {
          display: flex;
          margin-bottom: 24px;
          background-color: #f8f9fa;
          padding: 16px;
          border-radius: 4px;
        }
        
        .order-status, .order-date {
          display: flex;
          align-items: center;
          margin-right: 32px;
        }
        
        .status-label, .date-label {
          font-weight: 600;
          margin-right: 8px;
          color: #495057;
        }
        
        .status-select {
          padding: 6px 12px;
          border-radius: 4px;
          font-size: 14px;
          border: 1px solid #ced4da;
          background-color: white;
        }
        
        .status-select.delivered {
          background-color: #d4edda;
          color: #155724;
          border-color: #c3e6cb;
        }
        
        .status-select.processing {
          background-color: #fff3cd;
          color: #856404;
          border-color: #ffeeba;
        }
        
        .status-select.shipping {
          background-color: #cce5ff;
          color: #004085;
          border-color: #b8daff;
        }
        
        .status-select.canceled {
          background-color: #f8d7da;
          color: #721c24;
          border-color: #f5c6cb;
        }
        
        .date-value {
          color: #495057;
        }
        
        .order-content {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 24px;
        }
        
        .order-section {
          background-color: #f8f9fa;
          padding: 20px;
          border-radius: 8px;
          margin-bottom: 24px;
        }
        
        .order-section h2 {
          font-size: 18px;
          margin-top: 0;
          margin-bottom: 16px;
          color: #333;
          border-bottom: 1px solid #e9ecef;
          padding-bottom: 8px;
        }
        
        .info-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 12px;
        }
        
        .info-item {
          display: flex;
        }
        
        .info-label {
          font-weight: 600;
          margin-right: 8px;
          min-width: 150px;
          color: #495057;
        }
        
        .info-value {
          color: #212529;
        }
        
        .address-content {
          color: #212529;
        }
        
        .address-content p {
          margin: 4px 0;
        }
        
        .order-notes {
          margin-top: 16px;
          padding-top: 16px;
          border-top: 1px dashed #ced4da;
        }
        
        .order-notes h3 {
          font-size: 16px;
          margin-top: 0;
          margin-bottom: 8px;
          color: #333;
        }
        
        .order-notes p {
          margin: 0;
          color: #212529;
        }
        
        .order-items-section {
          grid-column: 1 / -1;
        }
        
        .order-items-table-container {
          overflow-x: auto;
          margin-bottom: 20px;
        }
        
        .order-items-table {
          width: 100%;
          border-collapse: collapse;
        }
        
        .order-items-table th, 
        .order-items-table td {
          padding: 12px 16px;
          text-align: left;
          border-bottom: 1px solid #e9ecef;
        }
        
        .order-items-table th {
          background-color: white;
          font-weight: 600;
          color: #495057;
        }
        
        .order-summary {
          width: 350px;
          margin-left: auto;
          background-color: white;
          padding: 16px;
          border-radius: 4px;
          box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        }
        
        .summary-row {
          display: flex;
          justify-content: space-between;
          padding: 8px 0;
          border-bottom: 1px solid #e9ecef;
        }
        
        .summary-label {
          font-weight: 600;
          color: #495057;
        }
        
        .summary-value {
          color: #212529;
        }
        
        .total-row {
          font-size: 18px;
          font-weight: bold;
          border-bottom: none;
          margin-top: 8px;
        }
        
        .order-history-section {
          grid-column: 1 / -1;
        }
        
        .history-timeline {
          position: relative;
          padding-left: 32px;
        }
        
        .history-timeline::before {
          content: '';
          position: absolute;
          top: 0;
          bottom: 0;
          left: 8px;
          width: 2px;
          background-color: #dee2e6;
        }
        
        .timeline-item {
          position: relative;
          margin-bottom: 24px;
        }
        
        .timeline-point {
          position: absolute;
          left: -32px;
          top: 4px;
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background-color: #007bff;
          border: 2px solid white;
          z-index: 1;
        }
        
        .timeline-content {
          background-color: white;
          padding: 16px;
          border-radius: 4px;
          box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        }
        
        .timeline-date {
          font-size: 14px;
          color: #6c757d;
          margin-bottom: 8px;
        }
        
        .timeline-status {
          margin-bottom: 8px;
        }
        
        .status-badge {
          display: inline-block;
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 12px;
          font-weight: 600;
        }
        
        .status-badge.delivered {
          background-color: #d4edda;
          color: #155724;
        }
        
        .status-badge.processing {
          background-color: #fff3cd;
          color: #856404;
        }
        
        .status-badge.shipping {
          background-color: #cce5ff;
          color: #004085;
        }
        
        .status-badge.canceled {
          background-color: #f8d7da;
          color: #721c24;
        }
        
        .timeline-description {
          color: #212529;
        }
        
        .loading-container, .error-container {
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 300px;
          font-size: 16px;
          color: #6c757d;
        }
        
        .error-container {
          color: #dc3545;
        }
        
        @media (max-width: 768px) {
          .order-meta {
            flex-direction: column;
            gap: 12px;
          }
          
          .order-content {
            grid-template-columns: 1fr;
          }
          
          .order-summary {
            width: 100%;
          }
        }
        
        @media print {
          .back-button, 
          .print-button, 
          .status-select-container {
            display: none;
          }
          
          body {
            background-color: white;
          }
          
          .order-detail-container,
          .order-section,
          .timeline-content {
            box-shadow: none;
            border: 1px solid #e9ecef;
          }
          
          .order-status .status-label:after {
            content: ${order.status};
            font-weight: normal;
            margin-left: 8px;
          }
        }
      `}</style>
    </div>
  );
};

export default OrderDetail; 
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import { BACKEND_URL_HTTP } from '../../../config';

const OrderList = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateRange, setDateRange] = useState({ from: '', to: '' });
  const [sortConfig, setSortConfig] = useState({ key: 'createdAt', direction: 'desc' });
  
  // Status options for the filter
  const statusOptions = [
    { value: 'all', label: 'Tất cả trạng thái' },
    { value: 'PENDING', label: 'Đang xử lý' },
    { value: 'PROCESSING', label: 'Đang chuẩn bị' },
    { value: 'SHIPPED', label: 'Đang vận chuyển' },
    { value: 'DELIVERED', label: 'Đã giao hàng' },
    { value: 'CANCELLED', label: 'Đã hủy' }
  ];
  
  // Trạng thái hiển thị tiếng Việt
  const statusTranslations = {
    'PENDING': 'Đang xử lý',
    'PROCESSING': 'Đang chuẩn bị',
    'SHIPPED': 'Đang vận chuyển',
    'DELIVERED': 'Đã giao hàng',
    'CANCELLED': 'Đã hủy'
  };
  
  useEffect(() => {
    fetchOrders();
  }, []);
  
  const fetchOrders = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      const response = await axios.get(`http://${BACKEND_URL_HTTP}/api/orders`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      const formattedOrders = response.data.map(order => ({
        id: order.id,
        customer: order.user ? order.user.username : 'Khách vãng lai',
        email: order.user ? order.user.email : 'N/A',
        phone: order.phone,
        date: new Date(order.createdAt).toISOString().split('T')[0],
        amount: order.totalAmount,
        items: order.orderItems ? order.orderItems.length : 0,
        payment_method: order.paymentMethod,
        status: order.status,
        statusVi: statusTranslations[order.status] || order.status
      }));
      
      setOrders(formattedOrders);
      setFilteredOrders(formattedOrders);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching orders:", error);
      toast.error("Không thể tải danh sách đơn hàng. Vui lòng thử lại sau.");
      setLoading(false);
    }
  };
  
  useEffect(() => {
    // Apply filters and search
    let result = [...orders];
    
    // Apply status filter
    if (statusFilter !== 'all') {
      result = result.filter(order => order.status === statusFilter);
    }
    
    // Apply date range filter
    if (dateRange.from) {
      result = result.filter(order => new Date(order.date) >= new Date(dateRange.from));
    }
    
    if (dateRange.to) {
      result = result.filter(order => new Date(order.date) <= new Date(dateRange.to));
    }
    
    // Apply search
    if (searchTerm) {
      const lowercasedSearch = searchTerm.toLowerCase();
      result = result.filter(order => 
        order.id.toLowerCase().includes(lowercasedSearch) ||
        order.customer.toLowerCase().includes(lowercasedSearch) ||
        order.email.toLowerCase().includes(lowercasedSearch) ||
        order.phone.includes(searchTerm)
      );
    }
    
    // Apply sorting
    result = [...result].sort((a, b) => {
      if (sortConfig.key === 'date') {
        return sortConfig.direction === 'asc' 
          ? new Date(a.date) - new Date(b.date)
          : new Date(b.date) - new Date(a.date);
      } else if (sortConfig.key === 'amount') {
        return sortConfig.direction === 'asc' 
          ? a.amount - b.amount
          : b.amount - a.amount;
      } else if (sortConfig.key === 'customer') {
        return sortConfig.direction === 'asc' 
          ? a.customer.localeCompare(b.customer)
          : b.customer.localeCompare(a.customer);
      } else {
        return 0;
      }
    });
    
    setFilteredOrders(result);
  }, [orders, statusFilter, dateRange, searchTerm, sortConfig]);
  
  // Format date string to display format
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
    return new Date(dateString).toLocaleDateString('vi-VN', options);
  };
  
  // Format price to Vietnamese format
  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };
  
  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };
  
  // Handle status filter change
  const handleStatusFilterChange = (e) => {
    setStatusFilter(e.target.value);
  };
  
  // Handle date range filter change
  const handleDateRangeChange = (e) => {
    const { name, value } = e.target;
    setDateRange(prev => ({ ...prev, [name]: value }));
  };
  
  // Handle clearing all filters
  const handleClearFilters = () => {
    setSearchTerm('');
    setStatusFilter('all');
    setDateRange({ from: '', to: '' });
  };
  
  // Get order status CSS class
  const getStatusClass = (status) => {
    switch (status) {
      case 'DELIVERED':
        return 'delivered';
      case 'SHIPPED':
        return 'shipping';
      case 'PENDING':
      case 'PROCESSING':
        return 'processing';
      case 'CANCELLED':
        return 'canceled';
      default:
        return '';
    }
  };
  
  // Handle sorting
  const requestSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };
  
  // Get sort indicator
  const getSortIndicator = (key) => {
    if (sortConfig.key !== key) return null;
    return sortConfig.direction === 'asc' ? '↑' : '↓';
  };
  
  // Chỉnh sửa hàm updateOrderStatus để gọi API
  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const token = localStorage.getItem('token');
      
      await axios.put(`http://${BACKEND_URL_HTTP}/api/orders/${orderId}/status?status=${newStatus}`, {}, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      toast.success("Cập nhật trạng thái đơn hàng thành công!");
      fetchOrders(); // Tải lại danh sách đơn hàng
    } catch (error) {
      console.error("Error updating order status:", error);
      toast.error("Không thể cập nhật trạng thái đơn hàng. Vui lòng thử lại sau.");
    }
  };
  
  if (loading) {
    return <div className="loading-container">Đang tải dữ liệu...</div>;
  }
  
  return (
    <div className="order-list-container">
      {/* Header */}
      <div className="page-header">
        <h1>Quản lý đơn hàng</h1>
      </div>
      
      {/* Filters */}
      <div className="filters-section">
        <div className="search-filter">
          <div className="search-box">
            <i className="fa fa-search search-icon"></i>
            <input
              type="text"
              placeholder="Tìm theo mã đơn, tên KH, email, SĐT..."
              value={searchTerm}
              onChange={handleSearchChange}
            />
            {searchTerm && (
              <button 
                className="clear-search" 
                onClick={() => setSearchTerm('')}
                title="Xóa tìm kiếm"
              >
                <i className="fa fa-times"></i>
              </button>
            )}
          </div>
        </div>
        
        <div className="filters-row">
          <div className="filter-group">
            <label>Trạng thái:</label>
            <select value={statusFilter} onChange={handleStatusFilterChange}>
              {statusOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          
          <div className="filter-group">
            <label>Từ ngày:</label>
            <input
              type="date"
              name="from"
              value={dateRange.from}
              onChange={handleDateRangeChange}
            />
          </div>
          
          <div className="filter-group">
            <label>Đến ngày:</label>
            <input
              type="date"
              name="to"
              value={dateRange.to}
              onChange={handleDateRangeChange}
            />
          </div>
          
          <button className="clear-filters-btn" onClick={handleClearFilters}>
            Xóa bộ lọc
          </button>
        </div>
        
        <div className="filter-summary">
          Hiển thị {filteredOrders.length} trên tổng số {orders.length} đơn hàng
        </div>
      </div>
      
      {/* Orders Table */}
      <div className="table-container">
        <table className="orders-table">
          <thead>
            <tr>
              <th>Mã đơn hàng</th>
              <th onClick={() => requestSort('customer')} className="sortable-header">
                Khách hàng {getSortIndicator('customer')}
              </th>
              <th>Thông tin liên hệ</th>
              <th onClick={() => requestSort('date')} className="sortable-header">
                Ngày đặt {getSortIndicator('date')}
              </th>
              <th onClick={() => requestSort('amount')} className="sortable-header">
                Tổng tiền {getSortIndicator('amount')}
              </th>
              <th>PT Thanh toán</th>
              <th>Trạng thái</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="8" className="loading-cell">
                  <div className="loading-spinner"></div>
                  <div>Đang tải dữ liệu...</div>
                </td>
              </tr>
            ) : filteredOrders.length > 0 ? (
              filteredOrders.map(order => (
                <tr key={order.id}>
                  <td>{order.id}</td>
                  <td>{order.customer}</td>
                  <td>
                    <div>{order.email}</div>
                    <div>{order.phone}</div>
                  </td>
                  <td>{formatDate(order.date)}</td>
                  <td>{formatPrice(order.amount)}</td>
                  <td>
                    {order.payment_method === 'COD' ? (
                      <span className="payment-method cod">COD</span>
                    ) : (
                      <span className="payment-method banking">Chuyển khoản</span>
                    )}
                  </td>
                  <td>
                    <select 
                      className={`status-select ${getStatusClass(order.status)}`}
                      value={order.status}
                      onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                    >
                      {statusOptions.filter(option => option.value !== 'all').map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <Link to={`/admin/orders/${order.id}`} className="view-button">
                        <i className="fa fa-eye"></i> Chi tiết
                      </Link>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="no-data">
                  Không tìm thấy đơn hàng nào phù hợp với bộ lọc hiện tại.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      <style jsx>{`
        .order-list-container {
          padding: 20px;
          background-color: #fff;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        
        .page-header {
          margin-bottom: 24px;
        }
        
        .page-header h1 {
          font-size: 24px;
          margin: 0;
          color: #333;
        }
        
        .loading-container {
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 300px;
          font-size: 16px;
          color: #6c757d;
        }
        
        /* Filters Section */
        .filters-section {
          margin-bottom: 24px;
        }
        
        .search-filter {
          margin-bottom: 16px;
        }
        
        .search-box {
          position: relative;
          max-width: 500px;
        }
        
        .search-icon {
          position: absolute;
          left: 12px;
          top: 50%;
          transform: translateY(-50%);
          color: #6c757d;
        }
        
        .search-box input {
          width: 100%;
          padding: 10px 40px 10px 35px;
          border: 1px solid #ced4da;
          border-radius: 4px;
          font-size: 14px;
        }
        
        .clear-search {
          position: absolute;
          right: 12px;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          color: #6c757d;
          cursor: pointer;
        }
        
        .filters-row {
          display: flex;
          flex-wrap: wrap;
          gap: 16px;
          margin-bottom: 16px;
        }
        
        .filter-group {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        
        .filter-group label {
          font-size: 14px;
          color: #495057;
        }
        
        .filter-group select,
        .filter-group input {
          padding: 8px 12px;
          border: 1px solid #ced4da;
          border-radius: 4px;
          font-size: 14px;
        }
        
        .clear-filters-btn {
          background-color: #6c757d;
          color: white;
          border: none;
          border-radius: 4px;
          padding: 8px 16px;
          cursor: pointer;
          font-size: 14px;
          transition: background-color 0.3s;
        }
        
        .clear-filters-btn:hover {
          background-color: #5a6268;
        }
        
        .filter-summary {
          font-size: 14px;
          color: #6c757d;
        }
        
        /* Orders Table */
        .table-container {
          overflow-x: auto;
        }
        
        .orders-table {
          width: 100%;
          border-collapse: collapse;
        }
        
        .orders-table th,
        .orders-table td {
          padding: 12px 16px;
          text-align: left;
          border-bottom: 1px solid #e9ecef;
        }
        
        .orders-table th {
          background-color: #f8f9fa;
          font-weight: 600;
          color: #495057;
        }
        
        .sortable-header {
          cursor: pointer;
          user-select: none;
        }
        
        .sortable-header:hover {
          background-color: #e9ecef;
        }
        
        .payment-method {
          display: inline-block;
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 12px;
          font-weight: 600;
        }
        
        .payment-method.cod {
          background-color: #f8f9fa;
          color: #495057;
        }
        
        .payment-method.banking {
          background-color: #e8f4fd;
          color: #0d6efd;
        }
        
        .status-select {
          padding: 8px 12px;
          border: 1px solid #ced4da;
          border-radius: 4px;
          font-size: 14px;
        }
        
        .status-select.delivered {
          background-color: #d4edda;
          color: #155724;
        }
        
        .status-select.shipping {
          background-color: #cce5ff;
          color: #004085;
        }
        
        .status-select.processing {
          background-color: #fff3cd;
          color: #856404;
        }
        
        .status-select.canceled {
          background-color: #f8d7da;
          color: #721c24;
        }
        
        .action-buttons {
          display: flex;
          gap: 8px;
        }
        
        .view-button {
          display: inline-flex;
          align-items: center;
          padding: 6px 12px;
          background-color: #17a2b8;
          color: white;
          border: none;
          border-radius: 4px;
          font-size: 13px;
          text-decoration: none;
          cursor: pointer;
          transition: background-color 0.3s;
        }
        
        .view-button:hover {
          background-color: #138496;
        }
        
        .view-button i {
          margin-right: 4px;
        }
        
        .no-data {
          text-align: center;
          color: #6c757d;
          padding: 20px 0;
        }
        
        .loading-cell {
          text-align: center;
          padding: 20px 0;
        }
        
        .loading-spinner {
          margin-bottom: 8px;
          border: 4px solid rgba(0, 0, 0, 0.1);
          border-top: 4px solid #007bff;
          border-radius: 50%;
          width: 40px;
          height: 40px;
          animation: spin 1s linear infinite;
        }
        
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        @media (max-width: 768px) {
          .filters-row {
            flex-direction: column;
            gap: 12px;
          }
          
          .filter-group {
            width: 100%;
          }
          
          .action-buttons {
            flex-direction: column;
          }
        }
      `}</style>
    </div>
  );
};

export default OrderList; 
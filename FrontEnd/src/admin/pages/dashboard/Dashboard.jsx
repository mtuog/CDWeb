import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  LineChart, Line, AreaChart, Area, PieChart, Pie, Cell
} from 'recharts';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [period, setPeriod] = useState('month');
  const [loading, setLoading] = useState(true);
  
  // Generate mock data
  const generateMockData = () => {
    // Sales overview
    const salesData = {
      totalRevenue: 28500000,
      totalOrders: 120,
      averageOrderValue: 237500,
      pendingOrders: 15,
      processingOrders: 8,
      shippingOrders: 12,
      completedOrders: 85,
      canceledOrders: 10
    };
    
    // Revenue charts data
    const monthlyRevenueData = [
      { name: 'Tháng 1', revenue: 12500000, orders: 52 },
      { name: 'Tháng 2', revenue: 15800000, orders: 65 },
      { name: 'Tháng 3', revenue: 14300000, orders: 58 },
      { name: 'Tháng 4', revenue: 18700000, orders: 72 },
      { name: 'Tháng 5', revenue: 21500000, orders: 89 },
      { name: 'Tháng 6', revenue: 23800000, orders: 98 },
      { name: 'Tháng 7', revenue: 28500000, orders: 120 }
    ];
    
    const weeklyRevenueData = [
      { name: 'Tuần 1', revenue: 5200000, orders: 22 },
      { name: 'Tuần 2', revenue: 7300000, orders: 31 },
      { name: 'Tuần 3', revenue: 8900000, orders: 38 },
      { name: 'Tuần 4', revenue: 7100000, orders: 29 }
    ];
    
    // Product categories data
    const productCategoriesData = [
      { name: 'Quần áo nam', value: 35 },
      { name: 'Quần áo nữ', value: 45 },
      { name: 'Phụ kiện', value: 15 },
      { name: 'Giày dép', value: 5 }
    ];
    
    // Top selling products data
    const topSellingProducts = [
      { id: 1, name: 'Áo thun nam basic', price: 250000, sold: 45, image: 'https://via.placeholder.com/50' },
      { id: 2, name: 'Váy đầm nữ dáng xòe', price: 450000, sold: 38, image: 'https://via.placeholder.com/50' },
      { id: 3, name: 'Quần jean nam slim fit', price: 350000, sold: 30, image: 'https://via.placeholder.com/50' },
      { id: 4, name: 'Áo sơ mi nữ công sở', price: 280000, sold: 27, image: 'https://via.placeholder.com/50' },
      { id: 5, name: 'Áo khoác nữ dáng dài', price: 650000, sold: 22, image: 'https://via.placeholder.com/50' }
    ];
    
    // Recent orders data
    const recentOrders = [
      { id: 'ORD-001', customer: 'Nguyễn Văn A', date: '2023-07-28', amount: 850000, status: 'Đã giao hàng' },
      { id: 'ORD-002', customer: 'Trần Thị B', date: '2023-07-27', amount: 1250000, status: 'Đang vận chuyển' },
      { id: 'ORD-003', customer: 'Phạm Văn C', date: '2023-07-26', amount: 520000, status: 'Đang xử lý' },
      { id: 'ORD-004', customer: 'Lê Thị D', date: '2023-07-25', amount: 780000, status: 'Đã giao hàng' },
      { id: 'ORD-005', customer: 'Hoàng Văn E', date: '2023-07-24', amount: 1450000, status: 'Đã hủy' }
    ];
    
    return {
      salesData,
      monthlyRevenueData,
      weeklyRevenueData,
      productCategoriesData,
      topSellingProducts,
      recentOrders
    };
  };
  
  useEffect(() => {
    // Simulate API call
    const fetchStats = async () => {
      try {
        setLoading(true);
        // In a real application, this would be an API call
        setTimeout(() => {
          const mockData = generateMockData();
          setStats(mockData);
          setLoading(false);
        }, 800);
      } catch (error) {
        console.error("Error fetching dashboard stats:", error);
        setLoading(false);
      }
    };
    
    fetchStats();
  }, []);
  
  // Format number to Vietnamese currency
  const formatCurrency = (value) => {
    return value.toLocaleString('vi-VN') + ' ₫';
  };
  
  // Format date string to display format
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN');
  };
  
  // Get chart data based on selected period
  const getChartData = () => {
    if (!stats) return [];
    return period === 'month' ? stats.monthlyRevenueData : stats.weeklyRevenueData;
  };
  
  // Colors for charts
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];
  
  // Custom tooltip for revenue chart
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip">
          <p className="label">{`${label}`}</p>
          <p className="desc">{`Doanh thu: ${formatCurrency(payload[0].value)}`}</p>
          <p className="desc">{`Đơn hàng: ${payload[1].value}`}</p>
        </div>
      );
    }
    return null;
  };
  
  if (loading) {
    return <div className="loading-container">Đang tải dữ liệu thống kê...</div>;
  }
  
  if (!stats) {
    return <div className="error-container">Không thể tải dữ liệu thống kê. Vui lòng thử lại sau.</div>;
  }
  
  return (
    <div className="dashboard-container">
      {/* Stats Cards */}
      <div className="stats-cards">
        <div className="stats-card">
          <div className="stats-icon revenue-icon">
            <i className="fa fa-money-bill-wave"></i>
          </div>
          <div className="stats-content">
            <h3>Tổng doanh thu</h3>
            <div className="stats-value">{formatCurrency(stats.salesData.totalRevenue)}</div>
          </div>
        </div>
        
        <div className="stats-card">
          <div className="stats-icon orders-icon">
            <i className="fa fa-shopping-cart"></i>
          </div>
          <div className="stats-content">
            <h3>Tổng đơn hàng</h3>
            <div className="stats-value">{stats.salesData.totalOrders}</div>
          </div>
        </div>
        
        <div className="stats-card">
          <div className="stats-icon avg-icon">
            <i className="fa fa-chart-line"></i>
          </div>
          <div className="stats-content">
            <h3>Giá trị đơn hàng TB</h3>
            <div className="stats-value">{formatCurrency(stats.salesData.averageOrderValue)}</div>
          </div>
        </div>
        
        <div className="stats-card">
          <div className="stats-icon pending-icon">
            <i className="fa fa-clock"></i>
          </div>
          <div className="stats-content">
            <h3>Đơn hàng đang chờ</h3>
            <div className="stats-value">{stats.salesData.pendingOrders + stats.salesData.processingOrders}</div>
          </div>
        </div>
      </div>
      
      {/* Charts Section */}
      <div className="charts-section">
        {/* Revenue Chart */}
        <div className="chart-container revenue-chart">
          <div className="chart-header">
            <h2>Biểu đồ doanh thu</h2>
            <div className="chart-controls">
              <button 
                className={`period-btn ${period === 'week' ? 'active' : ''}`}
                onClick={() => setPeriod('week')}
              >
                Tuần
              </button>
              <button 
                className={`period-btn ${period === 'month' ? 'active' : ''}`}
                onClick={() => setPeriod('month')}
              >
                Tháng
              </button>
            </div>
          </div>
          <div className="chart-content">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={getChartData()}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
                <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Bar yAxisId="left" dataKey="revenue" name="Doanh thu" fill="#8884d8" />
                <Bar yAxisId="right" dataKey="orders" name="Đơn hàng" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        {/* Product Categories Chart */}
        <div className="chart-container categories-chart">
          <div className="chart-header">
            <h2>Danh mục sản phẩm</h2>
          </div>
          <div className="chart-content">
            <div className="pie-chart-container">
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={stats.productCategoriesData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {stats.productCategoriesData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="categories-legend">
              {stats.productCategoriesData.map((entry, index) => (
                <div key={index} className="legend-item">
                  <div className="color-indicator" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                  <div className="legend-text">{entry.name}: {entry.value}%</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      {/* Order Status Overview */}
      <div className="order-status-overview">
        <h2>Tổng quan trạng thái đơn hàng</h2>
        <div className="status-bars">
          <div className="status-item">
            <div className="status-info">
              <div className="status-label">Đang xử lý</div>
              <div className="status-count">{stats.salesData.processingOrders}</div>
            </div>
            <div className="status-bar-bg">
              <div 
                className="status-bar processing"
                style={{ width: `${(stats.salesData.processingOrders / stats.salesData.totalOrders) * 100}%` }}
              ></div>
            </div>
          </div>
          
          <div className="status-item">
            <div className="status-info">
              <div className="status-label">Đang vận chuyển</div>
              <div className="status-count">{stats.salesData.shippingOrders}</div>
            </div>
            <div className="status-bar-bg">
              <div 
                className="status-bar shipping"
                style={{ width: `${(stats.salesData.shippingOrders / stats.salesData.totalOrders) * 100}%` }}
              ></div>
            </div>
          </div>
          
          <div className="status-item">
            <div className="status-info">
              <div className="status-label">Đã giao hàng</div>
              <div className="status-count">{stats.salesData.completedOrders}</div>
            </div>
            <div className="status-bar-bg">
              <div 
                className="status-bar completed"
                style={{ width: `${(stats.salesData.completedOrders / stats.salesData.totalOrders) * 100}%` }}
              ></div>
            </div>
          </div>
          
          <div className="status-item">
            <div className="status-info">
              <div className="status-label">Đã hủy</div>
              <div className="status-count">{stats.salesData.canceledOrders}</div>
            </div>
            <div className="status-bar-bg">
              <div 
                className="status-bar canceled"
                style={{ width: `${(stats.salesData.canceledOrders / stats.salesData.totalOrders) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="detail-sections">
        {/* Top Products Section */}
        <div className="detail-section top-products">
          <div className="section-header">
            <h2>Sản phẩm bán chạy</h2>
            <Link to="/admin/products" className="view-all">
              Xem tất cả <i className="fa fa-arrow-right"></i>
            </Link>
          </div>
          
          <div className="product-list">
            {stats.topSellingProducts.map((product, index) => (
              <div key={index} className="product-item">
                <div className="product-rank">{index + 1}</div>
                <div className="product-image">
                  <img src={product.image} alt={product.name} />
                </div>
                <div className="product-info">
                  <div className="product-name">{product.name}</div>
                  <div className="product-price">{formatCurrency(product.price)}</div>
                </div>
                <div className="product-sold">
                  <span>{product.sold}</span> đã bán
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Recent Orders Section */}
        <div className="detail-section recent-orders">
          <div className="section-header">
            <h2>Đơn hàng gần đây</h2>
            <Link to="/admin/orders" className="view-all">
              Xem tất cả <i className="fa fa-arrow-right"></i>
            </Link>
          </div>
          
          <div className="orders-list">
            <table className="orders-table">
              <thead>
                <tr>
                  <th>Mã đơn hàng</th>
                  <th>Khách hàng</th>
                  <th>Ngày đặt</th>
                  <th>Tổng tiền</th>
                  <th>Trạng thái</th>
                </tr>
              </thead>
              <tbody>
                {stats.recentOrders.map((order, index) => (
                  <tr key={index}>
                    <td>
                      <Link to={`/admin/orders/${order.id}`}>
                        {order.id}
                      </Link>
                    </td>
                    <td>{order.customer}</td>
                    <td>{formatDate(order.date)}</td>
                    <td>{formatCurrency(order.amount)}</td>
                    <td>
                      <span className={`status-badge ${
                        order.status === 'Đã hủy' ? 'canceled' : 
                        order.status === 'Đã giao hàng' ? 'delivered' : 
                        order.status === 'Đang vận chuyển' ? 'shipping' : 'processing'
                      }`}>
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      
      <style jsx>{`
        .dashboard-container {
          padding: 20px;
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
        
        /* Stats Cards */
        .stats-cards {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: 20px;
          margin-bottom: 24px;
        }
        
        .stats-card {
          background-color: white;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.08);
          padding: 20px;
          display: flex;
          align-items: center;
        }
        
        .stats-icon {
          width: 50px;
          height: 50px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-right: 16px;
          font-size: 20px;
          color: white;
        }
        
        .revenue-icon {
          background-color: #28a745;
        }
        
        .orders-icon {
          background-color: #007bff;
        }
        
        .avg-icon {
          background-color: #6f42c1;
        }
        
        .pending-icon {
          background-color: #fd7e14;
        }
        
        .stats-content h3 {
          margin: 0 0 8px 0;
          font-size: 14px;
          color: #6c757d;
        }
        
        .stats-value {
          font-size: 24px;
          font-weight: 600;
          color: #333;
        }
        
        /* Charts Section */
        .charts-section {
          display: grid;
          grid-template-columns: 2fr 1fr;
          gap: 20px;
          margin-bottom: 24px;
        }
        
        .chart-container {
          background-color: white;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.08);
          padding: A20px;
        }
        
        .chart-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
        }
        
        .chart-header h2 {
          margin: 0;
          font-size: 18px;
          color: #333;
        }
        
        .chart-controls {
          display: flex;
          gap: 8px;
        }
        
        .period-btn {
          padding: 6px 12px;
          background-color: #f8f9fa;
          border: 1px solid #ced4da;
          border-radius: 4px;
          cursor: pointer;
          font-size: 14px;
          transition: all 0.3s;
        }
        
        .period-btn.active {
          background-color: #007bff;
          color: white;
          border-color: #007bff;
        }
        
        .pie-chart-container {
          height: 250px;
        }
        
        .categories-legend {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 16px;
          margin-top: 16px;
        }
        
        .legend-item {
          display: flex;
          align-items: center;
        }
        
        .color-indicator {
          width: 16px;
          height: 16px;
          border-radius: 4px;
          margin-right: A8px;
        }
        
        .legend-text {
          font-size: 14px;
          color: #333;
        }
        
        .custom-tooltip {
          background-color: white;
          border: 1px solid #ced4da;
          border-radius: 4px;
          padding: 12px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        
        .custom-tooltip .label {
          font-weight: 600;
          margin-bottom: 8px;
          color: #333;
        }
        
        .custom-tooltip .desc {
          color: #6c757d;
          margin: 4px 0;
        }
        
        /* Order Status Overview */
        .order-status-overview {
          background-color: white;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.08);
          padding: 20px;
          margin-bottom: 24px;
        }
        
        .order-status-overview h2 {
          margin: 0 0 16px 0;
          font-size: 18px;
          color: #333;
        }
        
        .status-bars {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: 20px;
        }
        
        .status-item {
          margin-bottom: 16px;
        }
        
        .status-info {
          display: flex;
          justify-content: space-between;
          margin-bottom: 8px;
        }
        
        .status-label {
          font-size: 14px;
          color: #6c757d;
        }
        
        .status-count {
          font-weight: 600;
          color: #333;
        }
        
        .status-bar-bg {
          background-color: #e9ecef;
          border-radius: 4px;
          height: 8px;
          overflow: hidden;
        }
        
        .status-bar {
          height: 100%;
          border-radius: 4px;
        }
        
        .status-bar.processing {
          background-color: #ffc107;
        }
        
        .status-bar.shipping {
          background-color: #17a2b8;
        }
        
        .status-bar.completed {
          background-color: #28a745;
        }
        
        .status-bar.canceled {
          background-color: #dc3545;
        }
        
        /* Detail Sections */
        .detail-sections {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(450px, 1fr));
          gap: 20px;
        }
        
        .detail-section {
          background-color: white;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.08);
          padding: 20px;
        }
        
        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
        }
        
        .section-header h2 {
          margin: 0;
          font-size: 18px;
          color: #333;
        }
        
        .view-all {
          font-size: 14px;
          color: #007bff;
          text-decoration: none;
          display: flex;
          align-items: center;
        }
        
        .view-all i {
          margin-left: 4px;
          font-size: 12px;
        }
        
        /* Product List */
        .product-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        
        .product-item {
          display: flex;
          align-items: center;
          padding: 12px;
          border-radius: 4px;
          transition: background-color 0.3s;
        }
        
        .product-item:hover {
          background-color: #f8f9fa;
        }
        
        .product-rank {
          font-size: 18px;
          font-weight: 600;
          width: 24px;
          text-align: center;
          color: #333;
        }
        
        .product-image {
          margin: 0 16px;
        }
        
        .product-image img {
          width: 40px;
          height: 40px;
          object-fit: cover;
          border-radius: 4px;
        }
        
        .product-info {
          flex: 1;
        }
        
        .product-name {
          font-weight: 500;
          color: #333;
          margin-bottom: 4px;
        }
        
        .product-price {
          font-size: 14px;
          color: #6c757d;
        }
        
        .product-sold {
          font-size: 14px;
          color: #6c757d;
        }
        
        .product-sold span {
          font-weight: 600;
          color: #28a745;
        }
        
        /* Orders Table */
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
          font-weight: 600;
          color: #495057;
        }
        
        .orders-table a {
          color: #007bff;
          text-decoration: none;
          font-weight: 500;
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
        
        @media (max-width: 1200px) {
          .charts-section {
            grid-template-columns: 1fr;
          }
          
          .categories-chart {
            display: flex;
            flex-direction: column;
          }
          
          .categories-legend {
            margin-top: 0;
          }
          
          .detail-sections {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

export default Dashboard; 
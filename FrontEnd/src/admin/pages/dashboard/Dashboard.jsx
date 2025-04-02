import React from 'react';
import StatCard from '../../components/common/StatCard';
import RecentOrdersTable from '../../components/sections/dashboard/RecentOrdersTable';
import SalesChart from '../../components/sections/dashboard/SalesChart';
import TopProductsTable from '../../components/sections/dashboard/TopProductsTable';
import CustomerGrowthChart from '../../components/sections/dashboard/CustomerGrowthChart';

const Dashboard = () => {
  // Mock data - trong thực tế sẽ lấy từ API
  const stats = [
    { id: 1, title: 'Tổng doanh thu', value: '16,520,000đ', icon: 'fa fa-dollar-sign', color: '#28a745', increase: '+15%' },
    { id: 2, title: 'Đơn hàng', value: '352', icon: 'fa fa-shopping-cart', color: '#17a2b8', increase: '+8%' },
    { id: 3, title: 'Khách hàng', value: '1,259', icon: 'fa fa-users', color: '#ffc107', increase: '+5%' },
    { id: 4, title: 'Sản phẩm', value: '128', icon: 'fa fa-box', color: '#dc3545', increase: '+12%' }
  ];

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Dashboard</h1>
        <p>Xin chào, Admin! Đây là tổng quan về cửa hàng của bạn.</p>
      </div>

      <div className="stats-container">
        {stats.map(stat => (
          <StatCard 
            key={stat.id}
            title={stat.title}
            value={stat.value}
            icon={stat.icon}
            color={stat.color}
            increase={stat.increase}
          />
        ))}
      </div>

      <div className="charts-container">
        <div className="chart-card">
          <h2>Biểu đồ doanh thu</h2>
          <SalesChart />
        </div>
        <div className="chart-card">
          <h2>Tăng trưởng khách hàng</h2>
          <CustomerGrowthChart />
        </div>
      </div>

      <div className="tables-container">
        <div className="table-card">
          <h2>Đơn hàng gần đây</h2>
          <RecentOrdersTable />
        </div>
        <div className="table-card">
          <h2>Top sản phẩm bán chạy</h2>
          <TopProductsTable />
        </div>
      </div>

      <style jsx>{`
        .dashboard-container {
          width: 100%;
        }
        
        .dashboard-header {
          margin-bottom: 24px;
        }
        
        .dashboard-header h1 {
          font-size: 24px;
          margin-bottom: 8px;
          color: #333;
        }
        
        .dashboard-header p {
          color: #6c757d;
          margin: 0;
        }
        
        .stats-container {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
          gap: 24px;
          margin-bottom: 24px;
        }
        
        .charts-container {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(500px, 1fr));
          gap: 24px;
          margin-bottom: 24px;
        }
        
        .tables-container {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(500px, 1fr));
          gap: 24px;
        }
        
        .chart-card, .table-card {
          background-color: #fff;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          padding: 24px;
        }
        
        .chart-card h2, .table-card h2 {
          font-size: 18px;
          margin-top: 0;
          margin-bottom: 16px;
          color: #333;
        }
      `}</style>
    </div>
  );
};

export default Dashboard; 
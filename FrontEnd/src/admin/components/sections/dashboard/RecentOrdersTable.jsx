import React from 'react';
import { Link } from 'react-router-dom';

const RecentOrdersTable = () => {
  // Mock data - trong thực tế sẽ lấy từ API
  const recentOrders = [
    {
      id: 'ORD-001',
      customer: 'Nguyễn Văn A',
      date: '28/03/2023',
      amount: '850,000đ',
      status: 'Đã giao hàng',
      statusColor: '#28a745'
    },
    {
      id: 'ORD-002',
      customer: 'Trần Thị B',
      date: '27/03/2023',
      amount: '1,250,000đ',
      status: 'Đang xử lý',
      statusColor: '#ffc107'
    },
    {
      id: 'ORD-003',
      customer: 'Lê Văn C',
      date: '26/03/2023',
      amount: '450,000đ',
      status: 'Đã hủy',
      statusColor: '#dc3545'
    },
    {
      id: 'ORD-004',
      customer: 'Phạm Thị D',
      date: '25/03/2023',
      amount: '2,150,000đ',
      status: 'Đã giao hàng',
      statusColor: '#28a745'
    },
    {
      id: 'ORD-005',
      customer: 'Hoàng Văn E',
      date: '24/03/2023',
      amount: '950,000đ',
      status: 'Đang vận chuyển',
      statusColor: '#17a2b8'
    }
  ];

  return (
    <div className="table-responsive">
      <table className="orders-table">
        <thead>
          <tr>
            <th>Mã đơn hàng</th>
            <th>Khách hàng</th>
            <th>Ngày đặt</th>
            <th>Số tiền</th>
            <th>Trạng thái</th>
            <th>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {recentOrders.map(order => (
            <tr key={order.id}>
              <td>{order.id}</td>
              <td>{order.customer}</td>
              <td>{order.date}</td>
              <td>{order.amount}</td>
              <td>
                <span 
                  className="status-badge"
                  style={{ backgroundColor: order.statusColor }}
                >
                  {order.status}
                </span>
              </td>
              <td>
                <Link to={`/admin/orders/${order.id}`} className="action-button">
                  <i className="fa fa-eye"></i>
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      
      <div className="see-all-link">
        <Link to="/admin/orders">Xem tất cả đơn hàng</Link>
      </div>
      
      <style jsx>{`
        .table-responsive {
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
          font-weight: 600;
          color: #495057;
          background-color: #f8f9fa;
        }
        
        .orders-table tr:hover {
          background-color: #f8f9fa;
        }
        
        .status-badge {
          display: inline-block;
          padding: 4px 8px;
          border-radius: 4px;
          color: white;
          font-size: 12px;
        }
        
        .action-button {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 32px;
          height: 32px;
          border-radius: 4px;
          color: #495057;
          text-decoration: none;
          transition: background-color 0.3s;
        }
        
        .action-button:hover {
          background-color: #e9ecef;
        }
        
        .see-all-link {
          margin-top: 16px;
          text-align: right;
        }
        
        .see-all-link a {
          color: #007bff;
          text-decoration: none;
          font-size: 14px;
        }
        
        .see-all-link a:hover {
          text-decoration: underline;
        }
      `}</style>
    </div>
  );
};

export default RecentOrdersTable; 
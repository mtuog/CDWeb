import React from 'react';
import { Link } from 'react-router-dom';

const TopProductsTable = () => {
  // Mock data - trong thực tế sẽ lấy từ API
  const topProducts = [
    {
      id: 1,
      name: 'Áo thun nam basic',
      image: 'https://via.placeholder.com/50',
      category: 'Áo nam',
      price: '250,000đ',
      sold: 245,
      stock: 120
    },
    {
      id: 2,
      name: 'Váy liền thân',
      image: 'https://via.placeholder.com/50',
      category: 'Váy',
      price: '450,000đ',
      sold: 198,
      stock: 75
    },
    {
      id: 3,
      name: 'Quần jean nam',
      image: 'https://via.placeholder.com/50',
      category: 'Quần nam',
      price: '420,000đ',
      sold: 186,
      stock: 90
    },
    {
      id: 4,
      name: 'Áo khoác nữ',
      image: 'https://via.placeholder.com/50',
      category: 'Áo nữ',
      price: '550,000đ',
      sold: 165,
      stock: 50
    },
    {
      id: 5,
      name: 'Giày thể thao',
      image: 'https://via.placeholder.com/50',
      category: 'Giày',
      price: '850,000đ',
      sold: 142,
      stock: 30
    }
  ];

  return (
    <div className="table-responsive">
      <table className="products-table">
        <thead>
          <tr>
            <th>Sản phẩm</th>
            <th>Danh mục</th>
            <th>Giá</th>
            <th>Đã bán</th>
            <th>Tồn kho</th>
            <th>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {topProducts.map(product => (
            <tr key={product.id}>
              <td className="product-cell">
                <img src={product.image} alt={product.name} className="product-image" />
                <span className="product-name">{product.name}</span>
              </td>
              <td>{product.category}</td>
              <td>{product.price}</td>
              <td>{product.sold}</td>
              <td>{product.stock}</td>
              <td>
                <Link to={`/admin/products/${product.id}`} className="action-button">
                  <i className="fa fa-eye"></i>
                </Link>
                <Link to={`/admin/products/${product.id}/edit`} className="action-button">
                  <i className="fa fa-edit"></i>
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      
      <div className="see-all-link">
        <Link to="/admin/products">Xem tất cả sản phẩm</Link>
      </div>
      
      <style jsx>{`
        .table-responsive {
          overflow-x: auto;
        }
        
        .products-table {
          width: 100%;
          border-collapse: collapse;
        }
        
        .products-table th,
        .products-table td {
          padding: 12px 16px;
          text-align: left;
          border-bottom: 1px solid #e9ecef;
        }
        
        .products-table th {
          font-weight: 600;
          color: #495057;
          background-color: #f8f9fa;
        }
        
        .products-table tr:hover {
          background-color: #f8f9fa;
        }
        
        .product-cell {
          display: flex;
          align-items: center;
        }
        
        .product-image {
          width: 40px;
          height: 40px;
          border-radius: 4px;
          object-fit: cover;
          margin-right: 12px;
        }
        
        .product-name {
          font-weight: 500;
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
          margin-right: 8px;
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

export default TopProductsTable; 
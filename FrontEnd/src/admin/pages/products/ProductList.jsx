import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAllProducts } from '../../../api/productApi';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  
  const productsPerPage = 10;
  
  // Mock categories - trong thực tế sẽ lấy từ API
  const categories = ['Áo nam', 'Áo nữ', 'Quần nam', 'Quần nữ', 'Váy', 'Giày'];
  
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const data = await getAllProducts();
        setProducts(data);
        setLoading(false);
      } catch (error) {
        setError("Không thể tải danh sách sản phẩm. Vui lòng thử lại sau.");
        setLoading(false);
        console.error("Error fetching products:", error);
      }
    };
    
    fetchProducts();
  }, []);
  
  // Filter and sort products
  const filteredProducts = products
    .filter(product => {
      // Filter by search term
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                           product.des.toLowerCase().includes(searchTerm.toLowerCase());
      
      // Filter by category
      const matchesCategory = selectedCategory === '' || product.category === selectedCategory;
      
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      // Sort products
      switch(sortBy) {
        case 'newest':
          return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
        case 'oldest':
          return new Date(a.createdAt || 0) - new Date(b.createdAt || 0);
        case 'priceAsc':
          return a.price - b.price;
        case 'priceDesc':
          return b.price - a.price;
        case 'nameAsc':
          return a.name.localeCompare(b.name);
        case 'nameDesc':
          return b.name.localeCompare(a.name);
        default:
          return 0;
      }
    });
  
  // Paginate products
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
  
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };
  
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to first page when search changes
  };
  
  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
    setCurrentPage(1); // Reset to first page when category changes
  };
  
  const handleSortChange = (e) => {
    setSortBy(e.target.value);
  };
  
  const handleDeleteProduct = (productId) => {
    // Placeholder for delete functionality
    if (window.confirm('Bạn có chắc chắn muốn xóa sản phẩm này?')) {
      console.log(`Delete product with ID: ${productId}`);
      // In a real application, you would call an API to delete the product
      // Then you would update the products state
    }
  };

  if (loading) {
    return <div className="loading-container">Đang tải dữ liệu...</div>;
  }

  if (error) {
    return <div className="error-container">{error}</div>;
  }

  return (
    <div className="product-list-container">
      <div className="product-list-header">
        <h1>Quản lý sản phẩm</h1>
        <Link to="/admin/products/add" className="add-product-button">
          <i className="fa fa-plus"></i> Thêm sản phẩm
        </Link>
      </div>
      
      <div className="product-list-filters">
        <div className="search-filter">
          <input
            type="text"
            placeholder="Tìm kiếm sản phẩm..."
            value={searchTerm}
            onChange={handleSearchChange}
          />
          <i className="fa fa-search"></i>
        </div>
        
        <div className="category-filter">
          <select value={selectedCategory} onChange={handleCategoryChange}>
            <option value="">Tất cả danh mục</option>
            {categories.map((category, index) => (
              <option key={index} value={category}>{category}</option>
            ))}
          </select>
        </div>
        
        <div className="sort-filter">
          <select value={sortBy} onChange={handleSortChange}>
            <option value="newest">Mới nhất</option>
            <option value="oldest">Cũ nhất</option>
            <option value="priceAsc">Giá tăng dần</option>
            <option value="priceDesc">Giá giảm dần</option>
            <option value="nameAsc">Tên A-Z</option>
            <option value="nameDesc">Tên Z-A</option>
          </select>
        </div>
      </div>
      
      <div className="products-count">
        Hiển thị {indexOfFirstProduct + 1}-{Math.min(indexOfLastProduct, filteredProducts.length)} 
        trên {filteredProducts.length} sản phẩm
      </div>
      
      <div className="product-list-table-container">
        <table className="product-list-table">
          <thead>
            <tr>
              <th>Ảnh</th>
              <th>Tên sản phẩm</th>
              <th>Danh mục</th>
              <th>Giá</th>
              <th>Trạng thái</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {currentProducts.length > 0 ? (
              currentProducts.map(product => (
                <tr key={product.id}>
                  <td className="product-image-cell">
                    <img 
                      src={product.img || 'https://via.placeholder.com/50'} 
                      alt={product.name} 
                      className="product-thumbnail"
                    />
                  </td>
                  <td>{product.name}</td>
                  <td>{product.category}</td>
                  <td>{product.price.toLocaleString()} VNĐ</td>
                  <td>
                    <span className={`status-badge ${product.inStock ? 'in-stock' : 'out-of-stock'}`}>
                      {product.inStock ? 'Còn hàng' : 'Hết hàng'}
                    </span>
                  </td>
                  <td className="actions-cell">
                    <Link to={`/admin/products/${product.id}`} className="action-button view-button">
                      <i className="fa fa-eye"></i>
                    </Link>
                    <Link to={`/admin/products/${product.id}/edit`} className="action-button edit-button">
                      <i className="fa fa-edit"></i>
                    </Link>
                    <button 
                      className="action-button delete-button"
                      onClick={() => handleDeleteProduct(product.id)}
                    >
                      <i className="fa fa-trash"></i>
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="no-products-message">
                  Không tìm thấy sản phẩm nào.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      {totalPages > 1 && (
        <div className="pagination">
          <button 
            className="pagination-button"
            disabled={currentPage === 1}
            onClick={() => handlePageChange(currentPage - 1)}
          >
            <i className="fa fa-chevron-left"></i>
          </button>
          
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(pageNumber => (
            <button
              key={pageNumber}
              className={`pagination-button ${pageNumber === currentPage ? 'active' : ''}`}
              onClick={() => handlePageChange(pageNumber)}
            >
              {pageNumber}
            </button>
          ))}
          
          <button 
            className="pagination-button"
            disabled={currentPage === totalPages}
            onClick={() => handlePageChange(currentPage + 1)}
          >
            <i className="fa fa-chevron-right"></i>
          </button>
        </div>
      )}
      
      <style jsx>{`
        .product-list-container {
          padding: 20px;
          background-color: #fff;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        
        .product-list-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
        }
        
        .product-list-header h1 {
          font-size: 24px;
          margin: 0;
          color: #333;
        }
        
        .add-product-button {
          display: flex;
          align-items: center;
          padding: 10px 16px;
          background-color: #28a745;
          color: white;
          border: none;
          border-radius: 4px;
          font-size: 14px;
          cursor: pointer;
          text-decoration: none;
        }
        
        .add-product-button i {
          margin-right: 8px;
        }
        
        .product-list-filters {
          display: flex;
          gap: 16px;
          margin-bottom: 20px;
        }
        
        .search-filter {
          flex: 1;
          position: relative;
        }
        
        .search-filter input {
          width: 100%;
          padding: 10px 16px 10px 36px;
          border: 1px solid #ced4da;
          border-radius: 4px;
          font-size: 14px;
        }
        
        .search-filter i {
          position: absolute;
          left: 12px;
          top: 50%;
          transform: translateY(-50%);
          color: #6c757d;
        }
        
        .category-filter, .sort-filter {
          min-width: 200px;
        }
        
        .category-filter select, .sort-filter select {
          width: 100%;
          padding: 10px 16px;
          border: 1px solid #ced4da;
          border-radius: 4px;
          background-color: white;
          font-size: 14px;
        }
        
        .products-count {
          margin-bottom: 16px;
          font-size: 14px;
          color: #6c757d;
        }
        
        .product-list-table-container {
          overflow-x: auto;
        }
        
        .product-list-table {
          width: 100%;
          border-collapse: collapse;
        }
        
        .product-list-table th, 
        .product-list-table td {
          padding: 12px 16px;
          text-align: left;
          border-bottom: 1px solid #e9ecef;
        }
        
        .product-list-table th {
          background-color: #f8f9fa;
          font-weight: 600;
          color: #495057;
        }
        
        .product-image-cell {
          width: 60px;
        }
        
        .product-thumbnail {
          width: 50px;
          height: 50px;
          object-fit: cover;
          border-radius: 4px;
        }
        
        .status-badge {
          display: inline-block;
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 12px;
          font-weight: 600;
        }
        
        .in-stock {
          background-color: #d4edda;
          color: #155724;
        }
        
        .out-of-stock {
          background-color: #f8d7da;
          color: #721c24;
        }
        
        .actions-cell {
          white-space: nowrap;
        }
        
        .action-button {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 32px;
          height: 32px;
          border-radius: 4px;
          margin-right: 8px;
          border: none;
          cursor: pointer;
          color: white;
          text-decoration: none;
        }
        
        .view-button {
          background-color: #17a2b8;
        }
        
        .edit-button {
          background-color: #ffc107;
        }
        
        .delete-button {
          background-color: #dc3545;
        }
        
        .no-products-message {
          text-align: center;
          padding: 24px;
          color: #6c757d;
        }
        
        .pagination {
          display: flex;
          justify-content: center;
          margin-top: 24px;
        }
        
        .pagination-button {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 36px;
          height: 36px;
          margin: 0 4px;
          border: 1px solid #dee2e6;
          background-color: white;
          color: #495057;
          font-size: 14px;
          cursor: pointer;
          border-radius: 4px;
        }
        
        .pagination-button.active {
          background-color: #007bff;
          color: white;
          border-color: #007bff;
        }
        
        .pagination-button:disabled {
          color: #6c757d;
          cursor: not-allowed;
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
      `}</style>
    </div>
  );
};

export default ProductList; 
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProductById } from '../../../api/productApi';
import { getAllCategories } from '../../../api/categoryApi';

const ProductForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;
  
  const [formData, setFormData] = useState({
    name: '',
    category: null,
    price: '',
    des: '',
    inStock: true,
    img: '',
    sizes: [],
    colors: []
  });
  
  const [loading, setLoading] = useState(isEditMode);
  const [error, setError] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [categories, setCategories] = useState([]);
  
  // Mock sizes and colors for the form
  const availableSizes = ['S', 'M', 'L', 'XL', 'XXL'];
  const availableColors = ['Đen', 'Trắng', 'Đỏ', 'Xanh', 'Vàng', 'Hồng', 'Xám'];
  
  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getAllCategories();
        setCategories(data);
      } catch (error) {
        console.error("Error fetching categories:", error);
        // Default mock categories in case API fails
        setCategories([
          { id: 1, name: 'Áo nam' },
          { id: 2, name: 'Áo nữ' },
          { id: 3, name: 'Quần nam' },
          { id: 4, name: 'Quần nữ' },
          { id: 5, name: 'Váy' },
          { id: 6, name: 'Giày' }
        ]);
      }
    };
    
    fetchCategories();
  }, []);
  
  useEffect(() => {
    if (isEditMode) {
      const fetchProductDetails = async () => {
        try {
          setLoading(true);
          const data = await getProductById(parseInt(id));
          
          // Transform the data to match the form format
          setFormData({
            name: data.name || '',
            category: data.category || null,
            price: data.price || '',
            des: data.des || '',
            inStock: data.inStock !== undefined ? data.inStock : true,
            img: data.img || '',
            // These might need to be fetched from a separate API or adapted
            sizes: data.sizes || [],
            colors: data.colors || []
          });
          
          if (data.img) {
            setImagePreview(data.img);
          }
          
          setLoading(false);
        } catch (error) {
          setError("Không thể tải thông tin sản phẩm. Vui lòng thử lại sau.");
          setLoading(false);
          console.error("Error fetching product details:", error);
        }
      };
      
      fetchProductDetails();
    }
  }, [id, isEditMode]);
  
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    // Handle different input types
    if (type === 'checkbox') {
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else if (name === 'price') {
      // Only allow numbers
      const numericValue = value.replace(/[^0-9]/g, '');
      setFormData(prev => ({ ...prev, [name]: numericValue }));
    } else if (name === 'category') {
      // Handle category selection
      if (value === '') {
        setFormData(prev => ({ ...prev, category: null }));
      } else {
        const selectedCategory = categories.find(cat => cat.id === parseInt(value));
        setFormData(prev => ({ ...prev, category: selectedCategory }));
      }
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };
  
  const handleSizeToggle = (size) => {
    setFormData(prev => {
      const newSizes = prev.sizes.includes(size)
        ? prev.sizes.filter(s => s !== size)
        : [...prev.sizes, size];
      
      return { ...prev, sizes: newSizes };
    });
  };
  
  const handleColorToggle = (color) => {
    setFormData(prev => {
      const newColors = prev.colors.includes(color)
        ? prev.colors.filter(c => c !== color)
        : [...prev.colors, color];
      
      return { ...prev, colors: newColors };
    });
  };
  
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // In a real application, you would upload the file to a server
      // and get back the URL. For this example, we'll create a local URL.
      const imageUrl = URL.createObjectURL(file);
      setImagePreview(imageUrl);
      setFormData(prev => ({ ...prev, img: file })); // In reality, this would be the URL from the server
    }
  };
  
  const handleRemoveImage = () => {
    setImagePreview('');
    setFormData(prev => ({ ...prev, img: '' }));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.name || !formData.category || !formData.price) {
      alert('Vui lòng điền đầy đủ thông tin bắt buộc: tên, danh mục và giá.');
      return;
    }
    
    try {
      // In a real application, you would call an API to save the product
      console.log('Saving product data:', formData);
      
      // Redirect to product list after save
      navigate('/admin/products');
    } catch (error) {
      setError("Không thể lưu sản phẩm. Vui lòng thử lại sau.");
      console.error("Error saving product:", error);
    }
  };
  
  if (loading) {
    return <div className="loading-container">Đang tải dữ liệu...</div>;
  }
  
  if (error) {
    return <div className="error-container">{error}</div>;
  }

  return (
    <div className="product-form-container">
      <div className="form-header">
        <h1>{isEditMode ? 'Chỉnh sửa sản phẩm' : 'Thêm sản phẩm mới'}</h1>
        <button 
          type="button" 
          className="cancel-button"
          onClick={() => navigate('/admin/products')}
        >
          Hủy
        </button>
      </div>
      
      <form onSubmit={handleSubmit} className="product-form">
        <div className="form-grid">
          <div className="form-section">
            <h2>Thông tin cơ bản</h2>
            
            <div className="form-group">
              <label htmlFor="name">Tên sản phẩm <span className="required">*</span></label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="category">Danh mục <span className="required">*</span></label>
              <select
                id="category"
                name="category"
                value={formData.category?.id || ''}
                onChange={handleChange}
                required
              >
                <option value="">Chọn danh mục</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>{category.name}</option>
                ))}
              </select>
            </div>
            
            <div className="form-group">
              <label htmlFor="price">Giá (VNĐ) <span className="required">*</span></label>
              <input
                type="text"
                id="price"
                name="price"
                value={formData.price}
                onChange={handleChange}
                required
                placeholder="Ví dụ: 450000"
              />
              {formData.price && (
                <div className="price-display">
                  {parseInt(formData.price).toLocaleString()} VNĐ
                </div>
              )}
            </div>
            
            <div className="form-group">
              <label htmlFor="des">Mô tả sản phẩm</label>
              <textarea
                id="des"
                name="des"
                value={formData.des}
                onChange={handleChange}
                rows="5"
              ></textarea>
            </div>
            
            <div className="form-group checkbox-group">
              <input
                type="checkbox"
                id="inStock"
                name="inStock"
                checked={formData.inStock}
                onChange={handleChange}
              />
              <label htmlFor="inStock">Còn hàng</label>
            </div>
          </div>
          
          <div className="form-section">
            <h2>Hình ảnh</h2>
            
            <div className="image-upload-container">
              {imagePreview ? (
                <div className="image-preview">
                  <img src={imagePreview} alt="Product Preview" />
                  <button 
                    type="button" 
                    className="remove-image-button"
                    onClick={handleRemoveImage}
                  >
                    <i className="fa fa-times"></i>
                  </button>
                </div>
              ) : (
                <div className="upload-placeholder">
                  <i className="fa fa-cloud-upload-alt"></i>
                  <p>Kéo thả hình ảnh vào đây hoặc nhấp để tải lên</p>
                </div>
              )}
              
              <input
                type="file"
                id="img"
                name="img"
                accept="image/*"
                onChange={handleImageChange}
                className={imagePreview ? "hidden" : ""}
              />
            </div>
            
            <h2>Kích thước & Màu sắc</h2>
            
            <div className="form-group">
              <label>Kích thước có sẵn</label>
              <div className="size-options">
                {availableSizes.map((size, index) => (
                  <div 
                    key={index} 
                    className={`size-option ${formData.sizes.includes(size) ? 'selected' : ''}`}
                    onClick={() => handleSizeToggle(size)}
                  >
                    {size}
                  </div>
                ))}
              </div>
            </div>
            
            <div className="form-group">
              <label>Màu sắc có sẵn</label>
              <div className="color-options">
                {availableColors.map((color, index) => (
                  <div 
                    key={index} 
                    className={`color-option ${formData.colors.includes(color) ? 'selected' : ''}`}
                    onClick={() => handleColorToggle(color)}
                  >
                    {color}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        
        <div className="form-actions">
          <button type="submit" className="save-button">
            {isEditMode ? 'Cập nhật sản phẩm' : 'Thêm sản phẩm'}
          </button>
        </div>
      </form>
      
      <style jsx>{`
        .product-form-container {
          padding: 20px;
          background-color: #fff;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        
        .form-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
        }
        
        .form-header h1 {
          font-size: 24px;
          margin: 0;
          color: #333;
        }
        
        .cancel-button {
          padding: 8px 16px;
          background-color: #6c757d;
          color: white;
          border: none;
          border-radius: 4px;
          font-size: 14px;
          cursor: pointer;
          transition: background-color 0.3s;
        }
        
        .cancel-button:hover {
          background-color: #5a6268;
        }
        
        .product-form {
          width: 100%;
        }
        
        .form-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 24px;
        }
        
        .form-section {
          margin-bottom: 24px;
        }
        
        .form-section h2 {
          font-size: 18px;
          margin-top: 0;
          margin-bottom: 16px;
          color: #333;
          border-bottom: 1px solid #e9ecef;
          padding-bottom: 8px;
        }
        
        .form-group {
          margin-bottom: 16px;
        }
        
        .form-group label {
          display: block;
          margin-bottom: 8px;
          font-weight: 600;
          color: #495057;
        }
        
        .required {
          color: #dc3545;
        }
        
        .form-group input[type="text"],
        .form-group select,
        .form-group textarea {
          width: 100%;
          padding: 10px 16px;
          border: 1px solid #ced4da;
          border-radius: 4px;
          font-size: 14px;
        }
        
        .form-group textarea {
          resize: vertical;
        }
        
        .price-display {
          margin-top: 4px;
          font-size: 14px;
          color: #6c757d;
        }
        
        .checkbox-group {
          display: flex;
          align-items: center;
        }
        
        .checkbox-group input {
          margin-right: 8px;
        }
        
        .checkbox-group label {
          margin-bottom: 0;
        }
        
        .image-upload-container {
          position: relative;
          margin-bottom: 24px;
          border: 2px dashed #ced4da;
          border-radius: 4px;
          text-align: center;
          cursor: pointer;
        }
        
        .upload-placeholder {
          padding: 60px 20px;
          color: #6c757d;
        }
        
        .upload-placeholder i {
          font-size: 48px;
          margin-bottom: 8px;
        }
        
        .upload-placeholder p {
          margin: 0;
          font-size: 14px;
        }
        
        .image-preview {
          position: relative;
        }
        
        .image-preview img {
          max-width: 100%;
          max-height: 300px;
          border-radius: 4px;
        }
        
        .remove-image-button {
          position: absolute;
          top: 10px;
          right: 10px;
          background-color: #dc3545;
          color: white;
          border: none;
          border-radius: 50%;
          width: 30px;
          height: 30px;
          font-size: 14px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .hidden {
          display: none;
        }
        
        .size-options, .color-options {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          margin-top: 8px;
        }
        
        .size-option, .color-option {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 40px;
          height: 40px;
          border: 1px solid #ced4da;
          border-radius: 4px;
          cursor: pointer;
          font-size: 14px;
        }
        
        .size-option.selected, .color-option.selected {
          background-color: #007bff;
          color: white;
          border-color: #007bff;
        }
        
        .form-actions {
          margin-top: 32px;
          text-align: center;
        }
        
        .save-button {
          padding: 12px 24px;
          background-color: #28a745;
          color: white;
          border: none;
          border-radius: 4px;
          font-size: 16px;
          cursor: pointer;
          transition: background-color 0.3s;
        }
        
        .save-button:hover {
          background-color: #218838;
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
          .form-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

export default ProductForm; 
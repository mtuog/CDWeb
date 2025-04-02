import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

const StoreSettings = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('general');
  
  // State for General Settings
  const [generalSettings, setGeneralSettings] = useState({
    storeName: '',
    storeDescription: '',
    storeEmail: '',
    storePhone: '',
    logoUrl: '',
    faviconUrl: '',
    currencyCode: 'VND',
    currencySymbol: '₫',
    orderPrefix: 'ORD-'
  });
  
  // State for Address Settings
  const [addressSettings, setAddressSettings] = useState({
    address: '',
    city: '',
    district: '',
    zipCode: '',
    country: 'Việt Nam'
  });
  
  // State for Payment Settings
  const [paymentSettings, setPaymentSettings] = useState({
    enableCod: true,
    enableBankTransfer: true,
    bankName: '',
    accountNumber: '',
    accountName: '',
    paymentInstructions: ''
  });
  
  // State for Shipping Settings
  const [shippingSettings, setShippingSettings] = useState({
    enableFreeShipping: false,
    freeShippingThreshold: 500000,
    flatRate: 30000,
    shippingFromAddress: true,
    enableLocalPickup: false
  });
  
  // State for Email Settings
  const [emailSettings, setEmailSettings] = useState({
    emailNotifications: true,
    adminEmail: '',
    sendOrderConfirmation: true,
    sendOrderStatusUpdates: true,
    emailFooter: ''
  });
  
  // Load mock data
  useEffect(() => {
    // This would be an API call in a real application
    setTimeout(() => {
      // Mock data
      setGeneralSettings({
        storeName: 'Fashion Store',
        storeDescription: 'Cửa hàng thời trang cao cấp',
        storeEmail: 'contact@fashionstore.com',
        storePhone: '0912345678',
        logoUrl: 'https://via.placeholder.com/200x50',
        faviconUrl: 'https://via.placeholder.com/32x32',
        currencyCode: 'VND',
        currencySymbol: '₫',
        orderPrefix: 'ORD-'
      });
      
      setAddressSettings({
        address: '123 Đường Lê Lợi',
        city: 'TP. Hồ Chí Minh',
        district: 'Quận 1',
        zipCode: '70000',
        country: 'Việt Nam'
      });
      
      setPaymentSettings({
        enableCod: true,
        enableBankTransfer: true,
        bankName: 'Vietcombank',
        accountNumber: '1234567890',
        accountName: 'FASHION STORE JSC',
        paymentInstructions: 'Vui lòng chuyển khoản với nội dung: [Mã đơn hàng]'
      });
      
      setShippingSettings({
        enableFreeShipping: true,
        freeShippingThreshold: 500000,
        flatRate: 30000,
        shippingFromAddress: true,
        enableLocalPickup: false
      });
      
      setEmailSettings({
        emailNotifications: true,
        adminEmail: 'admin@fashionstore.com',
        sendOrderConfirmation: true,
        sendOrderStatusUpdates: true,
        emailFooter: 'Fashion Store - 123 Đường Lê Lợi, Quận 1, TP.HCM'
      });
      
      setLoading(false);
    }, 800);
  }, []);
  
  // Handle input changes
  const handleGeneralChange = (e) => {
    const { name, value } = e.target;
    setGeneralSettings(prev => ({ ...prev, [name]: value }));
  };
  
  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setAddressSettings(prev => ({ ...prev, [name]: value }));
  };
  
  const handlePaymentChange = (e) => {
    const { name, value, type, checked } = e.target;
    setPaymentSettings(prev => ({ 
      ...prev, 
      [name]: type === 'checkbox' ? checked : value 
    }));
  };
  
  const handleShippingChange = (e) => {
    const { name, value, type, checked } = e.target;
    setShippingSettings(prev => ({ 
      ...prev, 
      [name]: type === 'checkbox' ? checked : value 
    }));
  };
  
  const handleEmailChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEmailSettings(prev => ({ 
      ...prev, 
      [name]: type === 'checkbox' ? checked : value 
    }));
  };
  
  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    setSaving(true);
    
    // This would be an API call in a real application
    setTimeout(() => {
      setSaving(false);
      toast.success('Lưu cài đặt thành công!');
    }, 800);
  };
  
  if (loading) {
    return <div className="loading-container">Đang tải cài đặt...</div>;
  }
  
  return (
    <div className="settings-container">
      <div className="page-header">
        <h1>Cài đặt cửa hàng</h1>
      </div>
      
      <div className="settings-content">
        <div className="settings-tabs">
          <button 
            className={`tab-button ${activeTab === 'general' ? 'active' : ''}`}
            onClick={() => setActiveTab('general')}
          >
            <i className="fa fa-store"></i> Thông tin chung
          </button>
          <button 
            className={`tab-button ${activeTab === 'address' ? 'active' : ''}`}
            onClick={() => setActiveTab('address')}
          >
            <i className="fa fa-map-marker-alt"></i> Địa chỉ
          </button>
          <button 
            className={`tab-button ${activeTab === 'payment' ? 'active' : ''}`}
            onClick={() => setActiveTab('payment')}
          >
            <i className="fa fa-credit-card"></i> Thanh toán
          </button>
          <button 
            className={`tab-button ${activeTab === 'shipping' ? 'active' : ''}`}
            onClick={() => setActiveTab('shipping')}
          >
            <i className="fa fa-shipping-fast"></i> Vận chuyển
          </button>
          <button 
            className={`tab-button ${activeTab === 'email' ? 'active' : ''}`}
            onClick={() => setActiveTab('email')}
          >
            <i className="fa fa-envelope"></i> Email
          </button>
        </div>
        
        <div className="settings-form-container">
          <form onSubmit={handleSubmit}>
            {/* General Settings */}
            <div className={`tab-content ${activeTab === 'general' ? 'active' : ''}`}>
              <h2>Thông tin chung</h2>
              
              <div className="form-group">
                <label htmlFor="storeName">Tên cửa hàng</label>
                <input
                  type="text"
                  id="storeName"
                  name="storeName"
                  value={generalSettings.storeName}
                  onChange={handleGeneralChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="storeDescription">Mô tả cửa hàng</label>
                <textarea
                  id="storeDescription"
                  name="storeDescription"
                  value={generalSettings.storeDescription}
                  onChange={handleGeneralChange}
                  rows="3"
                ></textarea>
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="storeEmail">Email liên hệ</label>
                  <input
                    type="email"
                    id="storeEmail"
                    name="storeEmail"
                    value={generalSettings.storeEmail}
                    onChange={handleGeneralChange}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="storePhone">Số điện thoại</label>
                  <input
                    type="text"
                    id="storePhone"
                    name="storePhone"
                    value={generalSettings.storePhone}
                    onChange={handleGeneralChange}
                    required
                  />
                </div>
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="logoUrl">URL Logo</label>
                  <input
                    type="text"
                    id="logoUrl"
                    name="logoUrl"
                    value={generalSettings.logoUrl}
                    onChange={handleGeneralChange}
                  />
                  {generalSettings.logoUrl && (
                    <div className="image-preview">
                      <img src={generalSettings.logoUrl} alt="Logo preview" />
                    </div>
                  )}
                </div>
                
                <div className="form-group">
                  <label htmlFor="faviconUrl">URL Favicon</label>
                  <input
                    type="text"
                    id="faviconUrl"
                    name="faviconUrl"
                    value={generalSettings.faviconUrl}
                    onChange={handleGeneralChange}
                  />
                  {generalSettings.faviconUrl && (
                    <div className="image-preview small">
                      <img src={generalSettings.faviconUrl} alt="Favicon preview" />
                    </div>
                  )}
                </div>
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="currencyCode">Mã tiền tệ</label>
                  <input
                    type="text"
                    id="currencyCode"
                    name="currencyCode"
                    value={generalSettings.currencyCode}
                    onChange={handleGeneralChange}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="currencySymbol">Ký hiệu tiền tệ</label>
                  <input
                    type="text"
                    id="currencySymbol"
                    name="currencySymbol"
                    value={generalSettings.currencySymbol}
                    onChange={handleGeneralChange}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="orderPrefix">Tiền tố mã đơn hàng</label>
                  <input
                    type="text"
                    id="orderPrefix"
                    name="orderPrefix"
                    value={generalSettings.orderPrefix}
                    onChange={handleGeneralChange}
                  />
                </div>
              </div>
            </div>
            
            {/* Address Settings */}
            <div className={`tab-content ${activeTab === 'address' ? 'active' : ''}`}>
              <h2>Địa chỉ</h2>
              
              <div className="form-group">
                <label htmlFor="address">Địa chỉ</label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  value={addressSettings.address}
                  onChange={handleAddressChange}
                  required
                />
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="city">Thành phố</label>
                  <input
                    type="text"
                    id="city"
                    name="city"
                    value={addressSettings.city}
                    onChange={handleAddressChange}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="district">Quận/Huyện</label>
                  <input
                    type="text"
                    id="district"
                    name="district"
                    value={addressSettings.district}
                    onChange={handleAddressChange}
                    required
                  />
                </div>
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="zipCode">Mã bưu điện</label>
                  <input
                    type="text"
                    id="zipCode"
                    name="zipCode"
                    value={addressSettings.zipCode}
                    onChange={handleAddressChange}
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="country">Quốc gia</label>
                  <input
                    type="text"
                    id="country"
                    name="country"
                    value={addressSettings.country}
                    onChange={handleAddressChange}
                    required
                  />
                </div>
              </div>
            </div>
            
            {/* Payment Settings */}
            <div className={`tab-content ${activeTab === 'payment' ? 'active' : ''}`}>
              <h2>Thanh toán</h2>
              
              <div className="form-group checkbox-group">
                <label>
                  <input
                    type="checkbox"
                    name="enableCod"
                    checked={paymentSettings.enableCod}
                    onChange={handlePaymentChange}
                  />
                  Thanh toán khi nhận hàng (COD)
                </label>
              </div>
              
              <div className="form-group checkbox-group">
                <label>
                  <input
                    type="checkbox"
                    name="enableBankTransfer"
                    checked={paymentSettings.enableBankTransfer}
                    onChange={handlePaymentChange}
                  />
                  Chuyển khoản ngân hàng
                </label>
              </div>
              
              {paymentSettings.enableBankTransfer && (
                <div className="bank-details">
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="bankName">Tên ngân hàng</label>
                      <input
                        type="text"
                        id="bankName"
                        name="bankName"
                        value={paymentSettings.bankName}
                        onChange={handlePaymentChange}
                        required={paymentSettings.enableBankTransfer}
                      />
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor="accountNumber">Số tài khoản</label>
                      <input
                        type="text"
                        id="accountNumber"
                        name="accountNumber"
                        value={paymentSettings.accountNumber}
                        onChange={handlePaymentChange}
                        required={paymentSettings.enableBankTransfer}
                      />
                    </div>
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="accountName">Tên chủ tài khoản</label>
                    <input
                      type="text"
                      id="accountName"
                      name="accountName"
                      value={paymentSettings.accountName}
                      onChange={handlePaymentChange}
                      required={paymentSettings.enableBankTransfer}
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="paymentInstructions">Hướng dẫn thanh toán</label>
                    <textarea
                      id="paymentInstructions"
                      name="paymentInstructions"
                      value={paymentSettings.paymentInstructions}
                      onChange={handlePaymentChange}
                      rows="3"
                    ></textarea>
                  </div>
                </div>
              )}
            </div>
            
            {/* Shipping Settings */}
            <div className={`tab-content ${activeTab === 'shipping' ? 'active' : ''}`}>
              <h2>Vận chuyển</h2>
              
              <div className="form-group checkbox-group">
                <label>
                  <input
                    type="checkbox"
                    name="enableFreeShipping"
                    checked={shippingSettings.enableFreeShipping}
                    onChange={handleShippingChange}
                  />
                  Miễn phí vận chuyển khi đạt giá trị đơn hàng tối thiểu
                </label>
              </div>
              
              {shippingSettings.enableFreeShipping && (
                <div className="form-group">
                  <label htmlFor="freeShippingThreshold">Giá trị tối thiểu</label>
                  <input
                    type="number"
                    id="freeShippingThreshold"
                    name="freeShippingThreshold"
                    value={shippingSettings.freeShippingThreshold}
                    onChange={handleShippingChange}
                    required={shippingSettings.enableFreeShipping}
                  />
                </div>
              )}
              
              <div className="form-group">
                <label htmlFor="flatRate">Phí vận chuyển mặc định</label>
                <input
                  type="number"
                  id="flatRate"
                  name="flatRate"
                  value={shippingSettings.flatRate}
                  onChange={handleShippingChange}
                  required
                />
              </div>
              
              <div className="form-group checkbox-group">
                <label>
                  <input
                    type="checkbox"
                    name="shippingFromAddress"
                    checked={shippingSettings.shippingFromAddress}
                    onChange={handleShippingChange}
                  />
                  Sử dụng địa chỉ cửa hàng làm địa chỉ gửi hàng
                </label>
              </div>
              
              <div className="form-group checkbox-group">
                <label>
                  <input
                    type="checkbox"
                    name="enableLocalPickup"
                    checked={shippingSettings.enableLocalPickup}
                    onChange={handleShippingChange}
                  />
                  Cho phép nhận hàng tại cửa hàng
                </label>
              </div>
            </div>
            
            {/* Email Settings */}
            <div className={`tab-content ${activeTab === 'email' ? 'active' : ''}`}>
              <h2>Email</h2>
              
              <div className="form-group checkbox-group">
                <label>
                  <input
                    type="checkbox"
                    name="emailNotifications"
                    checked={emailSettings.emailNotifications}
                    onChange={handleEmailChange}
                  />
                  Bật thông báo email
                </label>
              </div>
              
              <div className="form-group">
                <label htmlFor="adminEmail">Email quản trị viên</label>
                <input
                  type="email"
                  id="adminEmail"
                  name="adminEmail"
                  value={emailSettings.adminEmail}
                  onChange={handleEmailChange}
                  required={emailSettings.emailNotifications}
                />
                <small>Email nhận thông báo đơn hàng mới và các thông báo hệ thống</small>
              </div>
              
              <div className="form-group checkbox-group">
                <label>
                  <input
                    type="checkbox"
                    name="sendOrderConfirmation"
                    checked={emailSettings.sendOrderConfirmation}
                    onChange={handleEmailChange}
                  />
                  Gửi email xác nhận đơn hàng
                </label>
              </div>
              
              <div className="form-group checkbox-group">
                <label>
                  <input
                    type="checkbox"
                    name="sendOrderStatusUpdates"
                    checked={emailSettings.sendOrderStatusUpdates}
                    onChange={handleEmailChange}
                  />
                  Gửi cập nhật trạng thái đơn hàng
                </label>
              </div>
              
              <div className="form-group">
                <label htmlFor="emailFooter">Chân trang email</label>
                <textarea
                  id="emailFooter"
                  name="emailFooter"
                  value={emailSettings.emailFooter}
                  onChange={handleEmailChange}
                  rows="3"
                ></textarea>
              </div>
            </div>
            
            <div className="form-actions">
              <button type="submit" className="save-button" disabled={saving}>
                {saving ? 'Đang lưu...' : 'Lưu cài đặt'}
              </button>
            </div>
          </form>
        </div>
      </div>
      
      <style jsx>{`
        .settings-container {
          padding: 20px;
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
        
        .settings-content {
          background-color: white;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.08);
          display: flex;
          overflow: hidden;
        }
        
        .settings-tabs {
          width: 250px;
          background-color: #f8f9fa;
          padding: 20px 0;
          border-right: 1px solid #e9ecef;
        }
        
        .tab-button {
          display: flex;
          align-items: center;
          width: 100%;
          padding: 12px 20px;
          text-align: left;
          background: none;
          border: none;
          font-size: 15px;
          color: #495057;
          cursor: pointer;
          transition: background-color 0.3s;
        }
        
        .tab-button i {
          margin-right: 12px;
          width: 20px;
          text-align: center;
        }
        
        .tab-button:hover {
          background-color: rgba(0,0,0,0.03);
        }
        
        .tab-button.active {
          background-color: #007bff;
          color: white;
        }
        
        .settings-form-container {
          flex: 1;
          padding: 30px;
        }
        
        .tab-content {
          display: none;
        }
        
        .tab-content.active {
          display: block;
        }
        
        .tab-content h2 {
          font-size: 20px;
          margin: 0 0 24px 0;
          color: #333;
          padding-bottom: 12px;
          border-bottom: 1px solid #e9ecef;
        }
        
        .form-group {
          margin-bottom: 20px;
        }
        
        .form-row {
          display: flex;
          gap: 20px;
          margin-bottom: 20px;
        }
        
        .form-row .form-group {
          flex: 1;
          margin-bottom: 0;
        }
        
        .form-group label {
          display: block;
          margin-bottom: 8px;
          font-weight: 500;
          color: #333;
        }
        
        .form-group input[type="text"],
        .form-group input[type="email"],
        .form-group input[type="number"],
        .form-group select,
        .form-group textarea {
          width: 100%;
          padding: 10px 12px;
          border: 1px solid #ced4da;
          border-radius: 4px;
          font-size: 14px;
        }
        
        .form-group small {
          display: block;
          margin-top: 4px;
          font-size: 12px;
          color: #6c757d;
        }
        
        .checkbox-group {
          display: flex;
          align-items: center;
        }
        
        .checkbox-group label {
          display: flex;
          align-items: center;
          margin-bottom: 0;
          cursor: pointer;
        }
        
        .checkbox-group input[type="checkbox"] {
          margin-right: 8px;
          width: 16px;
          height: 16px;
        }
        
        .bank-details {
          margin-top: 16px;
          padding-top: 16px;
          border-top: 1px solid #e9ecef;
        }
        
        .image-preview {
          margin-top: 8px;
          max-width: 200px;
          border: 1px solid #e9ecef;
          padding: 4px;
          border-radius: 4px;
        }
        
        .image-preview img {
          max-width: 100%;
          height: auto;
        }
        
        .image-preview.small {
          max-width: 50px;
        }
        
        .form-actions {
          margin-top: 30px;
          padding-top: 20px;
          border-top: 1px solid #e9ecef;
          text-align: right;
        }
        
        .save-button {
          padding: 10px 20px;
          background-color: #28a745;
          color: white;
          border: none;
          border-radius: 4px;
          font-size: 14px;
          cursor: pointer;
          transition: background-color 0.3s;
        }
        
        .save-button:hover {
          background-color: #218838;
        }
        
        .save-button:disabled {
          background-color: #6c757d;
          cursor: not-allowed;
        }
        
        @media (max-width: 768px) {
          .settings-content {
            flex-direction: column;
          }
          
          .settings-tabs {
            width: 100%;
            border-right: none;
            border-bottom: 1px solid #e9ecef;
            padding: 10px 0;
          }
          
          .form-row {
            flex-direction: column;
            gap: 20px;
          }
          
          .form-row .form-group {
            margin-bottom: 0;
          }
        }
      `}</style>
    </div>
  );
};

export default StoreSettings; 
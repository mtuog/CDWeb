import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

const PaymentSettings = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  // State for payment methods
  const [paymentMethods, setPaymentMethods] = useState([
    {
      id: 'cod',
      name: 'Thanh toán khi nhận hàng (COD)',
      enabled: true,
      description: 'Khách hàng thanh toán cho người giao hàng khi nhận hàng',
      fee: 0,
      icon: 'fa-money-bill',
      position: 1
    },
    {
      id: 'bank_transfer',
      name: 'Chuyển khoản ngân hàng',
      enabled: true,
      description: 'Chuyển khoản trực tiếp vào tài khoản ngân hàng của cửa hàng',
      fee: 0,
      icon: 'fa-university',
      position: 2
    },
    {
      id: 'momo',
      name: 'Ví Momo',
      enabled: false,
      description: 'Thanh toán qua ví điện tử Momo',
      fee: 1.5,
      icon: 'fa-wallet',
      position: 3
    },
    {
      id: 'vnpay',
      name: 'VNPay',
      enabled: false,
      description: 'Thanh toán qua cổng thanh toán VNPay',
      fee: 1.8,
      icon: 'fa-credit-card',
      position: 4
    },
    {
      id: 'paypal',
      name: 'PayPal',
      enabled: false,
      description: 'Thanh toán qua PayPal (quốc tế)',
      fee: 3.5,
      icon: 'fa-paypal',
      position: 5
    }
  ]);

  // State for bank details
  const [bankDetails, setBankDetails] = useState({
    accountName: '',
    accountNumber: '',
    bankName: '',
    bankBranch: '',
    instructions: ''
  });

  // State for momo details
  const [momoDetails, setMomoDetails] = useState({
    phoneNumber: '',
    accountName: '',
    qrCodeUrl: ''
  });

  // State for VNPay details
  const [vnpayDetails, setVnpayDetails] = useState({
    merchantId: '',
    secureHash: '',
    testMode: true
  });

  // State for PayPal details
  const [paypalDetails, setPaypalDetails] = useState({
    clientId: '',
    clientSecret: '',
    testMode: true
  });

  // State for general payment settings
  const [generalSettings, setGeneralSettings] = useState({
    defaultPaymentMethod: 'cod',
    showPaymentIcons: true,
    enablePaymentFees: false,
    orderConfirmationRequired: true,
    pendingOrderTimeout: 24 // hours
  });

  // Load mock data
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      // Mock data for bank details
      setBankDetails({
        accountName: 'FASHION STORE JSC',
        accountNumber: '1234567890',
        bankName: 'Vietcombank',
        bankBranch: 'Hồ Chí Minh',
        instructions: 'Vui lòng chuyển khoản với nội dung: [Mã đơn hàng]'
      });

      // Mock data for momo details
      setMomoDetails({
        phoneNumber: '0912345678',
        accountName: 'FASHION STORE',
        qrCodeUrl: 'https://via.placeholder.com/200x200'
      });

      // Mock data for VNPay details
      setVnpayDetails({
        merchantId: 'VNPAY123456',
        secureHash: 'abcdef0123456789',
        testMode: true
      });

      // Mock data for PayPal details
      setPaypalDetails({
        clientId: 'paypal-client-id',
        clientSecret: 'paypal-client-secret',
        testMode: true
      });

      setLoading(false);
    }, 800);
  }, []);

  const handlePaymentMethodToggle = (id) => {
    setPaymentMethods(prev => 
      prev.map(method => 
        method.id === id ? { ...method, enabled: !method.enabled } : method
      )
    );
  };

  const handleMethodReorder = (id, direction) => {
    setPaymentMethods(prev => {
      const methods = [...prev];
      const index = methods.findIndex(m => m.id === id);
      
      if (index === -1) return prev;
      
      // Calculate new position
      const newIndex = direction === 'up' ? Math.max(0, index - 1) : Math.min(methods.length - 1, index + 1);
      
      // No change if already at extremes
      if (newIndex === index) return prev;
      
      // Swap positions
      const temp = methods[index];
      methods[index] = methods[newIndex];
      methods[newIndex] = temp;
      
      // Update position values
      return methods.map((method, idx) => ({
        ...method,
        position: idx + 1
      }));
    });
  };

  const handleInputChange = (e, setter) => {
    const { name, value, type, checked } = e.target;
    setter(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleMethodInputChange = (e, id) => {
    const { name, value, type, checked } = e.target;
    setPaymentMethods(prev => 
      prev.map(method => 
        method.id === id 
          ? { ...method, [name]: type === 'checkbox' ? checked : value } 
          : method
      )
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSaving(true);
    
    // This would be an API call in a real application
    setTimeout(() => {
      setSaving(false);
      toast.success('Lưu cài đặt thanh toán thành công!');
    }, 800);
  };

  if (loading) {
    return <div className="loading-container">Đang tải cài đặt thanh toán...</div>;
  }

  return (
    <div className="payment-settings-container">
      <div className="page-header">
        <h1>Cài đặt thanh toán</h1>
      </div>

      <form onSubmit={handleSubmit}>
        {/* General Payment Settings */}
        <div className="settings-card">
          <h2>Cài đặt chung</h2>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="defaultPaymentMethod">Phương thức thanh toán mặc định</label>
              <select
                id="defaultPaymentMethod"
                name="defaultPaymentMethod"
                value={generalSettings.defaultPaymentMethod}
                onChange={(e) => handleInputChange(e, setGeneralSettings)}
              >
                {paymentMethods.filter(m => m.enabled).map(method => (
                  <option key={method.id} value={method.id}>
                    {method.name}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="form-group">
              <label htmlFor="pendingOrderTimeout">Thời hạn đơn hàng chờ thanh toán (giờ)</label>
              <input
                type="number"
                id="pendingOrderTimeout"
                name="pendingOrderTimeout"
                value={generalSettings.pendingOrderTimeout}
                onChange={(e) => handleInputChange(e, setGeneralSettings)}
                min="1"
                max="168"
              />
            </div>
          </div>
          
          <div className="form-group checkbox-group">
            <label>
              <input
                type="checkbox"
                name="showPaymentIcons"
                checked={generalSettings.showPaymentIcons}
                onChange={(e) => handleInputChange(e, setGeneralSettings)}
              />
              Hiển thị biểu tượng phương thức thanh toán
            </label>
          </div>
          
          <div className="form-group checkbox-group">
            <label>
              <input
                type="checkbox"
                name="enablePaymentFees"
                checked={generalSettings.enablePaymentFees}
                onChange={(e) => handleInputChange(e, setGeneralSettings)}
              />
              Áp dụng phí thanh toán cho khách hàng
            </label>
          </div>
          
          <div className="form-group checkbox-group">
            <label>
              <input
                type="checkbox"
                name="orderConfirmationRequired"
                checked={generalSettings.orderConfirmationRequired}
                onChange={(e) => handleInputChange(e, setGeneralSettings)}
              />
              Yêu cầu xác nhận đơn hàng từ quản trị viên
            </label>
          </div>
        </div>
        
        {/* Payment Methods */}
        <div className="settings-card">
          <h2>Phương thức thanh toán</h2>
          
          <div className="payment-methods-list">
            {paymentMethods.map((method) => (
              <div key={method.id} className="payment-method-item">
                <div className="payment-method-header">
                  <div className="payment-method-toggle">
                    <input
                      type="checkbox"
                      id={`toggle-${method.id}`}
                      checked={method.enabled}
                      onChange={() => handlePaymentMethodToggle(method.id)}
                    />
                    <label htmlFor={`toggle-${method.id}`} className="toggle-label">
                      <span className="toggle-inner"></span>
                      <span className="toggle-switch"></span>
                    </label>
                  </div>
                  
                  <div className="payment-method-title">
                    <i className={`fas ${method.icon}`}></i>
                    <h3>{method.name}</h3>
                  </div>
                  
                  <div className="payment-method-actions">
                    <button 
                      type="button" 
                      className="move-btn"
                      onClick={() => handleMethodReorder(method.id, 'up')}
                      disabled={method.position === 1}
                    >
                      <i className="fas fa-arrow-up"></i>
                    </button>
                    <button 
                      type="button" 
                      className="move-btn"
                      onClick={() => handleMethodReorder(method.id, 'down')}
                      disabled={method.position === paymentMethods.length}
                    >
                      <i className="fas fa-arrow-down"></i>
                    </button>
                  </div>
                </div>
                
                {method.enabled && (
                  <div className="payment-method-details">
                    <div className="form-group">
                      <label htmlFor={`name-${method.id}`}>Tên hiển thị</label>
                      <input
                        type="text"
                        id={`name-${method.id}`}
                        name="name"
                        value={method.name}
                        onChange={(e) => handleMethodInputChange(e, method.id)}
                      />
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor={`description-${method.id}`}>Mô tả</label>
                      <textarea
                        id={`description-${method.id}`}
                        name="description"
                        value={method.description}
                        onChange={(e) => handleMethodInputChange(e, method.id)}
                        rows="2"
                      ></textarea>
                    </div>
                    
                    <div className="form-row">
                      <div className="form-group">
                        <label htmlFor={`fee-${method.id}`}>Phí giao dịch (%)</label>
                        <input
                          type="number"
                          id={`fee-${method.id}`}
                          name="fee"
                          value={method.fee}
                          onChange={(e) => handleMethodInputChange(e, method.id)}
                          step="0.1"
                          min="0"
                        />
                      </div>
                      
                      <div className="form-group">
                        <label htmlFor={`icon-${method.id}`}>Biểu tượng</label>
                        <input
                          type="text"
                          id={`icon-${method.id}`}
                          name="icon"
                          value={method.icon}
                          onChange={(e) => handleMethodInputChange(e, method.id)}
                        />
                      </div>
                    </div>
                    
                    {/* Method-specific configuration */}
                    {method.id === 'bank_transfer' && (
                      <div className="method-specific-config">
                        <h4>Cấu hình chuyển khoản ngân hàng</h4>
                        
                        <div className="form-row">
                          <div className="form-group">
                            <label htmlFor="bankName">Tên ngân hàng</label>
                            <input
                              type="text"
                              id="bankName"
                              name="bankName"
                              value={bankDetails.bankName}
                              onChange={(e) => handleInputChange(e, setBankDetails)}
                              required
                            />
                          </div>
                          
                          <div className="form-group">
                            <label htmlFor="bankBranch">Chi nhánh</label>
                            <input
                              type="text"
                              id="bankBranch"
                              name="bankBranch"
                              value={bankDetails.bankBranch}
                              onChange={(e) => handleInputChange(e, setBankDetails)}
                            />
                          </div>
                        </div>
                        
                        <div className="form-row">
                          <div className="form-group">
                            <label htmlFor="accountName">Tên chủ tài khoản</label>
                            <input
                              type="text"
                              id="accountName"
                              name="accountName"
                              value={bankDetails.accountName}
                              onChange={(e) => handleInputChange(e, setBankDetails)}
                              required
                            />
                          </div>
                          
                          <div className="form-group">
                            <label htmlFor="accountNumber">Số tài khoản</label>
                            <input
                              type="text"
                              id="accountNumber"
                              name="accountNumber"
                              value={bankDetails.accountNumber}
                              onChange={(e) => handleInputChange(e, setBankDetails)}
                              required
                            />
                          </div>
                        </div>
                        
                        <div className="form-group">
                          <label htmlFor="instructions">Hướng dẫn thanh toán</label>
                          <textarea
                            id="instructions"
                            name="instructions"
                            value={bankDetails.instructions}
                            onChange={(e) => handleInputChange(e, setBankDetails)}
                            rows="3"
                          ></textarea>
                        </div>
                      </div>
                    )}
                    
                    {method.id === 'momo' && (
                      <div className="method-specific-config">
                        <h4>Cấu hình Momo</h4>
                        
                        <div className="form-row">
                          <div className="form-group">
                            <label htmlFor="phoneNumber">Số điện thoại Momo</label>
                            <input
                              type="text"
                              id="phoneNumber"
                              name="phoneNumber"
                              value={momoDetails.phoneNumber}
                              onChange={(e) => handleInputChange(e, setMomoDetails)}
                              required
                            />
                          </div>
                          
                          <div className="form-group">
                            <label htmlFor="momoAccountName">Tên tài khoản Momo</label>
                            <input
                              type="text"
                              id="momoAccountName"
                              name="accountName"
                              value={momoDetails.accountName}
                              onChange={(e) => handleInputChange(e, setMomoDetails)}
                              required
                            />
                          </div>
                        </div>
                        
                        <div className="form-group">
                          <label htmlFor="qrCodeUrl">URL mã QR Momo</label>
                          <input
                            type="text"
                            id="qrCodeUrl"
                            name="qrCodeUrl"
                            value={momoDetails.qrCodeUrl}
                            onChange={(e) => handleInputChange(e, setMomoDetails)}
                          />
                          {momoDetails.qrCodeUrl && (
                            <div className="image-preview">
                              <img src={momoDetails.qrCodeUrl} alt="Momo QR Code" />
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                    
                    {method.id === 'vnpay' && (
                      <div className="method-specific-config">
                        <h4>Cấu hình VNPay</h4>
                        
                        <div className="form-row">
                          <div className="form-group">
                            <label htmlFor="merchantId">Merchant ID</label>
                            <input
                              type="text"
                              id="merchantId"
                              name="merchantId"
                              value={vnpayDetails.merchantId}
                              onChange={(e) => handleInputChange(e, setVnpayDetails)}
                              required
                            />
                          </div>
                          
                          <div className="form-group">
                            <label htmlFor="secureHash">Secure Hash</label>
                            <input
                              type="password"
                              id="secureHash"
                              name="secureHash"
                              value={vnpayDetails.secureHash}
                              onChange={(e) => handleInputChange(e, setVnpayDetails)}
                              required
                            />
                          </div>
                        </div>
                        
                        <div className="form-group checkbox-group">
                          <label>
                            <input
                              type="checkbox"
                              name="testMode"
                              checked={vnpayDetails.testMode}
                              onChange={(e) => handleInputChange(e, setVnpayDetails)}
                            />
                            Sử dụng môi trường test
                          </label>
                        </div>
                      </div>
                    )}
                    
                    {method.id === 'paypal' && (
                      <div className="method-specific-config">
                        <h4>Cấu hình PayPal</h4>
                        
                        <div className="form-row">
                          <div className="form-group">
                            <label htmlFor="clientId">Client ID</label>
                            <input
                              type="text"
                              id="clientId"
                              name="clientId"
                              value={paypalDetails.clientId}
                              onChange={(e) => handleInputChange(e, setPaypalDetails)}
                              required
                            />
                          </div>
                          
                          <div className="form-group">
                            <label htmlFor="clientSecret">Client Secret</label>
                            <input
                              type="password"
                              id="clientSecret"
                              name="clientSecret"
                              value={paypalDetails.clientSecret}
                              onChange={(e) => handleInputChange(e, setPaypalDetails)}
                              required
                            />
                          </div>
                        </div>
                        
                        <div className="form-group checkbox-group">
                          <label>
                            <input
                              type="checkbox"
                              name="testMode"
                              checked={paypalDetails.testMode}
                              onChange={(e) => handleInputChange(e, setPaypalDetails)}
                            />
                            Sử dụng môi trường sandbox
                          </label>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
        
        <div className="form-actions">
          <button type="submit" className="save-button" disabled={saving}>
            {saving ? 'Đang lưu...' : 'Lưu cài đặt thanh toán'}
          </button>
        </div>
      </form>
      
      <style jsx>{`
        .payment-settings-container {
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
        
        .settings-card {
          background-color: white;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.08);
          padding: 24px;
          margin-bottom: 24px;
        }
        
        .settings-card h2 {
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
        .form-group input[type="password"],
        .form-group input[type="number"],
        .form-group select,
        .form-group textarea {
          width: 100%;
          padding: 10px 12px;
          border: 1px solid #ced4da;
          border-radius: 4px;
          font-size: 14px;
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
        
        .payment-methods-list {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        
        .payment-method-item {
          border: 1px solid #e9ecef;
          border-radius: 6px;
          overflow: hidden;
        }
        
        .payment-method-header {
          display: flex;
          align-items: center;
          padding: 16px;
          background-color: #f8f9fa;
          border-bottom: 1px solid #e9ecef;
        }
        
        .payment-method-title {
          display: flex;
          align-items: center;
          flex: 1;
        }
        
        .payment-method-title i {
          margin-right: 12px;
          font-size: 18px;
          width: 24px;
          text-align: center;
          color: #495057;
        }
        
        .payment-method-title h3 {
          margin: 0;
          font-size: 16px;
          font-weight: 500;
        }
        
        .payment-method-toggle {
          margin-right: 16px;
        }
        
        /* Toggle switch styling */
        .payment-method-toggle input {
          height: 0;
          width: 0;
          visibility: hidden;
          position: absolute;
        }
        
        .toggle-label {
          display: flex;
          align-items: center;
          justify-content: space-between;
          cursor: pointer;
          width: 50px;
          height: 25px;
          background: #ced4da;
          border-radius: 25px;
          position: relative;
          transition: background-color 0.2s;
        }
        
        .toggle-label .toggle-inner {
          width: 21px;
          height: 21px;
          background: #fff;
          border-radius: 50%;
          position: absolute;
          top: 2px;
          left: 2px;
          transition: 0.2s;
          box-shadow: 0 0 2px 0 rgba(10, 10, 10, 0.29);
        }
        
        .payment-method-toggle input:checked + .toggle-label {
          background: #28a745;
        }
        
        .payment-method-toggle input:checked + .toggle-label .toggle-inner {
          left: calc(100% - 2px);
          transform: translateX(-100%);
        }
        
        .payment-method-details {
          padding: 16px;
        }
        
        .payment-method-actions {
          display: flex;
          gap: 8px;
        }
        
        .move-btn {
          background: none;
          border: 1px solid #ced4da;
          border-radius: 4px;
          width: 30px;
          height: 30px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          color: #495057;
        }
        
        .move-btn:hover {
          background-color: #e9ecef;
        }
        
        .move-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        
        .method-specific-config {
          margin-top: 16px;
          padding-top: 16px;
          border-top: 1px solid #e9ecef;
        }
        
        .method-specific-config h4 {
          font-size: 16px;
          margin: 0 0 16px 0;
          color: #495057;
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
        
        .form-actions {
          margin-top: 30px;
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

export default PaymentSettings; 
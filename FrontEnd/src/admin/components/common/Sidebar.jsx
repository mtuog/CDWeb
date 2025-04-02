import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Sidebar = ({ isOpen }) => {
  const location = useLocation();
  const [activeDropdown, setActiveDropdown] = useState(null);
  
  const menuItems = [
    {
      title: 'Dashboard',
      icon: 'fa fa-tachometer-alt',
      path: '/admin/dashboard'
    },
    {
      title: 'Sản phẩm',
      icon: 'fa fa-box',
      path: '/admin/products',
      submenu: [
        { title: 'Danh sách sản phẩm', path: '/admin/products' },
        { title: 'Thêm sản phẩm', path: '/admin/products/add' },
        { title: 'Danh mục', path: '/admin/categories' }
      ]
    },
    {
      title: 'Đơn hàng',
      icon: 'fa fa-shopping-cart',
      path: '/admin/orders'
    },
    {
      title: 'Khách hàng',
      icon: 'fa fa-users',
      path: '/admin/customers'
    },
    {
      title: 'Thống kê',
      icon: 'fa fa-chart-bar',
      path: '/admin/analytics'
    },
    {
      title: 'Cài đặt',
      icon: 'fa fa-cog',
      path: '/admin/settings'
    }
  ];
  
  const toggleDropdown = (index) => {
    if (activeDropdown === index) {
      setActiveDropdown(null);
    } else {
      setActiveDropdown(index);
    }
  };
  
  const isActive = (path) => {
    return location.pathname === path;
  };
  
  const isActiveParent = (item) => {
    if (location.pathname === item.path) {
      return true;
    }
    
    if (item.submenu) {
      return item.submenu.some(subItem => location.pathname === subItem.path);
    }
    
    return false;
  };

  return (
    <aside className={`admin-sidebar ${isOpen ? 'open' : 'closed'}`}>
      <div className="sidebar-header">
        <Link to="/admin/dashboard" className="logo-container">
          {isOpen ? (
            <h2 className="logo-text">Admin Panel</h2>
          ) : (
            <h2 className="logo-icon">A</h2>
          )}
        </Link>
      </div>
      
      <nav className="sidebar-nav">
        <ul className="menu">
          {menuItems.map((item, index) => (
            <li 
              key={index} 
              className={`menu-item ${isActiveParent(item) ? 'active' : ''}`}
            >
              {item.submenu ? (
                <>
                  <button 
                    className="menu-button"
                    onClick={() => toggleDropdown(index)}
                  >
                    <i className={item.icon}></i>
                    {isOpen && <span className="menu-title">{item.title}</span>}
                    {isOpen && (
                      <i className={`submenu-arrow fa fa-angle-${activeDropdown === index ? 'down' : 'right'}`}></i>
                    )}
                  </button>
                  
                  {isOpen && activeDropdown === index && (
                    <ul className="submenu">
                      {item.submenu.map((subItem, subIndex) => (
                        <li 
                          key={subIndex}
                          className={`submenu-item ${isActive(subItem.path) ? 'active' : ''}`}
                        >
                          <Link to={subItem.path} className="submenu-link">
                            <span className="submenu-title">{subItem.title}</span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </>
              ) : (
                <Link to={item.path} className="menu-link">
                  <i className={item.icon}></i>
                  {isOpen && <span className="menu-title">{item.title}</span>}
                </Link>
              )}
            </li>
          ))}
        </ul>
      </nav>
      
      <style jsx>{`
        .admin-sidebar {
          height: 100vh;
          background-color: #333;
          color: #fff;
          position: fixed;
          top: 0;
          left: 0;
          transition: width 0.3s;
          overflow-x: hidden;
          z-index: 1000;
        }
        
        .open {
          width: 250px;
        }
        
        .closed {
          width: 70px;
        }
        
        .sidebar-header {
          height: 70px;
          display: flex;
          align-items: center;
          padding: 0 20px;
          border-bottom: 1px solid #444;
        }
        
        .logo-container {
          text-decoration: none;
          color: #fff;
          width: 100%;
        }
        
        .logo-text {
          margin: 0;
          font-size: 20px;
          white-space: nowrap;
        }
        
        .logo-icon {
          margin: 0;
          font-size: 24px;
          text-align: center;
        }
        
        .sidebar-nav {
          padding: 20px 0;
        }
        
        .menu {
          list-style: none;
          padding: 0;
          margin: 0;
        }
        
        .menu-item {
          margin-bottom: 5px;
        }
        
        .menu-item.active > .menu-link,
        .menu-item.active > .menu-button {
          background-color: #4a69bd;
        }
        
        .menu-link,
        .menu-button {
          display: flex;
          align-items: center;
          padding: 12px 20px;
          color: #fff;
          text-decoration: none;
          transition: background-color 0.3s;
          border: none;
          background: none;
          width: 100%;
          text-align: left;
          cursor: pointer;
        }
        
        .menu-link:hover,
        .menu-button:hover {
          background-color: #444;
        }
        
        .menu-item i {
          font-size: 18px;
          width: 30px;
          text-align: center;
        }
        
        .menu-title {
          margin-left: 10px;
          white-space: nowrap;
        }
        
        .submenu-arrow {
          margin-left: auto;
        }
        
        .submenu {
          list-style: none;
          padding: 0;
          margin: 5px 0 5px 30px;
        }
        
        .submenu-link {
          display: block;
          padding: 8px 20px;
          color: #c8c9ca;
          text-decoration: none;
          transition: background-color 0.3s;
          font-size: 14px;
        }
        
        .submenu-item.active .submenu-link {
          background-color: #34495e;
        }
        
        .submenu-link:hover {
          background-color: #34495e;
        }
      `}</style>
    </aside>
  );
};

export default Sidebar; 
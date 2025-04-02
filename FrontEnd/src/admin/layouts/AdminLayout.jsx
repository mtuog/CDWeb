import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/common/Sidebar';
import Header from '../components/common/Header';

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="admin-layout">
      <Sidebar isOpen={sidebarOpen} />
      
      <div className={`admin-main ${sidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
        <Header toggleSidebar={toggleSidebar} />
        
        <main className="admin-content">
          <Outlet />
        </main>
      </div>
      
      <style jsx>{`
        .admin-layout {
          display: flex;
          width: 100%;
          min-height: 100vh;
          background-color: #f8f9fa;
        }
        
        .admin-main {
          flex: 1;
          transition: margin-left 0.3s;
        }
        
        .sidebar-open {
          margin-left: 250px;
        }
        
        .sidebar-closed {
          margin-left: 70px;
        }
        
        .admin-content {
          padding: 20px;
          min-height: calc(100vh - 70px);
        }
      `}</style>
    </div>
  );
};

export default AdminLayout; 
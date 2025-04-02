import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from '../components/Home/Home';
import Product from '../components/Product/Product';
import ProductDetail from '../components/ProductDetail/ProductDetail';
import Cart from '../components/Cart/Cart';
import Checkout from '../components/Checkout/Checkout';
import Login from '../components/Login/Login';
import Register from '../components/Register/Register';
import AdminLayout from '../admin/layouts/AdminLayout';
import Dashboard from '../admin/pages/dashboard/Dashboard';

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<Home />} />
      <Route path="/products" element={<Product />} />
      <Route path="/product/:id" element={<ProductDetail />} />
      <Route path="/cart" element={<Cart />} />
      <Route path="/checkout" element={<Checkout />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      
      {/* Admin routes */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="dashboard" element={<Dashboard />} />
        {/* Add more admin routes here */}
      </Route>
    </Routes>
  );
};

export default AppRoutes; 
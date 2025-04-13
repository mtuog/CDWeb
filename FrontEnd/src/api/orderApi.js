import axios from 'axios';
import { BACKEND_URL_HTTP } from '../config';

const API_URL = `http://${BACKEND_URL_HTTP}/api`;

// Hàm lấy tất cả đơn hàng
export const getAllOrders = async (params = {}) => {
  try {
    const { limit, page, sortBy, direction } = params;
    let url = `${API_URL}/orders`;
    
    // Xây dựng query string cho các tham số
    const queryParams = [];
    if (limit) queryParams.push(`limit=${limit}`);
    if (page) queryParams.push(`page=${page}`);
    if (sortBy) queryParams.push(`sortBy=${sortBy}`);
    if (direction) queryParams.push(`direction=${direction}`);
    
    if (queryParams.length > 0) {
      url += `?${queryParams.join('&')}`;
    }
    
    const token = localStorage.getItem('token');
    const response = await axios.get(url, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    return response.data;
  } catch (error) {
    console.error('Error fetching orders:', error);
    throw error;
  }
};

// Hàm lấy đơn hàng theo ID
export const getOrderById = async (id) => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${API_URL}/orders/${id}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error(`Error fetching order with ID ${id}:`, error);
    throw error;
  }
};

// Hàm lấy đơn hàng theo trạng thái
export const getOrdersByStatus = async (status) => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${API_URL}/orders/status/${status}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error(`Error fetching orders with status ${status}:`, error);
    throw error;
  }
};

// Hàm lấy đơn hàng của một người dùng
export const getOrdersByUser = async (userId) => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${API_URL}/orders/user/${userId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error(`Error fetching orders for user ${userId}:`, error);
    throw error;
  }
};

// Hàm tạo đơn hàng mới
export const createOrder = async (orderData) => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.post(`${API_URL}/orders`, orderData, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error creating order:', error);
    throw error;
  }
};

// Hàm cập nhật trạng thái đơn hàng
export const updateOrderStatus = async (id, status) => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.put(
      `${API_URL}/orders/${id}/status`, 
      { status }, 
      {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
    );
    return response.data;
  } catch (error) {
    console.error(`Error updating status for order ${id}:`, error);
    throw error;
  }
};

// Hàm cập nhật toàn bộ thông tin đơn hàng
export const updateOrder = async (id, orderData) => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.put(`${API_URL}/orders/${id}`, orderData, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error(`Error updating order with ID ${id}:`, error);
    throw error;
  }
};

// Hàm hủy đơn hàng
export const cancelOrder = async (id, reason) => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.put(
      `${API_URL}/orders/${id}/cancel`, 
      { reason }, 
      {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
    );
    return response.data;
  } catch (error) {
    console.error(`Error canceling order with ID ${id}:`, error);
    throw error;
  }
};

// Hàm lấy thống kê đơn hàng
export const getOrdersStatistics = async () => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${API_URL}/orders/statistics`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching orders statistics:', error);
    throw error;
  }
}; 
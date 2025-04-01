import axios from 'axios';

const API_URL = 'http://localhost:8080/api';

// Hàm lấy tất cả sản phẩm
export const getAllProducts = async () => {
  try {
    const response = await axios.get(`${API_URL}/products`);
    return response.data;
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
};

// Hàm lấy sản phẩm theo ID
export const getProductById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/products/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching product with ID ${id}:`, error);
    throw error;
  }
};

// Hàm lấy sản phẩm theo danh mục
export const getProductsByCategory = async (category) => {
  try {
    const response = await axios.get(`${API_URL}/products/category/${category}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching products in category ${category}:`, error);
    throw error;
  }
};

// Hàm lấy sản phẩm bán chạy
export const getBestSellerProducts = async () => {
  try {
    const response = await axios.get(`${API_URL}/products/bestseller`);
    return response.data;
  } catch (error) {
    console.error('Error fetching bestseller products:', error);
    throw error;
  }
};

// Hàm lấy sản phẩm mới
export const getNewProducts = async () => {
  try {
    const response = await axios.get(`${API_URL}/products/new`);
    return response.data;
  } catch (error) {
    console.error('Error fetching new products:', error);
    throw error;
  }
};

// Hàm lấy sản phẩm được yêu thích
export const getFavoriteProducts = async () => {
  try {
    const response = await axios.get(`${API_URL}/products/favorite`);
    return response.data;
  } catch (error) {
    console.error('Error fetching favorite products:', error);
    throw error;
  }
}; 
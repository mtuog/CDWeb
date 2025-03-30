// src/store/cartReducer.js
import { ADD_TO_CART, REMOVE_FROM_CART, UPDATE_QUANTITY,CLEAR_CART } from './Actions';

const initialState = JSON.parse(localStorage.getItem('cart')) || [];
const cartReducer = (state = initialState, action) => {
    let updatedCart;
    switch (action.type) {
        case ADD_TO_CART:
            // Check if product with same ID, size, and color already exists
            const existingItemIndex = state.findIndex(item => 
                item.id === action.payload.id && 
                item.size === action.payload.size && 
                item.color === action.payload.color
            );
            
            if (existingItemIndex !== -1) {
                // Update existing item quantity
                updatedCart = state.map((item, index) => 
                    index === existingItemIndex
                        ? { ...item, quantity: item.quantity + action.payload.quantity }
                        : item
                );
            } else {
                // Add new item
                updatedCart = [...state, { 
                    id: action.payload.id, 
                    quantity: action.payload.quantity,
                    size: action.payload.size,
                    color: action.payload.color
                }];
            }
            break;
        case REMOVE_FROM_CART:
            updatedCart = state.filter(item => item.id !== action.payload);
            break;
        case UPDATE_QUANTITY:
            const { productId, quantity } = action.payload;
            updatedCart = state.map(item =>
                item.id === productId
                    ? { ...item, quantity }
                    : item
            );

            break;
        case CLEAR_CART:
            updatedCart = []; // Xóa tất cả sản phẩm trong giỏ hàng
            break;
        default:
            updatedCart = state;
    }

    // Lưu giỏ hàng vào Local Storage
    localStorage.setItem('cart', JSON.stringify(updatedCart));

    return updatedCart;
};

export default cartReducer;

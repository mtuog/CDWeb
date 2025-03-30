// src/store/Actions.js
export const ADD_TO_CART = 'ADD_TO_CART';
export const REMOVE_FROM_CART = 'REMOVE_FROM_CART';
export const UPDATE_QUANTITY = 'UPDATE_QUANTITY';
export const CLEAR_CART = 'CLEAR_CART';
export const addToCart = (product) => ({
    type: ADD_TO_CART,
    payload: product,
});

export const removeFromCart = (productId) => ({
    type: REMOVE_FROM_CART,
    payload: productId,
});

export const updateQuantity = (productId, quantity) => ({
    type: UPDATE_QUANTITY,
    payload: { productId, quantity },
});
export const loadCart = () => {
    const cart = JSON.parse(localStorage.getItem('cart')) ?? [];
    return {
        type: 'cart/load',
        payload: cart
    };
};
export const clearCartLocalStorage = () => {
    localStorage.removeItem('cart');
};
export const clearCart = () => ({
    type: CLEAR_CART,
});
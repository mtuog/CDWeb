// Helper functions for getting product sizes and colors
import { products } from './data/ProductDataFE';

export const findProductSizesById = (productId) => {
    const defaultSizes = ['S', 'M', 'L', 'XL'];
    const product = products.find(prod => prod.id === productId);
    return product && product.sizes ? product.sizes : defaultSizes;
};

export const findProductColorsById = (productId) => {
    const defaultColors = ['Đen', 'Xanh đen', 'Xám', 'Xanh coban'];
    const product = products.find(prod => prod.id === productId);
    return product && product.colors ? product.colors : defaultColors;
}; 
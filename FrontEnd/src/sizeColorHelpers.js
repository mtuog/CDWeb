// Các size có sẵn
const sizes = ['S', 'M', 'L', 'XL', 'XXL'];

// Các màu có sẵn
const colors = ['Trắng', 'Đen', 'Xanh dương', 'Xanh lá', 'Đỏ', 'Vàng'];

// Hàm trả về các size có sẵn cho sản phẩm dựa vào ID
export const findProductSizesById = (id) => {
    // Giả lập dữ liệu size cho tất cả sản phẩm
    // Trong thực tế, bạn nên lấy dữ liệu này từ API
    return sizes;
};

// Hàm trả về các màu có sẵn cho sản phẩm dựa vào ID
export const findProductColorsById = (id) => {
    // Giả lập dữ liệu màu cho tất cả sản phẩm
    // Trong thực tế, bạn nên lấy dữ liệu này từ API
    return colors;
}; 
import axios from 'axios';
import { BACKEND_URL_HTTP } from '../config';

const API_URL = `http://${BACKEND_URL_HTTP}/api`;

// Hàm lấy tất cả người dùng
export const getAllUsers = async () => {
  try {
    const response = await axios.get(`${API_URL}/users`);
    return response.data;
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
};

// Hàm lấy thông tin người dùng theo ID
export const getUserById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/UserServices/user/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching user with ID ${id}:`, error);
    throw error;
  }
};

// Hàm lấy thông tin người dùng theo tên người dùng
export const getUserByUsername = async (username) => {
  try {
    const response = await axios.get(`${API_URL}/users/username/${username}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching user with username ${username}:`, error);
    throw error;
  }
};

// Hàm lấy thông tin người dùng theo email
export const getUserByEmail = async (email) => {
  try {
    const response = await axios.get(`${API_URL}/users/email/${email}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching user with email ${email}:`, error);
    throw error;
  }
};

// Hàm lấy thống kê khách hàng
export const getUsersStatistics = async () => {
  try {
    // Lấy tất cả người dùng
    const users = await getAllUsers();
    
    // Tính toán các thống kê
    const totalCustomers = users.length;
    
    // Tính số lượng khách hàng hoạt động (có đơn hàng trong 30 ngày gần đây)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const activeCustomers = users.filter(user => {
      const lastOrderDate = user.lastOrderDate ? new Date(user.lastOrderDate) : null;
      return lastOrderDate && lastOrderDate >= thirtyDaysAgo;
    }).length;
    
    // Tính số lượng khách hàng mới (đăng ký trong 30 ngày gần đây)
    const newCustomers = users.filter(user => {
      const createdAt = user.createdAt ? new Date(user.createdAt) : null;
      return createdAt && createdAt >= thirtyDaysAgo;
    }).length;
    
    // Tính tỷ lệ giữ chân khách hàng
    const retentionRate = totalCustomers > 0 ? (activeCustomers / totalCustomers) * 100 : 0;
    
    // Xây dựng thống kê phân tích theo giới tính, tuổi, khu vực
    const customersByGender = countByProperty(users, 'gender');
    const customersByAge = groupUsersByAge(users);
    const customersByLocation = countByProperty(users, 'address', extractCity);
    
    // Tìm top khách hàng
    const topCustomers = users
      .sort((a, b) => (b.totalSpent || 0) - (a.totalSpent || 0))
      .slice(0, 5)
      .map(user => ({
        id: user.id,
        name: user.fullName || `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.username,
        email: user.email,
        phone: user.phone || 'Chưa cập nhật',
        orders: user.orderCount || 0,
        totalSpent: user.totalSpent || 0,
        lastOrder: user.lastOrderDate || null,
        status: user.isActive ? 'active' : 'inactive'
      }));
    
    return {
      summary: {
        totalCustomers,
        activeCustomers,
        newCustomersThisMonth: newCustomers,
        retentionRate: parseFloat(retentionRate.toFixed(1)),
        averageOrderValue: calculateAverageOrderValue(users)
      },
      customersByGender,
      customersByAge,
      customersByLocation,
      customerGrowth: generateCustomerGrowthData(users, 'month'),
      customerGrowthWeekly: generateCustomerGrowthData(users, 'week'),
      topCustomers
    };
  } catch (error) {
    console.error('Error fetching user statistics:', error);
    throw error;
  }
};

// Hàm hỗ trợ đếm theo thuộc tính
function countByProperty(users, property, transformFn = null) {
  const counts = {};
  
  users.forEach(user => {
    let value = user[property] || 'Không xác định';
    
    // Áp dụng hàm biến đổi nếu có
    if (transformFn) {
      value = transformFn(value);
    }
    
    counts[value] = (counts[value] || 0) + 1;
  });
  
  // Chuyển đổi thành mảng cho biểu đồ
  return Object.entries(counts).map(([name, value]) => ({ name, value }));
}

// Hàm hỗ trợ trích xuất thành phố từ địa chỉ
function extractCity(address) {
  if (!address) return 'Không xác định';
  
  // Tách địa chỉ và lấy phần cuối cùng (thường là thành phố/tỉnh)
  const parts = address.split(',').map(part => part.trim());
  
  const commonCities = [
    'TP.HCM', 'Hồ Chí Minh', 'HCM', 'Hà Nội', 'Đà Nẵng', 
    'Cần Thơ', 'Hải Phòng', 'Nha Trang', 'Đà Lạt'
  ];
  
  // Tìm thành phố phổ biến trong địa chỉ
  for (const city of commonCities) {
    if (address.includes(city)) {
      return city;
    }
  }
  
  // Nếu không tìm thấy, trả về phần cuối cùng
  return parts[parts.length - 1] || 'Khác';
}

// Hàm hỗ trợ nhóm người dùng theo độ tuổi
function groupUsersByAge(users) {
  const ageGroups = {
    '18-24': 0,
    '25-34': 0,
    '35-44': 0,
    '45-54': 0,
    '55+': 0,
    'Không xác định': 0
  };
  
  users.forEach(user => {
    if (!user.dateOfBirth && !user.dob) {
      ageGroups['Không xác định']++;
      return;
    }
    
    const birthDate = new Date(user.dateOfBirth || user.dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    
    // Kiểm tra xem đã qua sinh nhật năm nay chưa
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    if (age < 18) {
      ageGroups['18-24']++;
    } else if (age <= 24) {
      ageGroups['18-24']++;
    } else if (age <= 34) {
      ageGroups['25-34']++;
    } else if (age <= 44) {
      ageGroups['35-44']++;
    } else if (age <= 54) {
      ageGroups['45-54']++;
    } else {
      ageGroups['55+']++;
    }
  });
  
  // Chuyển đổi thành mảng cho biểu đồ
  return Object.entries(ageGroups)
    .filter(([name, value]) => value > 0) // Loại bỏ nhóm không có người dùng
    .map(([name, value]) => ({ name, value }));
}

// Hàm hỗ trợ tính toán giá trị đơn hàng trung bình
function calculateAverageOrderValue(users) {
  const usersWithOrders = users.filter(user => user.totalSpent && user.orderCount && user.orderCount > 0);
  
  if (usersWithOrders.length === 0) {
    return 0;
  }
  
  const totalSpent = usersWithOrders.reduce((sum, user) => sum + (user.totalSpent || 0), 0);
  const totalOrders = usersWithOrders.reduce((sum, user) => sum + (user.orderCount || 0), 0);
  
  return totalOrders > 0 ? Math.round(totalSpent / totalOrders) : 0;
}

// Hàm hỗ trợ tạo dữ liệu tăng trưởng khách hàng
function generateCustomerGrowthData(users, period) {
  if (period === 'month') {
    // Tạo dữ liệu tăng trưởng theo tháng (6 tháng gần đây)
    const months = [];
    const now = new Date();
    
    for (let i = 5; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      months.push({
        date,
        name: `T${date.getMonth() + 1}`,
        month: date.getMonth(),
        year: date.getFullYear()
      });
    }
    
    return months.map(monthData => {
      const { month, year, name } = monthData;
      
      // Tìm người dùng mới trong tháng này
      const newCustomers = users.filter(user => {
        const created = user.createdAt ? new Date(user.createdAt) : null;
        return created && 
               created.getMonth() === month && 
               created.getFullYear() === year;
      }).length;
      
      // Tính người dùng hoạt động (có đơn hàng) trong tháng này
      const activeCustomers = users.filter(user => {
        const lastOrder = user.lastOrderDate ? new Date(user.lastOrderDate) : null;
        return lastOrder && 
               lastOrder.getMonth() === month && 
               lastOrder.getFullYear() === year;
      }).length;
      
      return { name, newCustomers, activeCustomers };
    });
  } else {
    // Tạo dữ liệu tăng trưởng theo tuần (4 tuần gần đây)
    const weeks = [];
    const now = new Date();
    
    for (let i = 3; i >= 0; i--) {
      const startDate = new Date(now);
      startDate.setDate(now.getDate() - (i * 7) - now.getDay());
      
      weeks.push({
        date: startDate,
        name: `Tuần ${4 - i}`
      });
    }
    
    return weeks.map((weekData, index) => {
      const { date, name } = weekData;
      const endDate = new Date(date);
      endDate.setDate(date.getDate() + 6);
      
      // Tìm người dùng mới trong tuần này
      const newCustomers = users.filter(user => {
        const created = user.createdAt ? new Date(user.createdAt) : null;
        return created && created >= date && created <= endDate;
      }).length;
      
      // Tính người dùng hoạt động trong tuần này
      const totalActiveBefore = users.filter(user => {
        const created = user.createdAt ? new Date(user.createdAt) : null;
        return created && created <= endDate;
      }).length;
      
      // Giả lập tăng trưởng người dùng hoạt động
      const activeCustomers = Math.round(totalActiveBefore * (0.6 + (index * 0.05)));
      
      return { name, newCustomers, activeCustomers };
    });
  }
} 
package com.example.BackEndSpring.service;

import com.example.BackEndSpring.model.Order;
import com.example.BackEndSpring.model.OrderItem;
import com.example.BackEndSpring.model.User;
import com.example.BackEndSpring.repository.OrderRepository;
import com.example.BackEndSpring.repository.OrderItemRepository;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class OrderService {

    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;

    @Autowired
    public OrderService(OrderRepository orderRepository, OrderItemRepository orderItemRepository) {
        this.orderRepository = orderRepository;
        this.orderItemRepository = orderItemRepository;
    }

    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }
    
    /**
     * Lấy tất cả đơn hàng với phân trang
     * @param pageable Thông tin phân trang
     * @return Page chứa các đơn hàng
     */
    public Page<Order> getAllOrdersWithPaging(Pageable pageable) {
        return orderRepository.findAll(pageable);
    }

    public Optional<Order> getOrderById(Long id) {
        return orderRepository.findById(id);
    }

    public List<Order> getOrdersByUser(User user) {
        return orderRepository.findByUser(user);
    }

    public List<Order> getOrdersByStatus(Order.Status status) {
        return orderRepository.findByStatus(status);
    }

    @Transactional
    public Order createOrder(Order order) {
        order.setCreatedAt(LocalDateTime.now());
        order.setUpdatedAt(LocalDateTime.now());
        
        // Lưu đơn hàng mới không có các item
        List<OrderItem> items = new ArrayList<>(order.getOrderItems());
        order.getOrderItems().clear();
        Order savedOrder = orderRepository.save(order);
        
        // Thêm các item vào đơn hàng đã lưu
        if (items != null && !items.isEmpty()) {
            for (OrderItem item : items) {
                savedOrder.addOrderItem(item);
                orderItemRepository.save(item);
            }
        }
        
        // Lưu đơn hàng một lần nữa để cập nhật các thay đổi
        return orderRepository.save(savedOrder);
    }

    @Transactional
    public Order updateOrderStatus(Long orderId, Order.Status status) {
        Optional<Order> orderOpt = orderRepository.findById(orderId);
        if (orderOpt.isPresent()) {
            Order order = orderOpt.get();
            order.setStatus(status);
            order.setUpdatedAt(LocalDateTime.now());
            return orderRepository.save(order);
        }
        throw new RuntimeException("Order not found with id: " + orderId);
    }

    @Transactional
    public void deleteOrder(Long id) {
        orderRepository.deleteById(id);
    }

    // Calculate order total based on order items
    public double calculateOrderTotal(List<OrderItem> orderItems) {
        return orderItems.stream()
                .mapToDouble(item -> item.getPrice() * item.getQuantity())
                .sum();
    }
    
    /**
     * Đếm tổng số đơn hàng
     * @return Tổng số đơn hàng
     */
    public long countTotalOrders() {
        return orderRepository.count();
    }
    
    /**
     * Tính tổng doanh thu từ tất cả đơn hàng
     * @return Tổng doanh thu
     */
    public double calculateTotalRevenue() {
        // Sử dụng tổng hợp từ tất cả các trạng thái
        Double total = Arrays.stream(Order.Status.values())
                .map(orderRepository::sumTotalAmountByStatus)
                .filter(sum -> sum != null)
                .reduce(0.0, Double::sum);
        
        return total;
    }
    
    /**
     * Đếm số lượng đơn hàng theo trạng thái
     * @return Map với key là trạng thái và value là số lượng
     */
    public Map<Order.Status, Long> countOrdersByStatus() {
        Map<Order.Status, Long> result = new HashMap<>();
        
        for (Order.Status status : Order.Status.values()) {
            long count = orderRepository.countByStatus(status);
            result.put(status, count);
        }
        
        return result;
    }
    
    /**
     * Đếm số lượng đơn hàng sau một thời điểm cụ thể
     * @param date Thời điểm bắt đầu
     * @return Số lượng đơn hàng
     */
    public long countOrdersAfterDate(LocalDateTime date) {
        return orderRepository.findByCreatedAtAfter(date).size();
    }
    
    /**
     * Tính tổng doanh thu từ các đơn hàng sau một thời điểm cụ thể
     * @param date Thời điểm bắt đầu
     * @return Tổng doanh thu
     */
    public double calculateRevenueAfterDate(LocalDateTime date) {
        return orderRepository.findByCreatedAtAfter(date).stream()
                .mapToDouble(Order::getTotalAmount)
                .sum();
    }
    
    /**
     * Đếm số lượng đơn hàng theo ngày trong 7 ngày gần đây
     * @return Map với key là ngày (định dạng dd/MM) và value là số lượng
     */
    public Map<String, Long> countOrdersByDayLast7Days() {
        Map<String, Long> result = new HashMap<>();
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM");
        
        // Khởi tạo map với 7 ngày gần đây, mỗi ngày có giá trị là 0
        for (int i = 6; i >= 0; i--) {
            LocalDate date = LocalDate.now().minusDays(i);
            result.put(date.format(formatter), 0L);
        }
        
        // Đếm số lượng đơn hàng cho mỗi ngày
        LocalDateTime startDate = LocalDateTime.now().minusDays(7).withHour(0).withMinute(0).withSecond(0);
        LocalDateTime endDate = LocalDateTime.now().withHour(23).withMinute(59).withSecond(59);
        
        List<Order> recentOrders = orderRepository.findOrdersBetweenDates(startDate, endDate);
        
        for (Order order : recentOrders) {
            String dateStr = order.getCreatedAt().toLocalDate().format(formatter);
            result.put(dateStr, result.getOrDefault(dateStr, 0L) + 1);
        }
        
        return result;
    }
    
    /**
     * Tính tổng doanh thu từ các đơn hàng trong khoảng thời gian
     * @param startDate Thời điểm bắt đầu
     * @param endDate Thời điểm kết thúc
     * @return Tổng doanh thu
     */
    public double calculateRevenueBetweenDates(LocalDateTime startDate, LocalDateTime endDate) {
        List<Order> orders = orderRepository.findOrdersBetweenDates(startDate, endDate);
        return orders.stream()
                .mapToDouble(Order::getTotalAmount)
                .sum();
    }
    
    /**
     * Đếm số lượng đơn hàng trong khoảng thời gian
     * @param startDate Thời điểm bắt đầu
     * @param endDate Thời điểm kết thúc
     * @return Số lượng đơn hàng
     */
    public long countOrdersBetweenDates(LocalDateTime startDate, LocalDateTime endDate) {
        return orderRepository.findOrdersBetweenDates(startDate, endDate).size();
    }
} 
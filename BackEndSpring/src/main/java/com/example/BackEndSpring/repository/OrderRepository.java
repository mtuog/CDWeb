package com.example.BackEndSpring.repository;

import com.example.BackEndSpring.model.Order;
import com.example.BackEndSpring.model.User;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findByUser(User user);
    List<Order> findByStatus(Order.Status status);
} 
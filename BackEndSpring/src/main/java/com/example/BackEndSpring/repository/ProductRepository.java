package com.example.BackEndSpring.repository;

import com.example.BackEndSpring.model.Category;
import com.example.BackEndSpring.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    List<Product> findByCategory(Category category);
    List<Product> findByBestSellerTrue();
    List<Product> findByNewProductTrue();
    List<Product> findByFavoriteTrue();
} 
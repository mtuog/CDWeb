package com.example.BackEndSpring.service;

import com.example.BackEndSpring.model.Category;
import com.example.BackEndSpring.model.Product;
import com.example.BackEndSpring.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ProductService {

    private final ProductRepository productRepository;
    private final CategoryService categoryService;

    @Autowired
    public ProductService(ProductRepository productRepository, CategoryService categoryService) {
        this.productRepository = productRepository;
        this.categoryService = categoryService;
    }

    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    public Optional<Product> getProductById(Long id) {
        return productRepository.findById(id);
    }

    public List<Product> getProductsByCategory(String categoryName) {
        Category category = categoryService.getCategoryByName(categoryName);
        return productRepository.findByCategory(category);
    }

    public List<Product> getBestSellerProducts() {
        return productRepository.findByBestSellerTrue();
    }

    public List<Product> getNewProducts() {
        return productRepository.findByNewProductTrue();
    }

    public List<Product> getFavoriteProducts() {
        return productRepository.findByFavoriteTrue();
    }

    public Product saveProduct(Product product) {
        return productRepository.save(product);
    }

    public void deleteProduct(Long id) {
        productRepository.deleteById(id);
    }
} 
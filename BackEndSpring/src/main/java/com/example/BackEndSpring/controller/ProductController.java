package com.example.BackEndSpring.controller;

import com.example.BackEndSpring.model.Category;
import com.example.BackEndSpring.model.Product;
import com.example.BackEndSpring.service.CategoryService;
import com.example.BackEndSpring.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/products")
public class ProductController {

    private final ProductService productService;
    private final CategoryService categoryService;

    @Autowired
    public ProductController(ProductService productService, CategoryService categoryService) {
        this.productService = productService;
        this.categoryService = categoryService;
    }

    @GetMapping
    public ResponseEntity<List<Product>> getAllProducts() {
        List<Product> products = productService.getAllProducts();
        return ResponseEntity.ok(products);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Product> getProductById(@PathVariable Long id) {
        Optional<Product> product = productService.getProductById(id);
        return product.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping("/category/{category}")
    public ResponseEntity<List<Product>> getProductsByCategory(@PathVariable String category) {
        List<Product> products = productService.getProductsByCategory(category);
        return ResponseEntity.ok(products);
    }

    @GetMapping("/bestseller")
    public ResponseEntity<List<Product>> getBestSellerProducts() {
        List<Product> products = productService.getBestSellerProducts();
        return ResponseEntity.ok(products);
    }

    @GetMapping("/new")
    public ResponseEntity<List<Product>> getNewProducts() {
        List<Product> products = productService.getNewProducts();
        return ResponseEntity.ok(products);
    }

    @GetMapping("/favorite")
    public ResponseEntity<List<Product>> getFavoriteProducts() {
        List<Product> products = productService.getFavoriteProducts();
        return ResponseEntity.ok(products);
    }

    @PostMapping
    public ResponseEntity<Product> createProduct(@RequestBody Product product) {
        // Xử lý trường hợp product có category dạng string hoặc id
        if (product.getCategory() != null && product.getCategory().getId() == null && product.getCategory().getName() != null) {
            // Tìm category theo tên
            Category category = categoryService.getCategoryByName(product.getCategory().getName());
            // Nếu category không tồn tại, tạo mới
            if (category == null) {
                Category newCategory = new Category();
                newCategory.setName(product.getCategory().getName());
                category = categoryService.saveCategory(newCategory);
            }
            product.setCategory(category);
        }
        
        Product savedProduct = productService.saveProduct(product);
        return new ResponseEntity<>(savedProduct, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Product> updateProduct(@PathVariable Long id, @RequestBody Product product) {
        Optional<Product> existingProduct = productService.getProductById(id);
        if (existingProduct.isPresent()) {
            product.setId(id);
            
            // Xử lý trường hợp product có category dạng string hoặc id
            if (product.getCategory() != null && product.getCategory().getId() == null && product.getCategory().getName() != null) {
                // Tìm category theo tên
                Category category = categoryService.getCategoryByName(product.getCategory().getName());
                // Nếu category không tồn tại, tạo mới
                if (category == null) {
                    Category newCategory = new Category();
                    newCategory.setName(product.getCategory().getName());
                    category = categoryService.saveCategory(newCategory);
                }
                product.setCategory(category);
            }
            
            Product updatedProduct = productService.saveProduct(product);
            return ResponseEntity.ok(updatedProduct);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProduct(@PathVariable Long id) {
        Optional<Product> existingProduct = productService.getProductById(id);
        if (existingProduct.isPresent()) {
            productService.deleteProduct(id);
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }
} 
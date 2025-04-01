package com.example.BackEndSpring.controller;

import com.example.BackEndSpring.model.Product;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.LinkedHashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/structure")
public class ProductStructureController {

    @GetMapping("/product")
    public ResponseEntity<Map<String, Object>> getProductStructure() {
        // Sử dụng LinkedHashMap để duy trì thứ tự các trường
        Map<String, Object> structure = new LinkedHashMap<>();
        
        // Thêm các trường theo đúng thứ tự
        structure.put("id", "Long");
        structure.put("name", "String");
        structure.put("img", "String");
        structure.put("des", "String");
        structure.put("bestSeller", "boolean");
        structure.put("newProduct", "boolean");
        structure.put("favorite", "boolean");
        structure.put("price", "double");
        structure.put("category", "String");
        
        return ResponseEntity.ok(structure);
    }
    
    @GetMapping("/product-sample")
    public ResponseEntity<Product> getProductSample() {
        // Tạo một mẫu sản phẩm với đầy đủ các trường theo thứ tự
        Product sample = new Product(
            1L,
            "Tên sản phẩm mẫu",
            "đường dẫn hình ảnh",
            "Mô tả sản phẩm",
            true,
            false,
            true,
            1000000.0,
            "Danh mục sản phẩm"
        );
        
        return ResponseEntity.ok(sample);
    }
} 
package com.example.BackEndSpring.controller;

import com.example.BackEndSpring.service.EmailService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/test")
@Tag(name = "Test Controller", description = "API để kiểm tra cấu hình hệ thống")
public class TestController {

    private final EmailService emailService;
    
    @Autowired
    public TestController(EmailService emailService) {
        this.emailService = emailService;
    }
    
    @Operation(summary = "Kiểm tra kết nối SMTP")
    @GetMapping("/smtp")
    public ResponseEntity<?> testSmtpConnection() {
        boolean connectionSuccessful = emailService.testConnection();
        
        Map<String, Object> response = new HashMap<>();
        response.put("success", connectionSuccessful);
        
        if (connectionSuccessful) {
            response.put("message", "Kết nối SMTP thành công");
        } else {
            response.put("message", "Kết nối SMTP thất bại. Vui lòng kiểm tra cấu hình email trong application.properties");
        }
        
        return ResponseEntity.ok(response);
    }
} 
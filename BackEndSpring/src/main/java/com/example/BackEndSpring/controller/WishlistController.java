package com.example.BackEndSpring.controller;

import com.example.BackEndSpring.dto.WishlistDTO;
import com.example.BackEndSpring.dto.WishlistRequest;
import com.example.BackEndSpring.model.Product;
import com.example.BackEndSpring.model.User;
import com.example.BackEndSpring.model.Wishlist;
import com.example.BackEndSpring.repository.ProductRepository;
import com.example.BackEndSpring.repository.UserRepository;
import com.example.BackEndSpring.repository.WishlistRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/wishlist")
@CrossOrigin(
    origins = {"http://localhost:3000", "http://localhost:3001", "http://127.0.0.1:3000", "http://127.0.0.1:5500"},
    allowCredentials = "true",
    allowedHeaders = {"Authorization", "Content-Type", "X-Requested-With", "Accept", "Origin"},
    methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, RequestMethod.DELETE, RequestMethod.OPTIONS}
)
public class WishlistController {
    
    @Autowired
    private WishlistRepository wishlistRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private ProductRepository productRepository;
    
    /**
     * Lấy danh sách yêu thích của người dùng
     */
    @GetMapping("/user/{userId}")
    public ResponseEntity<?> getWishlistByUserId(@PathVariable Long userId) {
        try {
            List<Wishlist> wishlistItems = wishlistRepository.findByUserId(userId);
            List<WishlistDTO> dtos = wishlistItems.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
            
            return ResponseEntity.ok(dtos);
        } catch (Exception e) {
            return createErrorResponse(e, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    
    /**
     * Kiểm tra sản phẩm có trong danh sách yêu thích không
     */
    @GetMapping("/check")
    public ResponseEntity<?> checkWishlistItem(
            @RequestParam Long userId, 
            @RequestParam Long productId) {
        try {
            boolean exists = wishlistRepository.existsByUserIdAndProductId(userId, productId);
            return ResponseEntity.ok(exists);
        } catch (Exception e) {
            return createErrorResponse(e, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    
    /**
     * Thêm sản phẩm vào danh sách yêu thích
     */
    @PostMapping("/add")
    public ResponseEntity<?> addToWishlist(@RequestBody WishlistRequest request) {
        try {
            // Lấy thông tin người dùng từ request
            Long userId = request.getUserId();
            
            if (userId == null) {
                // Nếu không có userId trong request, thử lấy từ token
                Authentication auth = SecurityContextHolder.getContext().getAuthentication();
                System.out.println("Authentication details:");
                System.out.println("- Is authenticated: " + (auth != null && auth.isAuthenticated()));
                System.out.println("- Principal: " + (auth != null ? auth.getPrincipal() : "null"));
                System.out.println("- Authorities: " + (auth != null ? auth.getAuthorities() : "null"));
                
                User authenticatedUser = getCurrentUser();
                if (authenticatedUser == null) {
                    Map<String, Object> errorResponse = new HashMap<>();
                    errorResponse.put("error", "User not authenticated and no userId provided in request");
                    errorResponse.put("authDetails", auth != null ? auth.toString() : "null");
                    errorResponse.put("isAuthenticated", auth != null && auth.isAuthenticated());
                    
                    return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(errorResponse);
                }
                
                userId = authenticatedUser.getId();
                System.out.println("Using authenticated user ID: " + userId);
            } else {
                System.out.println("Using userId from request: " + userId);
            }
            
            // Lấy user từ database
            Optional<User> userOpt = userRepository.findById(userId);
            if (!userOpt.isPresent()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", "User not found"));
            }
            User user = userOpt.get();
            
            System.out.println("User found: " + user.getUsername() + " (ID: " + user.getId() + ")");
            
            // Kiểm tra xem sản phẩm đã tồn tại trong wishlist chưa
            Optional<Wishlist> existingItem = wishlistRepository
                .findByUserIdAndProductId(user.getId(), request.getProductId());
            
            if (existingItem.isPresent()) {
                return ResponseEntity.ok(convertToDTO(existingItem.get()));
            }
            
            // Lấy thông tin sản phẩm
            Optional<Product> productOpt = productRepository.findById(request.getProductId());
            if (!productOpt.isPresent()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", "Product not found"));
            }
            
            // Tạo mới wishlist item
            Wishlist wishlistItem = new Wishlist();
            wishlistItem.setUser(user);
            wishlistItem.setProduct(productOpt.get());
            
            // Lưu vào database
            wishlistItem = wishlistRepository.save(wishlistItem);
            
            return ResponseEntity.status(HttpStatus.CREATED).body(convertToDTO(wishlistItem));
        } catch (Exception e) {
            e.printStackTrace();
            return createErrorResponse(e, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    
    /**
     * Xóa sản phẩm khỏi danh sách yêu thích
     */
    @DeleteMapping("/remove/{productId}")
    public ResponseEntity<?> removeFromWishlist(
            @PathVariable Long productId,
            @RequestParam(required = false) Long userId) {
        try {
            // Nếu không có userId trong parameter, thử lấy từ token
            if (userId == null) {
                User authenticatedUser = getCurrentUser();
                if (authenticatedUser == null) {
                    return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("error", "User not authenticated and no userId provided in request"));
                }
                userId = authenticatedUser.getId();
                System.out.println("Using authenticated user ID: " + userId);
            } else {
                System.out.println("Using userId from request: " + userId);
            }
            
            // Lấy user từ database
            Optional<User> userOpt = userRepository.findById(userId);
            if (!userOpt.isPresent()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", "User not found"));
            }
            
            Optional<Wishlist> wishlistItem = wishlistRepository
                .findByUserIdAndProductId(userId, productId);
                
            if (wishlistItem.isPresent()) {
                wishlistRepository.delete(wishlistItem.get());
                
                Map<String, Object> response = new HashMap<>();
                response.put("success", true);
                response.put("message", "Item removed from wishlist");
                return ResponseEntity.ok(response);
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", "Item not found in wishlist"));
            }
        } catch (Exception e) {
            return createErrorResponse(e, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    
    /**
     * Chuyển đổi entity thành DTO
     */
    private WishlistDTO convertToDTO(Wishlist wishlist) {
        WishlistDTO dto = new WishlistDTO();
        dto.setId(wishlist.getId());
        dto.setUserId(wishlist.getUser().getId());
        dto.setProductId(wishlist.getProduct().getId());
        dto.setDateAdded(wishlist.getCreatedAt());
        dto.setProduct(wishlist.getProduct());
        return dto;
    }
    
    /**
     * Lấy thông tin người dùng hiện tại
     */
    private User getCurrentUser() {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            
            if (authentication == null || !authentication.isAuthenticated() || 
                "anonymousUser".equals(authentication.getPrincipal())) {
                return null;
            }
            
            Object principal = authentication.getPrincipal();
            String username;
            
            if (principal instanceof UserDetails) {
                username = ((UserDetails) principal).getUsername();
            } else if (principal instanceof String) {
                username = (String) principal;
            } else {
                return null;
            }
            
            Optional<User> userOpt = userRepository.findByUsername(username);
            return userOpt.orElse(null);
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }
    
    /**
     * Tạo response báo lỗi với thông tin chi tiết
     */
    private ResponseEntity<?> createErrorResponse(Exception e, HttpStatus status) {
        Map<String, Object> response = new HashMap<>();
        response.put("success", false);
        response.put("message", e.getMessage());
        response.put("error", e.getClass().getSimpleName());
        
        e.printStackTrace(); // In ra console để debug
        
        return ResponseEntity.status(status).body(response);
    }
} 
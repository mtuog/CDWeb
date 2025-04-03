package com.example.BackEndSpring.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "products")
public class Product {
    @Id
    private Long id;
    
    private String name;
    private String img;
    
    @Column(columnDefinition = "TEXT")
    private String des;
    
    private boolean bestSeller;
    private boolean newProduct;
    private boolean favorite;
    private double price;
    
    @ManyToOne
    @JoinColumn(name = "category_id")
    private Category category;
    
    // Constructors
    public Product() {
    }
    
    public Product(Long id, String name, String img, String des, boolean bestSeller, 
                  boolean newProduct, boolean favorite, double price, Category category) {
        this.id = id;
        this.name = name;
        this.img = img;
        this.des = des;
        this.bestSeller = bestSeller;
        this.newProduct = newProduct;
        this.favorite = favorite;
        this.price = price;
        this.category = category;
    }
    
    // Getters and Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public String getName() {
        return name;
    }
    
    public void setName(String name) {
        this.name = name;
    }
    
    public String getImg() {
        return img;
    }
    
    public void setImg(String img) {
        this.img = img;
    }
    
    public String getDes() {
        return des;
    }
    
    public void setDes(String des) {
        this.des = des;
    }
    
    public boolean isBestSeller() {
        return bestSeller;
    }
    
    public void setBestSeller(boolean bestSeller) {
        this.bestSeller = bestSeller;
    }
    
    public boolean isNewProduct() {
        return newProduct;
    }
    
    public void setNewProduct(boolean newProduct) {
        this.newProduct = newProduct;
    }
    
    public boolean isFavorite() {
        return favorite;
    }
    
    public void setFavorite(boolean favorite) {
        this.favorite = favorite;
    }
    
    public double getPrice() {
        return price;
    }
    
    public void setPrice(double price) {
        this.price = price;
    }
    
    public Category getCategory() {
        return category;
    }
    
    public void setCategory(Category category) {
        this.category = category;
    }
} 
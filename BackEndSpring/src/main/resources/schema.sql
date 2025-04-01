-- Drop table if exists
DROP TABLE IF EXISTS products;

-- Create products table with columns in specific order
CREATE TABLE products (
    id BIGINT NOT NULL,
    name VARCHAR(255),
    img VARCHAR(255),
    des TEXT,
    best_seller BIT NOT NULL,
    new_product BIT NOT NULL,
    favorite BIT NOT NULL,
    price DOUBLE PRECISION NOT NULL,
    category VARCHAR(255),
    PRIMARY KEY (id)
) ENGINE=InnoDB; 
-- Create Categories Table
CREATE TABLE categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  slug VARCHAR(100) UNIQUE NOT NULL,
  icon VARCHAR(10),
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create Products Table
CREATE TABLE products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  image VARCHAR(500),
  category VARCHAR(100) NOT NULL,
  rating DECIMAL(2,1) DEFAULT 0,
  reviews INTEGER DEFAULT 0,
  stock_quantity INTEGER DEFAULT 0,
  is_featured BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  FOREIGN KEY (category) REFERENCES categories(slug)
);

-- Create Users Table (for future user management)
CREATE TABLE users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  full_name VARCHAR(255),
  avatar_url VARCHAR(500),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create Orders Table
CREATE TABLE orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  total_amount DECIMAL(10,2) NOT NULL,
  status VARCHAR(50) DEFAULT 'pending',
  shipping_address JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create Order Items Table
CREATE TABLE order_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id),
  quantity INTEGER NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert Sample Categories
INSERT INTO categories (name, slug, icon, description) VALUES
('Furniture', 'furniture', '🪑', 'Chairs, tables, sofas, and more'),
('Lighting', 'lighting', '💡', 'Lamps, chandeliers, and lighting fixtures'),
('Decor', 'decor', '🏺', 'Decorative items and home accessories'),
('Textiles', 'textiles', '🛏️', 'Pillows, curtains, and fabric items');

-- Insert Sample Products
INSERT INTO products (name, description, price, image, category, rating, reviews, stock_quantity, is_featured) VALUES
('Modern Sofa Set', 'Comfortable 3-piece sofa set perfect for modern living rooms', 899.99, 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=500&q=80', 'furniture', 4.5, 128, 10, true),
('Coffee Table', 'Elegant wooden coffee table with storage compartments', 299.99, 'https://images.unsplash.com/photo-1549497538-303791108f95?w=500&q=80', 'furniture', 4.3, 89, 15, true),
('Table Lamp', 'Modern minimalist table lamp with adjustable brightness', 79.99, 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=500&q=80', 'lighting', 4.7, 203, 25, true),
('Decorative Vase', 'Handcrafted ceramic vase perfect for fresh flowers', 49.99, 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=500&q=80', 'decor', 4.4, 156, 30, false),
('Throw Pillows Set', 'Set of 4 comfortable throw pillows in various colors', 39.99, 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=500&q=80', 'decor', 4.6, 312, 20, true),
('Wall Art Canvas', 'Beautiful abstract canvas art to enhance your walls', 129.99, 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=500&q=80', 'decor', 4.2, 95, 12, false);

-- Create indexes for better performance
CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_products_featured ON products(is_featured);
CREATE INDEX idx_products_price ON products(price);
CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_order_items_order_id ON order_items(order_id);

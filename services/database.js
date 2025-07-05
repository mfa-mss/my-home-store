import { supabase, isSupabaseConfigured } from '../lib/supabase';

// Products API
export const productService = {
  // Get all products
  async getAllProducts() {
    // If Supabase is not configured, use local data
    if (!isSupabaseConfigured()) {
      const { products } = await import('../data/products');
      return products;
    }

    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching products:', error);
      // Fallback to local data
      const { products } = await import('../data/products');
      return products;
    }
  },

  // Get product by ID
  async getProductById(id) {
    // If Supabase is not configured, use local data
    if (!isSupabaseConfigured()) {
      const { products } = await import('../data/products');
      return products.find(p => p.id === parseInt(id));
    }

    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching product:', error);
      // Fallback to local data
      const { products } = await import('../data/products');
      return products.find(p => p.id === parseInt(id));
    }
  },

  // Get products by category
  async getProductsByCategory(category) {
    // If Supabase is not configured, use local data
    if (!isSupabaseConfigured()) {
      const { products } = await import('../data/products');
      return products.filter(p => p.category === category);
    }

    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('category', category)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching products by category:', error);
      // Fallback to local data
      const { products } = await import('../data/products');
      return products.filter(p => p.category === category);
    }
  },

  // Add new product (Admin function)
  async addProduct(product) {
    try {
      const { data, error } = await supabase
        .from('products')
        .insert([product])
        .select();
      
      if (error) throw error;
      return data[0];
    } catch (error) {
      console.error('Error adding product:', error);
      return null;
    }
  },

  // Update product (Admin function)
  async updateProduct(id, updates) {
    try {
      const { data, error } = await supabase
        .from('products')
        .update(updates)
        .eq('id', id)
        .select();
      
      if (error) throw error;
      return data[0];
    } catch (error) {
      console.error('Error updating product:', error);
      return null;
    }
  },

  // Delete product (Admin function)
  async deleteProduct(id) {
    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error deleting product:', error);
      return false;
    }
  }
};

// Categories API
export const categoryService = {
  // Get all categories
  async getAllCategories() {
    // If Supabase is not configured, use local data
    if (!isSupabaseConfigured()) {
      const { categories } = await import('../data/products');
      return categories;
    }

    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name');
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching categories:', error);
      // Fallback to local data
      const { categories } = await import('../data/products');
      return categories;
    }
  }
};

// Orders API (for future cart checkout)
export const orderService = {
  // Create new order
  async createOrder(orderData) {
    try {
      const { data, error } = await supabase
        .from('orders')
        .insert([orderData])
        .select();
      
      if (error) throw error;
      return data[0];
    } catch (error) {
      console.error('Error creating order:', error);
      return null;
    }
  },

  // Get user orders
  async getUserOrders(userId) {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          order_items (
            *,
            products (*)
          )
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching user orders:', error);
      return [];
    }
  }
};

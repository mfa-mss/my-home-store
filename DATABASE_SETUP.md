# Database Setup Instructions

## 🚀 Setting up Supabase Database

### 1. Create Supabase Account
1. Go to [supabase.com](https://supabase.com)
2. Sign up for a free account
3. Create a new project

### 2. Set up Database
1. In your Supabase dashboard, go to the **SQL Editor**
2. Copy and paste the content from `database/schema.sql`
3. Run the SQL script to create tables and insert sample data

### 3. Get API Credentials
1. Go to **Settings** > **API**
2. Copy your:
   - **Project URL**
   - **Anon/Public Key**

### 4. Configure Environment Variables
1. Open `.env.local` in your project
2. Replace the placeholder values:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_actual_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_actual_anon_key
   ```

### 5. Restart Development Server
```bash
npm run dev
```

## 🗄️ Database Tables Created:

- **categories** - Product categories (Furniture, Lighting, etc.)
- **products** - All product information
- **users** - Customer accounts (for future features)
- **orders** - Customer orders
- **order_items** - Items within each order

## 🔒 Row Level Security (RLS)
Supabase automatically enables RLS. For development:
1. Go to **Authentication** > **Policies**
2. Add policies for public read access to products and categories
3. Restrict write access to authenticated users only

## 📊 Features Now Available:
- ✅ Real-time product data from database
- ✅ Category management
- ✅ Product filtering and sorting
- ✅ Scalable architecture
- ✅ Ready for user authentication
- ✅ Order management system

## 🚀 Next Steps:
- Add user authentication
- Implement order processing
- Add admin panel for product management
- Set up payment processing

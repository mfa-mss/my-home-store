import { useState, useEffect } from 'react';
import Head from 'next/head';
import { productService, categoryService } from '../services/database';
import { uploadImage, validateImageFile } from '../services/imageUpload';

export default function Admin() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [uploading, setUploading] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    price: '',
    image: '',
    category: '',
    rating: '4.5',
    reviews: '0',
    stock_quantity: '10',
    is_featured: false
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [productsData, categoriesData] = await Promise.all([
        productService.getAllProducts(),
        categoryService.getAllCategories()
      ]);
      setProducts(productsData);
      setCategories(categoriesData);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) {
      setImageFile(null);
      setImagePreview('');
      return;
    }

    // Validate file
    const validationError = validateImageFile(file);
    if (validationError) {
      alert('❌ ' + validationError);
      e.target.value = ''; // Clear the input
      return;
    }

    setImageFile(file);
    
    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setImagePreview(e.target.result);
    };
    reader.readAsDataURL(file);
  };

  const resetForm = () => {
    setNewProduct({
      name: '',
      description: '',
      price: '',
      image: '',
      category: '',
      rating: '4.5',
      reviews: '0',
      stock_quantity: '10',
      is_featured: false
    });
    setImageFile(null);
    setImagePreview('');
    setUploading(false);
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    setUploading(true);
    
    try {
      let imageUrl = newProduct.image; // Use URL if provided

      // If there's a file selected, upload it first
      if (imageFile) {
        console.log('Uploading image...');
        const uploadResult = await uploadImage(imageFile);
        
        if (!uploadResult) {
          alert('❌ Failed to upload image. Please try again.');
          setUploading(false);
          return;
        }
        
        imageUrl = uploadResult.url;
        console.log('Image uploaded successfully:', imageUrl);
      }

      // Validate that we have an image (either uploaded or URL)
      if (!imageUrl) {
        alert('❌ Please either upload an image file or provide an image URL');
        setUploading(false);
        return;
      }

      const productData = {
        ...newProduct,
        image: imageUrl,
        price: parseFloat(newProduct.price),
        rating: parseFloat(newProduct.rating),
        reviews: parseInt(newProduct.reviews),
        stock_quantity: parseInt(newProduct.stock_quantity)
      };

      const result = await productService.addProduct(productData);
      if (result) {
        alert('✅ Product added successfully!');
        resetForm();
        setShowAddForm(false);
        fetchData(); // Refresh the list
      } else {
        alert('❌ Failed to add product');
      }
    } catch (error) {
      console.error('Error adding product:', error);
      alert('❌ Error: ' + error.message);
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteProduct = async (id) => {
    if (confirm('Are you sure you want to delete this product?')) {
      try {
        const result = await productService.deleteProduct(id);
        if (result) {
          alert('✅ Product deleted successfully!');
          fetchData(); // Refresh the list
        } else {
          alert('❌ Failed to delete product');
        }
      } catch (error) {
        console.error('Error deleting product:', error);
        alert('❌ Error: ' + error.message);
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-lg text-gray-600">Loading admin panel...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Admin Panel - My Home Store</title>
      </Head>

      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">🛠️ Admin Panel</h1>
            <p className="text-gray-600 mt-2">Manage your store products and inventory</p>
          </div>

          {/* Add Product Button */}
          <div className="mb-6">
            <button
              onClick={() => {
                setShowAddForm(!showAddForm);
                if (showAddForm) {
                  resetForm(); // Clear form when closing
                }
              }}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              {showAddForm ? '❌ Cancel' : '➕ Add New Product'}
            </button>
          </div>

          {/* Add Product Form */}
          {showAddForm && (
            <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
              <h2 className="text-xl font-semibold mb-4">Add New Product</h2>
              <form onSubmit={handleAddProduct} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
                  <input
                    type="text"
                    required
                    value={newProduct.name}
                    onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Modern Sofa Set"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Price ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={newProduct.price}
                    onChange={(e) => setNewProduct({...newProduct, price: e.target.value})}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="899.99"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <select
                    required
                    value={newProduct.category}
                    onChange={(e) => setNewProduct({...newProduct, category: e.target.value})}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select Category</option>
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.slug || cat.id}>{cat.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Stock Quantity</label>
                  <input
                    type="number"
                    required
                    value={newProduct.stock_quantity}
                    onChange={(e) => setNewProduct({...newProduct, stock_quantity: e.target.value})}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="10"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    required
                    value={newProduct.description}
                    onChange={(e) => setNewProduct({...newProduct, description: e.target.value})}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows="3"
                    placeholder="Comfortable 3-piece sofa set perfect for modern living rooms"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Product Image</label>
                  
                  {/* Image Upload Section */}
                  <div className="space-y-4">
                    {/* File Upload */}
                    <div>
                      <label className="block text-sm text-gray-600 mb-2">📁 Upload from Computer (Recommended)</label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                      />
                      <p className="text-xs text-gray-500 mt-1">Supported formats: JPEG, PNG, WebP (max 5MB)</p>
                    </div>

                    {/* OR Divider */}
                    <div className="flex items-center">
                      <div className="flex-1 border-t border-gray-300"></div>
                      <span className="px-3 text-sm text-gray-500">OR</span>
                      <div className="flex-1 border-t border-gray-300"></div>
                    </div>

                    {/* URL Input */}
                    <div>
                      <label className="block text-sm text-gray-600 mb-2">🔗 Image URL</label>
                      <input
                        type="url"
                        value={newProduct.image}
                        onChange={(e) => setNewProduct({...newProduct, image: e.target.value})}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="https://images.unsplash.com/photo-..."
                        disabled={imageFile !== null}
                      />
                      {imageFile && (
                        <p className="text-xs text-blue-600 mt-1">URL input disabled while file is selected</p>
                      )}
                    </div>

                    {/* Image Preview */}
                    {(imagePreview || newProduct.image) && (
                      <div>
                        <label className="block text-sm text-gray-600 mb-2">Preview</label>
                        <div className="relative inline-block">
                          <img
                            src={imagePreview || newProduct.image}
                            alt="Preview"
                            className="w-32 h-32 object-cover rounded-lg border border-gray-300"
                            onError={(e) => {
                              e.target.style.display = 'none';
                            }}
                          />
                          {imageFile && (
                            <button
                              type="button"
                              onClick={() => {
                                setImageFile(null);
                                setImagePreview('');
                                // Reset file input
                                const fileInput = document.querySelector('input[type="file"]');
                                if (fileInput) fileInput.value = '';
                              }}
                              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
                            >
                              ✕
                            </button>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Rating (1-5)</label>
                  <input
                    type="number"
                    step="0.1"
                    min="1"
                    max="5"
                    value={newProduct.rating}
                    onChange={(e) => setNewProduct({...newProduct, rating: e.target.value})}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Reviews Count</label>
                  <input
                    type="number"
                    min="0"
                    value={newProduct.reviews}
                    onChange={(e) => setNewProduct({...newProduct, reviews: e.target.value})}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={newProduct.is_featured}
                      onChange={(e) => setNewProduct({...newProduct, is_featured: e.target.checked})}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">Featured Product</span>
                  </label>
                </div>

                <div className="md:col-span-2">
                  <button
                    type="submit"
                    disabled={uploading}
                    className={`px-6 py-2 rounded-md transition-colors ${
                      uploading 
                        ? 'bg-gray-400 cursor-not-allowed' 
                        : 'bg-green-600 hover:bg-green-700'
                    } text-white`}
                  >
                    {uploading ? '⏳ Adding Product...' : '✅ Add Product'}
                  </button>
                  {uploading && (
                    <p className="text-sm text-blue-600 mt-2">
                      {imageFile ? 'Uploading image and creating product...' : 'Creating product...'}
                    </p>
                  )}
                </div>
              </form>
            </div>
          )}

          {/* Products List */}
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold">Products ({products.length})</h2>
            </div>
            
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {products.map((product) => (
                    <tr key={product.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <img className="h-10 w-10 rounded-md object-cover" src={product.image} alt={product.name} />
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{product.name}</div>
                            <div className="text-sm text-gray-500">{product.description?.substring(0, 50)}...</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{product.category}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${product.price}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{product.stock_quantity || 'N/A'}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => handleDeleteProduct(product.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          🗑️ Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

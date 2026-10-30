import { useState, useEffect } from "react";
import { 
  FiSearch, 
  FiPlus, 
  FiTrash2, 
  FiX, 
  FiStar,
  FiTrendingUp
} from "react-icons/fi";
import "./Products.css";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Add Product Form Inputs
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("T-shirts");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  // 1. Fetch Products from MongoDB Backend
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await fetch("http://localhost:5000/api/products");
      const data = await res.json();
      setProducts(data);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // 2. Add New Product to MongoDB Backend
  const handleCreateProduct = async (e) => {
    e.preventDefault();
    if (!title.trim() || !price || !stock) return;

    const newProductData = {
      title: title.trim(),
      description: description.trim() || "Quality clothing item",
      category,
      price: Number(price),
      stock: Number(stock),
      image: imageUrl.trim() || "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=300&q=80",
    };

    try {
      const res = await fetch("http://localhost:5000/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newProductData),
      });

      if (res.ok) {
        // Refresh catalog after adding product
        fetchProducts();
        setTitle("");
        setDescription("");
        setPrice("");
        setStock("");
        setImageUrl("");
        setIsAddModalOpen(false);
      }
    } catch (error) {
      console.error("Error creating product:", error);
    }
  };

  const filteredProducts = products.filter((p) => {
    const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "All" || p.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="products-module">
      <div className="module-top-header">
        <div>
          <h2>Products Catalog</h2>
          <p>Real-time inventory control synced with MongoDB Atlas.</p>
        </div>
        <button 
          type="button" 
          className="btn-create-product"
          onClick={() => setIsAddModalOpen(true)}
        >
          <FiPlus /> Add New Product
        </button>
      </div>

      {/* Control Bar */}
      <div className="products-controls">
        <div className="prod-search-wrap">
          <FiSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search products by title..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="category-filter-pills">
          {["All", "T-shirts", "Shirts", "Jeans", "Shorts"].map((cat) => (
            <button
              key={cat}
              type="button"
              className={`cat-pill ${selectedCategory === cat ? "active" : ""}`}
              onClick={() => setSelectedCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Products Table */}
      <div className="products-table-card">
        <div className="table-responsive">
          <table className="products-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Category</th>
                <th>Price</th>
                <th>Stock Level</th>
                <th>Rating</th>
                <th>Total Sold</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="7" className="empty-table-cell">
                    Loading products from MongoDB...
                  </td>
                </tr>
              ) : filteredProducts.length > 0 ? (
                filteredProducts.map((prod) => (
                  <tr key={prod._id}>
                    <td>
                      <div className="product-title-cell">
                        <img 
                          src={prod.image || "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=300&q=80"} 
                          alt={prod.title} 
                          className="prod-thumbnail" 
                        />
                        <div>
                          <span className="prod-name">{prod.title}</span>
                          <span className="prod-id">{prod._id}</span>
                        </div>
                      </div>
                    </td>
                    <td><span className="category-tag">{prod.category}</span></td>
                    <td style={{ fontWeight: 700, color: "#0f172a" }}>${prod.price}</td>
                    <td>
                      <span className="stock-value">{prod.stock}</span>
                    </td>
                    <td>
                      <span className="rating-pill">
                        <FiStar className="star-icon" /> 4.5
                      </span>
                    </td>
                    <td>
                      <span className="sales-text">
                        <FiTrendingUp className="trend-icon" /> 0 pcs
                      </span>
                    </td>
                    <td>
                      <span className={`stock-status-pill ${prod.stock > 0 ? "in-stock" : "out-of-stock"}`}>
                        {prod.stock > 0 ? "In Stock" : "Out of Stock"}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="empty-table-cell">
                    No products found matching your filter criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Product Modal */}
      {isAddModalOpen && (
        <div className="modal-backdrop" onClick={() => setIsAddModalOpen(false)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Create New Product</h3>
              <button type="button" className="close-modal-btn" onClick={() => setIsAddModalOpen(false)}>
                <FiX />
              </button>
            </div>

            <form onSubmit={handleCreateProduct} className="add-product-form">
              <label>
                Product Title *
                <input
                  type="text"
                  placeholder="e.g. Slim Fit Denim Jacket"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </label>

              <label>
                Description
                <input
                  type="text"
                  placeholder="Short description..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </label>

              <div className="form-grid-row">
                <label>
                  Category
                  <select value={category} onChange={(e) => setCategory(e.target.value)}>
                    <option value="T-shirts">T-shirts</option>
                    <option value="Shirts">Shirts</option>
                    <option value="Jeans">Jeans</option>
                    <option value="Shorts">Shorts</option>
                    <option value="Hoodies">Hoodies</option>
                  </select>
                </label>

                <label>
                  Price ($) *
                  <input
                    type="number"
                    placeholder="120"
                    min="1"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    required
                  />
                </label>
              </div>

              <div className="form-grid-row">
                <label>
                  Initial Stock Units *
                  <input
                    type="number"
                    placeholder="25"
                    min="0"
                    value={stock}
                    onChange={(e) => setStock(e.target.value)}
                    required
                  />
                </label>

                <label>
                  Image URL
                  <input
                    type="url"
                    placeholder="https://images.unsplash.com/..."
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                  />
                </label>
              </div>

              <div className="modal-actions-footer">
                <button type="button" className="btn-cancel" onClick={() => setIsAddModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-submit-save">
                  Save Product to Database
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
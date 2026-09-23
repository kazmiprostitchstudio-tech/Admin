import { useState } from "react";
import { 
  FiSearch, 
  FiPlus, 
  FiTrash2, 
  FiX, 
  FiBox, 
  FiAlertTriangle, 
  FiCheckCircle, 
  FiStar,
  FiTrendingUp
} from "react-icons/fi";
import { useAdmin } from "../../context/AdminContext";
import "./Products.css";

export default function Products() {
  const { products, addProduct, deleteProduct, updateProductStock } = useAdmin();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Add Product Form Inputs
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("T-shirts");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  const handleCreateProduct = (e) => {
    e.preventDefault();
    if (!title.trim() || !price || !stock) return;

    addProduct({
      title: title.trim(),
      category,
      price: Number(price),
      stock: Number(stock),
      image: imageUrl.trim() || "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=300&q=80",
    });

    setTitle("");
    setPrice("");
    setStock("");
    setImageUrl("");
    setIsAddModalOpen(false);
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
          <p>Real-time inventory control, price adjustments, and stock levels synced with LocalStorage.</p>
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
                <th style={{ textAlign: "right" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.length > 0 ? (
                filteredProducts.map((prod) => (
                  <tr key={prod.id}>
                    <td>
                      <div className="product-title-cell">
                        <img src={prod.image} alt={prod.title} className="prod-thumbnail" />
                        <div>
                          <span className="prod-name">{prod.title}</span>
                          <span className="prod-id">{prod.id}</span>
                        </div>
                      </div>
                    </td>
                    <td><span className="category-tag">{prod.category}</span></td>
                    <td style={{ fontWeight: 700, color: "#0f172a" }}>${prod.price}</td>
                    <td>
                      <div className="stock-counter-wrap">
                        <button 
                          type="button" 
                          onClick={() => updateProductStock(prod.id, prod.stock - 1)}
                          title="Decrease Stock"
                        >
                          -
                        </button>
                        <span className="stock-value">{prod.stock}</span>
                        <button 
                          type="button" 
                          onClick={() => updateProductStock(prod.id, prod.stock + 1)}
                          title="Increase Stock"
                        >
                          +
                        </button>
                      </div>
                    </td>
                    <td>
                      <span className="rating-pill">
                        <FiStar className="star-icon" /> {prod.rating}
                      </span>
                    </td>
                    <td>
                      <span className="sales-text">
                        <FiTrendingUp className="trend-icon" /> {prod.sales} pcs
                      </span>
                    </td>
                    <td>
                      <span className={`stock-status-pill ${prod.status.toLowerCase().replace(/\s+/g, "-")}`}>
                        {prod.status}
                      </span>
                    </td>
                    <td style={{ textAlign: "right" }}>
                      <button
                        type="button"
                        className="btn-delete-prod"
                        title="Delete Product"
                        onClick={() => {
                          if (window.confirm(`Delete ${prod.title}?`)) {
                            deleteProduct(prod.id);
                          }
                        }}
                      >
                        <FiTrash2 />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="empty-table-cell">
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
                  Save Product to Catalog
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
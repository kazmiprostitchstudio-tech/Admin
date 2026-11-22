import { useState, useEffect } from "react";
import {
  FiSearch,
  FiPlus,
  FiX,
  FiStar,
  FiTrendingUp,
  FiEdit2,
  FiTrash2,
} from "react-icons/fi";
import "./Products.css";

const API_BASE_URL = "https://backend-e-commerce-admin-hk.vercel.app/api/products";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProductId, setEditingProductId] = useState(null);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("T-shirts");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await fetch(API_BASE_URL);
      const data = await res.json();
      setProducts(Array.isArray(data) ? data : data.products || []);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setCategory("T-shirts");
    setPrice("");
    setStock("");
    setImageUrl("");
    setEditingProductId(null);
  };

  const openAddModal = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const openEditModal = (prod) => {
    setEditingProductId(prod._id);
    setTitle(prod.title || "");
    setDescription(prod.description || "");
    setCategory(prod.category || "T-shirts");
    setPrice(prod.price ?? "");
    setStock(prod.stock ?? "");
    setImageUrl(prod.imageUrl || prod.image || "");
    setIsModalOpen(true);
  };

  const handleSaveProduct = async (e) => {
    e.preventDefault();
    if (!title.trim() || price === "" || stock === "") return;

    const finalImage =
      imageUrl.trim() ||
      "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=300&q=80";

    const productPayload = {
      title: title.trim(),
      description: description.trim() || "Quality clothing item",
      category,
      price: Number(price),
      stock: Number(stock),
      image: finalImage,
      imageUrl: finalImage,
    };

    try {
      setSubmitting(true);
      const url = editingProductId
        ? `${API_BASE_URL}/${editingProductId}`
        : API_BASE_URL;
      const method = editingProductId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(productPayload),
      });

      const data = await res.json();

      if (res.ok) {
        await fetchProducts();
        resetForm();
        setIsModalOpen(false);
      } else {
        alert(data.message || "Failed to save product");
      }
    } catch (error) {
      console.error("Error saving product:", error);
      alert("Network error while saving product");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteProduct = async (id, prodTitle) => {
    const confirmed = window.confirm(`Are you sure you want to delete "${prodTitle}"?`);
    if (!confirmed) return;

    try {
      const res = await fetch(`${API_BASE_URL}/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setProducts((prev) => prev.filter((item) => item._id !== id));
      } else {
        const data = await res.json();
        alert(data.message || "Failed to delete product");
      }
    } catch (error) {
      console.error("Error deleting product:", error);
      alert("Network error while deleting product");
    }
  };

  const filteredProducts = products.filter((p) => {
    const matchesSearch = (p.title || "").toLowerCase().includes(searchQuery.toLowerCase());
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
          onClick={openAddModal}
        >
          <FiPlus /> Add New Product
        </button>
      </div>

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
          {["All", "T-shirts", "Shirts", "Jeans", "Shorts", "Hoodie"].map((cat) => (
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
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="8" className="empty-table-cell">
                    Loading products from MongoDB...
                  </td>
                </tr>
              ) : filteredProducts.length > 0 ? (
                filteredProducts.map((prod) => (
                  <tr key={prod._id}>
                    <td>
                      <div className="product-title-cell">
                        <img
                          src={
                            prod.imageUrl ||
                            prod.image ||
                            "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=300&q=80"
                          }
                          alt={prod.title}
                          className="prod-thumbnail"
                        />
                        <div>
                          <span className="prod-name">{prod.title}</span>
                          <span className="prod-id">{prod._id}</span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className="category-tag">{prod.category}</span>
                    </td>
                    <td style={{ fontWeight: 700, color: "#0f172a" }}>${prod.price}</td>
                    <td>
                      <span className="stock-value">{prod.stock}</span>
                    </td>
                    <td>
                      <span className="rating-pill">
                        <FiStar className="star-icon" /> {prod.rating || 4.5}
                      </span>
                    </td>
                    <td>
                      <span className="sales-text">
                        <FiTrendingUp className="trend-icon" /> {prod.sold || 0} pcs
                      </span>
                    </td>
                    <td>
                      <span
                        className={`stock-status-pill ${
                          prod.stock > 0 ? "in-stock" : "out-of-stock"
                        }`}
                      >
                        {prod.stock > 0 ? "In Stock" : "Out of Stock"}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: "flex", gap: "8px" }}>
                        <button
                          type="button"
                          onClick={() => openEditModal(prod)}
                          title="Edit Product"
                          style={{
                            padding: "6px 10px",
                            borderRadius: "6px",
                            border: "1px solid #cbd5e1",
                            background: "#f8fafc",
                            color: "#0f172a",
                            cursor: "pointer",
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "4px",
                          }}
                        >
                          <FiEdit2 size={14} /> Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteProduct(prod._id, prod.title)}
                          title="Delete Product"
                          style={{
                            padding: "6px 10px",
                            borderRadius: "6px",
                            border: "1px solid #fecaca",
                            background: "#fef2f2",
                            color: "#dc2626",
                            cursor: "pointer",
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "4px",
                          }}
                        >
                          <FiTrash2 size={14} /> Delete
                        </button>
                      </div>
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

      {isModalOpen && (
        <div className="modal-backdrop" onClick={() => setIsModalOpen(false)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{editingProductId ? "Edit Product" : "Create New Product"}</h3>
              <button
                type="button"
                className="close-modal-btn"
                onClick={() => setIsModalOpen(false)}
              >
                <FiX />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="add-product-form">
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
                    <option value="Hoodie">Hoodie</option>
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
                  Stock Units *
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
                <button
                  type="button"
                  className="btn-cancel"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn-submit-save" disabled={submitting}>
                  {submitting
                    ? "Saving..."
                    : editingProductId
                    ? "Update Product"
                    : "Save Product to Database"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
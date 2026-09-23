import { useState, useEffect } from "react";
import { 
  FiPlus, 
  FiTrash2, 
  FiGrid, 
  FiTag, 
  FiCheckCircle, 
  FiXCircle, 
  FiX, 
  FiLayers 
} from "react-icons/fi";
import "./Categories.css";

const INITIAL_CATEGORIES = [
  { id: "CAT-101", name: "T-shirts", slug: "t-shirts", itemCount: 28, status: "Active" },
  { id: "CAT-102", name: "Shirts", slug: "shirts", itemCount: 19, status: "Active" },
  { id: "CAT-103", name: "Jeans", slug: "jeans", itemCount: 14, status: "Active" },
  { id: "CAT-104", name: "Shorts", slug: "shorts", itemCount: 8, status: "Active" },
  { id: "CAT-105", name: "Hoodies", slug: "hoodies", itemCount: 6, status: "Inactive" },
];

const INITIAL_BRANDS = [
  { id: "BRD-1", name: "VERSACE", discountDeal: "Up to 20% Off", status: "Active" },
  { id: "BRD-2", name: "ZARA", discountDeal: "New Season 30% Off", status: "Active" },
  { id: "BRD-3", name: "GUCCI", discountDeal: "Exclusive Collection", status: "Active" },
  { id: "BRD-4", name: "PRADA", discountDeal: "Trending 15% Off", status: "Active" },
  { id: "BRD-5", name: "Calvin Klein", discountDeal: "Casual Wear Flat 25%", status: "Active" },
];

export default function Categories() {
  const [activeTab, setActiveTab] = useState("categories");

  // LocalStorage Sync
  const [categories, setCategories] = useState(() => {
    try {
      const saved = localStorage.getItem("shopco_admin_categories");
      return saved ? JSON.parse(saved) : INITIAL_CATEGORIES;
    } catch {
      return INITIAL_CATEGORIES;
    }
  });

  const [brands, setBrands] = useState(() => {
    try {
      const saved = localStorage.getItem("shopco_admin_brands");
      return saved ? JSON.parse(saved) : INITIAL_BRANDS;
    } catch {
      return INITIAL_BRANDS;
    }
  });

  useEffect(() => {
    localStorage.setItem("shopco_admin_categories", JSON.stringify(categories));
  }, [categories]);

  useEffect(() => {
    localStorage.setItem("shopco_admin_brands", JSON.stringify(brands));
  }, [brands]);

  // Modal States
  const [isCatModalOpen, setIsCatModalOpen] = useState(false);
  const [isBrandModalOpen, setIsBrandModalOpen] = useState(false);

  // Form Inputs
  const [catName, setCatName] = useState("");
  const [brandName, setBrandName] = useState("");
  const [brandDeal, setBrandDeal] = useState("");

  // Handlers
  const handleAddCategory = (e) => {
    e.preventDefault();
    if (!catName.trim()) return;

    const newCategory = {
      id: `CAT-${Math.floor(100 + Math.random() * 900)}`,
      name: catName.trim(),
      slug: catName.trim().toLowerCase().replace(/\s+/g, "-"),
      itemCount: 0,
      status: "Active",
    };

    setCategories([newCategory, ...categories]);
    setCatName("");
    setIsCatModalOpen(false);
  };

  const handleDeleteCategory = (id) => {
    if (window.confirm("Delete this category?")) {
      setCategories(categories.filter((c) => c.id !== id));
    }
  };

  const handleToggleCatStatus = (id) => {
    setCategories(
      categories.map((c) =>
        c.id === id ? { ...c, status: c.status === "Active" ? "Inactive" : "Active" } : c
      )
    );
  };

  const handleAddBrand = (e) => {
    e.preventDefault();
    if (!brandName.trim()) return;

    const newBrand = {
      id: `BRD-${Math.floor(10 + Math.random() * 90)}`,
      name: brandName.trim().toUpperCase(),
      discountDeal: brandDeal.trim() || "Featured Brand",
      status: "Active",
    };

    setBrands([newBrand, ...brands]);
    setBrandName("");
    setBrandDeal("");
    setIsBrandModalOpen(false);
  };

  const handleDeleteBrand = (id) => {
    if (window.confirm("Delete this partner brand?")) {
      setBrands(brands.filter((b) => b.id !== id));
    }
  };

  return (
    <div className="categories-module">
      <div className="module-top-header">
        <div>
          <h2>Taxonomy & Brands</h2>
          <p>Organize store classifications, catalog groupings, and top brand partnerships.</p>
        </div>
        <button
          type="button"
          className="btn-add-primary"
          onClick={() => (activeTab === "categories" ? setIsCatModalOpen(true) : setIsBrandModalOpen(true))}
        >
          <FiPlus /> {activeTab === "categories" ? "Add Category" : "Add Brand"}
        </button>
      </div>

      {/* Tabs Navigation */}
      <div className="taxonomy-tabs">
        <button
          type="button"
          className={`tab-btn ${activeTab === "categories" ? "active" : ""}`}
          onClick={() => setActiveTab("categories")}
        >
          <FiLayers /> Categories ({categories.length})
        </button>
        <button
          type="button"
          className={`tab-btn ${activeTab === "brands" ? "active" : ""}`}
          onClick={() => setActiveTab("brands")}
        >
          <FiTag /> Partner Brands ({brands.length})
        </button>
      </div>

      {/* Categories View */}
      {activeTab === "categories" && (
        <div className="data-table-card">
          <div className="table-responsive">
            <table className="taxonomy-table">
              <thead>
                <tr>
                  <th>Category ID</th>
                  <th>Category Name</th>
                  <th>URL Slug</th>
                  <th>Products Attached</th>
                  <th>Status</th>
                  <th style={{ textAlign: "right" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {categories.map((cat) => (
                  <tr key={cat.id}>
                    <td style={{ fontWeight: 600 }}>{cat.id}</td>
                    <td>
                      <span className="name-bold">{cat.name}</span>
                    </td>
                    <td>
                      <code className="slug-tag">/{cat.slug}</code>
                    </td>
                    <td style={{ fontWeight: 600 }}>{cat.itemCount} items</td>
                    <td>
                      <button
                        type="button"
                        className={`status-toggle-btn ${cat.status.toLowerCase()}`}
                        onClick={() => handleToggleCatStatus(cat.id)}
                        title="Click to toggle status"
                      >
                        {cat.status === "Active" ? <FiCheckCircle /> : <FiXCircle />}
                        {cat.status}
                      </button>
                    </td>
                    <td style={{ textAlign: "right" }}>
                      <button
                        type="button"
                        className="btn-trash"
                        title="Delete Category"
                        onClick={() => handleDeleteCategory(cat.id)}
                      >
                        <FiTrash2 />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Brands View */}
      {activeTab === "brands" && (
        <div className="brands-grid">
          {brands.map((b) => (
            <div key={b.id} className="brand-card">
              <div className="brand-card-top">
                <span className="brand-badge">{b.id}</span>
                <button
                  type="button"
                  className="btn-trash"
                  onClick={() => handleDeleteBrand(b.id)}
                  title="Remove Brand"
                >
                  <FiTrash2 />
                </button>
              </div>
              <h3 className="brand-title">{b.name}</h3>
              <p className="brand-deal">{b.discountDeal}</p>
              <div className="brand-card-footer">
                <span className="brand-status-tag">{b.status}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Category Modal */}
      {isCatModalOpen && (
        <div className="modal-backdrop" onClick={() => setIsCatModalOpen(false)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Create New Category</h3>
              <button type="button" className="close-btn" onClick={() => setIsCatModalOpen(false)}>
                <FiX />
              </button>
            </div>
            <form onSubmit={handleAddCategory} className="modal-form">
              <label>
                Category Name *
                <input
                  type="text"
                  placeholder="e.g. Formal Blazers"
                  value={catName}
                  onChange={(e) => setCatName(e.target.value)}
                  required
                />
              </label>
              <div className="modal-actions">
                <button type="button" className="btn-secondary" onClick={() => setIsCatModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Save Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Brand Modal */}
      {isBrandModalOpen && (
        <div className="modal-backdrop" onClick={() => setIsBrandModalOpen(false)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Register Partner Brand</h3>
              <button type="button" className="close-btn" onClick={() => setIsBrandModalOpen(false)}>
                <FiX />
              </button>
            </div>
            <form onSubmit={handleAddBrand} className="modal-form">
              <label>
                Brand Title *
                <input
                  type="text"
                  placeholder="e.g. ARMANI EXCHANGE"
                  value={brandName}
                  onChange={(e) => setBrandName(e.target.value)}
                  required
                />
              </label>
              <label>
                Promotional Tagline / Offer
                <input
                  type="text"
                  placeholder="e.g. Flat 20% on Luxury Edit"
                  value={brandDeal}
                  onChange={(e) => setBrandDeal(e.target.value)}
                />
              </label>
              <div className="modal-actions">
                <button type="button" className="btn-secondary" onClick={() => setIsBrandModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Register Brand
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
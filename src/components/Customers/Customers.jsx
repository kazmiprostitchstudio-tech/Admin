import { useState } from "react";
import { 
  FiSearch, 
  FiPlus, 
  FiEye, 
  FiTrash2, 
  FiMail, 
  FiPhone, 
  FiMapPin, 
  FiX, 
  FiUserCheck, 
  FiDollarSign, 
  FiShoppingBag,
  FiAward
} from "react-icons/fi";
import "./Customers.css";

// Store ke buyers aur reviewers ke mutabiq initial dataset
const INITIAL_CUSTOMERS = [
  {
    id: "CUST-1041",
    name: "Samantha D.",
    email: "samantha.d@example.com",
    phone: "+1 (555) 234-5678",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Samantha",
    totalOrders: 6,
    totalSpent: 845,
    status: "VIP",
    city: "New York, USA",
    joinedDate: "Aug 14, 2023",
    lastOrder: "Gradient Graphic T-shirt",
  },
  {
    id: "CUST-1042",
    name: "Alex Morgan",
    email: "alex.m@example.com",
    phone: "+1 (555) 345-6789",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex",
    totalOrders: 4,
    totalSpent: 532,
    status: "Active",
    city: "Los Angeles, USA",
    joinedDate: "Aug 15, 2023",
    lastOrder: "Black Striped T-shirt",
  },
  {
    id: "CUST-1043",
    name: "Ethan Ramirez",
    email: "ethan.r@example.com",
    phone: "+1 (555) 456-7890",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ethan",
    totalOrders: 5,
    totalSpent: 690,
    status: "Active",
    city: "Chicago, USA",
    joinedDate: "Aug 16, 2023",
    lastOrder: "Polo with Tipping Details",
  },
  {
    id: "CUST-1044",
    name: "Olivia Parker",
    email: "olivia.p@example.com",
    phone: "+1 (555) 567-8901",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Olivia",
    totalOrders: 8,
    totalSpent: 1120,
    status: "VIP",
    city: "Seattle, USA",
    joinedDate: "Aug 17, 2023",
    lastOrder: "Skinny Fit Jeans",
  },
  {
    id: "CUST-1045",
    name: "Liam Khan",
    email: "liam.k@example.com",
    phone: "+1 (555) 678-9012",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Liam",
    totalOrders: 2,
    totalSpent: 260,
    status: "New",
    city: "Houston, USA",
    joinedDate: "Aug 18, 2023",
    lastOrder: "Checkered Shirt",
  },
  {
    id: "CUST-1046",
    name: "Ava Harper",
    email: "ava.h@example.com",
    phone: "+1 (555) 789-0123",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ava",
    totalOrders: 3,
    totalSpent: 395,
    status: "Active",
    city: "San Francisco, USA",
    joinedDate: "Aug 19, 2023",
    lastOrder: "Loose Fit Bermuda Shorts",
  },
  {
    id: "CUST-1047",
    name: "Daniel Stone",
    email: "daniel.s@example.com",
    phone: "+1 (555) 890-1234",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Daniel",
    totalOrders: 1,
    totalSpent: 120,
    status: "Inactive",
    city: "Denver, USA",
    joinedDate: "Aug 20, 2023",
    lastOrder: "T-shirt with Tape Details",
  },
];

export default function Customers() {
  // LocalStorage state management
  const [customers, setCustomers] = useState(() => {
    try {
      const saved = localStorage.getItem("shopco_admin_customers");
      return saved ? JSON.parse(saved) : INITIAL_CUSTOMERS;
    } catch {
      return INITIAL_CUSTOMERS;
    }
  });

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Form State for Add Customer
  const [formName, setFormName] = useState("");
  const [formEmail, setFormEmail] = useState("");
  const [formPhone, setFormPhone] = useState("");
  const [formCity, setFormCity] = useState("");
  const [formStatus, setFormStatus] = useState("New");

  const updateCustomerStorage = (updated) => {
    setCustomers(updated);
    localStorage.setItem("shopco_admin_customers", JSON.stringify(updated));
  };

  // Delete Customer
  const handleDeleteCustomer = (id) => {
    if (window.confirm("Are you sure you want to remove this customer record?")) {
      const updated = customers.filter((c) => c.id !== id);
      updateCustomerStorage(updated);
      if (selectedCustomer?.id === id) setSelectedCustomer(null);
    }
  };

  // Add New Customer
  const handleAddCustomer = (e) => {
    e.preventDefault();
    if (!formName.trim() || !formEmail.trim()) return;

    const newCustomer = {
      id: `CUST-${Math.floor(1000 + Math.random() * 9000)}`,
      name: formName.trim(),
      email: formEmail.trim(),
      phone: formPhone.trim() || "+1 (555) 000-0000",
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(formName)}`,
      totalOrders: 0,
      totalSpent: 0,
      status: formStatus,
      city: formCity.trim() || "Unspecified",
      joinedDate: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      lastOrder: "None",
    };

    const updated = [newCustomer, ...customers];
    updateCustomerStorage(updated);

    // Reset Form
    setFormName("");
    setFormEmail("");
    setFormPhone("");
    setFormCity("");
    setFormStatus("New");
    setIsAddModalOpen(false);
  };

  // Filter & Search Logic
  const filteredCustomers = customers.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.city.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "All" || c.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // KPI Calculations
  const totalSpentAll = customers.reduce((sum, c) => sum + c.totalSpent, 0);
  const vipCount = customers.filter((c) => c.status === "VIP").length;

  return (
    <div className="customers-module">
      {/* Top Header */}
      <div className="module-header">
        <div>
          <h2>Customer Directory</h2>
          <p>Monitor customer lifecycle, spending volume, and account statuses.</p>
        </div>
        <button 
          type="button" 
          className="add-cust-btn"
          onClick={() => setIsAddModalOpen(true)}
        >
          <FiPlus /> Add Customer
        </button>
      </div>

      {/* Summary KPI Badges */}
      <div className="cust-metrics-grid">
        <div className="cust-kpi-card">
          <div className="kpi-icon-box blue"><FiUserCheck /></div>
          <div>
            <span className="kpi-label">Total Customers</span>
            <h3>{customers.length}</h3>
          </div>
        </div>
        <div className="cust-kpi-card">
          <div className="kpi-icon-box purple"><FiAward /></div>
          <div>
            <span className="kpi-label">VIP Clients</span>
            <h3>{vipCount}</h3>
          </div>
        </div>
        <div className="cust-kpi-card">
          <div className="kpi-icon-box green"><FiDollarSign /></div>
          <div>
            <span className="kpi-label">Gross Lifetime Value</span>
            <h3>${totalSpentAll.toLocaleString()}</h3>
          </div>
        </div>
      </div>

      {/* Control Bar: Search & Status Filter */}
      <div className="cust-control-bar">
        <div className="cust-search-box">
          <FiSearch className="search-ico" />
          <input 
            type="text" 
            placeholder="Search by customer name, email, or city..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="cust-filter-pills">
          {["All", "VIP", "Active", "New", "Inactive"].map((tab) => (
            <button
              key={tab}
              type="button"
              className={`pill-btn ${statusFilter === tab ? "active" : ""}`}
              onClick={() => setStatusFilter(tab)}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Customers Data Table */}
      <div className="cust-table-card">
        <div className="table-responsive">
          <table className="cust-data-table">
            <thead>
              <tr>
                <th>Customer</th>
                <th>Contact Info</th>
                <th>Location</th>
                <th>Orders</th>
                <th>Total Spent</th>
                <th>Status</th>
                <th style={{ textAlign: "right" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCustomers.length > 0 ? (
                filteredCustomers.map((c) => (
                  <tr key={c.id}>
                    <td>
                      <div className="customer-cell">
                        <img src={c.avatar} alt={c.name} className="cust-avatar" />
                        <div>
                          <span className="cust-name">{c.name}</span>
                          <span className="cust-id">{c.id}</span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="contact-cell">
                        <span><FiMail className="inline-ico" /> {c.email}</span>
                        <span className="sub-text"><FiPhone className="inline-ico" /> {c.phone}</span>
                      </div>
                    </td>
                    <td>
                      <span className="city-cell">
                        <FiMapPin className="inline-ico" /> {c.city}
                      </span>
                    </td>
                    <td style={{ fontWeight: 600 }}>{c.totalOrders}</td>
                    <td style={{ fontWeight: 700, color: "#0f172a" }}>${c.totalSpent}</td>
                    <td>
                      <span className={`status-badge ${c.status.toLowerCase()}`}>
                        {c.status}
                      </span>
                    </td>
                    <td>
                      <div className="action-buttons-group">
                        <button
                          type="button"
                          className="action-icon-btn view"
                          title="View Profile"
                          onClick={() => setSelectedCustomer(c)}
                        >
                          <FiEye />
                        </button>
                        <button
                          type="button"
                          className="action-icon-btn delete"
                          title="Delete Record"
                          onClick={() => handleDeleteCustomer(c.id)}
                        >
                          <FiTrash2 />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="empty-results-cell">
                    No customers found matching your search or filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Customer Profile Modal (View Details) */}
      {selectedCustomer && (
        <div className="modal-backdrop" onClick={() => setSelectedCustomer(null)}>
          <div className="modal-box details-box" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Customer Profile</h3>
              <button type="button" className="close-btn" onClick={() => setSelectedCustomer(null)}>
                <FiX />
              </button>
            </div>

            <div className="profile-summary">
              <img src={selectedCustomer.avatar} alt={selectedCustomer.name} className="profile-large-avatar" />
              <h4>{selectedCustomer.name}</h4>
              <span className={`status-badge ${selectedCustomer.status.toLowerCase()}`}>
                {selectedCustomer.status}
              </span>
            </div>

            <div className="profile-grid-info">
              <div className="info-block">
                <span className="lbl">Customer ID</span>
                <span className="val">{selectedCustomer.id}</span>
              </div>
              <div className="info-block">
                <span className="lbl">Email Address</span>
                <span className="val">{selectedCustomer.email}</span>
              </div>
              <div className="info-block">
                <span className="lbl">Phone Number</span>
                <span className="val">{selectedCustomer.phone}</span>
              </div>
              <div className="info-block">
                <span className="lbl">City / State</span>
                <span className="val">{selectedCustomer.city}</span>
              </div>
              <div className="info-block">
                <span className="lbl">Member Since</span>
                <span className="val">{selectedCustomer.joinedDate}</span>
              </div>
              <div className="info-block">
                <span className="lbl">Recent Purchase</span>
                <span className="val">{selectedCustomer.lastOrder}</span>
              </div>
            </div>

            <div className="financial-highlight">
              <div className="fin-item">
                <FiShoppingBag className="fin-ico" />
                <div>
                  <span className="fin-lbl">Completed Orders</span>
                  <h4>{selectedCustomer.totalOrders}</h4>
                </div>
              </div>
              <div className="fin-item">
                <FiDollarSign className="fin-ico" />
                <div>
                  <span className="fin-lbl">Total Expenditure</span>
                  <h4>${selectedCustomer.totalSpent}</h4>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Customer Modal */}
      {isAddModalOpen && (
        <div className="modal-backdrop" onClick={() => setIsAddModalOpen(false)}>
          <div className="modal-box form-box" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Add New Customer</h3>
              <button type="button" className="close-btn" onClick={() => setIsAddModalOpen(false)}>
                <FiX />
              </button>
            </div>

            <form onSubmit={handleAddCustomer} className="customer-add-form">
              <label>
                Full Name *
                <input
                  type="text"
                  placeholder="e.g. Liam Khan"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  required
                />
              </label>

              <label>
                Email Address *
                <input
                  type="email"
                  placeholder="name@example.com"
                  value={formEmail}
                  onChange={(e) => setFormEmail(e.target.value)}
                  required
                />
              </label>

              <div className="form-row">
                <label>
                  Phone Number
                  <input
                    type="text"
                    placeholder="+1 (555) 000-0000"
                    value={formPhone}
                    onChange={(e) => setFormPhone(e.target.value)}
                  />
                </label>

                <label>
                  City, Country
                  <input
                    type="text"
                    placeholder="e.g. Lahore, PK"
                    value={formCity}
                    onChange={(e) => setFormCity(e.target.value)}
                  />
                </label>
              </div>

              <label>
                Initial Account Status
                <select value={formStatus} onChange={(e) => setFormStatus(e.target.value)}>
                  <option value="New">New</option>
                  <option value="Active">Active</option>
                  <option value="VIP">VIP</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </label>

              <div className="modal-form-actions">
                <button type="button" className="cancel-btn" onClick={() => setIsAddModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="submit-cust-btn">
                  Save Customer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
import { useState, useEffect } from "react";
import { 
  FiShield, 
  FiUserCheck, 
  FiPlus, 
  FiTrash2, 
  FiMail, 
  FiLock, 
  FiX, 
  FiCheckCircle 
} from "react-icons/fi";
import "./Admins.css";

const INITIAL_ADMINS = [
  {
    id: "ADM-01",
    name: "Muhammad Raza",
    email: "raza@shopco.com",
    role: "Super Admin",
    access: "Full Unrestricted Access",
    status: "Active",
    lastLogin: "Active Now",
  },
  {
    id: "ADM-02",
    name: "Zainab Malik",
    email: "zainab.m@shopco.com",
    role: "Store Manager",
    access: "Products, Orders & Coupons",
    status: "Active",
    lastLogin: "2 hours ago",
  },
  {
    id: "ADM-03",
    name: "Hamza Tariq",
    email: "hamza.t@shopco.com",
    role: "Inventory Lead",
    access: "Products & Stock Dispatch",
    status: "Active",
    lastLogin: "Yesterday",
  },
  {
    id: "ADM-04",
    name: "Sara Ahmed",
    email: "sara.a@shopco.com",
    role: "Support Agent",
    access: "Customer Reviews & Refunds",
    status: "Inactive",
    lastLogin: "3 days ago",
  },
];

export default function Admins() {
  const [admins, setAdmins] = useState(() => {
    try {
      const saved = localStorage.getItem("shopco_admin_staff");
      return saved ? JSON.parse(saved) : INITIAL_ADMINS;
    } catch {
      return INITIAL_ADMINS;
    }
  });

  useEffect(() => {
    localStorage.setItem("shopco_admin_staff", JSON.stringify(admins));
  }, [admins]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("Store Manager");

  const handleAddAdmin = (e) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;

    const accessMap = {
      "Super Admin": "Full Unrestricted Access",
      "Store Manager": "Products, Orders & Coupons",
      "Inventory Lead": "Products & Stock Dispatch",
      "Support Agent": "Customer Reviews & Refunds",
    };

    const newAdmin = {
      id: `ADM-0${admins.length + 1}`,
      name: name.trim(),
      email: email.trim(),
      role,
      access: accessMap[role] || "Limited Access",
      status: "Active",
      lastLogin: "Invited (Never)",
    };

    setAdmins([...admins, newAdmin]);
    setName("");
    setEmail("");
    setIsModalOpen(false);
  };

  const handleDeleteAdmin = (id) => {
    if (id === "ADM-01") {
      alert("Super Admin account cannot be removed.");
      return;
    }
    if (window.confirm("Revoke this staff member's access?")) {
      setAdmins(admins.filter((a) => a.id !== id));
    }
  };

  const handleToggleStatus = (id) => {
    if (id === "ADM-01") return;
    setAdmins(
      admins.map((a) =>
        a.id === id
          ? { ...a, status: a.status === "Active" ? "Inactive" : "Active" }
          : a
      )
    );
  };

  return (
    <div className="admins-module">
      <div className="module-top-header">
        <div>
          <h2>Staff Members & Permissions</h2>
          <p>Control role-based access levels, invite staff, and audit security accounts.</p>
        </div>
        <button type="button" className="btn-add-primary" onClick={() => setIsModalOpen(true)}>
          <FiPlus /> Invite Admin
        </button>
      </div>

      <div className="admins-kpi-grid">
        <div className="kpi-card">
          <div className="kpi-ico blue"><FiShield /></div>
          <div>
            <span className="lbl">Authorized Users</span>
            <h3>{admins.length} Staff</h3>
          </div>
        </div>
        <div className="kpi-card">
          <div className="kpi-ico green"><FiUserCheck /></div>
          <div>
            <span className="lbl">Active Sessions</span>
            <h3>{admins.filter((a) => a.status === "Active").length} Online</h3>
          </div>
        </div>
      </div>

      <div className="admins-table-card">
        <div className="table-responsive">
          <table className="admins-table">
            <thead>
              <tr>
                <th>Admin Profile</th>
                <th>Assigned Role</th>
                <th>Permission Scope</th>
                <th>Status</th>
                <th>Last Active</th>
                <th style={{ textAlign: "right" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {admins.map((adm) => (
                <tr key={adm.id}>
                  <td>
                    <div className="admin-profile-cell">
                      <div className="admin-avatar">{adm.name[0]}</div>
                      <div>
                        <span className="name">{adm.name}</span>
                        <span className="email"><FiMail className="sub-ico" /> {adm.email}</span>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className={`role-badge ${adm.role.toLowerCase().replace(/\s+/g, "-")}`}>
                      {adm.role}
                    </span>
                  </td>
                  <td><span className="access-scope">{adm.access}</span></td>
                  <td>
                    <button
                      type="button"
                      className={`status-chip ${adm.status.toLowerCase()}`}
                      onClick={() => handleToggleStatus(adm.id)}
                      title="Click to toggle account access"
                    >
                      {adm.status}
                    </button>
                  </td>
                  <td style={{ color: "#64748b", fontSize: "0.825rem" }}>{adm.lastLogin}</td>
                  <td style={{ textAlign: "right" }}>
                    {adm.id !== "ADM-01" && (
                      <button
                        type="button"
                        className="btn-trash-admin"
                        onClick={() => handleDeleteAdmin(adm.id)}
                        title="Revoke Access"
                      >
                        <FiTrash2 />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="modal-backdrop" onClick={() => setIsModalOpen(false)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Grant Staff Access</h3>
              <button type="button" className="close-btn" onClick={() => setIsModalOpen(false)}>
                <FiX />
              </button>
            </div>
            <form onSubmit={handleAddAdmin} className="modal-form">
              <label>
                Full Name *
                <input
                  type="text"
                  placeholder="e.g. Asad Naveed"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </label>

              <label>
                Company Email Address *
                <input
                  type="email"
                  placeholder="user@shopco.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </label>

              <label>
                Role & Privileges
                <select value={role} onChange={(e) => setRole(e.target.value)}>
                  <option value="Super Admin">Super Admin (All Sections)</option>
                  <option value="Store Manager">Store Manager (Products, Orders, Coupons)</option>
                  <option value="Inventory Lead">Inventory Lead (Products & Shipping)</option>
                  <option value="Support Agent">Support Agent (Reviews & Customer Tickets)</option>
                </select>
              </label>

              <div className="modal-actions">
                <button type="button" className="btn-secondary" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Confirm & Send Credentials
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
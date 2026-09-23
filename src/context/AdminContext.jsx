import { createContext, useContext, useState, useEffect } from "react";

// Shop.co initial product dataset
const DEFAULT_PRODUCTS = [
  {
    id: "PROD-101",
    title: "Gradient Graphic T-shirt",
    category: "T-shirts",
    price: 145,
    stock: 24,
    rating: 4.5,
    sales: 120,
    status: "In Stock",
    image: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=300&q=80",
  },
  {
    id: "PROD-102",
    title: "Polo with Tipping Details",
    category: "Shirts",
    price: 180,
    stock: 12,
    rating: 4.8,
    sales: 85,
    status: "In Stock",
    image: "https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=300&q=80",
  },
  {
    id: "PROD-103",
    title: "Black Striped T-shirt",
    category: "T-shirts",
    price: 120,
    stock: 5,
    rating: 5.0,
    sales: 198,
    status: "Low Stock",
    image: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=300&q=80",
  },
  {
    id: "PROD-104",
    title: "Skinny Fit Jeans",
    category: "Jeans",
    price: 240,
    stock: 0,
    rating: 4.2,
    sales: 74,
    status: "Out of Stock",
    image: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=300&q=80",
  },
  {
    id: "PROD-105",
    title: "Checkered Shirt",
    category: "Shirts",
    price: 180,
    stock: 32,
    rating: 4.6,
    sales: 90,
    status: "In Stock",
    image: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=300&q=80",
  },
  {
    id: "PROD-106",
    title: "Loose Fit Bermuda Shorts",
    category: "Shorts",
    price: 80,
    stock: 15,
    rating: 3.8,
    sales: 45,
    status: "In Stock",
    image: "https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=300&q=80",
  },
];

// Initial Live Orders
const DEFAULT_ORDERS = [
  {
    id: "#ORD-9921",
    customer: "Samantha D.",
    email: "samantha.d@example.com",
    items: "Gradient Graphic T-shirt (x1)",
    amount: 145,
    paymentMethod: "Credit Card",
    paymentStatus: "Paid",
    status: "Delivered",
    date: "2026-09-18",
  },
  {
    id: "#ORD-9920",
    customer: "Alex Morgan",
    email: "alex.m@example.com",
    items: "Skinny Fit Jeans (x1)",
    amount: 240,
    paymentMethod: "Stripe",
    paymentStatus: "Paid",
    status: "Processing",
    date: "2026-09-19",
  },
  {
    id: "#ORD-9919",
    customer: "Ethan Ramirez",
    email: "ethan.r@example.com",
    items: "Checkered Shirt (x1)",
    amount: 180,
    paymentMethod: "Cash on Delivery",
    paymentStatus: "Pending",
    status: "Shipped",
    date: "2026-09-19",
  },
  {
    id: "#ORD-9918",
    customer: "Olivia Parker",
    email: "olivia.p@example.com",
    items: "Polo with Tipping Details (x1)",
    amount: 180,
    paymentMethod: "PayPal",
    paymentStatus: "Pending",
    status: "Pending",
    date: "2026-09-19",
  },
];

// Initial Categories
const DEFAULT_CATEGORIES = [
  { id: "CAT-1", name: "T-shirts", slug: "t-shirts", productsCount: 18, status: "Active" },
  { id: "CAT-2", name: "Shirts", slug: "shirts", productsCount: 14, status: "Active" },
  { id: "CAT-3", name: "Jeans", slug: "jeans", productsCount: 9, status: "Active" },
  { id: "CAT-4", name: "Shorts", slug: "shorts", productsCount: 6, status: "Active" },
  { id: "CAT-5", name: "Hoodies", slug: "hoodies", productsCount: 4, status: "Active" },
];

// Initial Coupons
const DEFAULT_COUPONS = [
  { id: "CPN-1", code: "SHOP20", discount: 20, type: "Percentage", used: 142, status: "Active" },
  { id: "CPN-2", code: "WELCOME10", discount: 10, type: "Percentage", used: 89, status: "Active" },
  { id: "CPN-3", code: "FREESHIP", discount: 15, type: "Fixed Amount", used: 47, status: "Expired" },
];

const AdminContext = createContext();

export function AdminProvider({ children }) {
  // 1. Products State with LocalStorage
  const [products, setProducts] = useState(() => {
    const saved = localStorage.getItem("shopco_db_products");
    return saved ? JSON.parse(saved) : DEFAULT_PRODUCTS;
  });

  // 2. Orders State with LocalStorage
  const [orders, setOrders] = useState(() => {
    const saved = localStorage.getItem("shopco_db_orders");
    return saved ? JSON.parse(saved) : DEFAULT_ORDERS;
  });

  // 3. Categories State with LocalStorage
  const [categories, setCategories] = useState(() => {
    const saved = localStorage.getItem("shopco_db_categories");
    return saved ? JSON.parse(saved) : DEFAULT_CATEGORIES;
  });

  // 4. Coupons State with LocalStorage
  const [coupons, setCoupons] = useState(() => {
    const saved = localStorage.getItem("shopco_db_coupons");
    return saved ? JSON.parse(saved) : DEFAULT_COUPONS;
  });

  // Sync to LocalStorage on changes
  useEffect(() => {
    localStorage.setItem("shopco_db_products", JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem("shopco_db_orders", JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem("shopco_db_categories", JSON.stringify(categories));
  }, [categories]);

  useEffect(() => {
    localStorage.setItem("shopco_db_coupons", JSON.stringify(coupons));
  }, [coupons]);

  // --- Dynamic Actions for Products ---
  const addProduct = (newProduct) => {
    setProducts((prev) => [
      {
        id: `PROD-${Math.floor(100 + Math.random() * 900)}`,
        sales: 0,
        rating: 5.0,
        status: newProduct.stock > 10 ? "In Stock" : newProduct.stock > 0 ? "Low Stock" : "Out of Stock",
        ...newProduct,
      },
      ...prev,
    ]);
  };

  const deleteProduct = (id) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  const updateProductStock = (id, newStock) => {
    setProducts((prev) =>
      prev.map((p) =>
        p.id === id
          ? {
              ...p,
              stock: Math.max(0, newStock),
              status: newStock > 10 ? "In Stock" : newStock > 0 ? "Low Stock" : "Out of Stock",
            }
          : p
      )
    );
  };

  // --- Dynamic Actions for Orders ---
  const updateOrderStatus = (orderId, newStatus) => {
    setOrders((prev) =>
      prev.map((ord) => {
        if (ord.id === orderId) {
          const isPaid = newStatus === "Delivered" ? "Paid" : ord.paymentStatus;
          return { ...ord, status: newStatus, paymentStatus: isPaid };
        }
        return ord;
      })
    );
  };

  const deleteOrder = (orderId) => {
    setOrders((prev) => prev.filter((ord) => ord.id !== orderId));
  };

  // --- Dynamic Actions for Coupons ---
  const addCoupon = (newCoupon) => {
    setCoupons((prev) => [
      {
        id: `CPN-${Math.floor(100 + Math.random() * 900)}`,
        used: 0,
        status: "Active",
        ...newCoupon,
      },
      ...prev,
    ]);
  };

  const deleteCoupon = (id) => {
    setCoupons((prev) => prev.filter((c) => c.id !== id));
  };

  // --- Live Metrics Computed on the Fly ---
  const totalRevenue = orders.reduce((sum, ord) => sum + ord.amount, 0);
  const totalOrdersCount = orders.length;
  const pendingOrdersCount = orders.filter((o) => o.status === "Pending" || o.status === "Processing").length;
  const totalStockUnits = products.reduce((sum, p) => sum + Number(p.stock), 0);

  return (
    <AdminContext.Provider
      value={{
        products,
        orders,
        categories,
        coupons,
        totalRevenue,
        totalOrdersCount,
        pendingOrdersCount,
        totalStockUnits,
        addProduct,
        deleteProduct,
        updateProductStock,
        updateOrderStatus,
        deleteOrder,
        addCoupon,
        deleteCoupon,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error("useAdmin must be used within an AdminProvider");
  }
  return context;
}
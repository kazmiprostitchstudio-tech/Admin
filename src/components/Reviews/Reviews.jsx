import { useState, useEffect } from "react";
import { 
  FiStar, 
  FiTrash2, 
  FiCheckCircle, 
  FiXCircle, 
  FiMessageSquare, 
  FiSearch, 
  FiX, 
  FiCornerDownRight 
} from "react-icons/fi";
import "./Reviews.css";

const INITIAL_REVIEWS = [
  {
    id: "REV-501",
    customer: "Samantha D.",
    product: "Gradient Graphic T-shirt",
    rating: 5,
    date: "Aug 14, 2023",
    comment: "I absolutely love this t-shirt! The design is unique and the fabric feels so comfortable. As an apparel enthusiast, I value quality and this exceeded expectations.",
    status: "Approved",
    adminReply: "Thank you Samantha! Glad you loved the fabric quality.",
  },
  {
    id: "REV-502",
    customer: "Alex Morgan",
    product: "Skinny Fit Jeans",
    rating: 4,
    date: "Aug 15, 2023",
    comment: "The jeans fit really well, snug around the waist without restricting movement. Only taking off 1 star because delivery took 4 days.",
    status: "Approved",
    adminReply: null,
  },
  {
    id: "REV-503",
    customer: "Ethan Ramirez",
    product: "Checkered Shirt",
    rating: 5,
    date: "Aug 16, 2023",
    comment: "This shirt is a wardrobe must-have! Fabric doesn't shrink after wash and buttons are stitched firmly.",
    status: "Approved",
    adminReply: null,
  },
  {
    id: "REV-504",
    customer: "Olivia Parker",
    product: "Polo with Tipping Details",
    rating: 3,
    date: "Aug 18, 2023",
    comment: "The shirt is decent but color was slightly darker than shown on screen.",
    status: "Pending",
    adminReply: null,
  },
  {
    id: "REV-505",
    customer: "Liam Khan",
    product: "Loose Fit Bermuda Shorts",
    rating: 2,
    date: "Aug 20, 2023",
    comment: "Fabric felt a bit rough on skin. Sizing runs larger than usual size chart.",
    status: "Pending",
    adminReply: null,
  },
];

export default function Reviews() {
  const [reviews, setReviews] = useState(() => {
    try {
      const saved = localStorage.getItem("shopco_admin_reviews");
      return saved ? JSON.parse(saved) : INITIAL_REVIEWS;
    } catch {
      return INITIAL_REVIEWS;
    }
  });

  useEffect(() => {
    localStorage.setItem("shopco_admin_reviews", JSON.stringify(reviews));
  }, [reviews]);

  const [searchQuery, setSearchQuery] = useState("");
  const [ratingFilter, setRatingFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [replyingReview, setReplyingReview] = useState(null);
  const [replyText, setReplyText] = useState("");

  // Status Toggle
  const handleToggleStatus = (id, newStatus) => {
    setReviews(
      reviews.map((r) => (r.id === id ? { ...r, status: newStatus } : r))
    );
  };

  // Delete Review
  const handleDeleteReview = (id) => {
    if (window.confirm("Permanently delete this customer review?")) {
      setReviews(reviews.filter((r) => r.id !== id));
    }
  };

  // Submit Admin Reply
  const handleSaveReply = (e) => {
    e.preventDefault();
    if (!replyText.trim() || !replyingReview) return;

    setReviews(
      reviews.map((r) =>
        r.id === replyingReview.id ? { ...r, adminReply: replyText.trim() } : r
      )
    );
    setReplyingReview(null);
    setReplyText("");
  };

  // Filtered Logic
  const filteredReviews = reviews.filter((r) => {
    const matchesSearch =
      r.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.product.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.comment.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRating = ratingFilter === "All" || r.rating === Number(ratingFilter);
    const matchesStatus = statusFilter === "All" || r.status === statusFilter;
    return matchesSearch && matchesRating && matchesStatus;
  });

  const avgRating = (
    reviews.reduce((sum, r) => sum + r.rating, 0) / (reviews.length || 1)
  ).toFixed(1);

  return (
    <div className="reviews-module">
      <div className="module-top-header">
        <div>
          <h2>Reviews & Customer Ratings</h2>
          <p>Moderate customer feedback, resolve complaints, and post official store replies.</p>
        </div>
      </div>

      {/* KPI Highlights */}
      <div className="reviews-kpi-grid">
        <div className="rev-kpi-card">
          <span className="lbl">Average Score</span>
          <div className="score-wrap">
            <h3>{avgRating}</h3>
            <div className="stars-row">
              {[...Array(5)].map((_, i) => (
                <FiStar key={i} className="star-filled" />
              ))}
            </div>
          </div>
        </div>
        <div className="rev-kpi-card">
          <span className="lbl">Total Reviews</span>
          <h3>{reviews.length}</h3>
        </div>
        <div className="rev-kpi-card">
          <span className="lbl">Pending Moderation</span>
          <h3 style={{ color: "#f59e0b" }}>
            {reviews.filter((r) => r.status === "Pending").length}
          </h3>
        </div>
      </div>

      {/* Control Bar */}
      <div className="reviews-controls">
        <div className="search-wrap">
          <FiSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search by customer, product, or keyword..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="filter-group">
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="All">All Statuses</option>
            <option value="Approved">Approved</option>
            <option value="Pending">Pending</option>
            <option value="Rejected">Rejected</option>
          </select>

          <select value={ratingFilter} onChange={(e) => setRatingFilter(e.target.value)}>
            <option value="All">All Ratings</option>
            <option value="5">5 Stars</option>
            <option value="4">4 Stars</option>
            <option value="3">3 Stars</option>
            <option value="2">2 Stars</option>
            <option value="1">1 Star</option>
          </select>
        </div>
      </div>

      {/* Reviews Cards List */}
      <div className="reviews-list">
        {filteredReviews.length > 0 ? (
          filteredReviews.map((rev) => (
            <div key={rev.id} className="review-card">
              <div className="review-header">
                <div className="customer-meta">
                  <div className="avatar-letter">{rev.customer[0]}</div>
                  <div>
                    <h4 className="cust-title">{rev.customer}</h4>
                    <span className="product-title">Review for: <strong>{rev.product}</strong></span>
                  </div>
                </div>

                <div className="header-right">
                  <div className="rating-stars">
                    {[...Array(5)].map((_, i) => (
                      <FiStar
                        key={i}
                        className={i < rev.rating ? "star-active" : "star-empty"}
                      />
                    ))}
                  </div>
                  <span className="rev-date">{rev.date}</span>
                </div>
              </div>

              <p className="review-comment-text">"{rev.comment}"</p>

              {/* Admin Reply Thread */}
              {rev.adminReply && (
                <div className="admin-reply-box">
                  <FiCornerDownRight className="reply-ico" />
                  <div>
                    <span className="reply-author">SHOP.CO Support Response:</span>
                    <p>{rev.adminReply}</p>
                  </div>
                </div>
              )}

              {/* Card Footer Controls */}
              <div className="review-card-footer">
                <div className="status-actions">
                  <span className={`rev-badge ${rev.status.toLowerCase()}`}>
                    {rev.status}
                  </span>
                  {rev.status !== "Approved" && (
                    <button
                      type="button"
                      className="btn-status-action approve"
                      onClick={() => handleToggleStatus(rev.id, "Approved")}
                    >
                      <FiCheckCircle /> Approve
                    </button>
                  )}
                  {rev.status !== "Rejected" && (
                    <button
                      type="button"
                      className="btn-status-action reject"
                      onClick={() => handleToggleStatus(rev.id, "Rejected")}
                    >
                      <FiXCircle /> Reject
                    </button>
                  )}
                </div>

                <div className="secondary-actions">
                  <button
                    type="button"
                    className="btn-reply"
                    onClick={() => {
                      setReplyingReview(rev);
                      setReplyText(rev.adminReply || "");
                    }}
                  >
                    <FiMessageSquare /> {rev.adminReply ? "Edit Reply" : "Reply"}
                  </button>
                  <button
                    type="button"
                    className="btn-del-rev"
                    onClick={() => handleDeleteReview(rev.id)}
                    title="Delete Review"
                  >
                    <FiTrash2 />
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="empty-reviews-state">
            No reviews match your selected filters.
          </div>
        )}
      </div>

      {/* Reply Modal */}
      {replyingReview && (
        <div className="modal-backdrop" onClick={() => setReplyingReview(null)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Reply to {replyingReview.customer}</h3>
              <button type="button" className="close-btn" onClick={() => setReplyingReview(null)}>
                <FiX />
              </button>
            </div>
            <form onSubmit={handleSaveReply} className="reply-form">
              <p className="cust-comment-quote">"{replyingReview.comment}"</p>
              <label>
                Official Store Reply:
                <textarea
                  rows="4"
                  placeholder="Thank you for your feedback..."
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  required
                />
              </label>
              <div className="modal-actions">
                <button type="button" className="btn-secondary" onClick={() => setReplyingReview(null)}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Publish Reply
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
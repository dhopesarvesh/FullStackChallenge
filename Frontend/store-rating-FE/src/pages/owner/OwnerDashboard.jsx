import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { getOwnerDashboard } from "../../api/owner.api";
import { AuthContext } from "../../context/AuthContext";
import "./owner.css";


const OwnerDashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const [dashboard, setDashboard] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await getOwnerDashboard(user.id);
        setDashboard(res.data);
      } catch (error) {
        console.error("Failed to load owner dashboard", error);
      }
    };

    if (user?.id) {
      fetchDashboard();
    }
  }, [user]);

  const handleLogout = () => {
    // preferred: context logout
    if (logout) {
      logout();
    } else {
      // fallback
      localStorage.clear();
    }

    navigate("/login");
  };

  if (!dashboard) return <p>Loading dashboard...</p>;

  
    return (
      <div className="owner-dashboard">
        <div className="dashboard-content">
          {/* HEADER */}
          <div className="dashboard-header">
            <h2>Store Owner Dashboard</h2>
            <button className="logout-btn" onClick={handleLogout}>
              Logout
            </button>
          </div>
    
          {/* STORE INFO */}
          <div className="store-info-card">
            <h3 className="store-name">{dashboard.store.name}</h3>
            <div className="store-stats">
              <div className="stat-item">
                <span>⭐</span>
                <span>Average Rating: <span className="rating-badge">{dashboard.store.averageRating || "No ratings"}</span></span>
              </div>
              <div className="stat-item">
                <span>📊</span>
                <span>Total Ratings: {dashboard.totalRatings}</span>
              </div>
            </div>
          </div>
    
          {/* REVIEWS */}
          <div className="reviews-section">
            <h3>User Reviews</h3>
            {dashboard.ratings.length === 0 && (
              <p className="no-reviews">No users have rated your store yet.</p>
            )}
    
            {dashboard.ratings.map((r, index) => (
              <div className="review-card" key={index}>
                <div className="review-header">
                  <strong>{r.userName}</strong>
                  <span>({r.userEmail})</span>
                  <span className="review-rating">⭐ {r.rating}</span>
                </div>
                {r.feedback && (
                  <p className="review-feedback">"{r.feedback}"</p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
                }

export default OwnerDashboard;

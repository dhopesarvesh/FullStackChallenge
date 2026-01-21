import { useEffect, useState, useContext } from "react";
import { getOwnerDashboard } from "../../api/owner.api";
import { AuthContext } from "../../context/AuthContext";

const OwnerDashboard = () => {
  const { user } = useContext(AuthContext);
  const [dashboard, setDashboard] = useState(null);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await getOwnerDashboard(user.id);
        setDashboard(res.data);
      } catch (error) {
        console.error("Failed to load owner dashboard", error);
      }
    };

    fetchDashboard();
  }, [user]);

  if (!dashboard) return <p>Loading dashboard...</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h2>Store Owner Dashboard</h2>

      <div
        style={{
          border: "1px solid #ccc",
          padding: "15px",
          marginBottom: "20px"
        }}
      >
        <h3>{dashboard.store.name}</h3>
        <p>
          Average Rating:{" "}
          {dashboard.store.averageRating || "No ratings yet"}
        </p>
        <p>Total Ratings: {dashboard.totalRatings}</p>
      </div>

      <h3>User Reviews</h3>

      {dashboard.ratings.length === 0 && (
        <p>No users have rated your store yet.</p>
      )}

      {dashboard.ratings.map((r, index) => (
        <div
          key={index}
          style={{
            border: "1px solid #ddd",
            padding: "10px",
            marginBottom: "10px"
          }}
        >
          <p><strong>{r.userName}</strong> ({r.userEmail})</p>
          <p>⭐ Rating: {r.rating}</p>
          <p>📝 Feedback: {r.feedback || "No feedback provided"}</p>
        </div>
      ))}
    </div>
  );
};

export default OwnerDashboard;

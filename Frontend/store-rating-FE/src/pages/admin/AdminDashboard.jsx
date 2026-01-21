import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAdminDashboard } from "../../api/admin.api";
import UserTable from "../../pages/admin/UserTable";
import StoreTable from "../../pages/admin/StoreTable";
import "./admind.css";

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await getAdminDashboard();
        setStats({
          totalUsers: res.data.totalUsers || 0,
          totalStores: res.data.totalStores || 0,
          totalRatings: res.data.totalRatings || 0,
        });
      } catch (error) {
        console.error("Failed to load dashboard", error);
      }
    };

    fetchStats();
  }, []);

  const handleLogout = () => {
    // Clear auth data
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("role");

    navigate("/login");
  };

  if (!stats) return <p>Loading dashboard...</p>;

  return (
    <div className="admin-dashboard">
      {/* HEADER */}
      <div className="admin-header">
        <h2>Admin Dashboard</h2>
        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </div>

      {/* STATS */}
      <div className="stats-container">
        <StatCard label="Total Users" value={stats.totalUsers} />
        <StatCard label="Total Stores" value={stats.totalStores} />
        <StatCard label="Total Ratings" value={stats.totalRatings} />
      </div>

      {/* TABLES */}
      <UserTable />
      <StoreTable />
    </div>
  );
};

const StatCard = ({ label, value }) => (
  <div className="stat-card">
    <h3>{value}</h3>
    <p>{label}</p>
  </div>
);

export default AdminDashboard;

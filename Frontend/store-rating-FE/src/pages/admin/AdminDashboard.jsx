import { useEffect, useState } from "react";
import { getAdminDashboard } from "../../api/admin.api";
import UserTable from "../../pages/admin/UserTable";
import StoreTable from "../../pages/admin/StoreTable";

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await getAdminDashboard();
        setStats({
          totalUsers: res.data.totalUsers || 0,
          totalStores: res.data.totalStores || 0,
          totalRatings: res.data.totalRatings || 0
        });
      } catch (error) {
        console.error("Failed to load dashboard", error);
      }
    };

    fetchStats();
  }, []);

  if (!stats) return <p>Loading dashboard...</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h2>Admin Dashboard</h2>

      <div style={{ display: "flex", gap: "20px", marginBottom: "30px" }}>
        <StatCard label="Total Users" value={stats.totalUsers} />
        <StatCard label="Total Stores" value={stats.totalStores} />
        <StatCard label="Total Ratings" value={stats.totalRatings} />
      </div>

      <UserTable />
      <StoreTable />
    </div>
  );
};

const StatCard = ({ label, value }) => (
  <div
    style={{
      border: "1px solid #ccc",
      padding: "15px",
      width: "150px",
      textAlign: "center"
    }}
  >
    <h3>{value}</h3>
    <p>{label}</p>
  </div>
);

export default AdminDashboard;

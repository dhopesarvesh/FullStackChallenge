import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getStores } from "../api/store.api";
import StorePreviewCard from "../pages/store/StorePreviewCard";
import "./HomePage.css";

const Home = () => {
  const navigate = useNavigate();
  const [stores, setStores] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchStores = async () => {
      try {
        const res = await getStores();
        setStores(res.data.stores);
      } catch (err) {
        console.error("Failed to load stores");
      }
    };

    fetchStores();
  }, []);

  const filteredStores = stores.filter(
    (store) =>
      store.name.toLowerCase().includes(search.toLowerCase()) ||
      store.address.toLowerCase().includes(search.toLowerCase())
  );

  return (
  <div className="app-layout">
    {/* HEADER */}
    <header className="app-header">
      <div className="header-content">
        <h2 className="logo">StoreHub</h2>

        <nav>
          <ul className="nav-links">
            <li><a href="/login">Login</a></li>
            <li><a href="/signup">SignUp</a></li>
          </ul>
        </nav>
      </div>
    </header>

    {/* MAIN CONTENT */}
    <main className="app-main">
      <div className="home-container">
        <div className="home-header">
          <h1>Store Rating Platform</h1>
          <p>Discover stores and see what others are saying</p>

          <input
            type="text"
            placeholder="Search stores by name or address..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="search-input"
          />
        </div>

        <div className="store-grid">
          {filteredStores.length === 0 && (
            <p className="no-stores">No stores found matching your search</p>
          )}

          {filteredStores.map((store) => (
            <StorePreviewCard key={store.id} store={store} />
          ))}
        </div>
      </div>
    </main>

    {/* FOOTER */}
    <footer className="app-footer">
      <div className="footer-content">
        <div>
          <h3>About StoreHub</h3>
          <p>Connecting customers with the best local stores through honest ratings and reviews.</p>
        </div>

        <div>
          <h3>Quick Links</h3>
          <ul>
            <li><a href="/">Home</a></li>
            <li><a href="/">Stores</a></li>
            <li><a href="/">About</a></li>
            <li><a href="/contact">Contact</a></li>
          </ul>
        </div>
      </div>

      <p className="footer-bottom">
        © 2026 StoreHub. All rights reserved | Made with ❤️ in India
      </p>
    </footer>
  </div>
);

};

export default Home;

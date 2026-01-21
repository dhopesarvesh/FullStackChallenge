import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/axios.js";
import { AuthContext } from "../context/AuthContext.jsx";
import "./LoginPage.css";


const Login = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await api.post("/auth/login", {
        email,
        password
      });

      login(res.data.user);
    //   alert("Login successful");

    const role = res.data.user.role;

      if (role === "ADMIN") {
        navigate("/admin/dashboard");
      } else if (role === "STORE_OWNER") {
        navigate("/owner/dashboard");
      } else {
        navigate("/stores");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  const handleLogout = () => {
    // Clear auth context and local storage if needed
    // logout(); // Uncomment if you have logout function in AuthContext
    navigate("/");
  };

  return (
    <div className="login-page-wrapper">
      <div className="login-card">
        <h2>Welcome Back</h2>
        <p className="login-subtitle">Please enter your details to sign in</p>

        {error && <div className="error-message">{error}</div>}

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email Address</label>
            <input
              className="login-input"
              type="email"
              placeholder="name@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              className="login-input"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="login-submit-btn">
            Sign In
          </button>
          
          <button type="button" className="back-btn" onClick={handleLogout}>
            Return to Homepage
          </button>
        </form>
      </div>
    </div>
  );
};
export default Login;

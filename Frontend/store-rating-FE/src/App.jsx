import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";
import AdminDashboard from "./pages/admin/AdminDashboard.jsx";
import StoreList from "./pages/users/StoreList.jsx";
import OwnerDashboard from "./pages/owner/OwnerDashboard.jsx";
import StoreDetail from "./pages/users/StoreDetail.jsx";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/stores/:id" element={<StoreDetail />} />


        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/stores" element={<StoreList />} />
        <Route path="/owner/dashboard" element={<OwnerDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

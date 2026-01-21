import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import "./storep.css";

const StorePreviewCard = ({ store }) => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const handleClick = () => {
    if (!user) {
      // Not logged in → go to login
      navigate("/auth/login");
    } else {
      // Logged in → go to store detail
      navigate(`/stores/${store.id}`);
    }
  };

  return (
    <div className="store-card" onClick={handleClick} style={{ cursor: "pointer" }}>
      <h3>{store.name}</h3>
      <p className="store-address">{store.address}</p>
      <p className="store-rating">
        ⭐ {store.overallRating ? store.overallRating : "No ratings yet"}
      </p>

      <style>
        
      </style>
    </div>

  
  );
};

export default StorePreviewCard;

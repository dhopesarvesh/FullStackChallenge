import { useEffect, useState, useContext } from "react";
import { getStores } from "../../api/store.api";
import { submitRating, updateRating } from "../../api/rating.api";
import { AuthContext } from "../../context/AuthContext";
import StoreCard from "../../components/store/StoreCard";



const StoreList = () => {
    const { user } = useContext(AuthContext);
    const [stores, setStores] = useState([]);
  
    const fetchStores = async () => {
      const res = await getStores(user?.id);
      setStores(res.data.stores);
    };
  
    useEffect(() => {
      fetchStores();
    }, []);
  
    const handleRatingSubmit = async (store, rating, feedback) => {
      const payload = {
        userId: user.id,
        rating,
        feedback,
        requestedByRole: "USER"
      };
  
      try {
        if (store.userRating !== null && store.userRating !== undefined) {
            console.log("➡️ PUT request");
            await updateRating(store.id, payload);
          } else {
            console.log("➡️ POST request");
            await submitRating(store.id, payload);
          }
  
        alert("Rating saved successfully");
        fetchStores();
      } catch (err) {
        alert(err.response?.data?.message || "Failed to save rating");
      }
    };
  
    return (
      <div style={{ padding: "20px" }}>
        <h2>Available Stores</h2>
  
        {stores.map((store) => (
          <StoreCard
            key={store.id}
            store={store}
            onSubmit={handleRatingSubmit}
          />
        ))}
      </div>
    );
  };
  
  export default StoreList;
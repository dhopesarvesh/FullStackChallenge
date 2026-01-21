import { useParams } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { getStores } from "../../api/store.api";
import StarRating from "../../components/store/StarRating";
import { submitRating, updateRating } from "../../api/rating.api";
import "./storedetail.css";

const StoreDetail = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const [store, setStore] = useState(null);
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState("");

  useEffect(() => {
    const fetchStore = async () => {
      const res = await getStores(user?.id);
      const found = res.data.stores.find(s => s.id === Number(id));
      setStore(found);
      setRating(found?.userRating || 0);
      setFeedback(found?.userFeedback || "");
    };

    fetchStore();
  }, [id, user]);

  const handleSubmit = async () => {
    const payload = {
      userId: user.id,
      rating,
      feedback,
      requestedByRole: "USER"
    };

    if (store.userRating !== null && store.userRating !== undefined) {
      await updateRating(store.id, payload);
    } else {
      await submitRating(store.id, payload);
    }

    alert("Rating saved");
  };

  if (!store) return <p>Loading store...</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h2>{store.name}</h2>
      <p>{store.address}</p>
      <p>⭐ Overall Rating: {store.overallRating || "No ratings yet"}</p>

      {user?.role === "USER" && (
        <>
          <StarRating value={rating} onChange={setRating} />

          <textarea
            placeholder="Write your feedback"
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            style={{ width: "100%", marginTop: "10px" }}
          />

          <br />
          <button onClick={handleSubmit} style={{ marginTop: "10px" }}>
            {store.userRating ? "Update Rating" : "Submit Rating"}
          </button>
        </>
      )}
    </div>
  );
};

export default StoreDetail;

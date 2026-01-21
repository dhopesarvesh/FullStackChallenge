import { useState } from "react";
import StarRating from "./StarRating";

const StoreCard = ({ store, onSubmit }) => {
  const [rating, setRating] = useState(store.userRating || 0);
  const [feedback, setFeedback] = useState(store.userFeedback || "");

  return (
    <div
      style={{
        border: "1px solid #ccc",
        padding: "15px",
        marginBottom: "15px"
      }}
    >
      <h3>{store.name}</h3>
      <p>{store.address}</p>
      <p>
        Overall Rating:{" "}
        {store.overallRating ? store.overallRating : "No ratings yet"}
      </p>

      <StarRating value={rating} onChange={setRating} />

      <textarea
        placeholder="Write your feedback"
        value={feedback}
        onChange={(e) => setFeedback(e.target.value)}
        style={{ width: "100%", marginTop: "10px" }}
      />

      <br />

      <button
        onClick={() => onSubmit(store, rating, feedback)}
        style={{ marginTop: "10px" }}
      >
        {store.userRating ? "Update Rating" : "Submit Rating"}
      </button>
    </div>
  );
};

export default StoreCard;

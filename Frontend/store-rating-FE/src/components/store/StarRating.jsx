const StarRating = ({ value = 0, onChange }) => {
    return (
      <div>
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            onClick={() => onChange(star)}
            style={{
              cursor: "pointer",
              fontSize: "20px",
              color: star <= value ? "gold" : "gray"
            }}
          >
            ★
          </span>
        ))}
      </div>
    );
  };
  
  export default StarRating;
  
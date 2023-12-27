// eslint-disable-next-line react/prop-types
const DisplayStarRating = ({ rating }) => {
  const maxStars = 5; // Set the maximum number of stars

  // Render stars based on the rating prop
  const renderStars = () => {
    const stars = [];
    for (let i = 1; i <= maxStars; i++) {
      stars.push(
        <input
          key={i}
          type="radio"
          name="rating-1"
          className={`mask mask-star ${i <= rating ? 'checked' : ''}`}
          checked={i === rating}
          readOnly
          disabled
        />
      );
    }
    return stars;
  };

  return <div className="rating">{renderStars()}</div>;
};

export default DisplayStarRating;

// eslint-disable-next-line react/prop-types
const StarRating = ({ rating }) => {
  return (
    <div className="flex">
      {[...Array(5)].map((star, index) => {
        const starValue = index + 1;
        
        return (
          <span
            key={index}
            style={{ cursor: "default" }} // Set cursor to default
          >
            {starValue <= rating ? (
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="26" height="26" stroke="gold" fill="gold" strokeWidth="2">
                <path d="M12 2l2.4 7.2h7.6l-6 4.8 2.4 7.2-6-4.8-6 4.8 2.4-7.2-6-4.8h7.6z"/>
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="26" height="26" stroke="gold" fill="none" strokeWidth="2">
                <path d="M12 2l2.4 7.2h7.6l-6 4.8 2.4 7.2-6-4.8-6 4.8 2.4-7.2-6-4.8h7.6z"/>
              </svg>
            )}
          </span>
        );
      })}
    </div>
  );
};

export default StarRating;

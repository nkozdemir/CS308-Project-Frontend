const calculateAverageRating = (songRatings, songId) => {
    const ratings = songRatings.filter((rating) => rating.SongID === songId);
    if (ratings.length === 0) return 'N/A';
  
    const sum = ratings.reduce((total, rating) => total + rating.Rating, 0);
    const average = sum / ratings.length;
    return average.toFixed(1);
};  

export default calculateAverageRating;
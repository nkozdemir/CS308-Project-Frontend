import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axiosInstance from '../../services/axiosConfig';
import showToast from '../showToast';
import convertToMinutes from '../../utils/convertToMinutes';

const SongRecommendations = () => {
  const navigate = useNavigate();

  const [songRecommendations, setSongRecommendations] = useState([]);
  const [loadingSongRecommendations, setLoadingSongRecommendations] = useState(false);
  const [addingSong, setAddingSong] = useState(false);
  const [noRecommendations, setNoRecommendations] = useState(true);

  const getSongRecommendations = async () => {
    try {
      setLoadingSongRecommendations(true);
      setNoRecommendations(false);
      const response = await axiosInstance.post('/recommendation/song/rating');

      if (response.status === 200) {
        setSongRecommendations(response.data.data);
      }
    } catch (error) {
      if (error.response.status === 404) {
        setNoRecommendations(true);
      } else if (error.response.status === 401 || error.response.status === 403) {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        showToast('warn', 'Your session has expired. Please log in again.');
        setTimeout(() => {
            navigate('/login');
        }, 3000);
      } else {
        console.error('Error fetching song recommendations: ', error);
        showToast('error', 'Error fetching song recommendations. Please try again later.');
        setNoRecommendations(true);
      }
    } finally {
      setLoadingSongRecommendations(false);
    }
  };

  const addSong = async (spotifyId) => {
    try {
      setAddingSong(true);
      showToast('info', 'Adding song...');
      const response = await axiosInstance.post('/song/addSpotifySong', { spotifyId });

      if (response.status === 200) {
        showToast('ok', 'Song added successfully!');
      }
    } catch (error) {
      if (error.response.status === 401 || error.response.status === 403) {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        showToast('warn', 'Your session has expired. Please log in again.');
        setTimeout(() => {
            navigate('/login');
        }, 3000);
      } else {
        console.error('Error during fetch', error);
        showToast('error', 'Error adding song. Please try again later.');
      }
    } finally {
      setAddingSong(false);
    }
  };

  return (
    <div>
      <div className='flex items-center justify-center mb-8'>
        <h2 className='font-bold text-2xl'>Based On Your Song Ratings</h2>
        <button
          onClick={() => {
            setNoRecommendations(false);
            getSongRecommendations();
          }}
          disabled={loadingSongRecommendations}
          className='btn btn-info btn-circle btn-sm ml-4'
        >
          <svg xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 512 512">
            <path d="M105.1 202.6c7.7-21.8 20.2-42.3 37.8-59.8c62.5-62.5 163.8-62.5 226.3 0L386.3 160H352c-17.7 0-32 14.3-32 32s14.3 32 32 32H463.5c0 0 0 0 0 0h.4c17.7 0 32-14.3 32-32V80c0-17.7-14.3-32-32-32s-32 14.3-32 32v35.2L414.4 97.6c-87.5-87.5-229.3-87.5-316.8 0C73.2 122 55.6 150.7 44.8 181.4c-5.9 16.7 2.9 34.9 19.5 40.8s34.9-2.9 40.8-19.5zM39 289.3c-5 1.5-9.8 4.2-13.7 8.2c-4 4-6.7 8.8-8.1 14c-.3 1.2-.6 2.5-.8 3.8c-.3 1.7-.4 3.4-.4 5.1V432c0 17.7 14.3 32 32 32s32-14.3 32-32V396.9l17.6 17.5 0 0c87.5 87.4 229.3 87.4 316.7 0c24.4-24.4 42.1-53.1 52.9-83.7c5.9-16.7-2.9-34.9-19.5-40.8s-34.9 2.9-40.8 19.5c-7.7 21.8-20.2 42.3-37.8 59.8c-62.5 62.5-163.8 62.5-226.3 0l-.1-.1L125.6 352H160c17.7 0 32-14.3 32-32s-14.3-32-32-32H48.4c-1.6 0-3.2 .1-4.8 .3s-3.1 .5-4.6 1z"/>
          </svg>
        </button>
      </div>
      {loadingSongRecommendations ? (
        <div className="flex items-center justify-center mt-8">
          <span className="loading loading-bars loading-lg"></span>
        </div>
      ) : noRecommendations ? (
        <p className='flex items-center justify-center'>No recommendations found. You can rate songs from <Link to="/song/user" className="text-indigo-600 hover:text-indigo-700 ml-1">here</Link>.</p>
      ) : (
        <>
          <div className="overflow-x-auto shadow-lg">
            <table className='table'>
              <thead>
                <tr>
                  <th>Image</th>
                  <th>Title</th>
                  <th>Performers</th>
                  <th>Album</th>
                  <th>Release Date</th>
                  <th>Length</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {songRecommendations.map((song) => (
                  <tr key={song.SpotifyId} className='hover'>
                    <th>
                      <figure>
                        <img src={song.Album.images[2].url} alt={song.Title} />
                      </figure>
                    </th>
                    <th>
                      {song.Title}
                    </th>
                    <th>
                      {song.Performer.map((performer) => performer.name).join(', ')}
                    </th>
                    <th>
                      <p>{song.Album.name}</p>
                    </th>
                    <th>
                      <p>{song.Album.release_date}</p>
                    </th>
                    <th>
                      <p>{convertToMinutes(song.Length)}</p>
                    </th>
                    <th>
                      <button 
                        onClick={() => addSong(song.SpotifyId)} 
                        disabled={addingSong}
                        className='btn btn-success btn-circle btn-sm'
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" height="16" width="14" viewBox="0 0 448 512">
                          <path d="M256 80c0-17.7-14.3-32-32-32s-32 14.3-32 32V224H48c-17.7 0-32 14.3-32 32s14.3 32 32 32H192V432c0 17.7 14.3 32 32 32s32-14.3 32-32V288H400c17.7 0 32-14.3 32-32s-14.3-32-32-32H256V80z"/>
                        </svg>
                      </button>
                    </th>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
};

export default SongRecommendations;
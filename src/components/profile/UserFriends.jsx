import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../services/axiosConfig';
import showToast from '../showToast';

const UserFriends = () => {
  const navigate = useNavigate();
  
  const [friendsInformation, setFriendsInformation] = useState([]);
  const [loadingFriends, setLoadingFriends] = useState(true);
  const [noFriends, setNoFriends] = useState(false);

  const getFriendsInfo = async () => {
    try {
      setLoadingFriends(true);
      const response = await axiosInstance.get('/friend/getAllFriends');

      if (response.status === 200) {
        if (response.data.data.length === 0) {
          setNoFriends(true);
        } else {
          setFriendsInformation(response.data.data);
        }
      }
    } catch (error) {
      if (error.code === 404) {
        setNoFriends(true);
      } else {
        if (error.response.status === 401 || error.response.status === 403) {
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          showToast('warn', 'Your session has expired. Please log in again.');
          setTimeout(() => {
            navigate('/login');
          }, 3000);
        } else {
          console.error('Error fetching user info: ', error);
          showToast('error', 'Error fetching user info. Please try again later.');
        }
      } 
    } finally {
      setLoadingFriends(false);
    }
  };

  useEffect(() => {
    getFriendsInfo();
  }, []);

  return (
    <div>
      <h1 className="font-bold mb-8 flex items-center justify-center text-3xl">Friends</h1>
      {loadingFriends ? (
        <div className="flex items-center justify-center">
          <span className="loading loading-bars loading-lg"></span>
        </div>
      ) : noFriends ? (
        <p>No friends found.</p>
      ) : (
        <div className="flex flex-wrap">
          {friendsInformation.map((friend) => (
            <div key={friend.FriendInfo.Email} className="flex items-center mb-4 mr-8">
              <div className="avatar placeholder mr-4">
                <div className="bg-neutral text-neutral-content rounded-full w-16 h-16 flex items-center justify-center">
                  <span className="text-2xl">{friend.FriendInfo.Name[0]}</span>
                </div>
              </div> 
              <span>{friend.FriendInfo.Name}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserFriends;

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../services/axiosConfig';
import showToast from '../components/showToast';
import FriendsTable from '../components/FriendsTable';
import handleSessionExpiration from '../utils/sessionUtils';

const Friends = () => {
  const navigate = useNavigate();
  
  const [friendsInformation, setFriendsInformation] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [filteredFriends, setFilteredFriends] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterQuery, setFilterQuery] = useState('');

  const [loadingFriends, setLoadingFriends] = useState(false);
  const [noFriends, setNoFriends] = useState(false);
  const [loadingSearch, setLoadingSearch] = useState(false);
  const [noResults, setNoResults] = useState(false);
  const [operating, setOperating] = useState(false);

  const getFriendsInfo = async () => {
    try {
      setLoadingFriends(true);
      const response = await axiosInstance.get('/friend/getAllFriends');
      
      setFriendsInformation(response.data.data);
      setFilteredFriends(response.data.data);
      setNoFriends(false);
    } catch (error) {
        if (error.response.status === 404) {
            setNoFriends(true);
        } else if (error.response.status === 401 || error.response.status === 403) {
            handleSessionExpiration(navigate);
        } else {
            console.error('Error during fetching friends information: ', error);
            showToast('err', 'An error occurred while fetching friends information.');
        }
    } finally {
      setLoadingFriends(false);
    }
  };

  const handleSearch = async () => {
    try {
      setLoadingSearch(true);
      setNoResults(false);

      const response = await axiosInstance.get(`/user/search?query=${searchQuery}`);

      if (response.status === 200) {
        if (response.data.data.length === 0) {
          setNoResults(true);
        } else {
          setSearchResults(response.data.data);
        }
      }
    } catch (error) {
        if (error.response.status === 401 || error.response.status === 403) {
            handleSessionExpiration(navigate);
        } else {
            console.error('Error during searching:', error);
            showToast('err', 'An error occurred while searching.');
        }
    } finally {
      setLoadingSearch(false);
    }
  };

  const addFriend = async (friendEmail) => {
    try {
        setOperating(true);
        showToast('info', 'Adding friend...');
        await axiosInstance.post('/friend/addFriend', { friendEmail });

        showToast('ok', 'Friend added successfully!');
        getFriendsInfo();
    } catch (error) {
        if (error.response.status === 401 || error.response.status === 403) {
            handleSessionExpiration(navigate);
        } else {
            console.error('Error during adding friend:', error);
            showToast('err', 'An error occurred while adding friend.');
        }
    } finally {
        setOperating(false);
        setSearchQuery('');
    }
  }

  const removeFriend = async (friendUserId) => {
    try {
        setOperating(true);
        showToast('info', 'Removing friend...');
        await axiosInstance.post('/friend/deleteFriend', { friendUserId });

        showToast('ok', 'Friend removed successfully!');
        getFriendsInfo();
    } catch (error) {
        if (error.response.status === 401 || error.response.status === 403) {
            handleSessionExpiration(navigate);
        } else {
            console.error('Error during removing friend:', error);
            showToast('err', 'An error occurred while removing friend.');
        }
    } finally {
        setOperating(false);
        setFilterQuery('');
    }
  }

  const handleFilter = (e) => {
    setFilterQuery(e.target.value);

    const filtered = friendsInformation.filter((friend) => {
        return friend.FriendInfo.Name.toLowerCase().includes(e.target.value.toLowerCase()) ||
        friend.FriendInfo.Email.toLowerCase().split('@')[0].includes(e.target.value.toLowerCase());
    });

    setFilteredFriends(filtered);
  }

  useEffect(() => {
    getFriendsInfo();
  }, []);

  useEffect(() => {
    if (searchQuery.trim() !== '' && searchQuery.length >= 2) {
        //console.log('Search query:', searchQuery)
        handleSearch();
    } else {
        setSearchResults([]);
        setNoResults(true);
    }
  }, [searchQuery]);

  return (
    <div className='flex flex-col md:flex-row w-full h-screen my-20 p-4'>
        <div className='w-full md:w-1/2 mb-8 md:mb-0'>
            <h1 className="font-bold mb-8 flex items-center justify-center text-3xl">Your Friends</h1>
            <div className="flex items-center justify-center mb-16">
                <input 
                    className="input input-bordered input-primary" 
                    placeholder="Find"
                    value={filterQuery}
                    onChange={handleFilter}
                    disabled={loadingFriends || friendsInformation.length === 0 || noFriends}
                />
            </div>
            {!noFriends && (
                <p className='flex items-center justify-center mb-8'>You have {friendsInformation.length} friends.</p>
            )}
            {loadingFriends ? (
                <div className="flex items-center justify-center">
                    <span className="loading loading-bars loading-lg"></span>
                </div>
            ) : noFriends ? (
                <p className='flex items-center justify-center'>No friends found.</p>
            ) : filteredFriends.length === 0 ? (
                <p className='flex items-center justify-center'>No results found.</p>
            ) : (
                <FriendsTable
                    data={filteredFriends.map((friend) => friend.FriendInfo)}
                    onAction={removeFriend}
                    isDeleting={true}
                    loading={operating}
                />
            )}
        </div>
        <div className='divider sm:divider-horizontal sm:h-screen'></div>
        <div className='w-full md:w-1/2 mt-8 sm:mt-0'>
            <h1 className="font-bold mb-8 flex items-center justify-center text-3xl">Add Friends</h1>
            <div className="flex items-center justify-center mb-16">
                <input 
                    className="input input-bordered input-primary" 
                    placeholder="Search"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>
            <div>
                {loadingSearch ? (
                    <div className="flex items-center justify-center">
                        <span className="loading loading-bars loading-lg"></span>
                    </div>
                ) : noResults ? (
                    <p className='flex items-center justify-center'>No results found.</p>
                ) : (
                    <FriendsTable
                        data={searchResults}
                        onAction={addFriend}
                        isDeleting={false}
                        loading={operating}
                    />
                )}
            </div>
        </div>
    </div>
  );
};

export default Friends;
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../services/axiosConfig';
import showToast from '../components/showToast';

const Friends = () => {
  const navigate = useNavigate();
  
  const [friendsInformation, setFriendsInformation] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [filteredFriends, setFilteredFriends] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterQuery, setFilterQuery] = useState('');

  const [loadingFriends, setLoadingFriends] = useState(true);
  const [noFriends, setNoFriends] = useState(false);
  const [loadingSearch, setLoadingSearch] = useState(false);
  const [noResults, setNoResults] = useState(false);
  const [operating, setOperating] = useState(false);

  const getFriendsInfo = async () => {
    try {
      setLoadingFriends(true);
      const response = await axiosInstance.get('/friend/getAllFriends');

      if (response.status === 200) {
        if (response.data.data.length === 0) {
          setNoFriends(true);
        } else {
          setFriendsInformation(response.data.data);
          setFilteredFriends(response.data.data);
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
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            showToast('warn', 'Your session has expired. Please log in again.');
            setTimeout(() => {
                navigate('/login');
            }, 3000);
        } else {
            console.error('Error searching for friends:', error);
            showToast('error', 'Error searching for friends. Please try again later.');
        }
    } finally {
      setLoadingSearch(false);
    }
  };

  const addFriend = async (friendEmail) => {
    try {
        setOperating(true);
        showToast('info', 'Adding friend...');
        const response = await axiosInstance.post('/friend/addFriend', { friendEmail });

        if (response.status === 200) {
            showToast('ok', 'Friend added successfully!');
            getFriendsInfo();
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
            showToast('error', 'Error adding friend. Please try again later.');
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
        const response = await axiosInstance.post('/friend/deleteFriend', { friendUserId });

        if (response.status === 200) {
            showToast('ok', 'Friend removed successfully!');
            getFriendsInfo();
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
            showToast('error', 'Error removing friend. Please try again later.');
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
    setNoFriends(filtered.length === 0);
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
    <div className='flex w-full h-screen my-20 p-4'>
        <div className='w-1/2'>
            <h1 className="font-bold mb-8 flex items-center justify-center text-3xl">Your Friends</h1>
            <div className="flex items-center justify-center mb-16">
                <input 
                    className="input input-bordered input-primary" 
                    placeholder="Find"
                    value={filterQuery}
                    onChange={handleFilter}
                />
            </div>
            {loadingFriends ? (
                <div className="flex items-center justify-center">
                    <span className="loading loading-bars loading-lg"></span>
                </div>
            ) : noFriends ? (
                <p className='flex items-center justify-center'>No friends found.</p>
            ) : (
                <>
                    <p className='mb-4'>You have {friendsInformation.length} friends.</p>
                    <div className="overflow-x-auto">
                        <table className='table'>
                            <thead>
                                <th>Avatar</th>
                                <th>Username</th>
                                <th>Name</th>
                                <th>Action</th>
                            </thead>
                            <tbody>
                                {filteredFriends.map((result) => (
                                    <tr key={result.FriendInfo.UserID} className='hover'>
                                        <td>
                                            <div className="avatar placeholder mr-4">
                                                <div className="bg-neutral text-neutral-content rounded-full w-16 h-16 flex items-center justify-center">
                                                    <span className="text-2xl">{result.FriendInfo.Name[0]}</span>
                                                </div>
                                            </div> 
                                        </td>
                                        <td>{`@${result.FriendInfo.Email.split('@')[0]}`}</td>
                                        <td>{result.FriendInfo.Name}</td>
                                        <td>
                                            <button 
                                                className="btn btn-error btn-circle"
                                                disabled={operating}
                                                onClick={() => removeFriend(result.FriendInfo.UserID)} 
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" height="16" width="14" viewBox="0 0 448 512">
                                                    <path d="M135.2 17.7L128 32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H320l-7.2-14.3C307.4 6.8 296.3 0 284.2 0H163.8c-12.1 0-23.2 6.8-28.6 17.7zM416 128H32L53.2 467c1.6 25.3 22.6 45 47.9 45H346.9c25.3 0 46.3-19.7 47.9-45L416 128z"/>
                                                </svg>
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </>
            )}
        </div>
        <div className='divider divider-horizontal'></div>
        <div className='w-1/2'>
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
                    <div className="overflow-x-auto">
                        <table className='table'>
                            <thead>
                                <th>Avatar</th>
                                <th>Username</th>
                                <th>Name</th>
                                <th>Action</th>
                            </thead>
                            <tbody>
                                {searchResults.map((result) => (
                                    <tr key={result.UserID} className='hover'>
                                        <td>
                                            <div className="avatar placeholder mr-4">
                                                <div className="bg-neutral text-neutral-content rounded-full w-16 h-16 flex items-center justify-center">
                                                    <span className="text-2xl">{result.Name[0]}</span>
                                                </div>
                                            </div> 
                                        </td>
                                        <td>{`@${result.Email.split('@')[0]}`}</td>
                                        <td>{result.Name}</td>
                                        <td>
                                            <button 
                                                className="btn btn-success btn-circle" 
                                                disabled={operating}
                                                onClick={() => addFriend(result.Email)}
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" height="16" width="14" viewBox="0 0 448 512">
                                                    <path d="M256 80c0-17.7-14.3-32-32-32s-32 14.3-32 32V224H48c-17.7 0-32 14.3-32 32s14.3 32 32 32H192V432c0 17.7 14.3 32 32 32s32-14.3 32-32V288H400c17.7 0 32-14.3 32-32s-14.3-32-32-32H256V80z"/>
                                                </svg>
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    </div>
  );
};

export default Friends;

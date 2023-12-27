import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../services/axiosConfig';
import showToast from '../components/showToast';
import Recommendations from '../components/profile/Recommendations';
import UserFriends from '../components/profile/UserFriends';

const Profile = () => {
    const navigate = useNavigate();

    const [userInfo, setUserInfo] = useState({
        Name: '',
        Email: '',
    });
    const [loading, setLoading] = useState(true);

    const updateUserInfo = (key, value) => {
        setUserInfo((prevState) => ({ ...prevState, [key]: value }));
    };

    // Function to get user information from the access token stored in local storage
    const getUserInfo = async () => {
        try {
            setLoading(true);
            const response = await axiosInstance.get('/user');

            // Update state with lowercase keys
            updateUserInfo('Name', response.data.data.Name);
            updateUserInfo('Email', response.data.data.Email);
        } catch (error) {
            if (error.response.status === 401 || error.response.status === 403) {
                showToast('warn', 'Session expired. Redirecting to login page...');
                setTimeout(() => {
                    localStorage.removeItem('accessToken');
                    localStorage.removeItem('refreshToken');
                    navigate("/login");
                }, 3000);
            }
            else {
                console.error('Error fetching user info: ', error);
                showToast('error', 'Error fetching user info. Please try again later.');
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getUserInfo();
    }, []);

    return (
        <div>
            <div className='my-20 p-4'>
                <h1 className="font-bold mb-8 flex items-center justify-center text-3xl">Your Profile</h1>
                {loading ? (
                    <div className="flex items-center justify-center">
                        <span className="loading loading-bars loading-lg"></span>
                    </div>
                ) : (
                    <div>
                        <div className='flex items-center justify-center'>
                            <div className="avatar placeholder mr-4">
                                <div className="bg-neutral text-neutral-content rounded-full w-20 h-20">
                                    <span className="text-3xl">{userInfo.Name[0]}</span>
                                </div>
                            </div> 
                            {userInfo.Name}
                        </div>
                        {userInfo.Name && userInfo.Email && (
                            <div>
                                <div className="divider my-16"></div> 
                                <UserFriends />
                                <div className="divider my-16"></div> 
                                <Recommendations />
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Profile;
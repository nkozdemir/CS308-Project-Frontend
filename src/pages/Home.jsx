import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../services/axiosConfig";
import showToast from "../components/showToast";
import RecommendationsPage from "./RecommendationsPage";
import handleSessionExpiration from "../utils/sessionUtils";

const Home = () => {
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

            updateUserInfo('Name', response.data.data.Name);
            updateUserInfo('Email', response.data.data.Email);
        } catch (error) {
            if (error.response.status === 401 || error.response.status === 403) {
                handleSessionExpiration(navigate);
            }
            else {
                console.error('Error during fetching user info: ', error);
                showToast('err', 'An error occurred while fetching user info.');
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getUserInfo();
    }, []);

    return (
        <div className="my-20 p-4">
            {loading ? (
                <div className="flex items-center justify-center">
                    <div className="flex items-center justify-center">
                        <span className="loading loading-bars loading-lg"></span>
                    </div>
                </div>
            ) : (
                <div>
                    <h1 className="font-bold text-3xl flex items-center justify-center mb-8">Welcome, {userInfo.Name}! (@{userInfo.Email.split('@')[0]})</h1>
                    <RecommendationsPage />
                </div>
            )}
        </div>
    );
}

export default Home;
import showToast from '../components/showToast';

const handleSessionExpiration = (navigate) => {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
  showToast('err', 'Your session has expired. Please log in again.');
  setTimeout(() => {
    navigate('/login');
  }, 3000);
};

export default handleSessionExpiration;
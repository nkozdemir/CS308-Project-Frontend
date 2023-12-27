import { Outlet, Navigate } from 'react-router-dom';

const PrivateRoutes = () => {
  const isAuthenticated = localStorage.getItem('accessToken');

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoutes;
import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor (Outgoing)
axiosInstance.interceptors.request.use(function (config) {
  console.log('Interceptor Request (Outgoing) ', config);

  if (localStorage.getItem('accessToken')) {
    config.headers.Authorization = `Bearer ${localStorage.getItem('accessToken')}`;
  }

  return config;
}, function (error) {
  // Request error
  return Promise.reject(error);
});

export default axiosInstance;
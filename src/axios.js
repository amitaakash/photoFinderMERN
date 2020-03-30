import axios from 'axios';

export const pixBayAxios = axios.create({
  baseURL: 'https://pixabay.com/api'
});

const axiosInstance = axios.create({
  baseURL: '/api/v1/users'
});

export default axiosInstance;

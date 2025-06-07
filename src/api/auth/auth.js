import axios from 'axios';

export const register = async (data, type) => {
  return await axios.post(`http://localhost:8000/api/register`, data);
};

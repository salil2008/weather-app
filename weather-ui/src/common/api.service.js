import axios from 'axios';

export const getRequest = async (url, options = {}) => {
  return axios.get(url, options);
}
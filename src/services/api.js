import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000';

export const searchProducts = async (query) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/search`, {
      params: { query },
    });
    return response.data;
  } catch (error) {
    console.error('Error searching products:', error);
    throw error;
  }
};
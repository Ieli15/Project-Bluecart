// API service for making requests to the backend

const API_URL = 'http://localhost:5000/api';

// Get auth token from localStorage
const getToken = () => {
  return localStorage.getItem('token');
};

// Headers for authenticated requests
const authHeaders = () => {
  const token = getToken();
  return {
    'Content-Type': 'application/json',
    'Authorization': token ? `Bearer ${token}` : ''
  };
};

// Search products across multiple e-commerce platforms
export const searchProducts = async (query, page = 1) => {
  try {
    const response = await fetch(`${API_URL}/search?query=${encodeURIComponent(query)}&page=${page}`, {
      headers: authHeaders()
    });
    
    if (!response.ok) {
      throw new Error('Search failed');
    }
    
    return await response.json();
  } catch (error) {
    console.error('API search error:', error);
    throw error;
  }
};

// Compare products
export const compareProducts = async (products) => {
  try {
    const response = await fetch(`${API_URL}/compare`, {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify({ products })
    });
    
    if (!response.ok) {
      throw new Error('Comparison failed');
    }
    
    return await response.json();
  } catch (error) {
    console.error('API comparison error:', error);
    throw error;
  }
};

// Get user profile
export const getProfile = async () => {
  try {
    const response = await fetch(`${API_URL}/profile`, {
      headers: authHeaders()
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch profile');
    }
    
    return await response.json();
  } catch (error) {
    console.error('API profile error:', error);
    throw error;
  }
};

// Update user profile
export const updateProfile = async (userData) => {
  try {
    const response = await fetch(`${API_URL}/profile`, {
      method: 'PUT',
      headers: authHeaders(),
      body: JSON.stringify(userData)
    });
    
    if (!response.ok) {
      throw new Error('Failed to update profile');
    }
    
    return await response.json();
  } catch (error) {
    console.error('API update profile error:', error);
    throw error;
  }
};

// Get search history
export const getSearchHistory = async (page = 1, perPage = 10) => {
  try {
    const response = await fetch(`${API_URL}/history?page=${page}&per_page=${perPage}`, {
      headers: authHeaders()
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch search history');
    }
    
    return await response.json();
  } catch (error) {
    console.error('API history error:', error);
    throw error;
  }
};

// Delete search history item
export const deleteSearchHistoryItem = async (id) => {
  try {
    const response = await fetch(`${API_URL}/history/${id}`, {
      method: 'DELETE',
      headers: authHeaders()
    });
    
    if (!response.ok) {
      throw new Error('Failed to delete history item');
    }
    
    return await response.json();
  } catch (error) {
    console.error('API delete history error:', error);
    throw error;
  }
};

// Authentication API calls
export const loginUser = async (credentials) => {
  try {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(credentials)
    });
    
    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.error || 'Login failed');
    }
    
    return await response.json();
  } catch (error) {
    console.error('API login error:', error);
    throw error;
  }
};

export const registerUser = async (userData) => {
  try {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(userData)
    });
    
    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.error || 'Registration failed');
    }
    
    return await response.json();
  } catch (error) {
    console.error('API register error:', error);
    throw error;
  }
};

export const refreshToken = async () => {
  try {
    const refreshToken = localStorage.getItem('refresh_token');
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }
    
    const response = await fetch(`${API_URL}/auth/refresh`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${refreshToken}`
      }
    });
    
    if (!response.ok) {
      throw new Error('Token refresh failed');
    }
    
    const data = await response.json();
    localStorage.setItem('token', data.access_token);
    
    return data;
  } catch (error) {
    console.error('API token refresh error:', error);
    // Clear tokens on refresh failure
    localStorage.removeItem('token');
    localStorage.removeItem('refresh_token');
    throw error;
  }
};

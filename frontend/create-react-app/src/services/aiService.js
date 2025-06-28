/*import axios from 'axios';

const API_URL = '/api/ai';

const authHeader = () => {
    const token = localStorage.getItem('token');
    if (token) {
        return { 'x-auth-token': token};
    } else {
        return {};
    }
};

const getAIChatResponse = async (prompt) => {
    try {
        const response = await axios.post(`${API_URL}/chat`, {prompt},{headers:authHeader()});
        return response.data;
    } catch(error) {
        console.error("AI Chat Error:", error.response?.data?.msg || error.message);
        throw error.response?.data?.msg || 'Failed to get AI response';
    }
};

const aiService = {
    getAIChatResponse
};

export default aiService;*/

import api from './api';

const getAIChatResponse = async (prompt) => {
  const token = localStorage.getItem('token');
  try {
    const response = await api.post('/ai/chat', { prompt },
       {
        headers: {
          'x-auth-token': token, // ✅ Include token in headers
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("AI Chat Error:", error.response?.data?.msg || error.message);
    throw error.response?.data?.msg || 'Failed to get AI response';
  }
};

const aiService = {
  getAIChatResponse
};

export default aiService;

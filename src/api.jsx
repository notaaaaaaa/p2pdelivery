import axios from "axios";
import { auth } from "./firebase/firebase";

const API_URL = "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use(
  async (config) => {
    const token = await auth.currentUser?.getIdToken(true);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

const getAuthToken = async () => {
  const user = auth.currentUser;
  if (user) {
    const token = await user.getIdToken(true); // Force refresh the token
    console.log("Generated token:", token); // Log the generated token
    return token;
  }
  return null;
};
export const registerUser = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}/users/register`, userData);
    return response.data;
  } catch (error) {
    console.error("Error in registerUser:", error);
    if (error.response) {
      console.error("Response data:", error.response.data);
      console.error("Response status:", error.response.status);
    }
    throw error;
  }
};

export const createRequest = async (formData) => {
  const token = await getAuthToken();
  console.log("Creating request with token:", token, "and data:", formData);
  try {
    const response = await axios.post(`${API_URL}/requests`, formData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error(
      "Error in createRequest:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const createDelivery = async (formData) => {
  const token = await getAuthToken();
  console.log("Creating delivery with token:", token, "and data:", formData);
  try {
    const response = await axios.post(`${API_URL}/deliveries`, formData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error(
      "Error in createDelivery:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const checkForMatch = async () => {
  const token = await getAuthToken();
  try {
    console.log("Checking for match with token:", token);
    const response = await axios.get(`${API_URL}/matches/check`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log("Check for match response:", response.data);
    if (response.data.match && response.data.isNewMatch) {
      return response.data;
    }
    return { match: null };
  } catch (error) {
    console.error(
      "Error checking for match:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const submitFoodRequest = async (requestData) => {
  const token = await getAuthToken();
  return axios.post(`${API_URL}/requests`, requestData, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const getMatchDetails = async (matchId) => {
  try {
    const response = await api.get(`/matches/${matchId}`);
    return response.data;
  } catch (error) {
    console.error(
      "Error getting match details:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const sendMessage = async (matchId, content) => {
  return api.post("/messages", { matchId, content });
};

export const getMessages = async (matchId) => {
  return api.get(`/messages/${matchId}`);
};

export const getUserDocument = async (uid) => {
  try {
    const response = await api.get(`/users/${uid}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching user document:", error);
    if (error.response) {
      console.error("Response data:", error.response.data);
      console.error("Response status:", error.response.status);
    }
    // Return a minimal user object if the backend request fails
    return { uid };
  }
};

// Add other API calls as needed

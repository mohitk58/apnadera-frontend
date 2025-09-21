import axios from "axios";

const apiUrl = import.meta.env.VITE_API_URL;

// Use a more secure approach for the API URL
const getApiUrl = () => {
  // In development
  if (!import.meta.env.DEV) {
    return "http://localhost:5002";
  }

  // In production
  return apiUrl;
};

const api = axios.create({
  baseURL: getApiUrl(),
  headers: {
    "Content-Type": "application/json",
  },
});
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);
export const sendContactInquiry = async (contactData) => {
  try {
    const response = await api.post("/contact/send", contactData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to send inquiry" };
  }
};
export default api;

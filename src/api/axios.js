import axios from "axios";

const API_BASE_URL = "https://skillhub-backend.up.railway.app"; // ✅ LIVE backend URL

const instance = axios.create({
  baseURL: API_BASE_URL,
});

// Attach token to every request
instance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token && token !== "undefined") {
    config.headers["Authorization"] = `Bearer ${token}`;
  } else {
    console.warn("⚠️ No token found in localStorage");
  }

  return config;
});

export default instance;

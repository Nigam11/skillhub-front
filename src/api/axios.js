import axios from "axios";

const API_BASE_URL = "http://localhost:8080";

const instance = axios.create({
  baseURL: API_BASE_URL,
});

// Attach token to every request
instance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token && token !== "undefined") {
    config.headers["Authorization"] = `Bearer ${token}`;
     // DEBUG
  } else {
    console.warn("⚠️ No token found in localStorage"); // DEBUG
  }

  return config;
});

export default instance;

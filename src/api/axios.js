import axios from "axios";
import { auth } from "../firebaseConfig";

const api = axios.create({
  baseURL: "http://localhost:5000",
});

api.interceptors.request.use(async (config) => {
  if (auth.currentUser) {
    const token = await auth.currentUser.getIdToken();
    config.headers.Authorization = `Bearer ${token}`;
  } else {
    const token = localStorage.getItem("redsaver_token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      if (auth.signOut) auth.signOut();
      localStorage.removeItem("redsaver_token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default api;

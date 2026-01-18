import axios from "axios";
import type { StreaksData } from "../types/general";
import { useAuth } from "../contexts/AuthContext";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

export const api = axios.create({
  baseURL: API_URL, 
  timeout: 70000,
});
api.interceptors.request.use((config) => {
  const storagedToken = localStorage.getItem('@Aequo:token'); 
  
  if ((storagedToken ) && storagedToken !== "null") {
    config.headers.Authorization = `Bearer ${storagedToken}`;
  }
  
  return config;
}, (error) => {
  return Promise.reject(error);
});

api.interceptors.response.use(
  (response) => response, 
  (error) => {
    const isLoginRequest = error.config.url.includes('/login');
    const isRegisterRequest = error.config.url.includes('/register');
    if (error.response && (error.response.status === 401) && !isLoginRequest && !isRegisterRequest) {
        window.location.href = '/logout';
    }
    return Promise.reject(error);
  }
);

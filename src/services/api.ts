import axios from "axios";
import type { StreaksData } from "../types/general";
import { useAuth } from "../contexts/AuthContext";

export const api = axios.create({
  baseURL: "http://192.168.0.9:8080", 
  timeout: 5000,
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

export async function getStreaks() {
    try {

        const response = await api.get<StreaksData>("/api/streaksdata");

        return response.data; 

    } catch (error) {
        console.error("ERROR: ", error);
    }
}
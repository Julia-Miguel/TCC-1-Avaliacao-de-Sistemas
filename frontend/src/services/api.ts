// frontend/src/services/api.ts
import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

// Interceptor que adiciona o token de autenticação em cada requisição
api.interceptors.request.use(
  (config) => {
    // Garante que o código só rode no navegador
    if (typeof window !== "undefined") {
      const token = localStorage.getItem('adminToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
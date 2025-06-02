// frontend/src/services/api.ts
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:4444",
});

// --- NOVO: Interceptor para adicionar o token JWT ---
api.interceptors.request.use(
  async (config) => {
    // Verifica se estamos no ambiente do navegador antes de tentar acessar o localStorage
    if (typeof window !== "undefined") {
      const token = localStorage.getItem('adminToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(new Error(error?.message ?? String(error)));
  }
);
// --------------------------------------------------

export default api;
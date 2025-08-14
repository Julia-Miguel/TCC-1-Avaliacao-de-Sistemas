import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

// Interceptor que adiciona o token de autenticação em cada requisição
api.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem('adminToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    let err: Error;
    if (error instanceof Error) {
      err = error;
    } else if (typeof error === 'string') {
      err = new Error(error);
    } else {
      err = new Error(JSON.stringify(error));
    }
    return Promise.reject(err);
  }
);

// ------------------- ADICIONE ESTE INTERCEPTOR DE RESPOSTA -------------------
api.interceptors.response.use(
  response => response,
  error => {
    if (
      error.response &&
      (error.response.data?.error === "jwt expired" ||
       error.response.data?.message === "jwt expired" ||
       error.response.status === 401)
    ) {
      localStorage.removeItem('adminToken');
      localStorage.removeItem('adminUser');
      if (typeof window !== "undefined") {
        window.location.href = "/empresas/login";
      }
    }
    let err: Error;
    if (error instanceof Error) {
      err = error;
    } else if (typeof error === 'string') {
      err = new Error(error);
    } else {
      err = new Error(JSON.stringify(error));
    }
    return Promise.reject(err);
  }
);

export default api;
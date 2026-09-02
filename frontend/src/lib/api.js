import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000/api',
});

// Se ejecuta antes de CADA petición: añade el token si existe en localStorage
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('lifto_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Se ejecuta cuando llega CUALQUIER respuesta: si el token es inválido/expiró,
// limpiamos la sesión para forzar un nuevo login
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('lifto_token');
    }
    return Promise.reject(error);
  }
);

export default api;

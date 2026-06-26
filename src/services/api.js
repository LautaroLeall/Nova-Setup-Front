import axios from "axios";

// Instancia base de axios
const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
  withCredentials: true, // Esto es crucial para enviar/recibir cookies HttpOnly (como el JWT)
});

// Manejador genérico de errores (opcional pero recomendado)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Aquí se podrían manejar errores globales (ej: 401 Unauthorized para redirigir a /login)
    return Promise.reject(error);
  }
);

export default api;

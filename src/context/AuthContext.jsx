/* eslint-disable react-refresh/only-export-components */
import { createContext, useState, useEffect } from "react";
import axios from "axios";
import { showConfirmDialog } from "../utils/swalConfig";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    // Inicialización directa para evitar renderizados en cascada (error ESLint)
    const userInfo = localStorage.getItem("userInfo");
    return userInfo ? JSON.parse(userInfo) : null;
  });
  const [loading] = useState(false);
  const [favoriteIds, setFavoriteIds] = useState([]);

  useEffect(() => {
    if (user) {
      const fetchFavorites = async () => {
        try {
          const { data } = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/favorites`, {
            headers: { Authorization: `Bearer ${user.token}` }
          });
          // data es un array de productos populados — extraemos solo los _id como strings
          setFavoriteIds(data.map(p => p._id.toString()));
        } catch (err) {
          console.error("Error cargando favoritos:", err.response?.data || err.message);
        }
      };
      fetchFavorites();
    } else {
      setFavoriteIds([]);
    }
  }, [user]);

  const login = async (email, password) => {
    try {
      const config = { headers: { "Content-Type": "application/json" } };
      const { data } = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/users/login`,
        { email, password },
        config
      );

      setUser(data);
      localStorage.setItem("userInfo", JSON.stringify(data));
      return { success: true };
    } catch (error) {
      // Diferenciar entre error de red (backend no levantado) y error de credenciales
      let errorMessage = "Ocurrió un error inesperado.";
      if (!error.response) {
        errorMessage = "El servidor no responde. ¿El backend está levantado?";
      } else if (error.response.data && error.response.data.message) {
        errorMessage = error.response.data.message;
      }
      return { success: false, error: errorMessage };
    }
  };

  const register = async (firstName, lastName, email, password) => {
    try {
      const config = { headers: { "Content-Type": "application/json" } };
      const { data } = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/users/register`,
        { firstName, lastName, email, password },
        config
      );

      setUser(null); // No guardamos el usuario porque ahora requiere verificación de email
      // localStorage.setItem("userInfo", JSON.stringify(data));
      return { success: true, message: data.message };
    } catch (error) {
      let errorMessage = "Ocurrió un error inesperado.";
      if (!error.response) {
        errorMessage = "El servidor no responde. ¿El backend está levantado?";
      } else if (error.response.data && error.response.data.message) {
        errorMessage = error.response.data.message;
      }
      return { success: false, error: errorMessage };
    }
  };

  const googleLogin = async (tokenId) => {
    try {
      const config = { headers: { "Content-Type": "application/json" } };
      const { data } = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/users/google-auth`,
        { tokenId },
        config
      );

      setUser(data);
      localStorage.setItem("userInfo", JSON.stringify(data));
      return { success: true };
    } catch (error) {
      let errorMessage = "Ocurrió un error inesperado al iniciar sesión con Google.";
      if (!error.response) {
        errorMessage = "El servidor no responde. ¿El backend está levantado?";
      } else if (error.response.data && error.response.data.message) {
        errorMessage = error.response.data.message;
      }
      return { success: false, error: errorMessage };
    }
  };

  const logout = async () => {
    const result = await showConfirmDialog(
      "¿Cerrar Sesión?",
      "¿Estás seguro que deseas salir de tu cuenta?",
      "Sí, salir",
      "Cancelar"
    );
    if (result.isConfirmed) {
      localStorage.removeItem("userInfo");
      setUser(null);
      setFavoriteIds([]);
    }
  };

  const updateUserProfile = async (profileData) => {
    try {
      const config = { 
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`
        } 
      };
      const { data } = await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/api/users/profile`,
        profileData,
        config
      );

      setUser(data);
      localStorage.setItem("userInfo", JSON.stringify(data));
      return { success: true };
    } catch (error) {
      let errorMessage = "Ocurrió un error inesperado al actualizar el perfil.";
      if (error.response && error.response.data && error.response.data.message) {
        errorMessage = error.response.data.message;
      }
      return { success: false, error: errorMessage };
    }
  };

  const toggleFavorite = async (productId) => {
    if (!user) return;
    try {
      const { data } = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/favorites/${productId}`,
        {},
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      // data es un array de IDs strings devuelto por el servidor
      setFavoriteIds(data);
    } catch (err) {
      console.error("Error toggling favorite:", err.response?.data || err.message);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, googleLogin, logout, favoriteIds, toggleFavorite, updateUserProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

/* eslint-disable react-refresh/only-export-components */
import { createContext, useState, useEffect, useMemo, useCallback } from "react";
import api from "../services/api";
import { showConfirmDialog } from "../utils/swalConfig";

export const AuthContext = createContext();

const handleError = (error, defaultMessage) => {
  if (!error.response) return "El servidor no responde. ¿El backend está levantado?";
  return error.response?.data?.message || defaultMessage;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const userInfo = localStorage.getItem("userInfo");
    return userInfo ? JSON.parse(userInfo) : null;
  });
  const [loading] = useState(false);
  const [favoriteIds, setFavoriteIds] = useState([]);

  useEffect(() => {
    let isMounted = true;

    if (user) {
      const fetchFavorites = async () => {
        try {
          const { data } = await api.get(`/api/favorites`);
          if (isMounted) {
            setFavoriteIds(data.map(p => p._id.toString()));
          }
        } catch (err) {
          console.error("Error cargando favoritos:", err.response?.data || err.message);
        }
      };
      fetchFavorites();
    } else {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setFavoriteIds([]);
    }

    return () => {
      isMounted = false;
    };
  }, [user]);

  const login = useCallback(async (email, password) => {
    try {
      const { data } = await api.post(`/api/users/login`, { email, password });

      // Extraemos el token si viene en la respuesta, y lo guardamos
      if (data.token) localStorage.setItem("nova_token", data.token);

      setUser(data);
      localStorage.setItem("userInfo", JSON.stringify(data));
      return { success: true };
    } catch (error) {
      return { success: false, error: handleError(error, "Ocurrió un error inesperado al iniciar sesión.") };
    }
  }, []);

  const register = useCallback(async (firstName, lastName, email, password) => {
    try {
      const { data } = await api.post(`/api/users/register`, { firstName, lastName, email, password });
      setUser(null);
      return { success: true, message: data.message };
    } catch (error) {
      return { success: false, error: handleError(error, "Ocurrió un error inesperado al registrarse.") };
    }
  }, []);

  const googleLogin = useCallback(async (tokenId) => {
    try {
      const { data } = await api.post(`/api/users/google-auth`, { tokenId });

      if (data.token) localStorage.setItem("nova_token", data.token);

      setUser(data);
      localStorage.setItem("userInfo", JSON.stringify(data));
      return { success: true };
    } catch (error) {
      return { success: false, error: handleError(error, "Ocurrió un error inesperado al iniciar sesión con Google.") };
    }
  }, []);

  const logout = useCallback(async () => {
    const result = await showConfirmDialog(
      "¿Cerrar Sesión?",
      "¿Estás seguro que deseas salir de tu cuenta?",
      "Sí, salir",
      "Cancelar"
    );
    if (result.isConfirmed) {
      try {
        await api.post(`/api/users/logout`);
      } catch (err) {
        console.error("Error al hacer logout en servidor:", err);
      } finally {
        localStorage.removeItem("userInfo");
        localStorage.removeItem("nova_token");
        setUser(null);
        setFavoriteIds([]);
      }
    }
  }, []);

  const updateUserProfile = useCallback(async (profileData) => {
    try {
      const { data } = await api.put(`/api/users/profile`, profileData);

      if (data.token) localStorage.setItem("nova_token", data.token);

      setUser(data);
      localStorage.setItem("userInfo", JSON.stringify(data));
      return { success: true };
    } catch (error) {
      return { success: false, error: handleError(error, "Ocurrió un error al actualizar el perfil.") };
    }
  }, []);

  const toggleFavorite = useCallback(async (productId) => {
    if (!user) return;
    try {
      const { data } = await api.post(`/api/favorites/${productId}`);
      setFavoriteIds(data);
    } catch (err) {
      console.error("Error toggling favorite:", err.response?.data || err.message);
    }
  }, [user]);

  const value = useMemo(() => ({
    user,
    loading,
    favoriteIds,
    login,
    register,
    googleLogin,
    logout,
    toggleFavorite,
    updateUserProfile
  }), [user, loading, favoriteIds, login, register, googleLogin, logout, toggleFavorite, updateUserProfile]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

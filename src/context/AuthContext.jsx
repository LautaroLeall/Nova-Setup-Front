/* eslint-disable react-refresh/only-export-components */
import { createContext, useState } from "react";
import axios from "axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    // Inicialización directa para evitar renderizados en cascada (error ESLint)
    const userInfo = localStorage.getItem("userInfo");
    return userInfo ? JSON.parse(userInfo) : null;
  });
  const [loading] = useState(false);

  const login = async (email, password) => {
    try {
      const config = { headers: { "Content-Type": "application/json" } };
      const { data } = await axios.post(
        "http://localhost:5000/api/users/login",
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

  const register = async (name, email, password) => {
    try {
      const config = { headers: { "Content-Type": "application/json" } };
      const { data } = await axios.post(
        "http://localhost:5000/api/users/register",
        { name, email, password },
        config
      );

      setUser(data);
      localStorage.setItem("userInfo", JSON.stringify(data));
      return { success: true };
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

  const logout = () => {
    localStorage.removeItem("userInfo");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

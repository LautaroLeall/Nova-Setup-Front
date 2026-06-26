import { useForm } from "react-hook-form";
import { Link } from "react-router";
import { useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { sileo } from "sileo";
import { ArrowLeft, AlertCircle } from "lucide-react";
import "../styles/Login.css";

const ForgotPassword = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/users/forgot-password`, {
        email: data.email
      });
      sileo.success({
        title: "Correo enviado",
        description: response.data.message,
        position: "bottom-center"
      });
    } catch (error) {
      sileo.error({
        title: "Error",
        description: error.response?.data?.message || "Ocurrió un error al procesar la solicitud"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      {/* ── Fondo Animado / Gráfico Izquierdo ── */}
      <div className="login-bg-graphic">
        <div className="login-orb-main"></div>
        <div className="login-orb-secondary"></div>

        <div className="login-hero-text">
          <h1 className="login-hero-title">
            RECUPERA TU<br />
            <span className="nova-gradient-text">ACCESO.</span>
          </h1>
          <p className="login-hero-subtitle">
            Ingresa tu correo y te enviaremos las instrucciones para restablecer tu contraseña.
          </p>
        </div>
      </div>

      {/* ── Sidebar (Alineada a la derecha) ── */}
      <motion.div
        initial={{ x: "100%", opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: "100%", opacity: 0 }}
        transition={{ type: "spring", stiffness: 90, damping: 20 }}
        className="login-sidebar"
      >
        <div className="login-sidebar-gradient" />

        <div className="login-header">
          <div className="login-header-top">
            <Link to="/" className="login-logo-link">
              <div className="login-logo-container">
                <img src="/logo-NovaSetUp.png" alt="Nova SetUp" className="login-logo-img" />
              </div>
            </Link>
            <Link to="/login" className="login-back-link">
              <ArrowLeft size={18} />
              Volver al Login
            </Link>
          </div>
          <h2 className="login-title">RECUPERAR CONTRASEÑA</h2>
          <p className="login-subtitle">
            Ingresa tu correo electrónico registrado.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="login-form">

          {/* Input Email */}
          <div className="login-input-group">
            <div className="login-input-glow"></div>
            <div className="login-input-wrapper">
              <label className="login-label">Correo Electrónico</label>
              <input
                type="email"
                className="login-input"
                placeholder="tu@email.com"
                autoComplete="off"
                {...register("email", { required: "El email es requerido" })}
              />
            </div>
            {errors.email && (
              <span className="login-error"><AlertCircle size={14} /> {errors.email.message}</span>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="login-submit-btn"
          >
            {isLoading ? (
              <div className="login-spinner" />
            ) : (
              "ENVIAR ENLACE"
            )}
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default ForgotPassword;

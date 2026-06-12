import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router";
import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { motion } from "framer-motion";
import { sileo } from "sileo";
import { ArrowLeft, Eye, EyeOff, AlertCircle } from "lucide-react";
import "../styles/Login.css";

const Login = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const onSubmit = async (data) => {
    setIsLoading(true);
    const result = await login(data.email, data.password);
    setIsLoading(false);

    if (result.success) {
      sileo.success({
        title: "¡Bienvenido a Nova SetUp!",
        description: "Has iniciado sesión correctamente.",
        position: "bottom-center"
      });
      navigate("/");
    } else {
      sileo.error({
        title: "Error de inicio de sesión",
        description: result.error
      });
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
            TU ESPACIO.<br />
            <span className="nova-gradient-text">TUS REGLAS.</span>
          </h1>
          <p className="login-hero-subtitle">
            Accede a tu cuenta y lleva el control absoluto de tu setup al siguiente nivel.
          </p>
        </div>
      </div>

      {/* ── Sidebar de Login (Alineada a la derecha) ── */}
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
            <Link to="/" className="login-back-link">
              <ArrowLeft size={18} />
              Volver al inicio
            </Link>
          </div>
          <h2 className="login-title">INICIAR SESIÓN</h2>
          <p className="login-subtitle">
            Ingresa tus credenciales para continuar.
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

          {/* Input Password */}
          <div className="login-input-group">
            <div className="login-input-glow"></div>
            <div className="login-input-wrapper" style={{ position: "relative" }}>
              <label className="login-label">Contraseña</label>
              <input
                type={showPassword ? "text" : "password"}
                className="login-input login-password-input"
                placeholder="••••••••"
                {...register("password", { required: "La contraseña es requerida" })}
              />
              <button
                type="button"
                className="login-eye-btn"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.password && (
              <span className="login-error"><AlertCircle size={14} /> {errors.password.message}</span>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="login-submit-btn"
          >
            {isLoading ? (
              <div className="login-spinner" />
            ) : (
              "ENTRAR"
            )}
          </button>
        </form>

        <div className="login-footer">
          ¿Nuevo en Nova SetUp?{" "}
          <Link to="/register" className="login-footer-link">
            Crear cuenta
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;

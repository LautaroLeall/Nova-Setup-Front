import { useForm } from "react-hook-form";
import { useNavigate, useParams, Link } from "react-router";
import { useState } from "react";
import api from "../services/api";
import { motion } from "framer-motion";
import { sileo } from "sileo";
import { Eye, EyeOff, AlertCircle } from "lucide-react";
import "../styles/auth/Login.css";

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors }, getValues } = useForm();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      const response = await api.put(`/api/users/reset-password/${token}`, {
        password: data.password
      });
      sileo.success({
        title: "¡Contraseña actualizada!",
        description: response.data.message,
        position: "bottom-center"
      });
      navigate("/login");
    } catch (error) {
      sileo.error({
        title: "Error",
        description: error.response?.data?.message || "Ocurrió un error al restablecer la contraseña"
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
            NUEVA <br />
            <span className="nova-gradient-text">CONTRASEÑA.</span>
          </h1>
          <p className="login-hero-subtitle">
            Crea una nueva contraseña segura para tu cuenta.
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
          </div>
          <h2 className="login-title">RESTABLECER</h2>
          <p className="login-subtitle">
            Ingresa tu nueva contraseña a continuación.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="login-form">

          {/* Input Password */}
          <div className="login-input-group">
            <div className="login-input-glow"></div>
            <div className="login-input-wrapper auth-relative-wrapper">
              <label className="login-label">Nueva Contraseña</label>
              <input
                type={showPassword ? "text" : "password"}
                className="login-input login-password-input"
                placeholder="••••••••"
                {...register("password", {
                  required: "La contraseña es requerida",
                  minLength: { value: 6, message: "Mínimo 6 caracteres" }
                })}
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

          {/* Input Confirm Password */}
          <div className="login-input-group">
            <div className="login-input-glow"></div>
            <div className="login-input-wrapper auth-relative-wrapper">
              <label className="login-label">Confirmar Contraseña</label>
              <input
                type={showConfirmPassword ? "text" : "password"}
                className="login-input login-password-input"
                placeholder="••••••••"
                {...register("confirmPassword", {
                  required: "Confirmación requerida",
                  validate: val => val === getValues("password") || "Las contraseñas no coinciden"
                })}
              />
              <button
                type="button"
                className="login-eye-btn"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.confirmPassword && (
              <span className="login-error"><AlertCircle size={14} /> {errors.confirmPassword.message}</span>
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
              "GUARDAR CONTRASEÑA"
            )}
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default ResetPassword;

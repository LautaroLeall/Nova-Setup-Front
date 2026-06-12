import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router";
import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { motion } from "framer-motion";
import { sileo } from "sileo";
import { ArrowLeft, Eye, EyeOff, AlertCircle } from "lucide-react";
import "../styles/Register.css";

const Register = () => {
  const { register: registerForm, handleSubmit, formState: { errors }, getValues } = useForm();
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const onSubmit = async (data) => {
    setIsLoading(true);
    const result = await register(data.firstName.trim(), data.lastName.trim(), data.email, data.password);
    setIsLoading(false);

    if (result.success) {
      sileo.success({
        title: "¡Cuenta creada con éxito!",
        description: "Ya puedes disfrutar de Nova SetUp.",
        position: "bottom-center" // Para que no se pise con el Navbar superior al redirigir
      });
      navigate("/");
    } else {
      sileo.error({
        title: "Error al registrarse",
        description: result.error
      });
    }
  };

  return (
    <div className="register-container">

      {/* ── Fondo Animado / Gráfico Izquierdo ── */}
      <div className="register-bg-graphic">
        <div className="register-orb-main"></div>
        <div className="register-orb-secondary"></div>

        <div className="register-hero-text">
          <h1 className="register-hero-title">
            CREA TU <br />
            <span className="nova-gradient-text">IDENTIDAD.</span>
          </h1>
          <p className="register-hero-subtitle">
            Únete a Nova SetUp y accede a productos exclusivos para perfeccionar tu ecosistema tecnológico.
          </p>
        </div>
      </div>

      {/* ── Sidebar de Registro (Alineada a la derecha) ── */}
      <motion.div
        initial={{ x: "100%", opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: "100%", opacity: 0 }}
        transition={{ type: "spring", stiffness: 90, damping: 20 }}
        className="register-sidebar"
      >
        <div className="register-sidebar-gradient" />

        <div className="register-header">
          <div className="register-header-top">
            <Link to="/" className="register-logo-link">
              <div className="register-logo-container">
                <img src="/logo-NovaSetUp.png" alt="Nova SetUp" className="register-logo-img" />
              </div>
            </Link>
            <Link to="/" className="register-back-link">
              <ArrowLeft size={18} />
              Volver al inicio
            </Link>
          </div>
          <h2 className="register-title">NUEVA CUENTA</h2>
          <p className="register-subtitle">
            Completa tus datos para unirte.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="register-form">

          {/* Fila para Nombre y Apellido */}
          <div style={{ display: 'flex', gap: '1rem', width: '100%' }}>
            {/* Input Nombre */}
            <div className="register-input-group" style={{ flex: 1 }}>
              <div className="register-input-glow"></div>
              <div className="register-input-wrapper">
                <label className="register-label">Nombre</label>
                <input
                  type="text"
                  className="register-input"
                  placeholder="Tu Nombre"
                  autoComplete="off"
                  {...registerForm("firstName", { required: "Requerido" })}
                />
              </div>
              {errors.firstName && (
                <span className="register-error"><AlertCircle size={14} /> {errors.firstName.message}</span>
              )}
            </div>

            {/* Input Apellido */}
            <div className="register-input-group" style={{ flex: 1 }}>
              <div className="register-input-glow"></div>
              <div className="register-input-wrapper">
                <label className="register-label">Apellido</label>
                <input
                  type="text"
                  className="register-input"
                  placeholder="Tu Apellido"
                  autoComplete="off"
                  {...registerForm("lastName", { required: "Requerido" })}
                />
              </div>
              {errors.lastName && (
                <span className="register-error"><AlertCircle size={14} /> {errors.lastName.message}</span>
              )}
            </div>
          </div>

          {/* Input Email */}
          <div className="register-input-group">
            <div className="register-input-glow"></div>
            <div className="register-input-wrapper">
              <label className="register-label">Correo Electrónico</label>
              <input
                type="email"
                className="register-input"
                placeholder="tu@email.com"
                autoComplete="off"
                {...registerForm("email", {
                  required: "El email es requerido",
                  pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "Email inválido" }
                })}
              />
            </div>
            {errors.email && (
              <span className="register-error"><AlertCircle size={14} /> {errors.email.message}</span>
            )}
          </div>

          {/* Input Password */}
          <div className="register-input-group">
            <div className="register-input-glow"></div>
            <div className="register-input-wrapper" style={{ position: "relative" }}>
              <label className="register-label">Contraseña</label>
              <input
                type={showPassword ? "text" : "password"}
                className="register-input register-password-input"
                placeholder="••••••••"
                {...registerForm("password", {
                  required: "La contraseña es requerida",
                  minLength: { value: 6, message: "Mínimo 6 caracteres" }
                })}
              />
              <button
                type="button"
                className="register-eye-btn"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.password && (
              <span className="register-error"><AlertCircle size={14} /> {errors.password.message}</span>
            )}
          </div>

          {/* Input Confirm Password */}
          <div className="register-input-group">
            <div className="register-input-glow"></div>
            <div className="register-input-wrapper" style={{ position: "relative" }}>
              <label className="register-label">Confirmar Contraseña</label>
              <input
                type={showConfirmPassword ? "text" : "password"}
                className="register-input register-password-input"
                placeholder="••••••••"
                {...registerForm("confirmPassword", {
                  required: "Confirmación requerida",
                  validate: val => val === getValues("password") || "Las contraseñas no coinciden"
                })}
              />
              <button
                type="button"
                className="register-eye-btn"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.confirmPassword && (
              <span className="register-error"><AlertCircle size={14} /> {errors.confirmPassword.message}</span>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="register-submit-btn"
          >
            {isLoading ? (
              <div className="register-spinner" />
            ) : (
              "REGISTRARSE"
            )}
          </button>
        </form>

        <div className="register-footer">
          ¿Ya tienes cuenta?{" "}
          <Link to="/login" className="register-footer-link">
            Inicia Sesión
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;

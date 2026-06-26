import { useForm } from "react-hook-form";
import { Link, useNavigate, useSearchParams } from "react-router";
import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { motion } from "framer-motion";
import { useGoogleLogin } from '@react-oauth/google';
import { showInfoAlert } from '../utils/swalConfig';
import { sileo } from "sileo";
import { ArrowLeft, Eye, EyeOff, AlertCircle } from "lucide-react";
import "../styles/Register.css";

const Register = () => {
  const { register: registerForm, handleSubmit, formState: { errors }, getValues } = useForm();
  const { register, googleLogin } = useContext(AuthContext);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const redirect = searchParams.get("redirect") || "/";

  const onSubmit = async (data) => {
    setIsLoading(true);
    const result = await register(data.firstName.trim(), data.lastName.trim(), data.email, data.password);
    setIsLoading(false);

    if (result.success) {
      showInfoAlert(
        "¡Revisa tu correo!",
        result.message || "Te enviamos un enlace para verificar tu cuenta."
      );
    } else {
      sileo.error({
        title: "Error al registrarse",
        description: result.error
      });
    }
  };

  const loginWithGoogle = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setIsLoading(true);
      const result = await googleLogin(tokenResponse.access_token);
      setIsLoading(false);

      if (result.success) {
        sileo.success({
          title: "¡Bienvenido a Nova SetUp!",
          description: "Has iniciado sesión con Google correctamente.",
          position: "bottom-center"
        });
        navigate(redirect);
      } else {
        sileo.error({
          title: "Error con Google Auth",
          description: result.error
        });
      }
    },
    onError: () => {
      sileo.error({
        title: "Error",
        description: "El inicio de sesión con Google falló"
      });
    }
  });

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

          <button
            type="button"
            disabled={isLoading}
            className="register-submit-btn"
            style={{
              background: 'transparent',
              color: 'var(--color-text)',
              border: '1px solid var(--color-border)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
              transition: 'all 0.3s ease',
              marginTop: '0'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
              e.currentTarget.style.borderColor = 'var(--color-text-dim)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = 'transparent';
              e.currentTarget.style.borderColor = 'var(--color-border)';
            }}
            onClick={() => loginWithGoogle()}
          >
            <svg viewBox="0 0 24 24" width="20" height="20" xmlns="http://www.w3.org/2000/svg">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              <path d="M1 1h22v22H1z" fill="none" />
            </svg>
            Continuar con Google
          </button>
        </form>

        <div className="register-footer">
          ¿Ya tienes cuenta?{" "}
          <Link to={`/login?redirect=${encodeURIComponent(redirect)}`} className="register-footer-link">
            Inicia Sesión
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;

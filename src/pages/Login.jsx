import { useForm } from "react-hook-form";
import { Link, useNavigate, useSearchParams } from "react-router";
import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { motion } from "framer-motion";
import { useGoogleLogin } from '@react-oauth/google';
import { sileo } from "sileo";
import { ArrowLeft, Eye, EyeOff, AlertCircle } from "lucide-react";
import "../styles/Login.css";

const Login = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const { login, googleLogin } = useContext(AuthContext);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const redirect = searchParams.get("redirect") || "/";

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
      navigate(redirect);
    } else {
      sileo.error({
        title: "Error de inicio de sesión",
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

          <div style={{ textAlign: "right", marginTop: "-0.5rem", marginBottom: "1.5rem" }}>
            <Link to="/forgot-password" style={{ color: "var(--color-nova-cyan)", fontSize: "0.85rem", textDecoration: "none", opacity: 0.8, transition: "opacity 0.2s" }} onMouseOver={(e) => e.currentTarget.style.opacity = 1} onMouseOut={(e) => e.currentTarget.style.opacity = 0.8}>
              ¿Olvidaste tu contraseña?
            </Link>
          </div>

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

          <button
            type="button"
            disabled={isLoading}
            className="login-submit-btn"
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

        <div className="login-footer">
          ¿Nuevo en Nova SetUp?{" "}
          <Link to={`/register?redirect=${encodeURIComponent(redirect)}`} className="login-footer-link">
            Crear cuenta
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;

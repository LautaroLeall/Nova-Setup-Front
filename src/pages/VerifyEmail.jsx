import { useEffect, useState } from "react";
import { useParams, Link } from "react-router";
import api from "../services/api";
import { CheckCircle2, XCircle } from "lucide-react";
import "../styles/auth/VerifyEmail.css";

const VerifyEmail = () => {
  const { token } = useParams();
  const [status, setStatus] = useState("loading");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const verifyToken = async () => {
      try {
        const { data } = await api.get(`/api/users/verify/${token}`);
        setStatus("success");
        setMessage(data.message);
      } catch (error) {
        setStatus("error");
        setMessage(error.response?.data?.message || "Error al verificar la cuenta.");
      }
    };
    verifyToken();
  }, [token]);

  return (
    <div className="verify-page">
      <div className="verify-card">
        {status === "loading" && (
          <div>
            <div className="spinner verify-spinner" />
            <h2 className="verify-title">Verificando tu cuenta...</h2>
            <p className="verify-text">Espera un momento mientras validamos tu enlace.</p>
          </div>
        )}

        {status === "success" && (
          <div className="verify-status-success">
            <CheckCircle2 size={64} className="verify-icon" />
            <h2 className="verify-title">¡Cuenta Verificada!</h2>
            <p className="verify-text--margin">{message}</p>
            <Link to="/login" className="verify-btn-login">
              Ir a Iniciar Sesión
            </Link>
          </div>
        )}

        {status === "error" && (
          <div className="verify-status-error">
            <XCircle size={64} className="verify-icon" />
            <h2 className="verify-title">Error de Verificación</h2>
            <p className="verify-text--margin">{message}</p>
            <Link to="/login" className="verify-link-back">Volver al inicio</Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default VerifyEmail;

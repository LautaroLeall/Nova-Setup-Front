import { useEffect, useState } from "react";
import { useParams, Link } from "react-router"; // V6 router
import axios from "axios";
import { CheckCircle2, XCircle } from "lucide-react";

const VerifyEmail = () => {
  const { token } = useParams();
  const [status, setStatus] = useState("loading");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const verifyToken = async () => {
      try {
        const { data } = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/users/verify/${token}`);
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
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', background: 'var(--color-bg-dark)', padding: '2rem' }}>
      <div style={{ background: 'var(--color-bg-light)', border: '1px solid var(--color-border)', borderRadius: '1rem', padding: '3rem', textAlign: 'center', maxWidth: '500px', width: '100%', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }}>
        {status === "loading" && (
          <div>
            <div className="spinner" style={{ width: '40px', height: '40px', margin: '0 auto 1rem' }} />
            <h2 style={{ color: 'white', marginBottom: '1rem' }}>Verificando tu cuenta...</h2>
            <p style={{ color: 'var(--color-text-dim)' }}>Espera un momento mientras validamos tu enlace.</p>
          </div>
        )}

        {status === "success" && (
          <div style={{ color: '#10b981' }}>
            <CheckCircle2 size={64} style={{ margin: '0 auto 1rem' }} />
            <h2 style={{ color: 'white', marginBottom: '1rem' }}>¡Cuenta Verificada!</h2>
            <p style={{ color: 'var(--color-text-dim)', marginBottom: '2rem' }}>{message}</p>
            <Link to="/login" style={{ display: 'inline-block', padding: '12px 24px', background: 'var(--color-nova-cyan)', color: '#000', fontWeight: 'bold', textDecoration: 'none', borderRadius: '5px' }}>
              Ir a Iniciar Sesión
            </Link>
          </div>
        )}

        {status === "error" && (
          <div style={{ color: '#ef4444' }}>
            <XCircle size={64} style={{ margin: '0 auto 1rem' }} />
            <h2 style={{ color: 'white', marginBottom: '1rem' }}>Error de Verificación</h2>
            <p style={{ color: 'var(--color-text-dim)', marginBottom: '2rem' }}>{message}</p>
            <Link to="/login" style={{ color: 'var(--color-nova-cyan)', textDecoration: 'none', fontWeight: 'bold' }}>Volver al inicio</Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default VerifyEmail;

import { useEffect, useContext } from "react";
import { useSearchParams, Link } from "react-router";
import { motion } from "framer-motion";
import { CheckCircle2, ShoppingBag, Package } from "lucide-react";
import { CartContext } from "../context/CartContext";
import "../styles/OrderResult.css";

const OrderSuccess = () => {
  const { clearCart } = useContext(CartContext);
  const [searchParams] = useSearchParams();

  const paymentId = searchParams.get("payment_id");
  const externalRef = searchParams.get("external_reference"); // El orderId

  useEffect(() => {
    clearCart();
  }, [clearCart]);

  return (
    <div className="order-result-page">
      <motion.div
        className="order-result-card success"
        initial={{ opacity: 0, scale: 0.85 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.175, 0.885, 0.32, 1.275] }}
      >
        {/* Ícono animado */}
        <motion.div
          className="result-icon-wrapper success-icon"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, duration: 0.5, ease: [0.175, 0.885, 0.32, 1.275] }}
        >
          <CheckCircle2 size={64} strokeWidth={1.5} />
          <div className="icon-pulse" />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          ¡Pago Aprobado!
        </motion.h1>

        <motion.p
          className="result-subtitle"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          Tu compra fue procesada exitosamente. En breve recibirás la confirmación.
        </motion.p>

        {paymentId && (
          <motion.div
            className="payment-details-box"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <div className="payment-detail-row">
              <Package size={16} />
              <span>N° de Pago:</span>
              <strong>#{paymentId}</strong>
            </div>
            {externalRef && (
              <div className="payment-detail-row">
                <span>N° de Orden:</span>
                <strong>{externalRef.slice(-8).toUpperCase()}</strong>
              </div>
            )}
            <div className="payment-detail-row">
              <span>Estado:</span>
              <strong className="status-approved">✓ Aprobado</strong>
            </div>
          </motion.div>
        )}

        <motion.div
          className="result-actions"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Link to="/shop" className="result-btn primary">
            <ShoppingBag size={18} />
            Seguir Comprando
          </Link>
          <Link to="/" className="result-btn secondary">
            Ir al Inicio
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default OrderSuccess;

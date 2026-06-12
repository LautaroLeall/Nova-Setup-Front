import { Link } from "react-router";
import { motion } from "framer-motion";
import { Clock, ShoppingBag, Mail } from "lucide-react";
import "../styles/OrderResult.css";

const OrderPending = () => {
  return (
    <div className="order-result-page">
      <motion.div
        className="order-result-card pending"
        initial={{ opacity: 0, scale: 0.85 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.175, 0.885, 0.32, 1.275] }}
      >
        <motion.div
          className="result-icon-wrapper pending-icon"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, duration: 0.5, ease: [0.175, 0.885, 0.32, 1.275] }}
        >
          <Clock size={64} strokeWidth={1.5} />
          <div className="icon-pulse pending-pulse" />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          Pago Pendiente
        </motion.h1>

        <motion.p
          className="result-subtitle"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          Tu pago está siendo procesado. Puede demorar hasta 2 días hábiles en acreditarse.
        </motion.p>

        <motion.div
          className="pending-info-box"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Mail size={18} />
          <p>
            Te enviaremos un email de confirmación cuando el pago se acredite y tu pedido
            esté listo para enviarse.
          </p>
        </motion.div>

        <motion.div
          className="result-actions"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Link to="/" className="result-btn primary">
            Ir al Inicio
          </Link>
          <Link to="/shop" className="result-btn secondary">
            <ShoppingBag size={18} />
            Seguir Comprando
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default OrderPending;

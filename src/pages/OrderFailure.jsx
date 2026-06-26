import { useSearchParams, Link, Navigate } from "react-router";
import { motion } from "framer-motion";
import { XCircle, ShoppingBag, RotateCcw } from "lucide-react";
import "../styles/OrderResult.css";

const OrderFailure = () => {
  const [searchParams] = useSearchParams();
  const paymentId = searchParams.get("payment_id");
  const externalRef = searchParams.get("external_reference");
  const preferenceId = searchParams.get("preference_id");

  if (!paymentId && !externalRef && !preferenceId) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="order-result-page">
      <motion.div
        className="order-result-card failure"
        initial={{ opacity: 0, scale: 0.85 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.175, 0.885, 0.32, 1.275] }}
      >
        <motion.div
          className="result-icon-wrapper failure-icon"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, duration: 0.5, ease: [0.175, 0.885, 0.32, 1.275] }}
        >
          <XCircle size={64} strokeWidth={1.5} />
          <div className="icon-pulse failure-pulse" />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          Pago No Completado
        </motion.h1>

        <motion.p
          className="result-subtitle"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          No pudimos procesar tu pago. Tu carrito sigue guardado para que puedas intentarlo de nuevo.
        </motion.p>

        <motion.ul
          className="failure-tips"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <li>Verificá que los datos de tu tarjeta sean correctos.</li>
          <li>Comprobá que tengas saldo suficiente.</li>
          <li>Intentá con otro medio de pago.</li>
        </motion.ul>

        <motion.div
          className="result-actions"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Link to="/checkout" className="result-btn primary">
            <RotateCcw size={18} />
            Intentar de Nuevo
          </Link>
          <Link to="/shop" className="result-btn secondary">
            <ShoppingBag size={18} />
            Ir a la Tienda
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default OrderFailure;

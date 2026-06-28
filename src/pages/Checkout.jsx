import { useContext, useState } from "react";
import { useNavigate } from "react-router";
import { motion } from "framer-motion";
import { initMercadoPago, Wallet } from "@mercadopago/sdk-react";
import { CartContext } from "../context/CartContext";
import { AuthContext } from "../context/AuthContext";
import { ShoppingBag, ChevronRight, CheckCircle2 } from "lucide-react";
import api from "../services/api";
import CheckoutForm from "../components/checkout/CheckoutForm";
import CheckoutSummary from "../components/checkout/CheckoutSummary";
import "../styles/checkout/CheckoutLayout.css";

// Inicializar MP una sola vez con la Public Key
initMercadoPago(import.meta.env.VITE_MP_PUBLIC_KEY, { locale: "es-AR" });

const Checkout = () => {
  const { cartItems, subtotal } = useContext(CartContext);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [preferenceId, setPreferenceId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [step, setStep] = useState(1); // 1: Datos, 2: Pagar

  // Si no está logueado, redirigir a login
  if (!user) {
    navigate("/login");
    return null;
  }

  // Si el carrito está vacío, redirigir a la tienda
  if (cartItems.length === 0) {
    navigate("/shop");
    return null;
  }

  const onSubmit = async (formData) => {
    setIsLoading(true);
    setError(null);
    try {
      // 1. Crear la orden en nuestro Backend
      const orderPayload = {
        orderItems: cartItems.map((item) => ({
          product: item._id,
          qty: item.qty,
        })),
        shippingAddress: {
          fullName: formData.fullName,
          address: formData.address,
          city: formData.city,
          province: formData.province,
          postalCode: formData.postalCode,
          phone: formData.phone,
        },
      };

      const { data: order } = await api.post(
        `/api/orders`,
        orderPayload
      );

      // 2. Generar la preferencia de Mercado Pago
      const { data: mpData } = await api.post(
        `/api/orders/mp-preference`,
        { orderId: order._id }
      );

      setPreferenceId(mpData.preferenceId);
      setStep(2);
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.message || "Error al procesar la orden. Intenta nuevamente."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const shipping = 0; // Envío gratis
  const total = subtotal + shipping;

  return (
    <div className="checkout-page">
      {/* Encabezado */}
      <motion.div
        className="checkout-header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1>
          <ShoppingBag size={28} />
          Finalizar Compra
        </h1>
        <div className="checkout-steps">
          <span className={`step-indicator ${step >= 1 ? "active" : ""}`}>
            <span>1</span> Datos de Envío
          </span>
          <ChevronRight size={16} className="step-arrow" />
          <span className={`step-indicator ${step >= 2 ? "active" : ""}`}>
            <span>2</span> Pagar
          </span>
        </div>
      </motion.div>

      <div className="checkout-layout">
        {/* ── Columna Izquierda: Formulario ── */}
        <motion.div
          className="checkout-form-col"
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          {step === 1 ? (
            <CheckoutForm user={user} onSubmit={onSubmit} isLoading={isLoading} apiError={error} />
          ) : (
            <motion.div
              className="checkout-payment-step"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <div className="payment-ready-header">
                <CheckCircle2 size={48} className="payment-check-icon" />
                <h2>¡Todo listo para pagar!</h2>
                <p>Serás redirigido de forma segura a Mercado Pago.</p>
              </div>

              {preferenceId && (
                <div className="mp-wallet-wrapper">
                  <Wallet
                    initialization={{ preferenceId }}
                    customization={{ texts: { valueProp: "smart_option" } }}
                  />
                </div>
              )}

              <button
                className="checkout-back-btn"
                onClick={() => { setStep(1); setPreferenceId(null); }}
              >
                ← Volver y editar datos
              </button>
            </motion.div>
          )}
        </motion.div>

        {/* ── Columna Derecha: Resumen ── */}
        <motion.div
          className="checkout-summary-col"
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <CheckoutSummary cartItems={cartItems} subtotal={subtotal} total={total} />
        </motion.div>
      </div>
    </div>
  );
};

export default Checkout;

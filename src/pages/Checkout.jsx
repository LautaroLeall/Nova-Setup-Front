import { useContext, useState } from "react";
import { useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import { initMercadoPago, Wallet } from "@mercadopago/sdk-react";
import { CartContext } from "../context/CartContext";
import { AuthContext } from "../context/AuthContext";
import { ShoppingBag, MapPin, User, Phone, Lock, ChevronRight, CheckCircle2 } from "lucide-react";
import axios from "axios";
import "../styles/Checkout.css";

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

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      fullName: user ? `${user.firstName || ""} ${user.lastName || ""}`.trim() : "",
    },
  });

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

      const { data: order } = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL || "http://localhost:5000"}/api/orders`,
        orderPayload,
        { headers: { Authorization: `Bearer ${user.token}` } }
      );

      // 2. Generar la preferencia de Mercado Pago
      const { data: mpData } = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL || "http://localhost:5000"}/api/orders/mp-preference`,
        { orderId: order._id },
        { headers: { Authorization: `Bearer ${user.token}` } }
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
            <form onSubmit={handleSubmit(onSubmit)} className="checkout-form">
              <div className="form-section">
                <h2 className="form-section-title">
                  <User size={18} /> Información Personal
                </h2>
                <div className="form-group">
                  <label>Nombre completo</label>
                  <input
                    type="text"
                    placeholder="Ej: Juan García"
                    className={errors.fullName ? "input-error" : ""}
                    {...register("fullName", { required: "El nombre es requerido" })}
                  />
                  {errors.fullName && <span className="field-error">{errors.fullName.message}</span>}
                </div>
                <div className="form-group">
                  <label>Teléfono de contacto</label>
                  <div className="input-with-icon">
                    <Phone size={16} />
                    <input
                      type="tel"
                      placeholder="Ej: +54 9 11 1234-5678"
                      {...register("phone")}
                    />
                  </div>
                </div>
              </div>

              <div className="form-section">
                <h2 className="form-section-title">
                  <MapPin size={18} /> Dirección de Envío
                </h2>
                <div className="form-group">
                  <label>Dirección (calle y número)</label>
                  <input
                    type="text"
                    placeholder="Ej: Av. Corrientes 1234, Piso 3"
                    className={errors.address ? "input-error" : ""}
                    {...register("address", { required: "La dirección es requerida" })}
                  />
                  {errors.address && <span className="field-error">{errors.address.message}</span>}
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Ciudad</label>
                    <input
                      type="text"
                      placeholder="Ej: Buenos Aires"
                      className={errors.city ? "input-error" : ""}
                      {...register("city", { required: "La ciudad es requerida" })}
                    />
                    {errors.city && <span className="field-error">{errors.city.message}</span>}
                  </div>
                  <div className="form-group">
                    <label>Código Postal</label>
                    <input
                      type="text"
                      placeholder="Ej: C1043"
                      className={errors.postalCode ? "input-error" : ""}
                      {...register("postalCode", { required: "El CP es requerido" })}
                    />
                    {errors.postalCode && <span className="field-error">{errors.postalCode.message}</span>}
                  </div>
                </div>
                <div className="form-group">
                  <label>Provincia</label>
                  <select
                    className={errors.province ? "input-error" : ""}
                    {...register("province", { required: "La provincia es requerida" })}
                  >
                    <option value="">Seleccionar provincia...</option>
                    {[
                      "Buenos Aires", "CABA", "Catamarca", "Chaco", "Chubut",
                      "Córdoba", "Corrientes", "Entre Ríos", "Formosa", "Jujuy",
                      "La Pampa", "La Rioja", "Mendoza", "Misiones", "Neuquén",
                      "Río Negro", "Salta", "San Juan", "San Luis", "Santa Cruz",
                      "Santa Fe", "Santiago del Estero", "Tierra del Fuego", "Tucumán"
                    ].map((p) => (
                      <option key={p} value={p}>{p}</option>
                    ))}
                  </select>
                  {errors.province && <span className="field-error">{errors.province.message}</span>}
                </div>
              </div>

              {error && (
                <div className="checkout-error">
                  <span>⚠️ {error}</span>
                </div>
              )}

              <button type="submit" className="checkout-submit-btn" disabled={isLoading}>
                {isLoading ? (
                  <span className="btn-spinner" />
                ) : (
                  <>
                    <Lock size={18} />
                    Continuar al Pago Seguro
                  </>
                )}
              </button>
            </form>
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
          <div className="order-summary-box">
            <h2 className="summary-title">Resumen del Pedido</h2>
            <ul className="summary-items">
              {cartItems.map((item) => (
                <li key={item._id} className="summary-item">
                  <div className="summary-item-img">
                    <img src={item.images[0]} alt={item.name} />
                    <span className="summary-item-qty">{item.qty}</span>
                  </div>
                  <span className="summary-item-name">{item.name}</span>
                  <span className="summary-item-price">
                    ${((item.discountPrice ?? item.price) * item.qty).toFixed(2)}
                  </span>
                </li>
              ))}
            </ul>

            <div className="summary-totals">
              <div className="summary-row">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="summary-row">
                <span>Envío</span>
                <span className="free-shipping">Gratis 🎉</span>
              </div>
              <div className="summary-row total-row">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>

            <div className="summary-security">
              <Lock size={14} />
              <span>Pago 100% seguro con Mercado Pago</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Checkout;

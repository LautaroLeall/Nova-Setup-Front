import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router";
import axios from "axios";
import { User, Package, Calendar, CheckCircle2, Clock, ChevronDown, ChevronUp, AlertCircle, Star, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { showConfirmDialog } from "../utils/swalConfig";
import { sileo } from "sileo";
import "../styles/UserProfile.css";

const UserProfile = () => {
  const { user, updateUserProfile } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const [activeTab, setActiveTab] = useState("orders"); // "orders" | "settings"
  
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedOrderId, setExpandedOrderId] = useState(null);
  
  // Review Modal State
  const [reviewModal, setReviewModal] = useState({ isOpen: false, product: null });
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewedProducts, setReviewedProducts] = useState([]);

  // Profile Form State
  const [formData, setFormData] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    password: "",
    shippingAddress: {
      fullName: user?.shippingAddress?.fullName || "",
      address: user?.shippingAddress?.address || "",
      city: user?.shippingAddress?.city || "",
      postalCode: user?.shippingAddress?.postalCode || "",
      province: user?.shippingAddress?.province || "",
      phone: user?.shippingAddress?.phone || "",
    }
  });
  const [updatingProfile, setUpdatingProfile] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    const fetchMyOrders = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/orders/myorders`, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setOrders(data);
      } catch (err) {
        setError(err.response?.data?.message || "Error al obtener tus pedidos.");
      } finally {
        setLoading(false);
      }
    };

    fetchMyOrders();
  }, [user, navigate]);

  if (!user) return null;

  const toggleExpandOrder = (orderId) => {
    setExpandedOrderId(expandedOrderId === orderId ? null : orderId);
  };

  const handleConfirmDelivery = async (orderId) => {
    const result = await showConfirmDialog(
      "¿Confirmar Recepción?",
      "¿Confirmas que has recibido el producto en buen estado?",
      "Sí, confirmar",
      "Cancelar"
    );
    if (result.isConfirmed) {
      try {
        await axios.put(`${import.meta.env.VITE_BACKEND_URL}/api/orders/${orderId}/confirm-delivery`, {}, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        // Refrescar órdenes
        const { data } = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/orders/myorders`, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setOrders(data);
        sileo.success({
          title: "¡Genial!",
          description: "Has confirmado la recepción del pedido.",
          position: "bottom-right",
        });
      } catch (err) {
        sileo.error({
          title: "Error",
          description: err.response?.data?.message || "Error al confirmar la entrega.",
          position: "bottom-right",
        });
      }
    }
  };

  const openReviewModal = (product) => {
    setRating(5);
    setComment("");
    setReviewModal({ isOpen: true, product });
  };

  const closeReviewModal = () => {
    setReviewModal({ isOpen: false, product: null });
  };

  const submitReviewHandler = async (e) => {
    e.preventDefault();
    if (!reviewModal.product) return;
    setSubmittingReview(true);
    try {
      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/products/${reviewModal.product._id}/reviews`,
        { rating, comment, orderId: reviewModal.product.orderId },
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      sileo.success({
        title: "¡Gracias!",
        description: "Tu reseña ha sido publicada con éxito.",
        position: "bottom-right",
      });
      setReviewedProducts([...reviewedProducts, `${reviewModal.product.orderId}-${reviewModal.product._id}`]);
      closeReviewModal();
    } catch (err) {
      if (err.response?.status === 400 && err.response?.data?.message.includes("Ya has calificado")) {
        sileo.info({
          title: "Atención",
          description: "Ya has calificado este producto en esta compra anteriormente.",
          position: "bottom-right",
        });
        setReviewedProducts([...reviewedProducts, `${reviewModal.product.orderId}-${reviewModal.product._id}`]);
        closeReviewModal();
      } else {
        sileo.error({
          title: "Error",
          description: err.response?.data?.message || "Error al enviar la reseña.",
          position: "bottom-right",
        });
      }
    } finally {
      setSubmittingReview(false);
    }
  };

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith("shipping_")) {
      const field = name.replace("shipping_", "");
      setFormData(prev => ({
        ...prev,
        shippingAddress: { ...prev.shippingAddress, [field]: value }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const submitProfileUpdate = async (e) => {
    e.preventDefault();
    setUpdatingProfile(true);
    const result = await updateUserProfile(formData);
    setUpdatingProfile(false);
    
    if (result.success) {
      sileo.success({
        title: "Perfil Actualizado",
        description: "Tus datos se guardaron correctamente.",
        position: "bottom-right",
      });
      setFormData(prev => ({ ...prev, password: "" })); // Clear password field
    } else {
      sileo.error({
        title: "Error",
        description: result.error || "No se pudo actualizar el perfil.",
        position: "bottom-right",
      });
    }
  };

  return (
    <div className="profile-page">
      <div className="profile-container">
        
        {/* Columna Izquierda: Info de Usuario */}
        <motion.aside 
          className="profile-sidebar"
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="profile-card">
            <div className="profile-avatar">
              <User size={48} />
            </div>
            <h2 className="profile-name">{user.firstName} {user.lastName}</h2>
            <p className="profile-email">{user.email}</p>
            <div className="profile-badge">
              {user.isAdmin ? "Administrador" : "Cliente"}
            </div>
            
            <div style={{ marginTop: '2rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <button 
                onClick={() => setActiveTab("orders")}
                style={{ 
                  background: activeTab === "orders" ? 'var(--color-nova-cyan)' : 'transparent',
                  color: activeTab === "orders" ? 'black' : 'white',
                  border: activeTab === "orders" ? 'none' : '1px solid rgba(255,255,255,0.2)',
                  padding: '0.8rem', borderRadius: '0.5rem', cursor: 'pointer', fontWeight: 'bold', transition: 'all 0.2s',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem'
                }}
              >
                <Package size={16} /> Mis Pedidos
              </button>
              <button 
                onClick={() => setActiveTab("settings")}
                style={{ 
                  background: activeTab === "settings" ? 'var(--color-nova-cyan)' : 'transparent',
                  color: activeTab === "settings" ? 'black' : 'white',
                  border: activeTab === "settings" ? 'none' : '1px solid rgba(255,255,255,0.2)',
                  padding: '0.8rem', borderRadius: '0.5rem', cursor: 'pointer', fontWeight: 'bold', transition: 'all 0.2s',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem'
                }}
              >
                <User size={16} /> Configuración de Perfil
              </button>
            </div>
          </div>
        </motion.aside>

        {/* Columna Derecha: Contenido Dinámico */}
        <motion.main 
          className="profile-main"
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          {activeTab === "orders" && (
            <>
              <h1 className="profile-title">Historial de Pedidos</h1>
              <p className="profile-subtitle">Revisa el estado de tus compras en tiempo real</p>

              {loading ? (
                <div className="profile-loading">
                  <div className="profile-spinner" />
                  <p>Cargando tus pedidos...</p>
                </div>
              ) : error ? (
                <div className="profile-error">
                  <AlertCircle size={20} />
                  <span>{error}</span>
                </div>
              ) : orders.length === 0 ? (
                <div className="profile-empty">
                  <Package size={48} />
                  <h3>Aún no has realizado compras</h3>
                  <button className="btn-shop-now" onClick={() => navigate("/shop")}>
                    Ir a la Tienda
                  </button>
                </div>
              ) : (
                <div className="orders-list">
                  {orders.map((order) => {
                    const isExpanded = expandedOrderId === order._id;
                    return (
                      <div key={order._id} className="order-card-wrapper">
                        <div 
                          className={`order-header-card ${isExpanded ? "active" : ""}`}
                          onClick={() => toggleExpandOrder(order._id)}
                        >
                          <div className="order-summary-info">
                            <div className="info-block">
                              <span className="block-label">ID PEDIDO</span>
                              <span className="block-val font-mono">#{order._id.slice(-8).toUpperCase()}</span>
                            </div>
                            <div className="info-block">
                              <span className="block-label">FECHA</span>
                              <span className="block-val text-xs align-middle">
                                <Calendar size={13} className="inline mr-1" />
                                {new Date(order.createdAt).toLocaleDateString()}
                              </span>
                            </div>
                            <div className="info-block">
                              <span className="block-label">TOTAL</span>
                              <span className="block-val font-bold">${order.totalPrice.toFixed(2)}</span>
                            </div>
                          </div>

                          <div className="order-status-badges">
                            {/* Estado del pago */}
                            <div className={`status-pill ${order.isPaid ? "paid" : "pending"}`}>
                              {order.isPaid ? <CheckCircle2 size={13} /> : <Clock size={13} />}
                              <span>{order.isPaid ? "Pagado" : "Pendiente"}</span>
                            </div>

                            {/* Estado del envío */}
                            <div className={`status-pill ${order.isDelivered ? "delivered" : "pending-delivery"}`}>
                              {order.isDelivered ? <CheckCircle2 size={13} /> : <Package size={13} />}
                              <span>{order.isDelivered ? "Entregado" : "Pendiente de Envío"}</span>
                            </div>
                            
                            <button className="btn-toggle-expand" type="button" aria-label="Ver detalles">
                              {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                            </button>
                          </div>
                        </div>

                        <AnimatePresence>
                          {isExpanded && (
                            <motion.div 
                              className="order-detail-expanded"
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.3 }}
                            >
                              <div className="detail-inner">
                                <h4 className="detail-section-title">Productos en este pedido</h4>
                                <ul className="detail-items-list">
                                  {order.orderItems.map((item, idx) => {
                                    const isReviewed = item.isReviewed || reviewedProducts.includes(`${order._id}-${item.product}`);
                                    return (
                                      <li key={idx} className="detail-item">
                                        <img src={item.image} alt={item.name} className="detail-item-img" />
                                        <div className="detail-item-info">
                                          <span className="item-name">{item.name}</span>
                                          <span className="item-qty">Cantidad: {item.qty}</span>
                                        </div>
                                        <div className="detail-item-actions">
                                          <span className="item-price">${(item.price * item.qty).toFixed(2)}</span>
                                          {order.isUserConfirmed && (
                                            <button 
                                              className="btn-review-item" 
                                              onClick={() => openReviewModal({ _id: item.product, name: item.name, orderId: order._id })}
                                              disabled={isReviewed}
                                              style={{
                                                marginTop: '0.5rem',
                                                padding: '0.4rem 0.8rem',
                                                fontSize: '0.8rem',
                                                background: isReviewed ? 'rgba(255,255,255,0.1)' : 'var(--color-nova-cyan)',
                                                color: isReviewed ? '#888' : 'black',
                                                border: 'none',
                                                borderRadius: '0.3rem',
                                                cursor: isReviewed ? 'not-allowed' : 'pointer',
                                                fontWeight: 'bold'
                                              }}
                                            >
                                              {isReviewed ? "Ya Reseñado" : "Calificar"}
                                            </button>
                                          )}
                                        </div>
                                      </li>
                                    );
                                  })}
                                </ul>

                                <div className="detail-grid">
                                  <div className="shipping-info-block">
                                    <h4 className="detail-section-title">Dirección de Envío</h4>
                                    <p><strong>Nombre:</strong> {order.shippingAddress.fullName}</p>
                                    <p><strong>Dirección:</strong> {order.shippingAddress.address}</p>
                                    <p><strong>Ciudad:</strong> {order.shippingAddress.city}, {order.shippingAddress.province}</p>
                                    <p><strong>C.P.:</strong> {order.shippingAddress.postalCode}</p>
                                    <p><strong>Teléfono:</strong> {order.shippingAddress.phone || "No provisto"}</p>
                                  </div>
                                  <div className="shipping-status-block">
                                    <h4 className="detail-section-title">Resumen de Pago y Entrega</h4>
                                    <p><strong>Método:</strong> Mercado Pago</p>
                                    {order.isPaid ? (
                                      <>
                                        <p className="paid-timestamp"><strong>Pagado el:</strong> {new Date(order.paidAt).toLocaleString()}</p>
                                        {order.paymentResult?.mp_payment_id && (
                                          <p className="trans-ref"><strong>Ref Transacción:</strong> #{order.paymentResult.mp_payment_id}</p>
                                        )}
                                      </>
                                    ) : (
                                      <p className="pending-notice">Pago pendiente. Recuerda completar tu pago desde el brick de Mercado Pago.</p>
                                    )}

                                    <div className="divider-admin-light" style={{ margin: '1rem 0' }} />
                                    
                                    {order.isDelivered && !order.isUserConfirmed && (
                                      <div className="confirm-delivery-box" style={{ background: 'rgba(58, 219, 241, 0.05)', padding: '1rem', borderRadius: '0.5rem', border: '1px solid rgba(58, 219, 241, 0.2)', marginTop: '1rem' }}>
                                        <p style={{ fontSize: '0.85rem', marginBottom: '0.75rem' }}>El administrador ha marcado este pedido como enviado/entregado. Por favor confirma la recepción una vez que lo tengas en tus manos.</p>
                                        <button 
                                          onClick={() => handleConfirmDelivery(order._id)}
                                          style={{ background: 'var(--color-nova-cyan)', color: 'black', padding: '0.6rem 1rem', borderRadius: '0.5rem', fontWeight: 'bold', width: '100%', border: 'none', cursor: 'pointer' }}
                                        >
                                          Confirmar Recepción
                                        </button>
                                      </div>
                                    )}
                                    
                                    {order.isUserConfirmed && (
                                      <div className="confirmed-delivery-box" style={{ background: 'rgba(16, 185, 129, 0.1)', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid rgba(16, 185, 129, 0.3)', marginTop: '1rem', color: '#10b981', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem' }}>
                                        <CheckCircle2 size={16} />
                                        <span>Recepción Confirmada por ti</span>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    );
                  })}
                </div>
              )}
            </>
          )}

          
          {activeTab === "settings" && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="profile-settings-section"
            >
              <h1 className="profile-title">Configuración de Perfil</h1>
              <p className="profile-subtitle">Actualiza tus datos personales y dirección de envío predeterminada</p>
              
              <form onSubmit={submitProfileUpdate} style={{ background: 'var(--color-dark-surface)', padding: '2rem', borderRadius: '1rem', border: '1px solid rgba(255,255,255,0.1)', marginTop: '2rem' }}>
                <h3 style={{ marginBottom: '1rem', color: 'var(--color-nova-cyan)' }}>Datos Personales</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: '#ccc' }}>Nombre</label>
                    <input type="text" name="firstName" value={formData.firstName} onChange={handleProfileChange} required style={{ width: '100%', padding: '0.8rem', borderRadius: '0.5rem', background: '#111', border: '1px solid #333', color: 'white' }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: '#ccc' }}>Apellido</label>
                    <input type="text" name="lastName" value={formData.lastName} onChange={handleProfileChange} required style={{ width: '100%', padding: '0.8rem', borderRadius: '0.5rem', background: '#111', border: '1px solid #333', color: 'white' }} />
                  </div>
                </div>
                
                <div style={{ marginBottom: '2rem' }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: '#ccc' }}>Nueva Contraseña (opcional)</label>
                  <input type="password" name="password" placeholder="Dejar en blanco para no cambiar" value={formData.password} onChange={handleProfileChange} style={{ width: '100%', padding: '0.8rem', borderRadius: '0.5rem', background: '#111', border: '1px solid #333', color: 'white' }} />
                  <small style={{ color: '#888', marginTop: '0.5rem', display: 'block' }}>Si te registraste con Google, establecer una contraseña aquí te permitirá iniciar sesión con correo tradicional también.</small>
                </div>

                <h3 style={{ marginBottom: '1rem', color: 'var(--color-nova-cyan)' }}>Dirección de Envío Predeterminada</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1rem', marginBottom: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: '#ccc' }}>Nombre Completo del Receptor</label>
                    <input type="text" name="shipping_fullName" value={formData.shippingAddress.fullName} onChange={handleProfileChange} style={{ width: '100%', padding: '0.8rem', borderRadius: '0.5rem', background: '#111', border: '1px solid #333', color: 'white' }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: '#ccc' }}>Dirección (Calle y Número)</label>
                    <input type="text" name="shipping_address" value={formData.shippingAddress.address} onChange={handleProfileChange} style={{ width: '100%', padding: '0.8rem', borderRadius: '0.5rem', background: '#111', border: '1px solid #333', color: 'white' }} />
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: '#ccc' }}>Ciudad</label>
                    <input type="text" name="shipping_city" value={formData.shippingAddress.city} onChange={handleProfileChange} style={{ width: '100%', padding: '0.8rem', borderRadius: '0.5rem', background: '#111', border: '1px solid #333', color: 'white' }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: '#ccc' }}>Provincia / Estado</label>
                    <input type="text" name="shipping_province" value={formData.shippingAddress.province} onChange={handleProfileChange} style={{ width: '100%', padding: '0.8rem', borderRadius: '0.5rem', background: '#111', border: '1px solid #333', color: 'white' }} />
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '2rem' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: '#ccc' }}>Código Postal</label>
                    <input type="text" name="shipping_postalCode" value={formData.shippingAddress.postalCode} onChange={handleProfileChange} style={{ width: '100%', padding: '0.8rem', borderRadius: '0.5rem', background: '#111', border: '1px solid #333', color: 'white' }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: '#ccc' }}>Teléfono de Contacto</label>
                    <input type="text" name="shipping_phone" value={formData.shippingAddress.phone} onChange={handleProfileChange} style={{ width: '100%', padding: '0.8rem', borderRadius: '0.5rem', background: '#111', border: '1px solid #333', color: 'white' }} />
                  </div>
                </div>

                <button 
                  type="submit" 
                  disabled={updatingProfile}
                  style={{ background: 'var(--color-nova-cyan)', color: 'black', padding: '1rem', borderRadius: '0.5rem', fontWeight: 'bold', width: '100%', border: 'none', cursor: updatingProfile ? 'not-allowed' : 'pointer', fontSize: '1rem', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem' }}
                >
                  {updatingProfile ? <span className="spinner-small" style={{ borderColor: 'black', borderTopColor: 'transparent' }} /> : null}
                  {updatingProfile ? "Guardando..." : "Guardar Cambios"}
                </button>
              </form>
            </motion.div>
          )}
        </motion.main>
      </div>

      {/* Modal de Reseña */}
      {reviewModal.isOpen && (
        <div className="review-modal-overlay">
          <motion.div 
            className="review-modal-content"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <button className="review-modal-close" onClick={closeReviewModal}>
              <X size={24} />
            </button>
            <h3>Calificar {reviewModal.product?.name}</h3>
            <p>Comparte tu experiencia con este producto para ayudar a otros.</p>
            
            <form onSubmit={submitReviewHandler} className="review-modal-form">
              <div className="star-rating-input">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    size={32}
                    style={{ cursor: "pointer", transition: "all 0.2s" }}
                    fill={star <= rating ? "var(--color-nova-cyan)" : "none"}
                    color={star <= rating ? "var(--color-nova-cyan)" : "rgba(255, 255, 255, 0.4)"}
                    onClick={() => setRating(star)}
                  />
                ))}
              </div>
              <textarea
                placeholder="Escribe tu reseña aquí (opcional)..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows="4"
              />
              <button type="submit" disabled={submittingReview} className="btn-submit-review">
                {submittingReview ? "Enviando..." : "Enviar Calificación"}
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default UserProfile;

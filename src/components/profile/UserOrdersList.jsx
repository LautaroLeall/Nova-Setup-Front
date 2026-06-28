import { Package, Calendar, CheckCircle2, Clock, ChevronDown, ChevronUp, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import "../../styles/profile/UserOrdersList.css";

export const UserOrdersList = ({
  loading,
  error,
  orders,
  navigate,
  expandedOrderId,
  toggleExpandOrder,
  reviewedProducts,
  openReviewModal,
  handleConfirmDelivery
}) => {
  return (
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
                      <span className="block-val orders-font-mono">#{order._id.slice(-8).toUpperCase()}</span>
                    </div>
                    <div className="info-block">
                      <span className="block-label">FECHA</span>
                      <span className="block-val orders-text-small">
                        <Calendar size={13} className="orders-inline-icon" />
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
                                      className={`orders-review-btn ${isReviewed ? 'orders-review-btn--done' : 'orders-review-btn--pending'}`}
                                      onClick={() => openReviewModal({ _id: item.product, name: item.name, orderId: order._id })}
                                      disabled={isReviewed}
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
                            <h4 className="detail-section-title">
                              Resumen de Pago y Entrega
                            </h4>
                            <p><strong>Método:</strong> Mercado Pago</p>
                            {order.isPaid ? (
                              <>
                                <p className="paid-timestamp"><strong>Pagado el:</strong> {new Date(order.paidAt).toLocaleString()}</p>
                                {order.paymentResult?.mp_payment_id && (
                                  <p className="trans-ref"><strong>Ref Transacción:</strong> #{order.paymentResult.mp_payment_id}</p>
                                )}
                              </>
                            ) : (
                              <p className="pending-notice">
                                Pago pendiente. Recuerda completar tu pago desde el brick de Mercado Pago.
                              </p>
                            )}

                            <div className="divider-admin-light orders-list-divider" />

                            {order.isDelivered && !order.isUserConfirmed && (
                              <div className="orders-confirm-box">
                                <p className="orders-confirm-text">
                                  El administrador ha marcado este pedido como enviado/entregado. Por favor confirma la recepción una vez que lo tengas en tus manos.
                                </p>
                                <button
                                  onClick={() => handleConfirmDelivery(order._id)}
                                  className="orders-confirm-btn"
                                >
                                  Confirmar Recepción
                                </button>
                              </div>
                            )}

                            {order.isUserConfirmed && (
                              <div className="orders-delivery-confirmed-box">
                                <CheckCircle2 size={16} />
                                <span>
                                  Recepción Confirmada por ti
                                </span>
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
  );
};

export default UserOrdersList;

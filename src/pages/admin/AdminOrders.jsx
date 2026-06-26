import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate, Link } from "react-router";
import axios from "axios";
import { Truck, ChevronDown, ChevronUp } from "lucide-react";
import { showConfirmDialog, showSuccessAlert, showErrorAlert } from "../../utils/swalConfig";
import "../../styles/Admin.css";

const AdminOrders = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedOrderId, setExpandedOrderId] = useState(null);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      const { data } = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/orders`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setOrders(data);
    } catch (err) {
      setError(err.response?.data?.message || "Error al obtener pedidos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user || !user.isAdmin) {
      navigate("/");
      return;
    }
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, navigate]);

  if (!user || !user.isAdmin) return null;

  const toggleExpandOrder = (orderId) => {
    setExpandedOrderId(expandedOrderId === orderId ? null : orderId);
  };

  const handleStatusChange = async (orderId, updates) => {
    let actionText = "";
    if (updates.isPaid !== undefined) {
      actionText = updates.isPaid ? "marcar como Pagado" : "marcar como Pendiente de Pago";
    } else if (updates.isDelivered !== undefined) {
      actionText = updates.isDelivered ? "marcar como Enviado/Entregado" : "marcar como Pendiente de Envío";
    }

    const result = await showConfirmDialog(
      "¿Actualizar Estado?",
      `¿Estás seguro de que deseas ${actionText} este pedido?`,
      "Sí, actualizar",
      "Cancelar"
    );

    if (!result.isConfirmed) return;

    try {
      await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/api/orders/${orderId}/status`,
        updates,
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      showSuccessAlert("Actualizado", "El estado del pedido se ha actualizado correctamente.");
      fetchOrders();
    } catch (err) {
      showErrorAlert("Error", err.response?.data?.message || "Error al actualizar estado");
    }
  };

  return (
    <div className="admin-page">
      <div className="admin-container">
        
        {/* Barra de Navegación del Panel Admin */}
        <aside className="admin-sidebar">
          <div className="admin-menu-box">
            <h3 className="admin-menu-title">Panel Control</h3>
            <ul className="admin-menu-list">
              <li>
                <Link to="/admin/dashboard" className="admin-menu-btn">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link to="/admin/products" className="admin-menu-btn">
                  Productos
                </Link>
              </li>
              <li>
                <Link to="/admin/orders" className="admin-menu-btn active">
                  Pedidos
                </Link>
              </li>
              <li>
                <Link to="/admin/users" className="admin-menu-btn">
                  Usuarios
                </Link>
              </li>
            </ul>
          </div>
        </aside>

        {/* Contenido Principal */}
        <main className="admin-main">
          <h1 className="admin-title">Gestión de Pedidos</h1>
          <p className="admin-subtitle">Rastrea, audita y gestiona los envíos de los clientes</p>

          <div className="admin-section-box">
            {loading ? (
              <div className="admin-loading">
                <div className="admin-spinner" />
                <p>Cargando pedidos...</p>
              </div>
            ) : error ? (
              <div className="admin-error">{error}</div>
            ) : orders.length === 0 ? (
              <div className="admin-empty">Aún no se han registrado pedidos en la tienda.</div>
            ) : (
              <div className="table-wrapper">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>ID Pedido</th>
                      <th>Cliente</th>
                      <th>Fecha</th>
                      <th>Total</th>
                      <th>Pago</th>
                      <th>Envío</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((order) => {
                      const isExpanded = expandedOrderId === order._id;
                      return (
                        <Fragment key={order._id}>
                          <tr className="row-order-header">
                            <td className="font-mono text-xs">#{order._id.slice(-8).toUpperCase()}</td>
                            <td>
                              <div className="client-cell-info">
                                <strong>{order.user ? `${order.user.firstName} ${order.user.lastName}` : "Usuario Eliminado"}</strong>
                                <span className="text-xs text-white/40 block">{order.user?.email}</span>
                              </div>
                            </td>
                            <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                            <td className="font-bold">${order.totalPrice.toFixed(2)}</td>
                            <td>
                              <span className={`badge-pago ${order.isPaid ? "pagado" : "pendiente"}`}>
                                {order.isPaid ? "Pagado" : "Pendiente"}
                              </span>
                            </td>
                            <td>
                              <span className={`badge-envio ${order.isDelivered ? "enviado" : "pendiente"}`}>
                                {order.isDelivered ? "Enviado" : "Pendiente"}
                              </span>
                            </td>
                            <td>
                              <div className="actions-cell-buttons">
                                <button
                                  className="btn-action-expand"
                                  onClick={() => toggleExpandOrder(order._id)}
                                >
                                  {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                                </button>
                              </div>
                            </td>
                          </tr>

                          {/* Fila expandida de detalles */}
                          {isExpanded && (
                            <tr className="row-order-detail-expanded">
                              <td colSpan="7">
                                <div className="order-detail-expanded-admin">
                                  <div className="detail-admin-columns">
                                    
                                    {/* Columna Izquierda: Productos e info */}
                                    <div className="detail-admin-col">
                                      <h4 className="detail-title-small">Productos</h4>
                                      <ul className="items-list-admin">
                                        {order.orderItems.map((item, idx) => (
                                          <li key={idx} className="item-row-admin">
                                            <img src={item.image} alt={item.name} className="item-thumb-admin" />
                                            <div className="item-details-admin">
                                              <span>{item.name}</span>
                                              <span className="qty-tag-admin">x{item.qty} a ${item.price.toFixed(2)}</span>
                                            </div>
                                            <span className="item-subtotal-admin">${(item.price * item.qty).toFixed(2)}</span>
                                          </li>
                                        ))}
                                      </ul>
                                    </div>

                                    {/* Columna Derecha: Dirección y Pago */}
                                    <div className="detail-admin-col border-left-admin">
                                      <h4 className="detail-title-small">Envío y Facturación</h4>
                                      <div className="detail-text-info-admin">
                                        <p><strong>Destinatario:</strong> {order.shippingAddress.fullName}</p>
                                        <p><strong>Dirección:</strong> {order.shippingAddress.address}</p>
                                        <p><strong>Ubicación:</strong> {order.shippingAddress.city}, {order.shippingAddress.province}</p>
                                        <p><strong>C.P.:</strong> {order.shippingAddress.postalCode}</p>
                                        <p><strong>Teléfono:</strong> {order.shippingAddress.phone || "N/A"}</p>
                                        
                                        <hr style={{ borderColor: 'rgba(255,255,255,0.1)', margin: '1rem 0' }}/>
                                        
                                        <h4 className="detail-title-small" style={{ marginTop: '1rem' }}>Gestión de Estados</h4>
                                        <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
                                          <div style={{ flex: 1 }}>
                                            <label style={{ display: 'block', fontSize: '0.8rem', color: '#888', marginBottom: '0.2rem' }}>Estado de Pago</label>
                                            {order.isPaid ? (
                                              <div style={{ display: 'flex', alignItems: 'center', height: '38px' }}>
                                                <span className="badge-pago pagado" style={{ width: '100%', justifyContent: 'center', padding: '0.5rem' }}>
                                                  Pagado
                                                </span>
                                              </div>
                                            ) : (
                                              <select 
                                                value={order.isPaid.toString()}
                                                onChange={(e) => handleStatusChange(order._id, { isPaid: e.target.value === 'true' })}
                                                style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', background: '#222', color: 'white', border: '1px solid #444' }}
                                              >
                                                <option value="false">Pendiente</option>
                                                <option value="true">Pagado</option>
                                              </select>
                                            )}
                                          </div>
                                          <div style={{ flex: 1 }}>
                                            <label style={{ display: 'block', fontSize: '0.8rem', color: '#888', marginBottom: '0.2rem' }}>Estado de Envío</label>
                                            {order.isDelivered || order.isUserConfirmed ? (
                                              <div style={{ display: 'flex', alignItems: 'center', height: '38px' }}>
                                                <span className="badge-envio enviado" style={{ width: '100%', justifyContent: 'center', padding: '0.5rem' }}>
                                                  Enviado / Entregado
                                                </span>
                                              </div>
                                            ) : (
                                              <select 
                                                value={order.isDelivered.toString()}
                                                onChange={(e) => handleStatusChange(order._id, { isDelivered: e.target.value === 'true' })}
                                                style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', background: '#222', color: 'white', border: '1px solid #444' }}
                                              >
                                                <option value="false">Pendiente</option>
                                                <option value="true">Enviado / Entregado</option>
                                              </select>
                                            )}
                                          </div>
                                        </div>
                                        {order.isUserConfirmed && (
                                          <div style={{ marginTop: '1rem', padding: '0.5rem', background: 'rgba(16, 185, 129, 0.1)', border: '1px solid #10b981', color: '#10b981', borderRadius: '4px', textAlign: 'center', fontSize: '0.85rem' }}>
                                            El usuario ha confirmado la recepción del producto.
                                          </div>
                                        )}
                                        <div className="payment-data-box-admin" style={{ marginTop: '1rem' }}>
                                          <h5>Datos Mercado Pago</h5>
                                          <p><strong>ID Transacción:</strong> {order.paymentResult?.mp_payment_id || "N/A"}</p>
                                          <p><strong>Estado MP:</strong> {order.paymentResult?.mp_status || "N/A"}</p>
                                          <p><strong>Tipo Pago:</strong> {order.paymentResult?.mp_payment_type || "N/A"}</p>
                                        </div>
                                      </div>
                                    </div>

                                  </div>
                                </div>
                              </td>
                            </tr>
                          )}
                        </Fragment>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

// Necesitamos importar Fragment para poder renderizar tr hermanos en map
import { Fragment } from "react";

export default AdminOrders;

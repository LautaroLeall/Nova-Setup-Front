import "../../styles/admin/AdminOrderDetails.css";

const OrderDetailsExpanded = ({ order, handleStatusChange }) => {
  return (
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

                <hr className="detail-divider-admin" />

                <h4 className="detail-title-small detail-title-mt">Gestión de Estados</h4>
                <div className="detail-status-row">
                  <div className="detail-status-col">
                    <label className="detail-status-label">Estado de Pago</label>
                    {order.status === "cancelled" ? (
                      <div className="detail-status-display">
                        <span className="badge-pago cancelado detail-badge-full" style={{ backgroundColor: '#ef4444', color: 'white', border: '1px solid #dc2626' }}>Cancelado</span>
                      </div>
                    ) : order.isPaid ? (
                      <div className="detail-status-display">
                        <span className="badge-pago pagado detail-badge-full">Pagado</span>
                      </div>
                    ) : (
                      <select
                        value={order.isPaid.toString()}
                        onChange={(e) => {
                          if (e.target.value === 'cancelled') {
                            handleStatusChange(order._id, { status: 'cancelled' });
                          } else {
                            handleStatusChange(order._id, { isPaid: e.target.value === 'true' });
                          }
                        }}
                        className="detail-status-select"
                      >
                        <option value="false">Pendiente</option>
                        <option value="true">Pagado</option>
                        <option value="cancelled">Cancelado</option>
                      </select>
                    )}
                  </div>
                  <div className="detail-status-col">
                    <label className="detail-status-label">Estado de Envío</label>
                    {order.status === "cancelled" ? (
                      <div className="detail-status-display">
                        <span className="badge-envio cancelado detail-badge-full" style={{ backgroundColor: '#ef4444', color: 'white', border: '1px solid #dc2626' }}>Cancelado</span>
                      </div>
                    ) : order.isDelivered || order.isUserConfirmed ? (
                      <div className="detail-status-display">
                        <span className="badge-envio enviado detail-badge-full">Enviado / Entregado</span>
                      </div>
                    ) : (
                      <select
                        value={order.isDelivered.toString()}
                        onChange={(e) => handleStatusChange(order._id, { isDelivered: e.target.value === 'true' })}
                        className="detail-status-select"
                      >
                        <option value="false">Pendiente</option>
                        <option value="true">Enviado / Entregado</option>
                      </select>
                    )}
                  </div>
                </div>
                {order.isUserConfirmed && (
                  <div className="detail-user-confirmed-box">
                    El usuario ha confirmado la recepción del producto.
                  </div>
                )}
                <div className="payment-data-box-admin">
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
  );
};

export default OrderDetailsExpanded;

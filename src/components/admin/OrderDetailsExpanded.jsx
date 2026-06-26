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

                <hr style={{ borderColor: 'rgba(255,255,255,0.1)', margin: '1rem 0' }} />

                <h4 className="detail-title-small" style={{ marginTop: '1rem' }}>Gestión de Estados</h4>
                <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
                  <div style={{ flex: 1 }}>
                    <label style={{ display: 'block', fontSize: '0.8rem', color: '#888', marginBottom: '0.2rem' }}>Estado de Pago</label>
                    {order.isPaid ? (
                      <div style={{ display: 'flex', alignItems: 'center', height: '38px' }}>
                        <span className="badge-pago pagado" style={{ display: 'flex', width: '100%', justifyContent: 'center', alignItems: 'center', padding: '0.5rem', textAlign: 'center' }}>
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
                        <span className="badge-envio enviado" style={{ display: 'flex', width: '100%', justifyContent: 'center', alignItems: 'center', padding: '0.5rem', textAlign: 'center' }}>
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
  );
};

export default OrderDetailsExpanded;

import { Fragment, useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import OrderDetailsExpanded from "./OrderDetailsExpanded";
import api from "../../services/api";
import { showConfirmDialog, showSuccessAlert, showErrorAlert } from "../../utils/swalConfig";

const OrderListTable = ({ orders, fetchOrders }) => {
  const [expandedOrderId, setExpandedOrderId] = useState(null);

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
      await api.put(
        `/api/orders/${orderId}/status`,
        updates
      );
      showSuccessAlert("Actualizado", "El estado del pedido se ha actualizado correctamente.");
      fetchOrders();
    } catch (err) {
      showErrorAlert("Error", err.response?.data?.message || "Error al actualizar estado");
    }
  };

  return (
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

                {isExpanded && (
                  <OrderDetailsExpanded
                    order={order}
                    handleStatusChange={handleStatusChange}
                  />
                )}
              </Fragment>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default OrderListTable;

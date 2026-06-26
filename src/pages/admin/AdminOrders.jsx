import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router";
import api from "../../services/api";
import AdminSidebar from "../../components/admin/AdminSidebar";
import OrderListTable from "../../components/admin/OrderListTable";
import "../../styles/Admin.css";

const AdminOrders = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      const { data } = await api.get(`/api/orders`);
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
  }, [user, navigate]);

  if (!user || !user.isAdmin) return null;

  return (
    <div className="admin-page">
      <div className="admin-container">
        {/* Barra de Navegación del Panel Admin */}
        <AdminSidebar />

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
              <OrderListTable orders={orders} fetchOrders={fetchOrders} user={user} />
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminOrders;

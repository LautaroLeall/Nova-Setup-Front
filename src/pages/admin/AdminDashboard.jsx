import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router";
import api from "../../services/api";
import AdminSidebar from "../../components/admin/AdminSidebar";
import DashboardStats from "../../components/admin/DashboardStats";
import RecentOrdersTable from "../../components/admin/RecentOrdersTable";
import "../../styles/admin/AdminLayout.css";

const AdminDashboard = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [usersCount, setUsersCount] = useState(0);
  const [productsCount, setProductsCount] = useState(0);
  const [totalStock, setTotalStock] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [ordersRes, usersRes, productsRes] = await Promise.all([
        api.get(`/api/orders`),
        api.get(`/api/users`),
        api.get(`/api/products?pageSize=0`)
      ]);

      setOrders(ordersRes.data);
      setUsersCount(usersRes.data.length);
      setProductsCount(productsRes.data.total);
      setTotalStock(productsRes.data.products.reduce((acc, product) => acc + (product.countInStock || 0), 0));
    } catch (err) {
      setError(err.response?.data?.message || "Error al obtener estadísticas");
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
    fetchDashboardData();
  }, [user, navigate]);

  if (!user || !user.isAdmin) return null;

  // Cálculos estadísticos
  const totalSales = orders
    .filter((order) => order.isPaid)
    .reduce((acc, order) => acc + order.totalPrice, 0);

  const totalOrdersCount = orders.length;
  const pendingShipmentCount = orders.filter((o) => o.isPaid && !o.isDelivered).length;

  const recentOrders = orders.slice(0, 5);

  return (
    <div className="admin-page">
      <div className="admin-container">
        {/* Barra de Navegación del Panel Admin */}
        <AdminSidebar />

        {/* Contenido Principal */}
        <main className="admin-main">
          <h1 className="admin-title">Dashboard General</h1>
          <p className="admin-subtitle">Estadísticas clave del negocio y ventas</p>

          {loading ? (
            <div className="admin-loading">
              <div className="admin-spinner" />
              <p>Cargando estadísticas...</p>
            </div>
          ) : error ? (
            <div className="admin-error">{error}</div>
          ) : (
            <>
              {/* Tarjetas de estadísticas separadas en su propio componente */}
              <DashboardStats
                usersCount={usersCount}
                totalOrdersCount={totalOrdersCount}
                pendingShipmentCount={pendingShipmentCount}
                totalSales={totalSales}
                productsCount={productsCount}
                totalStock={totalStock}
              />

              {/* Tabla de órdenes recientes separada en su propio componente */}
              <RecentOrdersTable recentOrders={recentOrders} fetchOrders={fetchDashboardData} user={user} />
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;

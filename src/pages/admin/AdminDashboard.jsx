import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate, Link } from "react-router";
import axios from "axios";
import { DollarSign, ShoppingBag, Clock, Users, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import "../../styles/Admin.css";

const AdminDashboard = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [usersCount, setUsersCount] = useState(0);
  const [productsCount, setProductsCount] = useState(0);
  const [totalStock, setTotalStock] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user || !user.isAdmin) {
      navigate("/");
      return;
    }

    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const headers = { Authorization: `Bearer ${user.token}` };
        
        const [ordersRes, usersRes, productsRes] = await Promise.all([
          axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/orders`, { headers }),
          axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/users`, { headers }),
          axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/products?pageSize=0`)
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
        <aside className="admin-sidebar">
          <div className="admin-menu-box">
            <h3 className="admin-menu-title">Panel Control</h3>
            <ul className="admin-menu-list">
              <li>
                <Link to="/admin/dashboard" className="admin-menu-btn active">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link to="/admin/products" className="admin-menu-btn">
                  Productos
                </Link>
              </li>
              <li>
                <Link to="/admin/orders" className="admin-menu-btn">
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
              {/* Tarjetas de estadísticas */}
              <div className="stats-grid">
                <motion.div 
                  className="stat-card"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="stat-icon-wrapper clients">
                    <Users size={22} />
                  </div>
                  <div className="stat-info">
                    <span className="stat-label">Total Usuarios</span>
                    <span className="stat-value">{usersCount}</span>
                  </div>
                </motion.div>

                <motion.div 
                  className="stat-card"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.05 }}
                >
                  <div className="stat-icon-wrapper orders">
                    <ShoppingBag size={22} />
                  </div>
                  <div className="stat-info">
                    <span className="stat-label">Total Pedidos</span>
                    <span className="stat-value">{totalOrdersCount}</span>
                  </div>
                </motion.div>

                <motion.div 
                  className="stat-card"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.1 }}
                >
                  <div className="stat-icon-wrapper pending">
                    <Clock size={22} />
                  </div>
                  <div className="stat-info">
                    <span className="stat-label">Pendientes Envío</span>
                    <span className="stat-value">{pendingShipmentCount}</span>
                  </div>
                </motion.div>

                <motion.div 
                  className="stat-card"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.15 }}
                >
                  <div className="stat-icon-wrapper sales">
                    <DollarSign size={22} />
                  </div>
                  <div className="stat-info">
                    <span className="stat-label">Ingresos Totales</span>
                    <span className="stat-value">${totalSales.toFixed(2)}</span>
                  </div>
                </motion.div>

                <motion.div 
                  className="stat-card"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.2 }}
                >
                  <div className="stat-icon-wrapper" style={{ background: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6' }}>
                    <ShoppingBag size={22} />
                  </div>
                  <div className="stat-info">
                    <span className="stat-label">Total Productos</span>
                    <span className="stat-value">{productsCount}</span>
                  </div>
                </motion.div>

                <motion.div 
                  className="stat-card"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.25 }}
                >
                  <div className="stat-icon-wrapper" style={{ background: 'rgba(234, 179, 8, 0.1)', color: '#eab308' }}>
                    <ShoppingBag size={22} />
                  </div>
                  <div className="stat-info">
                    <span className="stat-label">Stock Total</span>
                    <span className="stat-value">{totalStock}</span>
                  </div>
                </motion.div>
              </div>

              {/* Pedidos Recientes */}
              <div className="admin-section-box">
                <div className="section-box-header">
                  <h2>Pedidos Recientes</h2>
                  <Link to="/admin/orders" className="view-all-link">
                    Ver todos <ArrowRight size={13} className="inline ml-1" />
                  </Link>
                </div>

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
                      </tr>
                    </thead>
                    <tbody>
                      {recentOrders.map((order) => (
                        <tr key={order._id}>
                          <td className="font-mono text-xs">#{order._id.slice(-8).toUpperCase()}</td>
                          <td>{order.user ? `${order.user.firstName} ${order.user.lastName}` : "Usuario Eliminado"}</td>
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
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;

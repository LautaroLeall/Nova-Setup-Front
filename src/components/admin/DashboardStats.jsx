import { Users, ShoppingBag, Clock, DollarSign } from "lucide-react";
import { motion } from "framer-motion";

const DashboardStats = ({ usersCount, totalOrdersCount, pendingShipmentCount, totalSales, productsCount, totalStock }) => {
  return (
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
          <span className="stat-label">Pendientes de Envío</span>
          <span className="stat-value">{pendingShipmentCount}</span>
        </div>
      </motion.div>

      <motion.div
        className="stat-card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.15 }}
      >
        <div className="stat-icon-wrapper income">
          <DollarSign size={22} />
        </div>
        <div className="stat-info">
          <span className="stat-label">Ingresos Brutos</span>
          <span className="stat-value">${totalSales.toLocaleString()}</span>
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
  );
};

export default DashboardStats;

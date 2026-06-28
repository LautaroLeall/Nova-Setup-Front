import { ArrowRight } from "lucide-react";
import { Link } from "react-router";
import { motion } from "framer-motion";
import OrderListTable from "./OrderListTable";
import "../../styles/admin/AdminTables.css";

const RecentOrdersTable = ({ recentOrders, fetchOrders, user }) => {
  return (
    <motion.div
      className="recent-orders-section"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
    >
      <hr className="recent-orders-divider" />

      <div className="recent-orders-header">
        <h2 className="recent-orders-title">Últimos Pedidos</h2>
        <Link to="/admin/orders" className="view-all-link">
          Ver todos los pedidos <ArrowRight size={16} />
        </Link>
      </div>

      <div className="table-responsive table-transparent">
        {recentOrders.length === 0 ? (
          <div className="empty-orders-placeholder">
            No hay pedidos recientes
          </div>
        ) : (
          <OrderListTable orders={recentOrders} fetchOrders={fetchOrders} user={user} />
        )}
      </div>
    </motion.div>
  );
};

export default RecentOrdersTable;

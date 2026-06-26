import { ArrowRight } from "lucide-react";
import { Link } from "react-router";
import { motion } from "framer-motion";
import OrderListTable from "./OrderListTable";

const RecentOrdersTable = ({ recentOrders, fetchOrders, user }) => {
  return (
    <motion.div
      className="recent-orders-section"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
      style={{ marginTop: '2rem' }}
    >
      <hr style={{ borderColor: 'rgba(58, 219, 241, 0.3)', marginBottom: '1.5rem', width: '60px', borderWidth: '2px', borderRadius: '2px' }} />

      <div className="recent-orders-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h2 className="recent-orders-title" style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: 0 }}>Últimos Pedidos</h2>
        <Link to="/admin/orders" className="view-all-link" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.95rem', color: 'var(--color-nova-cyan)', textDecoration: 'none', fontWeight: '500', transition: 'opacity 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.opacity = '0.8'} onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}>
          Ver todos los pedidos <ArrowRight size={16} />
        </Link>
      </div>

      <div className="table-responsive" style={{ background: "transparent", border: "none" }}>
        {recentOrders.length === 0 ? (
          <div style={{ textAlign: "center", padding: "2rem", background: "var(--color-nova-darker)", borderRadius: "0.5rem", border: "1px solid rgba(255,255,255,0.1)" }}>
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

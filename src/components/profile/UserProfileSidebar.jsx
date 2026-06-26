import { motion } from "framer-motion";
import { User, Package } from "lucide-react";

export const UserProfileSidebar = ({ user, activeTab, setActiveTab }) => {
  return (
    <motion.aside
      className="profile-sidebar"
      initial={{ opacity: 0, x: -30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="profile-card">
        <div className="profile-avatar">
          <User size={48} />
        </div>
        <h2 className="profile-name">{user.firstName} {user.lastName}</h2>
        <p className="profile-email">{user.email}</p>
        <div className="profile-badge">
          {user.isAdmin ? "Administrador" : "Cliente"}
        </div>

        <div style={{ marginTop: '2rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <button
            onClick={() => setActiveTab("orders")}
            style={{
              background: activeTab === "orders" ? 'var(--color-nova-cyan)' : 'transparent',
              color: activeTab === "orders" ? 'black' : 'white',
              border: activeTab === "orders" ? 'none' : '1px solid rgba(255,255,255,0.2)',
              padding: '0.8rem', borderRadius: '0.5rem', cursor: 'pointer', fontWeight: 'bold', transition: 'all 0.2s',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem'
            }}
          >
            <Package size={16} /> Mis Pedidos
          </button>
          <button
            onClick={() => setActiveTab("settings")}
            style={{
              background: activeTab === "settings" ? 'var(--color-nova-cyan)' : 'transparent',
              color: activeTab === "settings" ? 'black' : 'white',
              border: activeTab === "settings" ? 'none' : '1px solid rgba(255,255,255,0.2)',
              padding: '0.8rem', borderRadius: '0.5rem', cursor: 'pointer', fontWeight: 'bold', transition: 'all 0.2s',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem'
            }}
          >
            <User size={16} /> Configuración de Perfil
          </button>
        </div>
      </div>
    </motion.aside>
  );
};

export default UserProfileSidebar;

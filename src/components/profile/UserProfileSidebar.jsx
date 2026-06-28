import { motion } from "framer-motion";
import { User, Package, Heart } from "lucide-react";
import "../../styles/profile/UserProfileSidebar.css";

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

        <div className="profile-sidebar-tabs">
          <button
            onClick={() => setActiveTab("orders")}
            className={`profile-tab-btn ${activeTab === "orders" ? "active" : ""}`}
          >
            <Package size={16} /> Mis Pedidos
          </button>
          <button
            onClick={() => setActiveTab("favorites")}
            className={`profile-tab-btn ${activeTab === "favorites" ? "active" : ""}`}
          >
            <Heart size={16} /> Mis Favoritos
          </button>

          <button
            onClick={() => setActiveTab("settings")}
            className={`profile-tab-btn ${activeTab === "settings" ? "active" : ""}`}
          >
            <User size={16} /> Configuración de Perfil
          </button>
        </div>
      </div>
    </motion.aside>
  );
};

export default UserProfileSidebar;

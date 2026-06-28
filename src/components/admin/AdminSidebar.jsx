import { Link, useLocation, useNavigate } from "react-router";
import "../../styles/admin/AdminSidebar.css";

const AdminSidebar = () => {
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname.startsWith(path) ? "admin-menu-btn active" : "admin-menu-btn";
  };

  return (
    <aside className="admin-sidebar">
      <div className="admin-menu-box">
        <h3 className="admin-menu-title">Panel Control</h3>
        <ul className="admin-menu-list">
          <li>
            <Link to="/admin/dashboard" className={isActive("/admin/dashboard")}>
              Dashboard
            </Link>
          </li>
          <li>
            <Link to="/admin/products" className={isActive("/admin/products")}>
              Productos
            </Link>
          </li>
          <li>
            <Link to="/admin/orders" className={isActive("/admin/orders")}>
              Pedidos
            </Link>
          </li>
          <li>
            <Link to="/admin/users" className={isActive("/admin/users")}>
              Usuarios
            </Link>
          </li>
        </ul>
      </div>
    </aside>
  );
};

export default AdminSidebar;

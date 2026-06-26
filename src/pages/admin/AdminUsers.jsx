import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router";
import api from "../../services/api";
import AdminSidebar from "../../components/admin/AdminSidebar";
import UserListTable from "../../components/admin/UserListTable";
import "../../styles/Admin.css";

const AdminUsers = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const { data } = await api.get(`/api/users`);
      setUsers(data);
    } catch (err) {
      setError(err.response?.data?.message || "Error al obtener usuarios");
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
    fetchUsers();
  }, [user, navigate]);

  if (!user || !user.isAdmin) return null;

  return (
    <div className="admin-page">
      <div className="admin-container">
        {/* Barra de Navegación del Panel Admin */}
        <AdminSidebar />

        {/* Contenido Principal */}
        <main className="admin-main">
          <h1 className="admin-title">Gestión de Usuarios</h1>
          <p className="admin-subtitle">Administra los roles y cuentas de tus clientes</p>

          <div className="admin-section-box">
            {loading ? (
              <div className="admin-loading">
                <div className="admin-spinner" />
                <p>Cargando usuarios...</p>
              </div>
            ) : error ? (
              <div className="admin-error">{error}</div>
            ) : users.length === 0 ? (
              <div className="admin-empty">Aún no hay usuarios registrados.</div>
            ) : (
              <UserListTable users={users} fetchUsers={fetchUsers} user={user} />
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminUsers;

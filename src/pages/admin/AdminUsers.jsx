import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate, Link } from "react-router";
import axios from "axios";
import { Trash2, UserCheck, UserX } from "lucide-react";
import { showConfirmDialog, showSuccessAlert, showErrorAlert } from "../../utils/swalConfig";
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
      const { data } = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/users`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
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
    // eslint-disable-next-line react-hooks/exhaustive-deps, react-hooks/set-state-in-effect
    fetchUsers();
  }, [user, navigate]);

  if (!user || !user.isAdmin) return null;

  const handleDeleteUser = async (id) => {
    const result = await showConfirmDialog(
      "¿Eliminar Usuario?",
      "¿Estás seguro de que deseas eliminar este usuario? Esta acción no se puede deshacer.",
      "Sí, eliminar",
      "Cancelar"
    );
    if (result.isConfirmed) {
      try {
        await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/api/users/${id}`, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        showSuccessAlert("¡Eliminado!", "El usuario ha sido eliminado correctamente.");
        fetchUsers();
      } catch (err) {
        showErrorAlert("Error", err.response?.data?.message || "Error al eliminar usuario");
      }
    }
  };

  const handleToggleAdmin = async (id, currentStatus) => {
    const result = await showConfirmDialog(
      "¿Actualizar Rol?",
      `¿Seguro que deseas ${currentStatus ? "quitar" : "dar"} permisos de Administrador?`,
      "Sí, actualizar",
      "Cancelar"
    );
    if (result.isConfirmed) {
      try {
        await axios.put(
          `${import.meta.env.VITE_BACKEND_URL}/api/users/${id}/role`,
          { isAdmin: !currentStatus },
          { headers: { Authorization: `Bearer ${user.token}` } }
        );
        showSuccessAlert("Rol Actualizado", "Los permisos del usuario se actualizaron correctamente.");
        fetchUsers();
      } catch (err) {
        showErrorAlert("Error", err.response?.data?.message || "Error al actualizar rol");
      }
    }
  };

  return (
    <div className="admin-page">
      <div className="admin-container">
        
        {/* Barra de Navegación del Panel Admin */}
        <aside className="admin-sidebar">
          <div className="admin-menu-box">
            <h3 className="admin-menu-title">Panel Control</h3>
            <ul className="admin-menu-list">
              <li>
                <Link to="/admin/dashboard" className="admin-menu-btn">
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
                <Link to="/admin/users" className="admin-menu-btn active">
                  Usuarios
                </Link>
              </li>
            </ul>
          </div>
        </aside>

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
              <div className="table-wrapper">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Nombre Completo</th>
                      <th>Email</th>
                      <th>Rol</th>
                      <th>Fecha de Registro</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((u) => (
                      <tr key={u._id}>
                        <td className="font-bold">{u.firstName} {u.lastName}</td>
                        <td><a href={`mailto:${u.email}`} className="text-blue-400 hover:underline">{u.email}</a></td>
                        <td>
                          <span className={`badge-pago ${u.isAdmin ? "pagado" : "pendiente"}`}>
                            {u.isAdmin ? "Admin" : "Cliente"}
                          </span>
                        </td>
                        <td>{new Date(u.createdAt).toLocaleDateString()}</td>
                        <td>
                          <div className="actions-cell-buttons">
                            {u._id !== user._id && (
                              <>
                                <button
                                  className="btn-action-edit"
                                  title={u.isAdmin ? "Quitar Admin" : "Hacer Admin"}
                                  onClick={() => handleToggleAdmin(u._id, u.isAdmin)}
                                >
                                  {u.isAdmin ? <UserX size={14} /> : <UserCheck size={14} />}
                                </button>
                                <button
                                  className="btn-action-delete"
                                  title="Eliminar Cuenta"
                                  onClick={() => handleDeleteUser(u._id)}
                                >
                                  <Trash2 size={14} />
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminUsers;

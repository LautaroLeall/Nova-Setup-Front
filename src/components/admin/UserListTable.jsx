import { Trash2, UserCheck, UserX } from "lucide-react";
import api from "../../services/api";
import { showConfirmDialog, showSuccessAlert, showErrorAlert } from "../../utils/swalConfig";

const UserListTable = ({ users, fetchUsers, user }) => {
  const handleDeleteUser = async (id) => {
    const result = await showConfirmDialog(
      "¿Eliminar Usuario?",
      "¿Estás seguro de que deseas eliminar este usuario? Esta acción no se puede deshacer.",
      "Sí, eliminar",
      "Cancelar"
    );
    if (result.isConfirmed) {
      try {
        await api.delete(`/api/users/${id}`);
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
        await api.put(
          `/api/users/${id}/role`,
          { isAdmin: !currentStatus }
        );
        showSuccessAlert("Rol Actualizado", "Los permisos del usuario se actualizaron correctamente.");
        fetchUsers();
      } catch (err) {
        showErrorAlert("Error", err.response?.data?.message || "Error al actualizar rol");
      }
    }
  };

  return (
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
  );
};

export default UserListTable;

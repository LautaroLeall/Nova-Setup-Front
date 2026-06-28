import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router";
import api from "../../services/api";
import { Plus } from "lucide-react";
import { AnimatePresence } from "framer-motion";
import { showConfirmDialog, showSuccessAlert, showErrorAlert } from "../../utils/swalConfig";
import AdminSidebar from "../../components/admin/AdminSidebar";
import ProductFormModal from "../../components/admin/ProductFormModal";
import ProductListTable from "../../components/admin/ProductListTable";
import "../../styles/admin/AdminLayout.css";

const AdminProducts = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  // Listado de productos
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [search, setSearch] = useState("");

  // Estado del Formulario
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [productToEdit, setProductToEdit] = useState(null);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const { data } = await api.get(
        `/api/products?pageNumber=${page}&keyword=${search}`
      );
      setProducts(data.products);
      setPages(data.pages);
    } catch (err) {
      setError(err.response?.data?.message || "Error al obtener productos");
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
    fetchProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, navigate, page, search]);

  if (!user || !user.isAdmin) return null;

  // Abrir formulario para crear
  const handleOpenCreateForm = () => {
    setProductToEdit(null);
    setIsFormOpen(true);
  };

  // Abrir formulario para editar
  const handleOpenEditForm = (product) => {
    setProductToEdit(product);
    setIsFormOpen(true);
  };

  // Eliminar producto
  const handleDeleteProduct = async (id) => {
    const result = await showConfirmDialog(
      "¿Eliminar Producto?",
      "¿Estás seguro de que deseas eliminar este producto? Esta acción no se puede deshacer.",
      "Sí, eliminar",
      "Cancelar"
    );
    if (result.isConfirmed) {
      try {
        await api.delete(`/api/products/${id}`);
        showSuccessAlert("¡Eliminado!", "El producto ha sido eliminado.");
        fetchProducts();
      } catch (err) {
        showErrorAlert("Error", err.response?.data?.message || "Error al eliminar producto");
      }
    }
  };

  return (
    <div className="admin-page">
      <div className="admin-container">
        {/* Barra de Navegación del Panel Admin */}
        <AdminSidebar />

        {/* Contenido Principal */}
        <main className="admin-main">
          <div className="admin-header-row">
            <div>
              <h1 className="admin-title">Gestión de Catálogo</h1>
              <p className="admin-subtitle">Añade, edita o elimina productos de la tienda</p>
            </div>
            {!isFormOpen && (
              <button className="btn-admin-primary" onClick={handleOpenCreateForm}>
                <Plus size={16} /> Crear Producto
              </button>
            )}
          </div>

          <AnimatePresence mode="wait">
            {isFormOpen ? (
              <ProductFormModal
                productToEdit={productToEdit}
                onClose={() => setIsFormOpen(false)}
                fetchProducts={fetchProducts}
              />
            ) : (
              <ProductListTable
                products={products}
                loading={loading}
                error={error}
                search={search}
                setSearch={setSearch}
                page={page}
                setPage={setPage}
                pages={pages}
                handleOpenEditForm={handleOpenEditForm}
                handleDeleteProduct={handleDeleteProduct}
              />
            )}
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
};

export default AdminProducts;

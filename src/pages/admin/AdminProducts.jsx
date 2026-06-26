import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate, Link } from "react-router";
import axios from "axios";
import { Plus, Edit, Trash2, Upload, Link as LinkIcon, X, Search } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { showConfirmDialog, showSuccessAlert, showErrorAlert } from "../../utils/swalConfig";
import "../../styles/Admin.css";

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

  // Estado del Formulario (Creación/Edición)
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);

  // Campos del Formulario
  const [formName, setFormName] = useState("");
  const [formBrand, setFormBrand] = useState("");
  const [formCategory, setFormCategory] = useState("");
  const [formPrice, setFormPrice] = useState("");
  const [formDiscountPrice, setFormDiscountPrice] = useState("");
  const [formStock, setFormStock] = useState("");
  const [formDescription, setFormDescription] = useState("");

  // Listas complejas
  const [formImages, setFormImages] = useState([]);
  const [formBadges, setFormBadges] = useState([]);
  const [formFeatures, setFormFeatures] = useState([]);

  // Variables auxiliares para agregar a las listas
  const [imageUrlInput, setImageUrlInput] = useState("");
  const [imageUploadType, setImageUploadType] = useState("file"); // "file" o "url"
  const [badgeInput, setBadgeInput] = useState("");
  const [featNameInput, setFeatNameInput] = useState("");
  const [featValueInput, setFeatValueInput] = useState("");

  const [uploading, setUploading] = useState(false);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const { data } = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/products?pageNumber=${page}&keyword=${search}`
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

  // Lógica para subir archivo de imagen a Cloudinary
  const handleImageFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);

    try {
      setUploading(true);
      const { data } = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/upload`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${user.token}`,
        },
      });
      setFormImages((prev) => [...prev, data.url]);
    } catch (err) {
      showErrorAlert("Error", err.response?.data?.message || "Error al subir imagen");
    } finally {
      setUploading(false);
    }
  };

  // Agregar imagen por URL
  const handleAddImageUrl = () => {
    if (imageUrlInput.trim()) {
      setFormImages((prev) => [...prev, imageUrlInput.trim()]);
      setImageUrlInput("");
    }
  };

  // Eliminar imagen de la lista de imágenes del formulario
  const handleRemoveImage = (indexToRemove) => {
    setFormImages((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  };

  // Agregar Badge (Etiqueta)
  const handleAddBadge = () => {
    if (badgeInput.trim() && !formBadges.includes(badgeInput.trim().toUpperCase())) {
      setFormBadges((prev) => [...prev, badgeInput.trim().toUpperCase()]);
      setBadgeInput("");
    }
  };

  // Quitar Badge
  const handleRemoveBadge = (badgeToRemove) => {
    setFormBadges((prev) => prev.filter((b) => b !== badgeToRemove));
  };

  // Agregar Característica Técnica
  const handleAddFeature = () => {
    if (featNameInput.trim() && featValueInput.trim()) {
      setFormFeatures((prev) => [
        ...prev,
        { name: featNameInput.trim(), value: featValueInput.trim() },
      ]);
      setFeatNameInput("");
      setFeatValueInput("");
    }
  };

  // Quitar Característica
  const handleRemoveFeature = (indexToRemove) => {
    setFormFeatures((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  };

  // Abrir formulario para crear
  const handleOpenCreateForm = () => {
    setIsEditing(false);
    setEditingId(null);
    setFormName("");
    setFormBrand("");
    setFormCategory("");
    setFormPrice("");
    setFormDiscountPrice("");
    setFormStock("");
    setFormDescription("");
    setFormImages([]);
    setFormBadges([]);
    setFormFeatures([]);
    setIsFormOpen(true);
  };

  // Abrir formulario para editar
  const handleOpenEditForm = (product) => {
    setIsEditing(true);
    setEditingId(product._id);
    setFormName(product.name);
    setFormBrand(product.brand);
    setFormCategory(product.category);
    setFormPrice(product.price);
    setFormDiscountPrice(product.discountPrice || "");
    setFormStock(product.countInStock);
    setFormDescription(product.description);
    setFormImages(product.images || []);
    setFormBadges(product.badges || []);
    setFormFeatures(product.features || []);
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
        await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/api/products/${id}`, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        showSuccessAlert("¡Eliminado!", "El producto ha sido eliminado.");
        fetchProducts();
      } catch (err) {
        showErrorAlert("Error", err.response?.data?.message || "Error al eliminar producto");
      }
    }
  };

  // Guardar Producto (Crear / Editar)
  const handleSubmitProduct = async (e) => {
    e.preventDefault();

    if (!formName || !formBrand || !formCategory || !formPrice) {
      showErrorAlert("Campos Incompletos", "Por favor completa los campos requeridos");
      return;
    }

    // Validaciones avanzadas
    if (formName.length > 50) return showErrorAlert("Validación", "El nombre del producto no puede exceder los 50 caracteres.");
    if (formBrand.length > 25) return showErrorAlert("Validación", "La marca no puede exceder los 25 caracteres.");
    if (Number(formPrice) < 0) return showErrorAlert("Validación", "El precio no puede ser negativo.");
    if (formDiscountPrice && Number(formDiscountPrice) < 0) return showErrorAlert("Validación", "El descuento no puede ser negativo.");
    if (Number(formStock) < 0) return showErrorAlert("Validación", "El stock no puede ser un número negativo.");
    if (formDescription.length > 250) return showErrorAlert("Validación", "La descripción excede el límite de 250 caracteres.");

    const productPayload = {
      name: formName,
      brand: formBrand,
      category: formCategory,
      price: Number(formPrice),
      discountPrice: formDiscountPrice ? Number(formDiscountPrice) : null,
      countInStock: Number(formStock) || 0,
      description: formDescription,
      images: formImages,
      badges: formBadges,
      features: formFeatures,
    };

    try {
      if (isEditing) {
        await axios.put(`${import.meta.env.VITE_BACKEND_URL}/api/products/${editingId}`, productPayload, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
      } else {
        await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/products`, productPayload, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
      }
      setIsFormOpen(false);
      showSuccessAlert("¡Éxito!", isEditing ? "Producto actualizado correctamente" : "Producto creado correctamente");
      fetchProducts();
    } catch (err) {
      showErrorAlert("Error", err.response?.data?.message || "Error al guardar producto");
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
                <Link to="/admin/products" className="admin-menu-btn active">
                  Productos
                </Link>
              </li>
              <li>
                <Link to="/admin/orders" className="admin-menu-btn">
                  Pedidos
                </Link>
              </li>
              <li>
                <Link to="/admin/users" className="admin-menu-btn">
                  Usuarios
                </Link>
              </li>
            </ul>
          </div>
        </aside>

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
              // ── Formulario de ABM ──
              <motion.div
                key="product-form"
                className="admin-section-box"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                transition={{ duration: 0.3 }}
              >
                <div className="section-box-header">
                  <h2>{isEditing ? "Editar Producto" : "Nuevo Producto"}</h2>
                  <button className="btn-close-form" onClick={() => setIsFormOpen(false)}>
                    <X size={18} />
                  </button>
                </div>

                <form onSubmit={handleSubmitProduct} className="admin-form">
                  <div className="form-group">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                      <label style={{ marginBottom: 0 }}>Nombre del Producto *</label>
                      <span style={{ fontSize: '0.75rem', color: formName.length >= 50 ? 'var(--color-nova-error, #f87171)' : '#888' }}>{formName.length}/50</span>
                    </div>
                    <input
                      type="text"
                      placeholder="Ej: Teclado Mecánico Nova 75%"
                      value={formName}
                      onChange={(e) => setFormName(e.target.value)}
                      maxLength={50}
                      required
                    />
                  </div>

                  <div className="form-grid-2">
                    <div className="form-group">
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                        <label style={{ marginBottom: 0 }}>Marca *</label>
                        <span style={{ fontSize: '0.75rem', color: formBrand.length >= 25 ? 'var(--color-nova-error, #f87171)' : '#888' }}>{formBrand.length}/25</span>
                      </div>
                      <input
                        type="text"
                        placeholder="Ej: Nova"
                        value={formBrand}
                        onChange={(e) => setFormBrand(e.target.value)}
                        maxLength={25}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Categoría *</label>
                      <select
                        value={formCategory}
                        onChange={(e) => setFormCategory(e.target.value)}
                        required
                      >
                        <option value="">Selecciona...</option>
                        <option value="Teclados">Teclados</option>
                        <option value="Monitores">Monitores</option>
                        <option value="Ratones">Ratones</option>
                        <option value="Audio">Audio</option>
                        <option value="Accesorios">Accesorios</option>
                      </select>
                    </div>
                  </div>

                  <div className="form-grid-3">
                    <div className="form-group">
                      <label>Precio Original ($) *</label>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        placeholder="Ej: 149.99"
                        value={formPrice}
                        onChange={(e) => setFormPrice(e.target.value)}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Precio con Descuento ($)</label>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        placeholder="Ej: 129.99"
                        value={formDiscountPrice}
                        onChange={(e) => setFormDiscountPrice(e.target.value)}
                      />
                    </div>
                    <div className="form-group">
                      <label>Cantidad en Stock *</label>
                      <input
                        type="number"
                        min="0"
                        placeholder="Ej: 25"
                        value={formStock}
                        onChange={(e) => setFormStock(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                      <label style={{ marginBottom: 0 }}>Descripción *</label>
                      <span style={{ fontSize: '0.75rem', color: formDescription.length >= 250 ? 'var(--color-nova-error, #f87171)' : '#888' }}>{formDescription.length}/250</span>
                    </div>
                    <textarea
                      rows="3"
                      maxLength={250}
                      placeholder="Escribe una breve descripción del producto..."
                      value={formDescription}
                      onChange={(e) => setFormDescription(e.target.value)}
                      required
                    />
                  </div>

                  {/* Sección de carga de imágenes */}
                  <div className="form-group" style={{ marginTop: '0.5rem' }}>
                    <label>Imágenes del Producto *</label>
                    
                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '1rem', height: '42px' }}>
                      <div className="file-upload-wrapper" style={{ flex: 1, height: '100%' }}>
                        <input
                          type="file"
                          accept="image/*"
                          id="file-upload-input"
                          onChange={handleImageFileUpload}
                          style={{ display: "none" }}
                        />
                        <label 
                          htmlFor="file-upload-input" 
                          className="btn-file-upload" 
                          style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0', border: '1px dashed rgba(58, 219, 241, 0.4)', background: 'rgba(58, 219, 241, 0.05)', borderRadius: '0.5rem', margin: 0 }}
                        >
                          {uploading ? (
                            <span className="spinner-small mr-2" />
                          ) : (
                            <Upload size={16} className="mr-2 inline" style={{ color: 'var(--color-nova-cyan)' }} />
                          )}
                          <span style={{ color: 'white', fontWeight: 'bold', fontSize: '0.85rem' }}>
                            {uploading ? "Subiendo..." : "SUBIR IMAGEN"}
                          </span>
                        </label>
                      </div>
                      <span style={{ fontSize: '0.85rem', color: '#666', fontWeight: 'bold' }}>O</span>
                      <div className="url-upload-wrapper" style={{ flex: 1, display: 'flex', height: '100%' }}>
                        <input
                          type="text"
                          placeholder="Pegar URL de internet..."
                          value={imageUrlInput}
                          onChange={(e) => setImageUrlInput(e.target.value)}
                          style={{ flex: 1, borderRadius: '0.5rem 0 0 0.5rem' }}
                        />
                        <button
                          type="button"
                          className="btn-add-url"
                          onClick={handleAddImageUrl}
                          style={{ borderRadius: '0 0.5rem 0.5rem 0', background: 'var(--color-nova-cyan)', color: 'black' }}
                        >
                          Agregar
                        </button>
                      </div>
                    </div>



                    {/* Previsualización de imágenes cargadas */}
                    <div className="form-images-preview-grid">
                      {formImages.map((img, idx) => (
                        <div key={idx} className="preview-image-card">
                          <img src={img} alt={`Preview ${idx}`} />
                          <button
                            type="button"
                            className="btn-remove-preview"
                            onClick={() => handleRemoveImage(idx)}
                          >
                            <X size={12} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Sección de Badges y Características */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    {/* Badges (Etiquetas) */}
                    <div className="form-group">
                      <label>Etiquetas (Badges)</label>
                      <div className="badge-input-wrapper">
                        <input
                          type="text"
                          placeholder="Ej: OFERTA, NUEVO, MÁS VENDIDO"
                          value={badgeInput}
                          onChange={(e) => setBadgeInput(e.target.value)}
                        />
                        <button type="button" className="btn-add-list" onClick={handleAddBadge}>
                          Agregar
                        </button>
                      </div>
                      <div className="badges-list-tags">
                        {formBadges.map((badge) => (
                          <span key={badge} className="badge-tag">
                            {badge}
                            <button type="button" onClick={() => handleRemoveBadge(badge)}>
                              <X size={10} />
                            </button>
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Características Técnicas */}
                    <div className="form-group">
                      <label>Características Técnicas</label>
                      <div className="feature-inputs">
                        <input
                          type="text"
                          placeholder="Nombre (Ej: Switches)"
                          value={featNameInput}
                          onChange={(e) => setFeatNameInput(e.target.value)}
                        />
                        <input
                          type="text"
                          placeholder="Valor (Ej: Outemu Red)"
                          value={featValueInput}
                          onChange={(e) => setFeatValueInput(e.target.value)}
                        />
                        <button type="button" className="btn-add-list" onClick={handleAddFeature}>
                          Agregar
                        </button>
                      </div>
                      <ul className="features-list-rows">
                        {formFeatures.map((feat, idx) => (
                          <li key={idx} className="feature-row-item">
                            <span>
                              <strong>{feat.name}:</strong> {feat.value}
                            </span>
                            <button type="button" onClick={() => handleRemoveFeature(idx)}>
                              <Trash2 size={13} />
                            </button>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="form-actions-row">
                    <button type="button" className="btn-admin-sec" onClick={() => setIsFormOpen(false)}>
                      Cancelar
                    </button>
                    <button type="submit" className="btn-admin-primary">
                      Guardar Producto
                    </button>
                  </div>
                </form>
              </motion.div>
            ) : (
              // ── Listado de Tabla de Catálogo ──
              <motion.div
                key="product-table"
                className="admin-section-box"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                {/* Buscador de Catálogo */}
                <div className="catalog-search-row">
                  <div className="admin-search-wrapper">
                    <Search size={16} />
                    <input
                      type="text"
                      placeholder="Buscar producto..."
                      value={search}
                      onChange={(e) => {
                        setSearch(e.target.value);
                        setPage(1);
                      }}
                    />
                  </div>
                </div>

                {loading ? (
                  <div className="admin-loading">
                    <div className="admin-spinner" />
                    <p>Cargando productos...</p>
                  </div>
                ) : error ? (
                  <div className="admin-error">{error}</div>
                ) : products.length === 0 ? (
                  <div className="admin-empty">No se encontraron productos en el catálogo.</div>
                ) : (
                  <>
                    <div className="table-wrapper">
                      <table className="admin-table">
                        <thead>
                          <tr>
                            <th>Imagen</th>
                            <th>Nombre</th>
                            <th>Categoría</th>
                            <th>Precio Original</th>
                            <th>Descuento</th>
                            <th>Stock</th>
                            <th>Acciones</th>
                          </tr>
                        </thead>
                        <tbody>
                          {products.map((prod) => (
                            <tr key={prod._id}>
                              <td>
                                <img
                                  src={prod.images[0]}
                                  alt={prod.name}
                                  className="table-product-thumbnail"
                                />
                              </td>
                              <td className="font-bold">{prod.name}</td>
                              <td>{prod.category}</td>
                              <td>${prod.price.toFixed(2)}</td>
                              <td>{prod.discountPrice ? `$${prod.discountPrice.toFixed(2)}` : "-"}</td>
                              <td>
                                <span className={`stock-indicator ${prod.countInStock === 0 ? "out" : prod.countInStock < 5 ? "low" : "ok"}`}>
                                  {prod.countInStock} u.
                                </span>
                              </td>
                              <td>
                                <div className="actions-cell-buttons">
                                  <button
                                    className="btn-action-edit"
                                    onClick={() => handleOpenEditForm(prod)}
                                  >
                                    <Edit size={14} />
                                  </button>
                                  <button
                                    className="btn-action-delete"
                                    onClick={() => handleDeleteProduct(prod._id)}
                                  >
                                    <Trash2 size={14} />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {/* Paginación */}
                    {pages > 1 && (
                      <div className="admin-pagination">
                        {[...Array(pages).keys()].map((p) => (
                          <button
                            key={p + 1}
                            className={`page-btn ${page === p + 1 ? "active" : ""}`}
                            onClick={() => setPage(p + 1)}
                          >
                            {p + 1}
                          </button>
                        ))}
                      </div>
                    )}
                  </>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
};

export default AdminProducts;

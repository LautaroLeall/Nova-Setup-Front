import { useState, useEffect } from "react";
import { X, Upload, Trash2 } from "lucide-react";
import { motion } from "framer-motion";
import api from "../../services/api";
import { showSuccessAlert, showErrorAlert } from "../../utils/swalConfig";

const ProductFormModal = ({ productToEdit, onClose, fetchProducts }) => {
  const isEditing = !!productToEdit;

  const [formName, setFormName] = useState("");
  const [formBrand, setFormBrand] = useState("");
  const [formCategory, setFormCategory] = useState("");
  const [formPrice, setFormPrice] = useState("");
  const [formDiscountPrice, setFormDiscountPrice] = useState("");
  const [formStock, setFormStock] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [formImages, setFormImages] = useState([]);
  const [formBadges, setFormBadges] = useState([]);
  const [formFeatures, setFormFeatures] = useState([]);

  const [imageUrlInput, setImageUrlInput] = useState("");
  const [badgeInput, setBadgeInput] = useState("");
  const [featNameInput, setFeatNameInput] = useState("");
  const [featValueInput, setFeatValueInput] = useState("");
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (productToEdit) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setFormName(productToEdit.name);
      setFormBrand(productToEdit.brand);
      setFormCategory(productToEdit.category);
      setFormPrice(productToEdit.price);
      setFormDiscountPrice(productToEdit.discountPrice || "");
      setFormStock(productToEdit.countInStock);
      setFormDescription(productToEdit.description);
      setFormImages(productToEdit.images || []);
      setFormBadges(productToEdit.badges || []);
      setFormFeatures(productToEdit.features || []);
    }
  }, [productToEdit]);

  const handleImageFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);

    try {
      setUploading(true);
      const { data } = await api.post(`/api/upload`, formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        },
      });
      setFormImages((prev) => [...prev, data.url]);
    } catch (err) {
      showErrorAlert("Error", err.response?.data?.message || "Error al subir imagen");
    } finally {
      setUploading(false);
    }
  };

  const handleAddImageUrl = () => {
    if (imageUrlInput.trim()) {
      setFormImages((prev) => [...prev, imageUrlInput.trim()]);
      setImageUrlInput("");
    }
  };

  const handleRemoveImage = (indexToRemove) => {
    setFormImages((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  };

  const handleAddBadge = () => {
    if (badgeInput.trim() && !formBadges.includes(badgeInput.trim().toUpperCase())) {
      setFormBadges((prev) => [...prev, badgeInput.trim().toUpperCase()]);
      setBadgeInput("");
    }
  };

  const handleRemoveBadge = (badgeToRemove) => {
    setFormBadges((prev) => prev.filter((b) => b !== badgeToRemove));
  };

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

  const handleRemoveFeature = (indexToRemove) => {
    setFormFeatures((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  };

  const handleSubmitProduct = async (e) => {
    e.preventDefault();

    if (!formName || !formBrand || !formCategory || !formPrice) {
      showErrorAlert("Campos Incompletos", "Por favor completa los campos requeridos");
      return;
    }

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
        await api.put(`/api/products/${productToEdit._id}`, productPayload);
      } else {
        await api.post(`/api/products`, productPayload);
      }
      onClose();
      showSuccessAlert("¡Éxito!", isEditing ? "Producto actualizado correctamente" : "Producto creado correctamente");
      fetchProducts();
    } catch (err) {
      showErrorAlert("Error", err.response?.data?.message || "Error al guardar producto");
    }
  };

  return (
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
        <button className="btn-close-form" onClick={onClose}>
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

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
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
          <button type="button" className="btn-admin-sec" onClick={onClose}>
            Cancelar
          </button>
          <button type="submit" className="btn-admin-primary">
            Guardar Producto
          </button>
        </div>
      </form>
    </motion.div>
  );
};

export default ProductFormModal;

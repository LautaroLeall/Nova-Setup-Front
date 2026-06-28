import { useState, useEffect } from "react";
import { X, Upload, Trash2 } from "lucide-react";
import "../../styles/admin/AdminForms.css";
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
    const url = imageUrlInput.trim();
    if (url) {
      if (!/^https?:\/\//i.test(url)) {
        showErrorAlert("Validación", "La URL de la imagen debe comenzar con http:// o https://");
        return;
      }
      setFormImages((prev) => [...prev, url]);
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

    if (formName.trim().length < 3 || formName.trim().length > 100) return showErrorAlert("Validación", "El nombre debe tener entre 3 y 100 caracteres.");
    if (formBrand.trim().length < 2 || formBrand.trim().length > 50) return showErrorAlert("Validación", "La marca debe tener entre 2 y 50 caracteres.");
    if (Number(formPrice) <= 0) return showErrorAlert("Validación", "El precio debe ser mayor a 0.");
    if (formDiscountPrice) {
      const dPrice = Number(formDiscountPrice);
      if (dPrice < 0) return showErrorAlert("Validación", "El descuento no puede ser negativo.");
      if (dPrice >= Number(formPrice)) return showErrorAlert("Validación", "El precio con descuento debe ser estrictamente menor al precio original.");
    }
    if (Number(formStock) < 0 || !Number.isInteger(Number(formStock))) return showErrorAlert("Validación", "El stock debe ser un número entero mayor o igual a 0.");
    if (formDescription.trim().length < 10 || formDescription.trim().length > 1000) return showErrorAlert("Validación", "La descripción debe tener entre 10 y 1000 caracteres.");

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
          <div className="form-field-header">
            <label>Nombre del Producto *</label>
            <span className={`form-char-count ${formName.length >= 100 ? 'limit-reached' : ''}`}>{formName.length}/100</span>
          </div>
          <input
            type="text"
            placeholder="Ej: Teclado Mecánico Nova 75%"
            value={formName}
            onChange={(e) => setFormName(e.target.value)}
            minLength={3}
            maxLength={100}
            required
          />
        </div>

        <div className="form-grid-2">
          <div className="form-group">
            <div className="form-field-header">
              <label>Marca *</label>
              <span className={`form-char-count ${formBrand.length >= 50 ? 'limit-reached' : ''}`}>{formBrand.length}/50</span>
            </div>
            <input
              type="text"
              placeholder="Ej: Nova"
              value={formBrand}
              onChange={(e) => setFormBrand(e.target.value)}
              minLength={2}
              maxLength={50}
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
              {/* Categorías PC Builder */}
              <option value="Procesadores">Procesadores</option>
              <option value="Mothers">Mothers</option>
              <option value="Coolers">Coolers</option>
              <option value="Memorias RAM">Memorias RAM</option>
              <option value="Placas de Video">Placas de Video</option>
              <option value="Almacenamiento">Almacenamiento</option>
              <option value="Fuentes">Fuentes</option>
              <option value="Gabinetes">Gabinetes</option>
              {/* Otras categorías */}
              <option value="Monitores">Monitores</option>
              <option value="Periféricos">Periféricos</option>
              <option value="Teclados">Teclados</option>
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
          <div className="form-field-header">
            <label>Descripción *</label>
            <span className={`form-char-count ${formDescription.length >= 1000 ? 'limit-reached' : ''}`}>{formDescription.length}/1000</span>
          </div>
          <textarea
            rows="5"
            minLength={10}
            maxLength={1000}
            placeholder="Escribe una breve descripción del producto..."
            value={formDescription}
            onChange={(e) => setFormDescription(e.target.value)}
            required
          />
        </div>

        <div className="form-group form-group-mt">
          <label>Imágenes del Producto *</label>

          <div className="form-upload-row">
            <div className="form-upload-col">
              <input
                type="file"
                accept="image/*"
                id="file-upload-input"
                onChange={handleImageFileUpload}
                style={{ display: "none" }}
              />
              <label
                htmlFor="file-upload-input"
                className="btn-file-upload-full"
              >
                {uploading ? (
                  <span className="spinner-small mr-2" />
                ) : (
                  <Upload size={16} className="upload-icon-cyan" />
                )}
                <span className="upload-text-bold">
                  {uploading ? "Subiendo..." : "SUBIR IMAGEN"}
                </span>
              </label>
            </div>
            <span className="upload-separator">O</span>
            <div className="url-upload-wrapper-flex">
              <input
                type="text"
                placeholder="Pegar URL de internet..."
                value={imageUrlInput}
                onChange={(e) => setImageUrlInput(e.target.value)}
                className="url-upload-input-flex"
              />
              <button
                type="button"
                className="btn-add-url-flex"
                onClick={handleAddImageUrl}
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

        <div className="form-badges-container">
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

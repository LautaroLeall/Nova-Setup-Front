import { motion } from "framer-motion";
import "../../styles/profile/Profile.css";

export const ProfileSettingsForm = ({ formData, handleProfileChange, submitProfileUpdate, updatingProfile }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="profile-settings-section"
    >
      <h1 className="profile-title">
        Configuración de Perfil
      </h1>
      <p className="profile-subtitle">
        Actualiza tus datos personales y dirección de envío predeterminada
      </p>

      <form onSubmit={submitProfileUpdate} className="profile-settings-form">
        <h3 className="profile-form-section-title">
          Datos Personales
        </h3>
        <div className="profile-form-grid-2">
          <div>
            <label className="profile-form-label">
              Nombre
            </label>
            <input type="text" name="firstName" value={formData.firstName} onChange={handleProfileChange} required className="profile-form-input" />
          </div>
          <div>
            <label className="profile-form-label">
              Apellido
            </label>
            <input type="text" name="lastName" value={formData.lastName} onChange={handleProfileChange} required className="profile-form-input" />
          </div>
        </div>

        <div className="profile-form-field-mb">
          <label className="profile-form-label">
            Nueva Contraseña (opcional)
          </label>
          <input type="password" name="password" placeholder="Dejar en blanco para no cambiar" value={formData.password} onChange={handleProfileChange} className="profile-form-input" />
          <small className="profile-form-hint">
            Si te registraste con Google, establecer una contraseña aquí te permitirá iniciar sesión con correo tradicional también.
          </small>
        </div>

        <h3 className="profile-form-section-title">Dirección de Envío Predeterminada</h3>
        <div className="profile-form-grid-1">
          <div>
            <label className="profile-form-label">
              Nombre Completo del Receptor
            </label>
            <input type="text" name="shipping_fullName" value={formData.shippingAddress.fullName} onChange={handleProfileChange} className="profile-form-input" />
          </div>
          <div>
            <label className="profile-form-label">Dirección (Calle y Número)</label>
            <input type="text" name="shipping_address" value={formData.shippingAddress.address} onChange={handleProfileChange} className="profile-form-input" />
          </div>
        </div>
        <div className="profile-form-grid-2">
          <div>
            <label className="profile-form-label">
              Ciudad
            </label>
            <input type="text" name="shipping_city" value={formData.shippingAddress.city} onChange={handleProfileChange} className="profile-form-input" />
          </div>
          <div>
            <label className="profile-form-label">
              Provincia / Estado
            </label>
            <input type="text" name="shipping_province" value={formData.shippingAddress.province} onChange={handleProfileChange} className="profile-form-input" />
          </div>
        </div>
        <div className="profile-form-grid-2--mb">
          <div>
            <label className="profile-form-label">
              Código Postal
            </label>
            <input type="text" name="shipping_postalCode" value={formData.shippingAddress.postalCode} onChange={handleProfileChange} className="profile-form-input" />
          </div>
          <div>
            <label className="profile-form-label">
              Teléfono de Contacto
            </label>
            <input type="text" name="shipping_phone" value={formData.shippingAddress.phone} onChange={handleProfileChange} className="profile-form-input" />
          </div>
        </div>

        <button
          type="submit"
          disabled={updatingProfile}
          className="profile-save-btn"
        >
          {updatingProfile ? <span className="spinner-small profile-spinner" /> : null}
          {updatingProfile ? "Guardando..." : "Guardar Cambios"}
        </button>
      </form>
    </motion.div>
  );
};

export default ProfileSettingsForm;

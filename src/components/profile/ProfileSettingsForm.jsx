import { motion } from "framer-motion";
import { ARGENTINE_PROVINCES, ARGENTINE_CITIES } from "../../utils/argData";
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
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleProfileChange}
              required
              minLength={2}
              maxLength={50}
              pattern="^[A-Za-záéíóúÁÉÍÓÚñÑ\s]+$"
              title="El nombre solo puede contener letras y espacios (2-50 caracteres)"
              className="profile-form-input"
            />
          </div>
          <div>
            <label className="profile-form-label">
              Apellido
            </label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleProfileChange}
              required
              minLength={2}
              maxLength={50}
              pattern="^[A-Za-záéíóúÁÉÍÓÚñÑ\s]+$"
              title="El apellido solo puede contener letras y espacios (2-50 caracteres)"
              className="profile-form-input"
            />
          </div>
        </div>

        <div className="profile-form-field-mb">
          <label className="profile-form-label">
            Nueva Contraseña (opcional)
          </label>
          <input
            type="password"
            name="password"
            placeholder="Dejar en blanco para no cambiar"
            value={formData.password}
            onChange={handleProfileChange}
            minLength={6}
            title="La contraseña debe tener al menos 6 caracteres"
            className="profile-form-input"
          />
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
            <input
              type="text"
              name="shipping_fullName"
              value={formData.shippingAddress.fullName}
              onChange={handleProfileChange}
              minLength={2}
              maxLength={100}
              pattern="^[A-Za-záéíóúÁÉÍÓÚñÑ\s]+$"
              title="El nombre solo puede contener letras y espacios"
              className="profile-form-input"
            />
          </div>
          <div>
            <label className="profile-form-label">Dirección (Calle y Número)</label>
            <input
              type="text"
              name="shipping_address"
              value={formData.shippingAddress.address}
              onChange={handleProfileChange}
              minLength={5}
              maxLength={100}
              pattern="^[A-Za-z0-9áéíóúÁÉÍÓÚñÑ\s\.,'-]+$"
              title="La dirección debe ser alfanumérica y válida"
              className="profile-form-input"
            />
          </div>
        </div>
        <div className="profile-form-grid-2">
          <div>
            <label className="profile-form-label">
              Provincia / Estado
            </label>
            <select
              name="shipping_province"
              value={formData.shippingAddress.province}
              onChange={handleProfileChange}
              className="profile-form-input"
            >
              <option value="">Selecciona una provincia</option>
              {ARGENTINE_PROVINCES.map(prov => (
                <option key={prov} value={prov}>{prov}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="profile-form-label">
              Ciudad
            </label>
            {formData.shippingAddress.province ? (
              <select
                name="shipping_city"
                value={formData.shippingAddress.city}
                onChange={handleProfileChange}
                className="profile-form-input"
              >
                <option value="">Selecciona una ciudad</option>
                {(ARGENTINE_CITIES[formData.shippingAddress.province] || []).map(city => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
            ) : (
              <input
                type="text"
                value=""
                disabled
                placeholder="Selecciona una provincia primero"
                className="profile-form-input"
              />
            )}

            {/* Si elige "Otra", mostramos un input libre (opcional) o simplemente dejamos que el endpoint lo guarde */}
            {formData.shippingAddress.city === "Otra" && (
              <input
                type="text"
                name="shipping_cityOther"
                placeholder="Escribe tu ciudad..."
                value={formData.shippingAddress.cityOther || ""}
                onChange={handleProfileChange}
                className="profile-form-input"
                style={{ marginTop: "0.5rem" }}
                minLength={2}
                maxLength={50}
                required
              />
            )}
          </div>
        </div>
        <div className="profile-form-grid-2--mb">
          <div>
            <label className="profile-form-label">
              Código Postal
            </label>
            <input
              type="text"
              name="shipping_postalCode"
              value={formData.shippingAddress.postalCode}
              onChange={handleProfileChange}
              pattern="^([A-Za-z]{1}\d{4}[A-Za-z]{3}|\d{4})$"
              title="Formato válido: 1425 o C1425AAA"
              className="profile-form-input"
            />
          </div>
          <div>
            <label className="profile-form-label">
              Teléfono de Contacto
            </label>
            <input
              type="text"
              name="shipping_phone"
              value={formData.shippingAddress.phone}
              onChange={handleProfileChange}
              pattern="^\+?[0-9\s\-]{8,15}$"
              title="Solo números, espacios o -, entre 8 y 15 caracteres"
              className="profile-form-input"
            />
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

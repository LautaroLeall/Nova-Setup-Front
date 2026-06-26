import { motion } from "framer-motion";

export const ProfileSettingsForm = ({ formData, handleProfileChange, submitProfileUpdate, updatingProfile }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="profile-settings-section"
    >
      <h1 className="profile-title">Configuración de Perfil</h1>
      <p className="profile-subtitle">Actualiza tus datos personales y dirección de envío predeterminada</p>

      <form onSubmit={submitProfileUpdate} style={{ background: 'var(--color-dark-surface)', padding: '2rem', borderRadius: '1rem', border: '1px solid rgba(255,255,255,0.1)', marginTop: '2rem' }}>
        <h3 style={{ marginBottom: '1rem', color: 'var(--color-nova-cyan)' }}>Datos Personales</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: '#ccc' }}>Nombre</label>
            <input type="text" name="firstName" value={formData.firstName} onChange={handleProfileChange} required style={{ width: '100%', padding: '0.8rem', borderRadius: '0.5rem', background: '#111', border: '1px solid #333', color: 'white' }} />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: '#ccc' }}>Apellido</label>
            <input type="text" name="lastName" value={formData.lastName} onChange={handleProfileChange} required style={{ width: '100%', padding: '0.8rem', borderRadius: '0.5rem', background: '#111', border: '1px solid #333', color: 'white' }} />
          </div>
        </div>

        <div style={{ marginBottom: '2rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: '#ccc' }}>Nueva Contraseña (opcional)</label>
          <input type="password" name="password" placeholder="Dejar en blanco para no cambiar" value={formData.password} onChange={handleProfileChange} style={{ width: '100%', padding: '0.8rem', borderRadius: '0.5rem', background: '#111', border: '1px solid #333', color: 'white' }} />
          <small style={{ color: '#888', marginTop: '0.5rem', display: 'block' }}>Si te registraste con Google, establecer una contraseña aquí te permitirá iniciar sesión con correo tradicional también.</small>
        </div>

        <h3 style={{ marginBottom: '1rem', color: 'var(--color-nova-cyan)' }}>Dirección de Envío Predeterminada</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1rem', marginBottom: '1rem' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: '#ccc' }}>Nombre Completo del Receptor</label>
            <input type="text" name="shipping_fullName" value={formData.shippingAddress.fullName} onChange={handleProfileChange} style={{ width: '100%', padding: '0.8rem', borderRadius: '0.5rem', background: '#111', border: '1px solid #333', color: 'white' }} />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: '#ccc' }}>Dirección (Calle y Número)</label>
            <input type="text" name="shipping_address" value={formData.shippingAddress.address} onChange={handleProfileChange} style={{ width: '100%', padding: '0.8rem', borderRadius: '0.5rem', background: '#111', border: '1px solid #333', color: 'white' }} />
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: '#ccc' }}>Ciudad</label>
            <input type="text" name="shipping_city" value={formData.shippingAddress.city} onChange={handleProfileChange} style={{ width: '100%', padding: '0.8rem', borderRadius: '0.5rem', background: '#111', border: '1px solid #333', color: 'white' }} />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: '#ccc' }}>Provincia / Estado</label>
            <input type="text" name="shipping_province" value={formData.shippingAddress.province} onChange={handleProfileChange} style={{ width: '100%', padding: '0.8rem', borderRadius: '0.5rem', background: '#111', border: '1px solid #333', color: 'white' }} />
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '2rem' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: '#ccc' }}>Código Postal</label>
            <input type="text" name="shipping_postalCode" value={formData.shippingAddress.postalCode} onChange={handleProfileChange} style={{ width: '100%', padding: '0.8rem', borderRadius: '0.5rem', background: '#111', border: '1px solid #333', color: 'white' }} />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: '#ccc' }}>Teléfono de Contacto</label>
            <input type="text" name="shipping_phone" value={formData.shippingAddress.phone} onChange={handleProfileChange} style={{ width: '100%', padding: '0.8rem', borderRadius: '0.5rem', background: '#111', border: '1px solid #333', color: 'white' }} />
          </div>
        </div>

        <button
          type="submit"
          disabled={updatingProfile}
          style={{ background: 'var(--color-nova-cyan)', color: 'black', padding: '1rem', borderRadius: '0.5rem', fontWeight: 'bold', width: '100%', border: 'none', cursor: updatingProfile ? 'not-allowed' : 'pointer', fontSize: '1rem', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem' }}
        >
          {updatingProfile ? <span className="spinner-small" style={{ borderColor: 'black', borderTopColor: 'transparent' }} /> : null}
          {updatingProfile ? "Guardando..." : "Guardar Cambios"}
        </button>
      </form>
    </motion.div>
  );
};

export default ProfileSettingsForm;

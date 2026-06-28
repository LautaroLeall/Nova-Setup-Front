import { useForm } from "react-hook-form";
import { User, Phone, MapPin, AlertCircle, Lock } from "lucide-react";
import "../../styles/checkout/CheckoutForm.css";

const CheckoutForm = ({ user, onSubmit, isLoading, apiError }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      fullName: user?.shippingAddress?.fullName || (user ? `${user.firstName || ""} ${user.lastName || ""}`.trim() : ""),
      phone: user?.shippingAddress?.phone || "",
      address: user?.shippingAddress?.address || "",
      city: user?.shippingAddress?.city || "",
      postalCode: user?.shippingAddress?.postalCode || "",
      province: user?.shippingAddress?.province || "",
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="checkout-form">
      <div className="form-section">
        <h2 className="form-section-title">
          <User size={18} /> Información Personal
        </h2>
        <div className="form-group">
          <label>Nombre completo</label>
          <input
            type="text"
            placeholder="Ej: Juan García"
            className={errors.fullName ? "input-error" : ""}
            {...register("fullName", { required: "El nombre es requerido" })}
          />
          {errors.fullName && <span className="field-error">{errors.fullName.message}</span>}
        </div>
        <div className="form-group">
          <label>Teléfono de contacto</label>
          <div className="input-with-icon">
            <Phone size={16} />
            <input
              type="tel"
              placeholder="Ej: +54 9 11 1234-5678"
              {...register("phone")}
            />
          </div>
        </div>
      </div>

      <div className="form-section">
        <h2 className="form-section-title">
          <MapPin size={18} /> Dirección de Envío
        </h2>
        <div className="form-group">
          <label>Dirección (calle y número)</label>
          <input
            type="text"
            placeholder="Ej: Av. Corrientes 1234, Piso 3"
            className={errors.address ? "input-error" : ""}
            {...register("address", { required: "La dirección es requerida" })}
          />
          {errors.address && <span className="field-error">{errors.address.message}</span>}
        </div>
        <div className="form-row">
          <div className="form-group">
            <label>Ciudad</label>
            <input
              type="text"
              placeholder="Ej: Buenos Aires"
              className={errors.city ? "input-error" : ""}
              {...register("city", { required: "La ciudad es requerida" })}
            />
            {errors.city && <span className="field-error">{errors.city.message}</span>}
          </div>
          <div className="form-group">
            <label>Código Postal</label>
            <input
              type="text"
              placeholder="Ej: C1043"
              className={errors.postalCode ? "input-error" : ""}
              {...register("postalCode", { required: "El CP es requerido" })}
            />
            {errors.postalCode && <span className="field-error">{errors.postalCode.message}</span>}
          </div>
        </div>
        <div className="form-group">
          <label>Provincia</label>
          <select
            className={errors.province ? "input-error" : ""}
            {...register("province", { required: "La provincia es requerida" })}
          >
            <option value="">Seleccionar provincia...</option>
            {[
              "Buenos Aires", "CABA", "Catamarca", "Chaco", "Chubut",
              "Córdoba", "Corrientes", "Entre Ríos", "Formosa", "Jujuy",
              "La Pampa", "La Rioja", "Mendoza", "Misiones", "Neuquén",
              "Río Negro", "Salta", "San Juan", "San Luis", "Santa Cruz",
              "Santa Fe", "Santiago del Estero", "Tierra del Fuego", "Tucumán"
            ].map((p) => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
          {errors.province && <span className="field-error">{errors.province.message}</span>}
        </div>
      </div>

      {apiError && (
        <div className="checkout-error">
          <AlertCircle size={16} />
          <span>{apiError}</span>
        </div>
      )}

      <button type="submit" className="checkout-submit-btn" disabled={isLoading}>
        {isLoading ? (
          <span className="btn-spinner" />
        ) : (
          <>
            <Lock size={18} />
            Continuar al Pago Seguro
          </>
        )}
      </button>
    </form>
  );
};

export default CheckoutForm;

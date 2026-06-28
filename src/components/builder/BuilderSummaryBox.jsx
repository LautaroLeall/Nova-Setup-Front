import { useContext, useState } from "react";
import { PCBuilderContext } from "../../context/PCBuilderContext";
import { CartContext } from "../../context/CartContext";
import { useNavigate } from "react-router";
import { motion, AnimatePresence } from "framer-motion";
import "../../styles/builder/BuilderSummaryBox.css";
import { X, ShoppingCart } from "lucide-react";
import confetti from "canvas-confetti"; // Usaremos esto para la celebración si se puede, o algo simple

export const BuilderSummaryBox = () => {
  const {
    steps,
    selectedComponents,
    totalPrice,
    removeComponent,
    isConfigurationValid,
    goToStep,
    clearBuilder
  } = useContext(PCBuilderContext);

  const { addToCart } = useContext(CartContext);
  const navigate = useNavigate();
  const [isFinishing, setIsFinishing] = useState(false);

  const handleFinish = () => {
    if (!isConfigurationValid()) return;

    setIsFinishing(true);

    // Animación de celebración 🎉
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#3adbf1', '#ffffff', '#ff00ff']
    });

    // Inyectar en carrito
    setTimeout(() => {
      Object.values(selectedComponents).forEach(product => {
        if (product) {
          addToCart(product, 1);
        }
      });

      // Limpiar y redirigir
      clearBuilder();
      navigate("/checkout");
    }, 1500);
  };

  return (
    <div className="builder-summary-box">
      <h3 className="summary-title">Resumen de Ensamble</h3>

      <div className="summary-items-list">
        {steps.map((step, idx) => {
          const product = selectedComponents[step.id];

          return (
            <div key={step.id} className="summary-item-row" onClick={() => !product && goToStep(idx)}>
              <div className="item-icon-col">
                <step.icon size={18} className={product ? "text-cyan" : "text-gray"} />
              </div>
              <div className="item-details-col">
                <span className="item-category-label">
                  {step.label} {step.isRequired && <span className="req-asterisk">*</span>}
                </span>
                {product ? (
                  <div className="item-product-name">{product.name}</div>
                ) : (
                  <div className="item-empty-text">Sin seleccionar</div>
                )}
              </div>
              <div className="item-action-col">
                {product ? (
                  <div className="item-price-action">
                    <span className="item-price">${product.discountPrice || product.price}</span>
                    <button
                      className="btn-remove-item"
                      onClick={(e) => { e.stopPropagation(); removeComponent(step.id); }}
                      title="Quitar"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ) : (
                  <button className="btn-select-jump" onClick={(e) => { e.stopPropagation(); goToStep(idx); }}>
                    Elegir
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="summary-footer">
        <div className="total-row">
          <span>Subtotal Estimado:</span>
          <motion.span
            key={totalPrice}
            initial={{ scale: 1.2, color: "#fff" }}
            animate={{ scale: 1, color: "var(--color-nova-cyan)" }}
            className="total-price-val"
          >
            ${totalPrice}
          </motion.span>
        </div>

        <button
          className={`btn-finish-build ${isConfigurationValid() ? "valid" : "invalid"} ${isFinishing ? "loading" : ""}`}
          onClick={handleFinish}
          disabled={!isConfigurationValid() || isFinishing}
        >
          {isFinishing ? (
            <span className="btn-content"><div className="spinner-small"></div> Procesando...</span>
          ) : isConfigurationValid() ? (
            <span className="btn-content"><ShoppingCart size={18} /> Terminar y Comprar</span>
          ) : (
            <span className="btn-content">Faltan componentes obligatorios</span>
          )}
        </button>
      </div>
    </div>
  );
};

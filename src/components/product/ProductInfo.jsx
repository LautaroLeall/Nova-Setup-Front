import { motion } from "framer-motion";
import { Shield, Truck, RotateCcw } from "lucide-react";
import "../../styles/product/ProductInfo.css";

export const ProductInfo = ({ product }) => {
  return (
    <motion.div
      className="detail-specs-section"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: 0.2 }}
    >
      <h2 className="specs-title">Especificaciones Técnicas</h2>
      <div className="specs-grid">
        <div className="spec-item">
          <span className="spec-label">Marca</span>
          <span className="spec-value">{product.brand}</span>
        </div>
        <div className="spec-item">
          <span className="spec-label">Categoría</span>
          <span className="spec-value">{product.category}</span>
        </div>
        {product.features && product.features.map((feat, idx) => (
          <div key={idx} className="spec-item">
            <span className="spec-label">{feat.name}</span>
            <span className="spec-value">{feat.value}</span>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default ProductInfo;

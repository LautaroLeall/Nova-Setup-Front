import { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router";
import axios from "axios";
import { ShoppingCart, ArrowLeft, Star, Package, ShieldCheck } from "lucide-react";
import { sileo } from "sileo";
import { motion } from "framer-motion";
import { CartContext } from "../context/CartContext";
import "../styles/ProductDetail.css";

export const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useContext(CartContext);
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [qty, setQty] = useState(1);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get(`http://localhost:5000/api/products/${id}`);
        setProduct(data);
      } catch (err) {
        setError(err.response?.data?.message || err.message || "Error al cargar producto");
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    if (!product || product.countInStock === 0) return;
    
    addToCart(product, qty);
    
    sileo.success({
      title: "¡Producto Agregado!",
      description: `${qty}x ${product.name}`,
      position: "bottom-right"
    });
  };

  if (loading) {
    return (
      <div className="product-detail-page loader-container">
        <div className="spinner"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="product-detail-page error-container">
        <h2>Producto no encontrado</h2>
        <p>{error}</p>
        <button onClick={() => navigate("/shop")} className="btn-secondary">Volver al catálogo</button>
      </div>
    );
  }

  if (!product) return null;

  return (
    <div className="product-detail-page">
      <button onClick={() => navigate(-1)} className="back-btn">
        <ArrowLeft size={20} />
        <span>Volver</span>
      </button>

      <div className="detail-layout">
        {/* Columna Izquierda: Galería Inmersiva y Detalles (Scroll) */}
        <div className="detail-scroll-column">
          <div className="detail-image-gallery">
            {product.images.map((img, idx) => (
              <motion.div 
                key={idx} 
                className="detail-image-wrapper"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6 }}
              >
                <img src={img} alt={`${product.name} - Vista ${idx + 1}`} className="detail-image" />
              </motion.div>
            ))}
          </div>

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
        </div>

        {/* Columna Derecha: Información de Compra (Sticky) */}
        <motion.div 
          className="detail-sticky-column"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <div className="detail-buy-box">
            <div className="buy-box-header">
              <span className="buy-brand">{product.brand}</span>
              <div className="buy-rating">
                <Star size={14} fill="var(--color-nova-cyan)" color="var(--color-nova-cyan)" />
                <span>{product.rating}</span>
                <span className="reviews-count">({product.numReviews} reseñas)</span>
              </div>
            </div>

            <h1 className="buy-title">{product.name}</h1>
            
            <p className="buy-description">{product.description}</p>

            <div className="buy-price-section">
              {product.discountPrice ? (
                <div className="price-wrapper">
                  <span className="current-price">${product.discountPrice}</span>
                  <span className="old-price">${product.price}</span>
                  <span className="discount-badge">OFERTA</span>
                </div>
              ) : (
                <span className="current-price">${product.price}</span>
              )}
            </div>

            <div className="buy-stock-status">
              {product.countInStock > 0 ? (
                <div className="stock-in"><Package size={16} /> En Stock ({product.countInStock} disp.)</div>
              ) : (
                <div className="stock-out"><Package size={16} /> Agotado Temporalmente</div>
              )}
            </div>

            {product.countInStock > 0 && (
              <div className="buy-qty-selector">
                <span>Cantidad:</span>
                <div className="qty-controls">
                  <button onClick={() => setQty(Math.max(1, qty - 1))}>-</button>
                  <input type="number" value={qty} readOnly />
                  <button onClick={() => setQty(Math.min(product.countInStock, qty + 1))}>+</button>
                </div>
              </div>
            )}

            <button 
              className={`add-to-cart-mega ${product.countInStock === 0 ? "disabled" : ""}`}
              onClick={handleAddToCart}
              disabled={product.countInStock === 0}
            >
              <ShoppingCart size={20} />
              {product.countInStock > 0 ? "Agregar al Carrito" : "Agotado"}
            </button>

            <div className="buy-guarantees">
              <div className="guarantee-item">
                <ShieldCheck size={18} />
                <span>1 Año de Garantía Oficial</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ProductDetail;

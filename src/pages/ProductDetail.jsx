import { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router";
import axios from "axios";
import { ShoppingCart, ArrowLeft, Star, Package, ShieldCheck, Heart, Bell, ChevronLeft, ChevronRight, X } from "lucide-react";
import { sileo } from "sileo";
import { motion } from "framer-motion";
import { AuthContext } from "../context/AuthContext";
import { CartContext } from "../context/CartContext";
import "../styles/ProductDetail.css";

const API = import.meta.env.VITE_BACKEND_URL;

export const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useContext(CartContext);
  const { user, favoriteIds, toggleFavorite } = useContext(AuthContext);

  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [qty, setQty] = useState(1);

  const [canReview, setCanReview] = useState(false);
  const [daysLeft, setDaysLeft] = useState(0);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);
  const [isNotifying, setIsNotifying] = useState(false);

  // Carousel y Modal
  const [currentImageIdx, setCurrentImageIdx] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // ── Cargar producto ──────────────────────────────────────────────
  const fetchProduct = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`${API}/api/products/${id}`);
      setProduct(data);
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Error al cargar producto");
    } finally {
      setLoading(false);
    }
  };

  // ── Cargar reseñas (colección separada) ─────────────────────────
  const fetchReviews = async () => {
    try {
      const { data } = await axios.get(`${API}/api/products/${id}/reviews`);
      setReviews(data);
    } catch (err) {
      console.error("Error al cargar reseñas:", err.message);
    }
  };

  useEffect(() => {
    fetchProduct();
    fetchReviews();
  }, [id]);

  // ── Verificar si el usuario puede calificar ──────────────────────
  useEffect(() => {
    if (!user || !product) return;

    const checkPurchase = async () => {
      try {
        const { data: orders } = await axios.get(`${API}/api/orders/myorders`, {
          headers: { Authorization: `Bearer ${user.token}` },
        });

        const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;
        const now = Date.now();

        // Contar cuantas reseñas ya hizo este usuario
        const myReviewsCount = reviews.filter(r => r.user === user._id || r.user?._id === user._id).length;

        // Contar cuantas órdenes válidas tiene
        let validOrdersCount = 0;
        let latestDays = 0;

        for (const order of orders) {
          if (order.status === "delivered") {
            const hasProduct = order.orderItems.some(i => i.product === product._id);
            if (hasProduct && order.deliveredAt) {
              const timeSinceDelivery = now - new Date(order.deliveredAt).getTime();
              if (timeSinceDelivery <= SEVEN_DAYS_MS) {
                validOrdersCount++;
                latestDays = Math.ceil((SEVEN_DAYS_MS - timeSinceDelivery) / (1000 * 60 * 60 * 24));
              }
            }
          }
        }

        // Si tiene más compras recientes válidas que reseñas hechas, puede calificar
        setCanReview(validOrdersCount > myReviewsCount);
        setDaysLeft(latestDays);
      } catch (err) {
        console.error("Error al verificar compra:", err.message);
      }
    };
    checkPurchase();
  }, [user, product, reviews]);

  // ── Acciones ─────────────────────────────────────────────────────
  const handleAddToCart = () => {
    if (!product || product.countInStock === 0) return;
    addToCart(product, qty);
    sileo.success({
      title: "¡Producto Agregado!",
      description: `${qty}x ${product.name}`,
      position: "bottom-right",
    });
  };

  const handleToggleFavorite = () => {
    if (!user) {
      sileo.error({
        title: "Inicia Sesión",
        description: "Necesitas iniciar sesión para agregar a favoritos.",
        position: "bottom-right",
      });
      return;
    }
    toggleFavorite(product._id);
  };

  const handleNotifyRestock = async () => {
    if (!user) {
      sileo.error({
        title: "Inicia Sesión",
        description: "Necesitas iniciar sesión para recibir notificaciones.",
        position: "bottom-right",
      });
      return;
    }
    try {
      setIsNotifying(true);
      const { data } = await axios.post(`${API}/api/products/${product._id}/notify-restock`, {}, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      sileo.success({
        title: "¡Notificación activada!",
        description: data.message,
        position: "bottom-right",
      });
    } catch (err) {
      sileo.error({
        title: "Error",
        description: err.response?.data?.message || "No se pudo activar la notificación",
        position: "bottom-right",
      });
    } finally {
      setIsNotifying(false);
    }
  };

  const submitReviewHandler = async (e) => {
    e.preventDefault();
    if (rating === 0) {
      sileo.error({
        title: "Calificación Requerida",
        description: "Por favor selecciona una calificación de 1 a 5 estrellas.",
        position: "bottom-right",
      });
      return;
    }
    try {
      setSubmittingReview(true);
      await axios.post(
        `${API}/api/products/${id}/reviews`,
        { rating, comment },
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      sileo.success({
        title: "Reseña publicada",
        description: "¡Gracias por tu opinión!",
        position: "bottom-right",
      });
      setCanReview(false);
      setRating(0);
      setComment("");
      // Recargar producto (actualiza rating/numReviews) y reseñas por separado
      await Promise.all([fetchProduct(), fetchReviews()]);
    } catch (err) {
      sileo.error({
        title: "Error",
        description: err.response?.data?.message || "Error al enviar reseña",
        position: "bottom-right",
      });
    } finally {
      setSubmittingReview(false);
    }
  };

  const nextImage = (e) => {
    e.stopPropagation();
    setCurrentImageIdx((prev) => (prev + 1) % product.images.length);
  };

  const prevImage = (e) => {
    e.stopPropagation();
    setCurrentImageIdx((prev) => (prev - 1 + product.images.length) % product.images.length);
  };

  // ── Render ────────────────────────────────────────────────────────
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
          <div className="detail-carousel-container" onClick={() => setIsModalOpen(true)}>
            <img 
              src={product.images[currentImageIdx]} 
              alt={`${product.name} - Imagen ${currentImageIdx + 1}`} 
              className="detail-carousel-main-img" 
            />
            {product.images.length > 1 && (
              <>
                <button className="carousel-arrow left" onClick={prevImage}>
                  <ChevronLeft size={24} />
                </button>
                <button className="carousel-arrow right" onClick={nextImage}>
                  <ChevronRight size={24} />
                </button>
                <div className="carousel-dots">
                  {product.images.map((_, idx) => (
                    <span 
                      key={idx} 
                      className={`carousel-dot ${idx === currentImageIdx ? 'active' : ''}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        setCurrentImageIdx(idx);
                      }}
                    />
                  ))}
                </div>
              </>
            )}
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

          {/* Sección de Reseñas — datos de la colección separada */}
          <motion.div
            className="detail-reviews-section"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <h2 className="specs-title">Reseñas de Clientes</h2>

            {reviews.length === 0 && !canReview && (
              <p style={{ color: "var(--color-text-dim)" }}>Aún no hay reseñas para este producto.</p>
            )}

            {reviews.length > 0 && (
              <div className="reviews-list">
                {reviews.map((review) => (
                  <div key={review._id} className="review-card">
                    <div className="review-header">
                      <strong>{review.firstName}</strong>
                      <span className="review-date">{new Date(review.createdAt).toLocaleDateString()}</span>
                    </div>
                    <div className="review-stars">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={14}
                          fill={i < review.rating ? "var(--color-nova-cyan)" : "none"}
                          color={i < review.rating ? "var(--color-nova-cyan)" : "rgba(255, 255, 255, 0.3)"}
                        />
                      ))}
                    </div>
                    {review.comment && <p className="review-comment">{review.comment}</p>}
                  </div>
                ))}
              </div>
            )}

            {canReview && (
              <div className="review-form-container">
                <h3>Calificar tu compra</h3>
                <p className="review-days-left">Te quedan {daysLeft} días para calificar.</p>
                <form onSubmit={submitReviewHandler} className="review-form">
                  <div className="star-rating-input">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        size={24}
                        style={{ cursor: "pointer", transition: "all 0.2s" }}
                        fill={star <= rating ? "var(--color-nova-cyan)" : "none"}
                        color={star <= rating ? "var(--color-nova-cyan)" : "rgba(255, 255, 255, 0.4)"}
                        onClick={() => setRating(star)}
                      />
                    ))}
                  </div>
                  <textarea
                    placeholder="Comparte tu experiencia (opcional)..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    rows="3"
                  />
                  <button type="submit" disabled={submittingReview} className="btn-primary">
                    {submittingReview ? "Enviando..." : "Publicar Calificación"}
                  </button>
                </form>
              </div>
            )}
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
                {reviews.length > 0 ? (
                  <>
                    <span>{product.rating.toFixed(1)}</span>
                    <span className="reviews-count">({product.numReviews} reseñas)</span>
                  </>
                ) : (
                  <span className="reviews-count">Sin reseñas</span>
                )}
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

            <div className="cart-action-group" style={{ marginBottom: product.countInStock === 0 ? '0.75rem' : '1.5rem' }}>
              <button
                className={`add-to-cart-mega ${product.countInStock === 0 ? "disabled" : ""}`}
                onClick={handleAddToCart}
                disabled={product.countInStock === 0}
              >
                <ShoppingCart size={20} />
                {product.countInStock > 0 ? "Agregar al Carrito" : "Agotado"}
              </button>

              <button
                className={`fav-btn-small ${favoriteIds?.includes(product._id) ? "active" : ""}`}
                onClick={handleToggleFavorite}
                title={favoriteIds?.includes(product._id) ? "Quitar de favoritos" : "Agregar a favoritos"}
                aria-label={favoriteIds?.includes(product._id) ? "Quitar de favoritos" : "Agregar a favoritos"}
              >
                <Heart
                  size={22}
                  fill={favoriteIds?.includes(product._id) ? "currentColor" : "none"}
                  strokeWidth={1.5}
                />
              </button>
            </div>

            {product.countInStock === 0 && (
              <button
                className="notify-restock-btn"
                onClick={handleNotifyRestock}
                disabled={isNotifying}
              >
                <Bell size={18} />
                {isNotifying ? "Cargando..." : "Avisarme cuando haya stock"}
              </button>
            )}

            <div className="buy-guarantees">
              <div className="guarantee-item">
                <ShieldCheck size={18} />
                <span>1 Año de Garantía Oficial</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Modal Pantalla Completa para Imágenes */}
      {isModalOpen && (
        <div className="fullscreen-image-modal" onClick={() => setIsModalOpen(false)}>
          <button className="close-modal-btn" onClick={() => setIsModalOpen(false)}>
            <X size={32} />
          </button>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <img 
              src={product.images[currentImageIdx]} 
              alt={`${product.name} - Zoom`} 
              className="modal-main-img" 
            />
            {product.images.length > 1 && (
              <>
                <button className="modal-arrow left" onClick={prevImage}>
                  <ChevronLeft size={36} />
                </button>
                <button className="modal-arrow right" onClick={nextImage}>
                  <ChevronRight size={36} />
                </button>
                <div className="modal-thumbnails">
                  {product.images.map((img, idx) => (
                    <img 
                      key={idx} 
                      src={img} 
                      alt={`Miniatura ${idx + 1}`} 
                      className={`modal-thumb ${idx === currentImageIdx ? 'active' : ''}`}
                      onClick={() => setCurrentImageIdx(idx)}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetail;

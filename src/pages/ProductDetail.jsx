import { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router";
import api from "../services/api";
import { ArrowLeft } from "lucide-react";
import { sileo } from "sileo";
import { AuthContext } from "../context/AuthContext";
import { CartContext } from "../context/CartContext";
import ProductGallery from "../components/product/ProductGallery";
import ProductInfo from "../components/product/ProductInfo";
import ProductReviews from "../components/product/ProductReviews";
import ProductBuyBox from "../components/product/ProductBuyBox";
import "../styles/ProductDetail.css";

// API URL centralizada en services/api.js

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

  // ── Cargar producto ──────────────────────────────────────────────
  const fetchProduct = async () => {
    try {
      setLoading(true);
      const { data } = await api.get(`/api/products/${id}`);
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
      const { data } = await api.get(`/api/products/${id}/reviews`);
      setReviews(data);
    } catch (err) {
      console.error("Error al cargar reseñas:", err.message);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchProduct();
    fetchReviews();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  // ── Verificar si el usuario puede calificar ──────────────────────
  useEffect(() => {
    if (!user || !product) return;

    const checkPurchase = async () => {
      try {
        const { data: orders } = await api.get(`/api/orders/myorders`);

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
      const { data } = await api.post(`/api/products/${product._id}/notify-restock`, {});
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
      await api.post(
        `/api/products/${id}/reviews`,
        { rating, comment }
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
          <ProductGallery product={product} />

          <ProductInfo product={product} />

          {/* Sección de Reseñas — datos de la colección separada */}
          <ProductReviews
            reviews={reviews}
            canReview={canReview}
            daysLeft={daysLeft}
            rating={rating}
            setRating={setRating}
            comment={comment}
            setComment={setComment}
            submittingReview={submittingReview}
            submitReviewHandler={submitReviewHandler}
          />
        </div>

        {/* Columna Derecha: Información de Compra (Sticky) */}
        <ProductBuyBox
          product={product}
          reviews={reviews}
          qty={qty}
          setQty={setQty}
          handleAddToCart={handleAddToCart}
          favoriteIds={favoriteIds}
          handleToggleFavorite={handleToggleFavorite}
          isNotifying={isNotifying}
          handleNotifyRestock={handleNotifyRestock}
        />
      </div>

    </div>
  );
};

export default ProductDetail;

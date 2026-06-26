import { motion } from "framer-motion";
import { Star, Package, ShoppingCart, Bell, Heart } from "lucide-react";

export const ProductBuyBox = ({
  product,
  reviews,
  qty,
  setQty,
  handleAddToCart,
  favoriteIds,
  handleToggleFavorite,
  isNotifying,
  handleNotifyRestock
}) => {
  return (
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
              <button onClick={() => setQty(q => Math.max(1, q - 1))}>-</button>
              <span className="qty-val">{qty}</span>
              <button onClick={() => setQty(q => Math.min(product.countInStock, q + 1))}>+</button>
            </div>
          </div>
        )}

        <div className="cart-action-group">
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
            <Package size={20} />
            <div>
              <strong>Envío Asegurado</strong>
              <p>Despacho en 24hs a todo el país</p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductBuyBox;

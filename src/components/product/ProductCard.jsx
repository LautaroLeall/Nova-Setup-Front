import { Link } from "react-router";
import { ShoppingCart, Heart } from "lucide-react";
import { sileo } from "sileo";
import { useContext } from "react";
import { CartContext } from "../../context/CartContext";
import { AuthContext } from "../../context/AuthContext";
import "../../styles/ProductCard.css";

export const ProductCard = ({ product }) => {
  const { _id, name, brand, price, discountPrice, images, countInStock } = product;

  const { addToCart } = useContext(CartContext);
  const { user, favoriteIds, toggleFavorite } = useContext(AuthContext);

  const isFavorite = favoriteIds?.includes(_id);

  const handleAddToCart = (e) => {
    e.preventDefault();
    if (countInStock === 0) return;

    addToCart(product, 1);

    sileo.success({
      title: "¡Producto Agregado!",
      description: `1x ${name}`,
      position: "bottom-right"
    });
  };

  const handleToggleFavorite = (e) => {
    e.preventDefault();
    if (!user) {
      sileo.error({
        title: "Inicia Sesión",
        description: "Necesitas iniciar sesión para agregar a favoritos.",
        position: "bottom-right"
      });
      return;
    }
    toggleFavorite(_id);
  };

  return (
    <Link to={`/product/${_id}`} className="clean-product-card group">
      {/* Background Glow */}
      <div className="clean-card-glow" />

      <div className="clean-card-inner">
        {/* Imagen del Producto */}
        <div className="clean-card-image-box">
          <img
            src={images[0]}
            alt={name}
            className="clean-card-image"
          />
          {countInStock === 0 && (
            <div className="clean-card-badge danger">AGOTADO</div>
          )}
          {discountPrice && countInStock > 0 && (
            <div className="clean-card-badge offer">OFERTA</div>
          )}

          {/* Botón de Favorito — siempre visible */}
          <button
            className={`clean-card-fav-btn ${isFavorite ? "active" : ""}`}
            onClick={handleToggleFavorite}
            title={isFavorite ? "Quitar de favoritos" : "Agregar a favoritos"}
            aria-label={isFavorite ? "Quitar de favoritos" : "Agregar a favoritos"}
          >
            <Heart
              size={17}
              fill={isFavorite ? "currentColor" : "rgba(255,255,255,0.15)"}
              strokeWidth={isFavorite ? 0 : 1.5}
            />
          </button>
        </div>

        {/* Información */}
        <div className="clean-card-info">
          <div className="clean-card-header">
            <span className="clean-card-brand">{brand}</span>
            <h3 className="clean-card-title">{name}</h3>
          </div>

          <div className="clean-card-footer">
            <div className="clean-card-price-group">
              {discountPrice ? (
                <>
                  <span className="clean-price-current">${discountPrice}</span>
                  <span className="clean-price-old">${price}</span>
                </>
              ) : (
                <span className="clean-price-current">${price}</span>
              )}
            </div>

            <button
              className={`clean-add-btn ${countInStock === 0 ? "disabled" : ""}`}
              onClick={handleAddToCart}
              disabled={countInStock === 0}
              aria-label={countInStock === 0 ? `${name} - Sin stock` : `Agregar ${name} al carrito`}
            >
              <ShoppingCart size={18} />
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;

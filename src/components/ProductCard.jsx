import { Link } from "react-router";
import { ShoppingCart } from "lucide-react";
import { sileo } from "sileo";
import "../styles/ProductCard.css";

export const ProductCard = ({ product }) => {
  const { _id, name, brand, price, discountPrice, images, countInStock } = product;

  const handleAddToCart = (e) => {
    e.preventDefault();
    if (countInStock === 0) return;
    
    sileo.success(`¡Agregado al carrito!`, {
      description: `${name} ha sido añadido.`,
    });
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

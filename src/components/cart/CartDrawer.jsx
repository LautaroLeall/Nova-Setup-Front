import { useContext, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Trash2, ShoppingBag } from "lucide-react";
import { CartContext } from "../../context/CartContext";
import { Link, useNavigate } from "react-router";
import { showConfirmDialog } from "../../utils/swalConfig";
import "../../styles/cart/CartDrawer.css";

export const CartDrawer = () => {
  const navigate = useNavigate();
  const {
    isCartOpen,
    closeCart,
    cartItems,
    removeFromCart,
    updateQuantity,
    clearCart,
    subtotal,
  } = useContext(CartContext);

  // Cerrar el carrito con la tecla Escape
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isCartOpen) {
        closeCart();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isCartOpen, closeCart]);

  const handleClearCart = async () => {
    const result = await showConfirmDialog(
      "¿Vaciar carrito?",
      "¿Estás seguro de que deseas eliminar todos los productos?",
      "Sí, vaciar",
      "Cancelar"
    );
    if (result.isConfirmed) {
      clearCart();
    }
  };

  const handleCheckout = async () => {
    const result = await showConfirmDialog(
      "¿Proceder al pago?",
      "¿Estás listo para finalizar tu compra?",
      "Ir a pagar",
      "Cancelar"
    );
    if (result.isConfirmed) {
      closeCart();
      navigate("/checkout");
    }
  };

  // Prevenir scroll del body cuando el carrito está abierto
  useEffect(() => {
    if (isCartOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [isCartOpen]);

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          {/* Backdrop Borroso */}
          <motion.div
            className="cart-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
          />

          {/* Panel Lateral (Drawer) */}
          <motion.div
            className="cart-drawer"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
          >
            {/* Header */}
            <div className="cart-header">
              <h2>Tu Carrito</h2>
              <div className="cart-header-actions">
                {cartItems.length > 0 && (
                  <button className="cart-clear-all-btn" onClick={handleClearCart} title="Vaciar carrito completo">
                    <Trash2 size={18} />
                  </button>
                )}
                <button className="cart-close-btn" onClick={closeCart}>
                  <X size={24} />
                </button>
              </div>
            </div>

            {/* Content (Items o Estado Vacío) */}
            <div className="cart-body">
              {cartItems.length === 0 ? (
                <div className="cart-empty">
                  <ShoppingBag size={48} strokeWidth={1} />
                  <p>Tu carrito está vacío</p>
                  <button className="cart-continue-btn" onClick={closeCart}>
                    Seguir Comprando
                  </button>
                </div>
              ) : (
                <ul className="cart-items-list">
                  <AnimatePresence>
                    {cartItems.map((item) => (
                      <motion.li
                        key={item._id}
                        className="cart-item"
                        layout
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: -50 }}
                      >
                        <div className="cart-item-img-box">
                          <img src={item.images[0]} alt={item.name} />
                        </div>

                        <div className="cart-item-info">
                          <Link to={`/product/${item._id}`} onClick={closeCart}>
                            <h4>{item.name}</h4>
                          </Link>
                          <p className="cart-item-price">
                            ${item.discountPrice ? item.discountPrice : item.price}
                          </p>

                          <div className="cart-item-controls">
                            <div className="cart-qty-selector">
                              <button
                                onClick={() => updateQuantity(item._id, item.qty - 1, item.countInStock)}
                                disabled={item.qty <= 1}
                              >
                                -
                              </button>
                              <span>{item.qty}</span>
                              <button
                                onClick={() => updateQuantity(item._id, item.qty + 1, item.countInStock)}
                                disabled={item.qty >= item.countInStock}
                              >
                                +
                              </button>
                            </div>
                            <button
                              className="cart-item-remove"
                              onClick={() => removeFromCart(item._id)}
                              title="Eliminar producto"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>
                      </motion.li>
                    ))}
                  </AnimatePresence>
                </ul>
              )}
            </div>

            {/* Footer de Checkout */}
            {cartItems.length > 0 && (
              <div className="cart-footer">
                <div className="cart-subtotal">
                  <span>Subtotal</span>
                  <span className="subtotal-amount">${subtotal.toFixed(2)}</span>
                </div>
                <p className="cart-taxes-note">Impuestos y envío calculados en el checkout</p>
                <button
                  className="cart-checkout-btn"
                  onClick={handleCheckout}
                >
                  Ir a Pagar
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CartDrawer;

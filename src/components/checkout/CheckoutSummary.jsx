import { Lock } from "lucide-react";

const CheckoutSummary = ({ cartItems, subtotal, total }) => {
  return (
    <div className="order-summary-box">
      <h2 className="summary-title">Resumen del Pedido</h2>
      <ul className="summary-items">
        {cartItems.map((item) => (
          <li key={item._id} className="summary-item">
            <div className="summary-item-img">
              <img src={item.images[0]} alt={item.name} />
              <span className="summary-item-qty">{item.qty}</span>
            </div>
            <span className="summary-item-name">{item.name}</span>
            <span className="summary-item-price">
              ${((item.discountPrice ?? item.price) * item.qty).toFixed(2)}
            </span>
          </li>
        ))}
      </ul>

      <div className="summary-totals">
        <div className="summary-row">
          <span>Subtotal</span>
          <span>${subtotal.toFixed(2)}</span>
        </div>
        <div className="summary-row">
          <span>Envío</span>
          <span className="free-shipping">Gratis</span>
        </div>
        <div className="summary-row total-row">
          <span>Total</span>
          <span>${total.toFixed(2)}</span>
        </div>
      </div>

      <div className="summary-security">
        <Lock size={14} />
        <span>Pago 100% seguro con Mercado Pago</span>
      </div>
    </div>
  );
};

export default CheckoutSummary;

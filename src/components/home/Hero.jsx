// src/components/home/Hero.jsx
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, useContext } from "react";
import { ProductContext } from "../../context/ProductContext";
import { CartContext } from "../../context/CartContext";
import { sileo } from "sileo";
import { useNavigate } from "react-router";
import "../../styles/home/Hero.css";

// Tarjeta individual premium (restaurada al estilo MacBook anterior)
const ProductCard = ({ product }) => {
    const { addToCart } = useContext(CartContext);
    const navigate = useNavigate();

    // Si es un producto real o mock
    const imgUrl = product.images?.[0] || product.img;
    const rawPrice = product.discountPrice ?? product.price;
    const priceDisplay = typeof rawPrice === "number" ? `$${rawPrice.toFixed(2)}` : rawPrice;
    const badgeText = product.badges?.[0] || product.tag || "PREMIUM";

    const handleAddToCart = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (product.countInStock === 0) return;

        addToCart(product, 1);

        sileo.success({
            title: "¡Producto Agregado!",
            description: `1x ${product.name}`,
            position: "bottom-right"
        });
    };

    return (
        <div
            className="product-hero-card group"
            onClick={() => navigate(`/product/${product._id || product.id}`)}
        >
            {/* Foto de fondo */}
            <img
                src={imgUrl}
                alt={product.name}
                className="product-hero-img"
                draggable={false}
            />
            {/* Capa oscura base */}
            <div className="product-hero-overlay" />
            {/* Gradiente inferior */}
            <div className="product-hero-gradient" />

            {/* Badge */}
            <div className="product-hero-badge-container">
                <span className="product-hero-badge nova-gradient">
                    {badgeText}
                </span>
            </div>

            {/* Info inferior */}
            <div className="product-hero-info">
                <p className="product-hero-brand">
                    {product.brand || "Nova SetUp"}
                </p>
                <h3 className="product-hero-name">{product.name}</h3>
                <div className="product-hero-footer">
                    <span className="product-hero-price">{priceDisplay}</span>
                    <button
                        className={`product-hero-add-btn nova-gradient nova-glow ${product.countInStock === 0 ? "opacity-30 cursor-not-allowed" : "product-hero-add-btn-hidden"
                            }`}
                        onClick={handleAddToCart}
                        disabled={product.countInStock === 0}
                    >
                        +
                    </button>
                </div>
            </div>
        </div>
    );
};

const MacScreen = ({ children }) => (
    <div className="mac-wrapper">
        <div className="mac-frame">
            {/* Notch */}
            <div className="mac-notch">
                <div className="mac-camera-outer">
                    <div className="mac-camera-inner" />
                </div>
            </div>
            {/* Pantalla */}
            <div className="mac-screen-content">
                {children}
            </div>
            {/* Barbilla */}
            <div className="mac-chin">
                <span className="mac-chin-text">MacBook Pro</span>
            </div>
        </div>
    </div>
);

export function HeroEcommerce() {
    const containerRef = useRef(null);
    const { products } = useContext(ProductContext);

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end start"],
    });

    // ── Fases ────────────────────────────────────────────────────
    // 0.00 → 0.25 : Mac sube desde abajo y el título es empujado
    // 0.25 → 0.65 : Mac en el centro absoluto y el carrusel se mueve
    // 0.65 → 1.00 : Mac se aleja hacia atrás lentamente
    const rotateX = useTransform(scrollYProgress, [0, 0.25, 0.65, 1], [40, 0, 0, -20]);
    const translateZ = useTransform(scrollYProgress, [0, 0.25, 0.65, 1], [-200, 0, 0, -800]);
    const macScale = useTransform(scrollYProgress, [0, 0.25, 0.65, 1], [0.85, 1, 1, 0.5]);
    const macOpacity = useTransform(scrollYProgress, [0, 0.25, 0.75, 1], [0.3, 1, 1, 0]);
    const macY = useTransform(scrollYProgress, [0, 0.25, 0.65, 1], ["50vh", "0vh", "0vh", "-10vh"]);

    // ── Movimiento del carrusel (Ocurre mientras la Mac está centrada)
    const carouselX = useTransform(scrollYProgress, [0.30, 0.60], ["0%", "-50%"]);

    // ── Título: arranca centrado y es empujado hacia arriba
    const titleScale = useTransform(scrollYProgress, [0, 0.20], [1, 0.8]);
    const titleOpacity = useTransform(scrollYProgress, [0, 0.20], [1, 0]);
    const titleY = useTransform(scrollYProgress, [0, 0.25], ["-5vh", "-50vh"]);

    // Usamos 12 productos: 6 para la primera pantalla, 6 para la segunda
    const items = products ? products.slice(0, 12) : [];
    const group1 = items.slice(0, 6);
    const group2 = items.slice(6, 12);

    return (
        <div ref={containerRef} className="hero-wrapper">
            {/* ── Zona sticky: exactamente 100vh ── */}
            <div className="hero-sticky-zone">
                {/* ── TÍTULO ── */}
                <motion.div
                    style={{ scale: titleScale, opacity: titleOpacity, y: titleY }}
                    className="hero-title-container"
                >
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.15 }}
                        className="hero-title-text-center"
                    >
                        <h1 className="hero-title">
                            DISEÑADO PARA LA{" "}
                            <span className="nova-gradient-text animate-gradient">
                                PERFECCIÓN
                            </span>
                        </h1>
                        <p className="hero-subtitle">
                            Teclados mecánicos, iluminación inteligente y setups premium.
                        </p>
                    </motion.div>
                </motion.div>

                {/* ── MAC ── */}
                <motion.div
                    className="hero-mac-container"
                    style={{
                        y: macY,
                        rotateX,
                        z: translateZ,
                        scale: macScale,
                        opacity: macOpacity,
                        transformStyle: "preserve-3d",
                    }}
                >
                    <MacScreen>
                        {/* Contenido dentro de la pantalla Mac */}
                        <div className="mac-screen-inner-content">
                            {/* Dots indicadores de página */}
                            <div className="mac-carousel-dots">
                                <div className="mac-carousel-dot active" />
                                <div className="mac-carousel-dot inactive" />
                            </div>

                            {/* Carrusel Deslizable */}
                            <motion.div
                                style={{ width: "200%", x: carouselX }}
                                className="mac-carousel-wrapper"
                            >
                                {/* Pantalla 1 */}
                                <div className="mac-carousel-page">
                                    {group1.map((p, idx) => (
                                        <div key={p._id || idx} className="mac-product-wrapper">
                                            <ProductCard product={p} />
                                        </div>
                                    ))}
                                </div>
                                {/* Pantalla 2 */}
                                <div className="mac-carousel-page">
                                    {group2.map((p, idx) => (
                                        <div key={p._id || idx} className="mac-product-wrapper">
                                            <ProductCard product={p} />
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        </div>
                    </MacScreen>
                </motion.div>
            </div>
        </div>
    );
}

export default HeroEcommerce;

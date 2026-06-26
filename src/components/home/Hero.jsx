// src/components/Hero.jsx
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, useContext } from "react";
import { ProductContext } from "../../context/ProductContext";
import { CartContext } from "../../context/CartContext";
import { sileo } from "sileo";
import { useNavigate } from "react-router";

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
            className="relative h-full flex-1 overflow-hidden group cursor-pointer border-r border-white/5 last:border-r-0"
            onClick={() => navigate(`/product/${product._id || product.id}`)}
        >
            {/* Foto de fondo */}
            <img
                src={imgUrl}
                alt={product.name}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                draggable={false}
            />
            {/* Capa oscura base */}
            <div className="absolute inset-0 bg-black/50 group-hover:bg-black/30 transition-colors duration-500" />
            {/* Gradiente inferior */}
            <div className="absolute inset-0 bg-linear-to-t from-black via-black/20 to-transparent" />

            {/* Badge */}
            <div className="absolute top-3 left-3">
                <span className="text-[9px] font-black tracking-widest text-white px-2 py-0.5 rounded-full nova-gradient">
                    {badgeText}
                </span>
            </div>

            {/* Info inferior */}
            <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                <p className="font-mono text-[10px] tracking-widest mb-0.5 uppercase" style={{ color: "#3adbf1" }}>
                    {product.brand || "Nova SetUp"}
                </p>
                <h3 className="text-white font-bold text-sm leading-tight mb-2">{product.name}</h3>
                <div className="flex items-center justify-between">
                    <span className="font-black text-base" style={{ color: "#3adbf1" }}>{priceDisplay}</span>
                    <button
                        className={`text-white w-7 h-7 rounded-full flex items-center justify-center text-base font-bold transition-all duration-300 active:scale-90 nova-gradient nova-glow ${product.countInStock === 0 ? "opacity-30 cursor-not-allowed" : "opacity-0 group-hover:opacity-100"
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
    <div className="w-full" style={{ aspectRatio: "16/9" }}>
        <div className="w-full h-full rounded-[1.75rem] border-4 border-[#2a2a2a] bg-[#1c1c1e] shadow-[0_30px_80px_rgba(0,0,0,0.9)] overflow-hidden flex flex-col relative">
            {/* Notch */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-5 bg-[#1c1c1e] rounded-b-xl z-20 flex items-end justify-center pb-1">
                <div className="w-1.5 h-1.5 rounded-full bg-[#111] border border-white/10 flex items-center justify-center">
                    <div className="w-0.75 h-0.75 bg-blue-400/50 rounded-full" />
                </div>
            </div>
            {/* Pantalla */}
            <div className="grow mx-2 mt-2 mb-5 bg-[#050505] rounded-t-3xl rounded-b-sm overflow-hidden border border-white/6">
                {children}
            </div>
            {/* Barbilla */}
            <div className="absolute bottom-1 left-0 right-0 h-4 flex justify-center items-center">
                <span className="text-[7px] tracking-[0.25em] text-white/20 uppercase font-semibold">MacBook Pro</span>
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
        <div ref={containerRef} className="relative w-full bg-transparent" style={{ height: "500vh" }}>
            {/* ── Zona sticky: exactamente 100vh ── */}
            <div
                className="sticky top-0 w-full h-screen flex items-center justify-center overflow-hidden"
                style={{ perspective: "1400px" }}
            >
                {/* ── TÍTULO ── */}
                <motion.div
                    style={{ scale: titleScale, opacity: titleOpacity, y: titleY }}
                    className="absolute z-10 w-full flex flex-col items-center justify-center pointer-events-none px-4"
                >
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.15 }}
                        className="text-center"
                    >
                        <h1 className="text-4xl md:text-5xl lg:text-7xl font-black text-white tracking-tighter leading-none">
                            DISEÑADO PARA LA{" "}
                            <span className="nova-gradient-text animate-gradient">
                                PERFECCIÓN
                            </span>
                        </h1>
                        <p className="mt-4 text-sm md:text-base lg:text-lg max-w-lg mx-auto font-light" style={{ color: "#a682e7", opacity: 0.8 }}>
                            Teclados mecánicos, iluminación inteligente y setups premium.
                        </p>
                    </motion.div>
                </motion.div>

                {/* ── MAC ── */}
                <motion.div
                    className="absolute z-0 w-full max-w-250 flex items-center justify-center px-4"
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
                        <div className="relative w-full h-full overflow-hidden" style={{ background: "#06060f" }}>
                            {/* Dots indicadores de página */}
                            <div className="absolute top-3 left-1/2 -translate-x-1/2 flex gap-2 z-20">
                                <div className="w-2 h-2 rounded-full" style={{ background: "rgba(255,255,255,0.8)" }} />
                                <div className="w-2 h-2 rounded-full" style={{ background: "rgba(255,255,255,0.3)" }} />
                            </div>

                            {/* Carrusel Deslizable */}
                            <motion.div
                                style={{ width: "200%", x: carouselX }}
                                className="flex h-full"
                            >
                                {/* Pantalla 1 */}
                                <div className="w-1/2 h-full grid grid-cols-3 grid-rows-2">
                                    {group1.map((p, idx) => (
                                        <div key={p._id || idx} className="relative h-full w-full border-b border-r border-white/5 last:border-b-0">
                                            <ProductCard product={p} />
                                        </div>
                                    ))}
                                </div>
                                {/* Pantalla 2 */}
                                <div className="w-1/2 h-full grid grid-cols-3 grid-rows-2">
                                    {group2.map((p, idx) => (
                                        <div key={p._id || idx} className="relative h-full w-full border-b border-r border-white/5 last:border-b-0">
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

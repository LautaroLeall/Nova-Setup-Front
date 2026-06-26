// src/components/Hero.jsx
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, useContext } from "react";
import { ProductContext } from "../context/ProductContext";
import { CartContext } from "../context/CartContext";
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
                    <div className="w-[3px] h-[3px] bg-blue-400/50 rounded-full" />
                </div>
            </div>
            {/* Pantalla */}
            <div className="grow mx-2 mt-2 mb-5 bg-[#050505] rounded-t-3xl rounded-b-sm overflow-hidden border border-white/[0.06]">
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
    // 0.00 → 0.15 : Mac se levanta (acostada → derecha)
    // 0.15 → 0.80 : Mac quieta, carrusel corre
    // 0.80 → 1.00 : Mac se aleja
    const rotateX = useTransform(scrollYProgress, [0, 0.15, 0.80, 1], [25, 0, 0, -25]);
    const translateZ = useTransform(scrollYProgress, [0, 0.15, 0.80, 1], [-200, 0, 0, -600]);
    const macScale = useTransform(scrollYProgress, [0, 0.15, 0.80, 1], [0.85, 1, 1, 0.65]);
    const macOpacity = useTransform(scrollYProgress, [0, 0.15, 0.88, 1], [0.5, 1, 1, 0]);

    // ── Título: grande al inicio, se achica mientras la Mac sube ─
    // Mientras p va de 0 a 0.15 el titulo se encoge y sube
    const titleScale = useTransform(scrollYProgress, [0, 0.15], [1, 0.55]);
    const titleOpacity = useTransform(scrollYProgress, [0, 0.12, 0.80, 0.88], [1, 0, 0, 0]);
    const titleY = useTransform(scrollYProgress, [0, 0.15], ["0px", "-24px"]);

    // El carrusel se mueve SÓLO mientras la Mac está quieta (fases 0.15 → 0.80)
    // -50% = desplazar la mitad del ancho total (2 grupos de 3 tarjetas)
    const carouselX = useTransform(scrollYProgress, [0.15, 0.80], ["0%", "-50%"]);

    // Usamos exclusivamente los productos que vienen del backend (max 6)
    const items = products ? products.slice(0, 6) : [];

    return (
        <div ref={containerRef} className="relative w-full bg-transparent" style={{ height: "500vh" }}>
            {/* ── Zona sticky: exactamente 100vh ── */}
            <div
                className="sticky top-0 w-full h-screen flex flex-col overflow-hidden"
                style={{ perspective: "1400px" }}
            >
                {/* Espaciador del Navbar (100px) */}
                <div className="h-[100px] shrink-0" />

                {/* ── TÍTULO ── grande al inicio, desaparece al subir la Mac */}
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 0.15 }}
                    style={{ scale: titleScale, opacity: titleOpacity, y: titleY }}
                    className="shrink-0 text-center px-3 pb-3 origin-top"
                >
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white tracking-tighter leading-none">
                        DISEÑADO PARA LA{" "}
                        <span className="nova-gradient-text animate-gradient">
                            PERFECCIÓN
                        </span>
                    </h1>
                    <p className="mt-3 text-sm md:text-base max-w-lg mx-auto font-light" style={{ color: "#a682e7", opacity: 0.8 }}>
                        Teclados mecánicos, iluminación inteligente y setups premium.
                    </p>
                </motion.div>

                {/* ── MAC ── ocupa el espacio restante, crece cuando el título se achica */}
                <div className="flex-1 flex items-center justify-center px-3 pb-4 min-h-0">
                    <motion.div
                        className="w-full max-w-4xl"
                        style={{
                            rotateX,
                            z: translateZ,
                            scale: macScale,
                            opacity: macOpacity,
                            transformStyle: "preserve-3d",
                            maxHeight: "calc(100vh - 72px - 2rem)",
                        }}
                    >
                        <MacScreen>
                            {/* Contenido dentro de la pantalla Mac */}
                            <div className="relative w-full h-full overflow-hidden" style={{ background: "#06060f" }}>
                                {/* Dots indicadores de página (ahora 2 páginas) */}
                                <div className="absolute top-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
                                    {[0, 1].map(i => (
                                        <div key={i} className="w-1.5 h-1.5 rounded-full" style={{ background: "#2c2767" }} />
                                    ))}
                                </div>

                                {/* Carrusel: 2 grupos de 3 cards, el motion.div se desplaza mostrando 1 grupo a la vez */}
                                <motion.div
                                    style={{ width: "200%", x: carouselX }}
                                    className="flex h-full"
                                >
                                    <div className="flex h-full" style={{ width: "50%" }}>
                                        {items.slice(0, 3).map((p, idx) => <ProductCard key={p._id || idx} product={p} />)}
                                    </div>
                                    <div className="flex h-full" style={{ width: "50%" }}>
                                        {items.slice(3, 6).map((p, idx) => <ProductCard key={p._id || idx} product={p} />)}
                                    </div>
                                </motion.div>
                            </div>
                        </MacScreen>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}

export default HeroEcommerce;
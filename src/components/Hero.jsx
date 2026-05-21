import { HeroContainer } from "./HeroContainer";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

const products = [
    { id: 1, name: "Teclado Neo Matrix", price: "$199", tag: "NUEVO", img: "https://images.unsplash.com/photo-1595225476474-87563907a212?q=80&w=2071&auto=format&fit=crop" },
    { id: 2, name: "Display Holográfico", price: "$299", tag: "LIMITADO", img: "https://images.unsplash.com/photo-1626218174358-7769486c4b79?q=80&w=2074&auto=format&fit=crop" },
    { id: 3, name: "Tira LED Inteligente", price: "$89", tag: "POPULAR", img: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2070&auto=format&fit=crop" },
    { id: 4, name: "Alfombrilla Cyberpunk", price: "$49", tag: "OFERTA", img: "https://images.unsplash.com/photo-1522869635100-9f4c5e86aa37?q=80&w=2070&auto=format&fit=crop" },
    { id: 5, name: "Reloj Tubos Nixie", price: "$149", tag: "EXCLUSIVO", img: "https://images.unsplash.com/photo-1501162946741-4960f91cebf5?q=80&w=2069&auto=format&fit=crop" },
    { id: 6, name: "Organizador Magnético", price: "$39", tag: "POPULAR", img: "https://images.unsplash.com/photo-1497215728101-856f4ea42174?q=80&w=2070&auto=format&fit=crop" },
    { id: 7, name: "Lámpara Levitante", price: "$129", tag: "NUEVO", img: "https://images.unsplash.com/photo-1507668077129-56e32842fceb?q=80&w=2070&auto=format&fit=crop" },
    { id: 8, name: "Keycaps Transparentes", price: "$59", tag: "HOT", img: "https://images.unsplash.com/photo-1618384887929-16ec33faf9ca?q=80&w=2070&auto=format&fit=crop" },
    { id: 9, name: "Soporte Aluminio", price: "$89", tag: "PREMIUM", img: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?q=80&w=2070&auto=format&fit=crop" },
];

// Tarjeta individual premium
const ProductCard = ({ product }) => (
    <div className="relative h-full flex-1 overflow-hidden group cursor-pointer border-r border-white/5 last:border-r-0">
        {/* Foto de fondo */}
        <img
            src={product.img}
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
                {product.tag}
            </span>
        </div>

        {/* Info inferior */}
        <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
            <p className="font-mono text-[10px] tracking-widest mb-0.5 uppercase" style={{ color: "#3adbf1" }}>Nova SetUp</p>
            <h3 className="text-white font-bold text-sm leading-tight mb-2">{product.name}</h3>
            <div className="flex items-center justify-between">
                <span className="font-black text-base" style={{ color: "#3adbf1" }}>{product.price}</span>
                <button
                    className="text-white w-7 h-7 rounded-full flex items-center justify-center text-base font-bold opacity-0 group-hover:opacity-100 transition-all duration-300 active:scale-90 nova-gradient nova-glow"
                >
                    +
                </button>
            </div>
        </div>
    </div>
);

export function HeroEcommerce() {
    // Un solo ref y un solo scrollYProgress para TODO el hero
    const containerRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end start"],
    });

    // ── Carrusel ─────────────────────────────────────────────
    // El carrusel se mueve SÓLO mientras la Mac está quieta (fases 0.15 → 0.80)
    // -66.666% = desplazar 2/3 del ancho total (3 grupos de 3 tarjetas)
    const carouselX = useTransform(scrollYProgress, [0.15, 0.80], ["0%", "-66.666%"]);

    return (
        <HeroContainer
            containerRef={containerRef}
            scrollYProgress={scrollYProgress}
            titleComponent={
                <>
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white tracking-tighter leading-none">
                        DISEÑADO PARA LA{" "}
                        <span className="nova-gradient-text animate-gradient">
                            PERFECCIÓN
                        </span>
                    </h1>
                    <p className="mt-3 text-sm md:text-base max-w-lg mx-auto font-light" style={{ color: "#a682e7", opacity: 0.8 }}>
                        Teclados mecánicos, iluminación inteligente y coleccionables que transforman tu escritorio.
                    </p>
                </>
            }
        >
            {/* Contenido dentro de la pantalla Mac */}
            <div className="relative w-full h-full overflow-hidden" style={{ background: "#06060f" }}>
                {/* Dots indicadores de página */}
                <div className="absolute top-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
                    {[0, 1, 2].map(i => (
                        <div key={i} className="w-1.5 h-1.5 rounded-full" style={{ background: "#2c2767" }} />
                    ))}
                </div>

                {/* Carrusel: 3 grupos de 3 cards, el motion.div se desplaza mostrando 1 grupo a la vez */}
                <motion.div
                    style={{ width: "300%", x: carouselX }}
                    className="flex h-full"
                >
                    {/* Grupo 1: productos 1-3 */}
                    <div className="flex h-full" style={{ width: "33.333%" }}>
                        {products.slice(0, 3).map(p => <ProductCard key={p.id} product={p} />)}
                    </div>
                    {/* Grupo 2: productos 4-6 */}
                    <div className="flex h-full" style={{ width: "33.333%" }}>
                        {products.slice(3, 6).map(p => <ProductCard key={p.id} product={p} />)}
                    </div>
                    {/* Grupo 3: productos 7-9 */}
                    <div className="flex h-full" style={{ width: "33.333%" }}>
                        {products.slice(6, 9).map(p => <ProductCard key={p.id} product={p} />)}
                    </div>
                </motion.div>
            </div>
        </HeroContainer>
    );
}

export default HeroEcommerce;
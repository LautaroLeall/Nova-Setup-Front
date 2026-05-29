// src/hero/HeroEcommerce.jsx
import { HeroContainer } from "./HeroContainer";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import "../styles/Hero.css";

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

const ProductCard = ({ product }) => (
    <div className="product-card">
        <img src={product.img} alt={product.name} className="product-img" draggable={false} />
        <div className="product-overlay-dark" />
        <div className="product-overlay-gradient" />

        <div className="product-badge-container">
            <span className="product-badge">{product.tag}</span>
        </div>

        <div className="product-info-container">
            <p className="product-brand">Nova SetUp</p>
            <h3 className="product-name">{product.name}</h3>
            <div className="product-price-row">
                <span className="product-price">{product.price}</span>
                <button className="product-add-btn">+</button>
            </div>
        </div>
    </div>
);

export function HeroEcommerce() {
    const containerRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end start"],
    });

    // Movimiento horizontal sincronizado con el estado estático central
    const carouselX = useTransform(scrollYProgress, [0.25, 0.75], ["0%", "-66.666%"]);

    return (
        <HeroContainer
            containerRef={containerRef}
            scrollYProgress={scrollYProgress}
            titleComponent={
                <>
                    <h1 className="hero-title-text">
                        DISEÑADO PARA LA{" "}
                        <span className="nova-gradient-text animate-gradient">
                            PERFECCIÓN
                        </span>
                    </h1>
                    <p className="hero-subtitle-text">
                        Teclados mecánicos, iluminación inteligente y setups premium.
                    </p>
                </>
            }
        >
            <div className="hero-carousel-container">
                <motion.div
                    style={{ width: "300%", x: carouselX }}
                    className="hero-carousel-track"
                >
                    <div className="hero-carousel-group">
                        {products.slice(0, 3).map(p => <ProductCard key={p.id} product={p} />)}
                    </div>
                    <div className="hero-carousel-group">
                        {products.slice(3, 6).map(p => <ProductCard key={p.id} product={p} />)}
                    </div>
                    <div className="hero-carousel-group">
                        {products.slice(6, 9).map(p => <ProductCard key={p.id} product={p} />)}
                    </div>
                </motion.div>
            </div>
        </HeroContainer>
    );
}

export default HeroEcommerce;
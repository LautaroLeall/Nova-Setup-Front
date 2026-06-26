import { useState } from "react";
import HeroEcommerce from "../components/home/Hero";
import { motion } from "framer-motion";
import { useNavigate } from "react-router";
import HomeScrollAssembly from "../components/home/HomeScrollAssembly";
import HomeManifesto from "../components/home/HomeManifesto";
import Footer from "../components/layout/Footer";
import "../styles/Home.css";

const Home = () => {
  const navigate = useNavigate();

  // Botón Magnético Interactivo
  const [btnPos, setBtnPos] = useState({ x: 0, y: 0 });
  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    setBtnPos({ x: x * 0.3, y: y * 0.3 });
  };
  const handleMouseLeave = () => {
    setBtnPos({ x: 0, y: 0 });
  };

  return (
    <main className="home-page-container">
      {/* ── Hero Carousel (Sin Tocar) ── */}
      <HeroEcommerce />

      {/* ── Animación 2.5D de Ensamblaje ── */}
      <HomeScrollAssembly />

      {/* ── Manifiesto de la Marca (Historia y Pilares) ── */}
      <HomeManifesto />

      {/* ── Call To Action Magnético ── */}
      <section className="home-section-cta">
        <div className="cta-glow-main" />
        <div className="cta-content-wrapper">
          <h2>¿Listo para subir de nivel tu Setup?</h2>
          <p>Equípate con herramientas construidas para durar y optimizar tu productividad diaria.</p>

          <motion.button
            className="btn-magnetic-cta"
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            animate={{ x: btnPos.x, y: btnPos.y }}
            transition={{ type: "spring", stiffness: 150, damping: 15, mass: 0.5 }}
            onClick={() => navigate("/shop")}
          >
            ENTRAR A LA TIENDA
          </motion.button>
        </div>
      </section>

      {/* ── Footer Decorativo ── */}
      <Footer />
    </main>
  );
};

export default Home;

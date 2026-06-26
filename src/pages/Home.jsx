import { useContext, useRef, useState, useEffect } from "react";
import { ProductContext } from "../context/ProductContext";
import ProductCard from "../components/ProductCard";
import HeroEcommerce from "../components/Hero";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { useNavigate } from "react-router";
import { Monitor, Keyboard, Mouse, Headphones, ArrowRight, Zap, AudioLines, Sparkles } from "lucide-react";
import "../styles/Home.css";

// ── Componente de Animación Parallax 2.5D ──
const ScrollSetupAssembly = () => {
  const containerRef = useRef(null);
  
  // Rastrear el scroll dentro de este contenedor
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  // Smoothing para que no sea tan brusco
  const smoothProgress = useSpring(scrollYProgress, { damping: 20, stiffness: 100 });

  // Transformaciones (Fases: 0.2-0.6 Ensamblaje | 0.6-0.75 Hold | 0.75-1.0 Desensamblaje)
  
  // Monitor
  const monitorScale = useTransform(smoothProgress, [0.2, 0.45, 0.75, 0.95], [0.5, 1.2, 1.2, 0.8]);
  const monitorY = useTransform(smoothProgress, [0.2, 0.45, 0.75, 0.95], [100, 0, 0, -100]);
  const monitorOpacity = useTransform(smoothProgress, [0.15, 0.4, 0.85, 1], [0, 1, 1, 0]);

  // Teclado
  const keyboardX = useTransform(smoothProgress, [0.3, 0.5, 0.75, 0.95], [-300, -80, -80, -400]);
  const keyboardY = useTransform(smoothProgress, [0.3, 0.5, 0.75, 0.95], [200, 150, 150, 300]);
  const keyboardOpacity = useTransform(smoothProgress, [0.25, 0.45, 0.85, 1], [0, 1, 1, 0]);
  const keyboardRotateZ = useTransform(smoothProgress, [0.3, 0.5, 0.75, 0.95], [-45, -15, -15, -60]);

  // Mouse
  const mouseX = useTransform(smoothProgress, [0.35, 0.55, 0.75, 0.95], [300, 120, 120, 400]);
  const mouseY = useTransform(smoothProgress, [0.35, 0.55, 0.75, 0.95], [200, 160, 160, 300]);
  const mouseOpacity = useTransform(smoothProgress, [0.3, 0.5, 0.85, 1], [0, 1, 1, 0]);
  const mouseRotateZ = useTransform(smoothProgress, [0.35, 0.55, 0.75, 0.95], [45, 15, 15, 60]);

  // Auriculares
  const headsetX = useTransform(smoothProgress, [0.4, 0.6, 0.75, 0.95], [300, 180, 180, 400]);
  const headsetY = useTransform(smoothProgress, [0.4, 0.6, 0.75, 0.95], [-200, -80, -80, -300]);
  const headsetOpacity = useTransform(smoothProgress, [0.35, 0.55, 0.85, 1], [0, 1, 1, 0]);
  const headsetRotateZ = useTransform(smoothProgress, [0.4, 0.6, 0.75, 0.95], [60, 25, 25, 80]);

  // Textos
  const textOpacity = useTransform(smoothProgress, [0.15, 0.25], [1, 0]);
  const assembledTextOpacity = useTransform(smoothProgress, [0.6, 0.65, 0.8, 0.9], [0, 1, 1, 0]);

  return (
    <section className="home-assembly-section" ref={containerRef}>
      <div className="assembly-sticky-container">
        
        <motion.div className="assembly-intro-text" style={{ opacity: textOpacity }}>
          <h2>CONSTRUYE TU <span>ECOSISTEMA</span></h2>
          <p>Pieza por pieza, diseñado para la perfección.</p>
        </motion.div>

        {/* El Escenario 3D */}
        <div className="assembly-stage">
          {/* Monitor */}
          <motion.div 
            className="assembly-piece monitor-piece"
            style={{ scale: monitorScale, y: monitorY, opacity: monitorOpacity }}
          >
            <div className="piece-glow neon-blue"></div>
            <Monitor size={160} strokeWidth={1} color="#fff" />
          </motion.div>

          {/* Keyboard */}
          <motion.div 
            className="assembly-piece keyboard-piece"
            style={{ x: keyboardX, y: keyboardY, opacity: keyboardOpacity, rotateZ: keyboardRotateZ }}
          >
            <div className="piece-glow neon-cyan"></div>
            <Keyboard size={100} strokeWidth={1.2} color="#fff" />
          </motion.div>

          {/* Mouse */}
          <motion.div 
            className="assembly-piece mouse-piece"
            style={{ x: mouseX, y: mouseY, opacity: mouseOpacity, rotateZ: mouseRotateZ }}
          >
            <div className="piece-glow neon-pink"></div>
            <Mouse size={60} strokeWidth={1.5} color="#fff" />
          </motion.div>

          {/* Auriculares */}
          <motion.div 
            className="assembly-piece headset-piece"
            style={{ x: headsetX, y: headsetY, opacity: headsetOpacity, rotateZ: headsetRotateZ }}
          >
            <div className="piece-glow neon-purple"></div>
            <Headphones size={90} strokeWidth={1.2} color="#fff" />
          </motion.div>
        </div>

        <motion.div 
          className="assembly-outro-text" 
          style={{ opacity: assembledTextOpacity, top: '15%' }}
        >
          <h2>SETUP <span>COMPLETADO</span></h2>
          <p>La máxima sinergia entre tus periféricos.</p>
        </motion.div>

      </div>
    </section>
  );
};

// ── Componente Manifesto (Historia y Qué Hacemos) ──
const NovaManifesto = () => {
  return (
    <section className="home-manifesto-section">
      <div className="manifesto-grid">
        
        {/* Columna Izquierda (Sticky Text) */}
        <div className="manifesto-text-col">
          <div className="manifesto-sticky">
            <span className="manifesto-subtitle">NUESTRO ADN</span>
            <h2 className="manifesto-title">FORJANDO EL <span>FUTURO</span> DEL SETUP</h2>
            <p className="manifesto-desc">
              Nova SetUp no es solo una tienda de tecnología. Somos el puente entre el hardware premium y los entusiastas que exigen la máxima perfección en su espacio de trabajo y juego.
            </p>
            <p className="manifesto-desc">
              Diseñamos, seleccionamos y optimizamos cada pieza para que tu escritorio no solo sea funcional, sino una obra de arte cibernética.
            </p>
          </div>
        </div>

        {/* Columna Derecha (Pilares en Glassmorphism) */}
        <div className="manifesto-pillars-col">
          <motion.div 
            className="pillar-card"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
          >
            <div className="pillar-icon-box cyan-box">
              <Zap size={28} />
            </div>
            <div className="pillar-content">
              <h3>Rendimiento Extremo</h3>
              <p>Cada componente que ofrecemos es probado bajo los estándares más exigentes. Solo hardware de grado entusiasta, sin cuellos de botella.</p>
            </div>
          </motion.div>

          <motion.div 
            className="pillar-card"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ delay: 0.1 }}
          >
            <div className="pillar-icon-box purple-box">
              <Sparkles size={28} />
            </div>
            <div className="pillar-content">
              <h3>Estética Ciber-Minimalista</h3>
              <p>Creemos en el poder de un escritorio limpio. Cables ocultos, líneas rectas y una iluminación inteligente que se adapta a tu estado de ánimo.</p>
            </div>
          </motion.div>

          <motion.div 
            className="pillar-card"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ delay: 0.2 }}
          >
            <div className="pillar-icon-box pink-box">
              <AudioLines size={28} />
            </div>
            <div className="pillar-content">
              <h3>Sinergia Sensorial</h3>
              <p>Desde el click táctil perfecto de un teclado mecánico custom hasta la acústica inmersiva de tus auriculares. Todo está conectado.</p>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};


const Home = () => {
  const { products, loading } = useContext(ProductContext);
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
      <ScrollSetupAssembly />

      {/* ── Manifiesto de la Marca (Historia y Pilares) ── */}
      <NovaManifesto />

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

      {/* ── Footer Decorativo (Sin Tocar) ── */}
      <section className="home-section-footer">
        <div className="home-footer-text-container">
          <h2 className="home-footer-title">NOVA SETUP</h2>
        </div>
      </section>
    </main>
  );
};

export default Home;

import { useRef } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { Monitor, Keyboard, Mouse, Headphones } from "lucide-react";

const HomeScrollAssembly = () => {
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

export default HomeScrollAssembly;

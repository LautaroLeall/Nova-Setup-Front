import { motion } from "framer-motion";
import { Zap, AudioLines, Sparkles } from "lucide-react";

const HomeManifesto = () => {
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

export default HomeManifesto;

import { motion } from "framer-motion";
import { Link } from "react-router";
import { Cpu, Monitor, Mouse, Keyboard, HardDrive, Headphones, Home } from "lucide-react";
import "../styles/NotFound.css";

const floatingElements = [
  { Icon: Cpu, size: 64, color: "var(--color-nova-cyan)", initialPosition: { x: "-30vw", y: "-20vh" }, delay: 0 },
  { Icon: Monitor, size: 80, color: "var(--color-nova-magenta)", initialPosition: { x: "25vw", y: "-35vh" }, delay: 1 },
  { Icon: Mouse, size: 48, color: "var(--color-nova-purple)", initialPosition: { x: "35vw", y: "15vh" }, delay: 2 },
  { Icon: Keyboard, size: 72, color: "var(--color-nova-cyan)", initialPosition: { x: "-25vw", y: "30vh" }, delay: 0.5 },
  { Icon: HardDrive, size: 56, color: "var(--color-nova-magenta)", initialPosition: { x: "-10vw", y: "-40vh" }, delay: 1.5 },
  { Icon: Headphones, size: 64, color: "var(--color-nova-purple)", initialPosition: { x: "15vw", y: "35vh" }, delay: 2.5 },
];

const NotFound = () => {
  return (
    <div className="not-found-page">
      {/* Background Floating Elements */}
      <div className="floating-elements-container">
        {floatingElements.map((el, idx) => (
          <motion.div
            key={idx}
            className="floating-icon"
            initial={{ x: el.initialPosition.x, y: el.initialPosition.y, opacity: 0.3 }}
            animate={{
              x: [el.initialPosition.x, `calc(${el.initialPosition.x} + 20px)`, `calc(${el.initialPosition.x} - 20px)`, el.initialPosition.x],
              y: [el.initialPosition.y, `calc(${el.initialPosition.y} - 30px)`, `calc(${el.initialPosition.y} + 15px)`, el.initialPosition.y],
              opacity: 0.3,
              rotate: [0, 15, -15, 0]
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "easeInOut",
              delay: el.delay,
            }}
          >
            <el.Icon size={el.size} color={el.color} style={{ filter: `drop-shadow(0 0 20px ${el.color})` }} />
          </motion.div>
        ))}
      </div>

      {/* Main Content */}
      <motion.div
        className="not-found-content"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <motion.div
          className="glitch-wrapper"
          animate={{ x: [-2, 2, -2, 0], y: [1, -1, 1, 0] }}
          transition={{ duration: 0.2, repeat: Infinity, repeatDelay: 3 }}
        >
          <h1 className="error-code" data-text="404">404</h1>
        </motion.div>

        <h2 className="error-title">SYSTEM_ERROR: PAGE_NOT_FOUND</h2>

        <p className="error-description">
          Parece que has intentado acceder a un sector del servidor que ha sido desconectado o no existe.
          Nuestros drones de búsqueda no encontraron la ruta solicitada.
        </p>

        <Link to="/" className="btn-return-home">
          <Home size={20} />
          <span>Volver al Inicio</span>
        </Link>
      </motion.div>
    </div>
  );
};

export default NotFound;

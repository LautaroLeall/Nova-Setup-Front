// src/hero/HeroContainer.jsx
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import "../styles/Hero.css";

export const HeroContainer = ({ titleComponent, children, containerRef, scrollYProgress }) => {
    const internalRef = useRef(null);
    const ref = containerRef || internalRef;

    const { scrollYProgress: ownProgress } = useScroll({
        target: ref,
        offset: ["start start", "end start"],
    });

    const p = scrollYProgress ?? ownProgress;

    const deviceY = useTransform(p, [0, 0.25, 0.75, 1], ["5vh", "0vh", "-5vh", "-10vh"]);

    const rotateX = useTransform(p, [0, 0.25, 0.75, 1], [20, 0, 0, -15]);
    const translateZ = useTransform(p, [0, 0.25, 0.75, 1], [-150, 0, 0, -400]);
    const deviceScale = useTransform(p, [0, 0.25, 0.75, 1], [0.9, 1, 1, 0.8]);
    const deviceOpacity = useTransform(p, [0, 0.1, 0.80, 1], [0.6, 1, 1, 0]);

    const titleY = useTransform(p, [0, 0.25], ["5vh", "-45vh"]);
    const titleOpacity = useTransform(p, [0, 0.18, 0.25], [1, 0.4, 0]);
    const titleScale = useTransform(p, [0, 0.25], [1, 0.85]);

    return (
        <div ref={ref} className="hero-container-wrapper">
            <div className="hero-sticky-zone">

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    style={{ scale: titleScale, opacity: titleOpacity, y: titleY }}
                    className="hero-title-motion"
                >
                    {titleComponent}
                </motion.div>

                <div className="hero-device-container">
                    <motion.div
                        className="hero-device-motion"
                        style={{
                            y: deviceY,
                            rotateX,
                            z: translateZ,
                            scale: deviceScale,
                            opacity: deviceOpacity,
                            transformStyle: "preserve-3d",
                        }}
                    >
                        <ProTablet>{children}</ProTablet>
                    </motion.div>
                </div>

            </div>
        </div>
    );
};

const ProTablet = ({ children }) => (
    <div className="pro-tablet-wrapper">
        <div className="pro-tablet-glow" />
        <div className="pro-tablet-frame">
            <div className="pro-tablet-power-btn" />
            <div className="pro-tablet-volume-btn" />

            <div className="pro-tablet-camera-container">
                <div className="pro-tablet-sensor" />
                <div className="pro-tablet-camera" />
            </div>

            <div className="pro-tablet-display">
                {children}
            </div>
        </div>
    </div>
);

export default HeroContainer;
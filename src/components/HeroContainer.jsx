import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

export const HeroContainer = ({ titleComponent, children, containerRef, scrollYProgress }) => {
    const internalRef = useRef(null);
    const ref = containerRef || internalRef;

    const { scrollYProgress: ownProgress } = useScroll({
        target: ref,
        offset: ["start start", "end start"],
    });

    const p = scrollYProgress ?? ownProgress;

    // ── Fases ────────────────────────────────────────────────────
    // 0.00 → 0.15 : Mac se levanta (acostada → derecha)
    // 0.15 → 0.80 : Mac quieta, carrusel corre
    // 0.80 → 1.00 : Mac se aleja
    const rotateX    = useTransform(p, [0, 0.15, 0.80, 1], [25, 0, 0, -25]);
    const translateZ = useTransform(p, [0, 0.15, 0.80, 1], [-200, 0, 0, -600]);
    const macScale   = useTransform(p, [0, 0.15, 0.80, 1], [0.85, 1, 1, 0.65]);
    const macOpacity = useTransform(p, [0, 0.15, 0.88, 1], [0.5, 1, 1, 0]);

    // ── Título: grande al inicio, se achica mientras la Mac sube ─
    // Mientras p va de 0 a 0.15 el titulo se encoge y sube
    const titleScale   = useTransform(p, [0, 0.15], [1, 0.55]);
    const titleOpacity = useTransform(p, [0, 0.12, 0.80, 0.88], [1, 0, 0, 0]);
    const titleY       = useTransform(p, [0, 0.15], ["0px", "-24px"]);

    return (
        <div ref={ref} className="relative w-full bg-black" style={{ height: "500vh" }}>

            {/* ── Zona sticky: exactamente 100vh ── */}
            <div
                className="sticky top-0 w-full h-screen flex flex-col overflow-hidden"
                style={{ perspective: "1400px" }}
            >
                {/* Espaciador del Navbar (72px) */}
                <div className="h-[100px] shrink-0" />

                {/* ── TÍTULO ── grande al inicio, desaparece al subir la Mac */}
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 0.15 }}
                    style={{ scale: titleScale, opacity: titleOpacity, y: titleY }}
                    className="shrink-0 text-center px-3 pb-3 origin-top"
                >
                    {titleComponent}
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
                        <MacScreen>{children}</MacScreen>
                    </motion.div>
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

export default HeroContainer;
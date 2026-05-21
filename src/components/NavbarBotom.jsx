import { useState, useEffect } from "react";
import {
    Home,
    LaptopMinimalCheck,
    Heart,
    ShoppingCart,
    User,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const navItems = [
    { label: "Inicio", icon: Home },
    { label: "Productos", icon: LaptopMinimalCheck },
    { label: "Favoritos", icon: Heart },
    { label: "Carrito", icon: ShoppingCart },
    { label: "Perfil", icon: User },
];

export function BottomNavBar({
    className = "",
    defaultIndex = 0,
}) {
    const [activeIndex, setActiveIndex] = useState(defaultIndex);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            //
            // El Hero ocupa 500vh. Con offset ["start start", "end start"]
            // scrollYProgress llega a 1 cuando el usuario scrolleó 400vh
            // (500vh - 100vh del viewport).
            //
            // Fórmula: window.innerHeight × MULTIPLICADOR
            //   · Multiplicador 4   → aparece justo al terminar el Hero
            //   · Multiplicador 4.5 → aparece un poco después ← ACTUAL
            //   · Multiplicador 5   → aparece aún más tarde
            const MULTIPLICADOR = 4;
            const heroEnd = window.innerHeight * MULTIPLICADOR;
            setIsVisible(window.scrollY > heroEnd);
        };
        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.nav
                    initial={{ y: 100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 100, opacity: 0 }}
                    transition={{ type: "spring", damping: 20, stiffness: 100 }}
                    className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-50 border border-[#2c2767]/60 rounded-full flex items-center p-2 space-x-1 min-w-[320px] max-w-[95vw] h-[64px] ${className}`}
                    style={{ background: "rgba(6,6,15,0.85)", backdropFilter: "blur(20px)", boxShadow: "0 0 30px rgba(44,39,103,0.4)" }}
                >
                    {navItems.map((item, idx) => {
                        const Icon = item.icon;
                        const isActive = activeIndex === idx;

                        return (
                            <button
                                key={item.label}
                                className={`flex items-center px-4 py-2 rounded-full transition-all duration-500 ease-in-out relative h-12 focus:outline-none ${isActive
                                    ? "text-white shadow-[0_0_15px_rgba(58,219,241,0.3)] gap-2"
                                    : "bg-transparent text-[#a682e7]/60 hover:bg-[#2c2767]/40 hover:text-[#3adbf1] gap-0"
                                    }`}
                                onClick={() => setActiveIndex(idx)}
                                aria-label={item.label}
                                type="button"
                            >
                                <Icon
                                    size={20}
                                    strokeWidth={isActive ? 2.5 : 2}
                                    className="flex-shrink-0"
                                />

                                <div
                                    className={`overflow-hidden transition-all duration-500 ease-in-out flex items-center ${isActive ? "max-w-[80px] opacity-100" : "max-w-0 opacity-0"
                                        }`}
                                >
                                    <span className="font-bold text-xs uppercase tracking-wider whitespace-nowrap">
                                        {item.label}
                                    </span>
                                </div>

                                {isActive && (
                                    <motion.div
                                        layoutId="activeTab"
                                        className="absolute inset-0 rounded-full -z-10 nova-gradient"
                                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                    />
                                )}
                            </button>
                        );
                    })}
                </motion.nav>
            )}
        </AnimatePresence>
    );
}

export default BottomNavBar;

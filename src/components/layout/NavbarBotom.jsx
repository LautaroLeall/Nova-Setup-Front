import { useState, useEffect, useContext } from "react";
import {
    Home,
    LaptopMinimalCheck,
    Cpu,
    ShoppingCart,
    User,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, useLocation } from "react-router";
import { AuthContext } from "../../context/AuthContext";
import { CartContext } from "../../context/CartContext";
import "../../styles/layout/NavbarBotom.css";

export function BottomNavBar({
    className = "",
}) {
    const { user } = useContext(AuthContext);
    const { totalItems, toggleCart } = useContext(CartContext);
    const navigate = useNavigate();
    const location = useLocation();

    const navItems = [
        { label: "Inicio", icon: Home, to: "/" },
        { label: "Tienda", icon: LaptopMinimalCheck, to: "/shop" },
        { label: "Arma PC", icon: Cpu, to: "/arma-tu-pc" },
        { label: "Carrito", icon: ShoppingCart, isCart: true },
        { label: "Perfil", icon: User, to: user ? "/perfil" : "/login" },
    ];

    // Determinar el index activo basado en la ruta actual
    const getActiveIndex = () => {
        const index = navItems.findIndex(item => {
            if (item.to === "/") {
                return location.pathname === "/";
            }
            return location.pathname.startsWith(item.to);
        });
        return index !== -1 ? index : 0;
    };

    const activeIndex = getActiveIndex();
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            // Rutas donde NO queremos que aparezca el NavbarBotom
            const hiddenRoutes = ["/login", "/register", "/perfil", "/product", "/checkout", "/payment", "/forgot-password", "/reset-password", "/admin"];
            const isHiddenRoute = hiddenRoutes.some(route => location.pathname.startsWith(route));

            if (isHiddenRoute) {
                setIsVisible(false);
                return;
            }

            const MULTIPLICADOR = 3.5;
            const heroEnd = window.innerHeight * MULTIPLICADOR;

            // Mostrar siempre la barra inferior en rutas distintas a la principal
            if (location.pathname !== "/") {
                setIsVisible(true);
            } else {
                setIsVisible(window.scrollY > heroEnd);
            }
        };
        handleScroll(); // Call on mount/route change
        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, [location.pathname]);

    const handleNavigation = (item) => {
        if (item.isCart) {
            toggleCart();
        } else {
            navigate(item.to);
        }
    };

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.nav
                    initial={{ y: 100, x: "-50%", opacity: 0 }}
                    animate={{ y: 0, x: "-50%", opacity: 1 }}
                    exit={{ y: 100, x: "-50%", opacity: 0 }}
                    transition={{ type: "spring", damping: 20, stiffness: 100 }}
                    className={`bottom-nav-container ${className}`}
                >
                    {navItems.map((item, idx) => {
                        const Icon = item.icon;
                        const isActive = activeIndex === idx;

                        return (
                            <button
                                key={item.label}
                                className={`bottom-nav-btn ${isActive ? "bottom-nav-btn-active" : "bottom-nav-btn-inactive"}`}
                                onClick={() => handleNavigation(item)}
                                aria-label={item.label}
                                type="button"
                            >
                                <div className="bottom-nav-icon-wrapper">
                                    <Icon
                                        size={20}
                                        strokeWidth={isActive ? 2.5 : 2}
                                        className="bottom-nav-icon"
                                    />
                                    {item.isCart && totalItems > 0 && (
                                        <span className="bottom-nav-badge">{totalItems}</span>
                                    )}
                                </div>

                                <div
                                    className={`bottom-nav-label-container ${isActive ? "bottom-nav-label-active" : "bottom-nav-label-inactive"}`}
                                >
                                    <span className="bottom-nav-label">
                                        {item.label}
                                    </span>
                                </div>

                                {isActive && (
                                    <motion.div
                                        layoutId="activeTab"
                                        className="bottom-nav-bg-active"
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

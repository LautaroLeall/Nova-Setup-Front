import { useState, useEffect, useContext } from "react";
import { ShoppingCart, Search, Menu, X, User } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useLocation } from "react-router";
import { AuthContext } from "../context/AuthContext";
import "../styles/Navbar.css"; // NO OLVIDAR IMPORTAR EL CSS

export const Navbar = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const { user, logout } = useContext(AuthContext);
    const location = useLocation();

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 20);
        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // Cierra el menú móvil si cambia de ruta
    useEffect(() => {
        setIsMobileMenuOpen(false);
    }, [location.pathname]);

    const navLinks = [
        { name: "Inicio",         to: "/" },
        { name: "Productos",      to: "/shop" },
        { name: "Teclados",       to: "/shop" },
        { name: "Accesorios",     to: "/shop" },
    ];

    // Rutas donde la Navbar Superior no debe aparecer
    const hiddenRoutes = ["/login", "/register"];
    if (hiddenRoutes.some(route => location.pathname.startsWith(route))) {
        return null;
    }

    return (
        <header className={`navbar-header ${isScrolled ? "scrolled" : "top"}`}>
            <div className="navbar-container">

                {/* ── Logo ── */}
                <Link to="/" className="navbar-logo-link group">
                    <div className="navbar-logo-wrapper">
                        <img
                            src="/logo-NovaSetUp.png"
                            alt="Nova SetUp"
                            className="navbar-logo-img"
                        />
                    </div>
                    <span className="navbar-logo-text">
                        Nova SetUp
                    </span>
                </Link>

                {/* ── Desktop Nav ── */}
                <nav className="navbar-desktop-nav">
                    {navLinks.map((link) => (
                        <Link
                            key={link.name}
                            to={link.to}
                            className="navbar-link group"
                        >
                            {link.name}
                            <span className="navbar-link-underline" />
                        </Link>
                    ))}
                </nav>

                {/* ── Actions ── */}
                <div className="navbar-actions">
                    <button className="navbar-action-btn">
                        <Search size={19} />
                    </button>

                    {/* Lógica de Usuario Desktop */}
                    {user ? (
                        <div className="navbar-user-group group">
                            <button className="navbar-user-btn">
                                <User size={19} />
                                <span>{user.firstName}</span>
                            </button>
                            {/* Dropdown Logout */}
                            <div className="navbar-user-dropdown">
                                <button onClick={logout} className="navbar-logout-btn">
                                    Cerrar Sesión
                                </button>
                            </div>
                        </div>
                    ) : (
                        <Link to="/login" className="navbar-login-link">
                            <User size={19} />
                        </Link>
                    )}

                    <button className="navbar-cart-btn">
                        <ShoppingCart size={19} />
                        <span className="navbar-cart-badge">0</span>
                    </button>

                    <button
                        className="navbar-mobile-toggle"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    >
                        {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
                    </button>
                </div>
            </div>

            {/* ── Mobile Menu ── */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="navbar-mobile-menu"
                    >
                        <div className="navbar-mobile-content">
                            
                            {/* User Section Mobile */}
                            <div className="navbar-mobile-user">
                                <div className="navbar-mobile-avatar">
                                    <User size={24} color="white" />
                                </div>
                                <div className="navbar-mobile-user-info">
                                    {user ? (
                                        <>
                                            <p className="navbar-mobile-user-name">{user.firstName} {user.lastName}</p>
                                            <button onClick={logout} className="navbar-mobile-logout">Cerrar Sesión</button>
                                        </>
                                    ) : (
                                        <>
                                            <p className="navbar-mobile-welcome">Bienvenido</p>
                                            <div className="navbar-mobile-auth-links">
                                                <Link to="/login" className="navbar-mobile-auth-login">Iniciar Sesión</Link>
                                                <span className="navbar-mobile-auth-separator">|</span>
                                                <Link to="/register" className="navbar-mobile-auth-register">Registrarse</Link>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>

                            {/* Nav Links Mobile */}
                            <ul className="navbar-mobile-list">
                                {navLinks.map((link) => (
                                    <li key={link.name}>
                                        <Link
                                            to={link.to}
                                            className="navbar-mobile-link"
                                        >
                                            <span className="navbar-mobile-link-dot"></span>
                                            {link.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                            
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    );
};

export default Navbar;

import { useState, useEffect, useContext } from "react";
import { ShoppingCart, Search, Menu, X, User } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useLocation, useNavigate } from "react-router";
import { AuthContext } from "../../context/AuthContext";
import { ProductContext } from "../../context/ProductContext";
import { CartContext } from "../../context/CartContext";
import "../../styles/Navbar.css";

export const Navbar = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [searchInput, setSearchInput] = useState("");

    const { user, logout } = useContext(AuthContext);
    const { handleSearch } = useContext(ProductContext);
    const { totalItems, toggleCart } = useContext(CartContext);

    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 20);
        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // Cierra el menú móvil si cambia de ruta
    useEffect(() => {
        if (isMobileMenuOpen) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setIsMobileMenuOpen(false);
        }
    }, [location.pathname, isMobileMenuOpen]);

    const navLinks = [
        { name: "Inicio", to: "/" },
        { name: "Tienda", to: "/shop" },
        { name: "Arma tu PC", to: "/arma-tu-pc" },
        { name: "Contacto", to: "/contacto" },
    ];

    const submitSearch = (e) => {
        e.preventDefault();
        if (searchInput.trim()) {
            handleSearch(searchInput.trim());
            navigate("/shop");
            setIsSearchOpen(false);
            setSearchInput("");
        }
    };

    // Rutas donde la Navbar Superior no debe aparecer
    const hiddenRoutes = ["/login", "/register", "/forgot-password", "/reset-password"];
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
                    <div className="navbar-search-container">
                        <AnimatePresence>
                            {isSearchOpen && (
                                <motion.form
                                    initial={{ width: 0, opacity: 0 }}
                                    animate={{ width: "200px", opacity: 1 }}
                                    exit={{ width: 0, opacity: 0 }}
                                    transition={{ duration: 0.3 }}
                                    className="navbar-search-form"
                                    onSubmit={submitSearch}
                                >
                                    <input
                                        type="text"
                                        placeholder="Buscar..."
                                        value={searchInput}
                                        onChange={(e) => setSearchInput(e.target.value)}
                                        className="navbar-search-input"
                                        autoFocus
                                    />
                                </motion.form>
                            )}
                        </AnimatePresence>
                        <button
                            className="navbar-action-btn"
                            onClick={() => setIsSearchOpen(!isSearchOpen)}
                        >
                            {isSearchOpen ? <X size={19} /> : <Search size={19} />}
                        </button>
                    </div>

                    {/* Lógica de Usuario Desktop */}
                    {user ? (
                        <div className="navbar-user-group group">
                            <button className="navbar-user-btn">
                                <User size={19} />
                                <span>{user.firstName}</span>
                            </button>
                            {/* Dropdown */}
                            <div className="navbar-user-dropdown">
                                <Link to="/perfil" className="navbar-dropdown-link">
                                    Mi Perfil
                                </Link>
                                {user.isAdmin && (
                                    <Link to="/admin/dashboard" className="navbar-dropdown-link">
                                        Panel Admin
                                    </Link>
                                )}
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

                    <button className="navbar-cart-btn" onClick={toggleCart}>
                        <ShoppingCart size={19} />
                        {totalItems > 0 && (
                            <span className="navbar-cart-badge">{totalItems}</span>
                        )}
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

import { useState, useEffect } from "react";
import { ShoppingCart, Search, Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export const Navbar = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 20);
        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const navLinks = [
        { name: "Teclados",       href: "#" },
        { name: "Iluminación",    href: "#" },
        { name: "Coleccionables", href: "#" },
        { name: "Accesorios",     href: "#" },
    ];

    return (
        <header
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
                isScrolled
                    ? "py-2 border-b border-[#2c2767]/60"
                    : "py-3 bg-transparent"
            }`}
            style={isScrolled ? {
                background: "rgba(6,6,15,0.75)",
                backdropFilter: "blur(16px)",
            } : {}}
        >
            <div className="max-w-7xl mx-auto px-5 flex items-center justify-between">

                {/* ── Logo ── */}
                <div className="flex items-center gap-2.5">
                    <img
                        src="/logo-NovaSetUp.png"
                        alt="Nova SetUp"
                        className="w-10 h-10 drop-shadow-[0_0_8px_rgba(58,219,241,0.6)]"
                    />
                    <span className="font-black text-xl tracking-tighter hidden sm:block" style={{
                        background: "linear-gradient(135deg, #3adbf1 0%, #5572d0 50%, #a682e7 100%)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        backgroundClip: "text",
                    }}>
                        Nova SetUp
                    </span>
                </div>

                {/* ── Desktop Nav ── */}
                <nav className="hidden md:flex items-center gap-7">
                    {navLinks.map((link) => (
                        <a
                            key={link.name}
                            href={link.href}
                            className="text-[#a682e7]/80 hover:text-[#3adbf1] text-sm font-medium tracking-wide transition-colors duration-200 relative group"
                        >
                            {link.name}
                            <span className="absolute -bottom-0.5 left-0 w-0 h-[1.5px] rounded-full transition-all duration-300 group-hover:w-full"
                                style={{ background: "linear-gradient(90deg, #3adbf1, #5572d0)" }}
                            />
                        </a>
                    ))}
                </nav>

                {/* ── Actions ── */}
                <div className="flex items-center gap-2">
                    <button className="text-[#a682e7]/70 hover:text-[#3adbf1] transition-colors duration-200 p-2 rounded-lg hover:bg-[#2c2767]/40">
                        <Search size={19} />
                    </button>

                    <button className="text-[#a682e7]/70 hover:text-[#3adbf1] transition-colors duration-200 p-2 rounded-lg hover:bg-[#2c2767]/40 relative">
                        <ShoppingCart size={19} />
                        <span className="absolute top-1 right-1 w-3.5 h-3.5 text-[9px] font-black rounded-full flex items-center justify-center"
                            style={{ background: "linear-gradient(135deg,#3adbf1,#5572d0)" }}>
                            0
                        </span>
                    </button>

                    <button
                        className="md:hidden text-[#a682e7]/70 hover:text-[#3adbf1] p-2 transition-colors duration-200"
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
                        initial={{ opacity: 0, y: -12 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -12 }}
                        transition={{ duration: 0.2 }}
                        className="absolute top-full left-0 right-0 border-t border-[#2c2767]/50 p-5 md:hidden"
                        style={{ background: "rgba(6,6,15,0.95)", backdropFilter: "blur(20px)" }}
                    >
                        <ul className="flex flex-col gap-4">
                            {navLinks.map((link) => (
                                <li key={link.name}>
                                    <a
                                        href={link.href}
                                        className="text-[#a682e7] hover:text-[#3adbf1] text-base font-semibold block transition-colors duration-200"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                    >
                                        {link.name}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    );
};

export default Navbar;

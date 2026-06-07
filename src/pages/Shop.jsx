import { useContext } from "react";
import { ProductContext } from "../context/ProductContext";
import ProductCard from "../components/ProductCard";
import { Search, X, Filter } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import "../styles/Shop.css";

export const Shop = () => {
  const {
    products,
    loading,
    error,
    searchKeyword,
    activeCategory,
    handleSearch,
    handleCategoryFilter,
  } = useContext(ProductContext);

  const categories = ["Todos", "Teclados", "Monitores", "Ratones", "Audio", "Accesorios"];

  // Variantes para la animación en cascada (stagger)
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { type: "spring", stiffness: 100, damping: 15 }
    }
  };

  const onCategoryClick = (cat) => {
    if (cat === "Todos") {
      handleCategoryFilter("");
    } else {
      handleCategoryFilter(cat);
    }
  };

  return (
    <div className="shop-page">
      <div className="shop-header">
        <h1 className="shop-title">Catálogo Nova</h1>
        <p className="shop-subtitle">Equipamiento premium para profesionales</p>
      </div>

      <div className="shop-container">
        {/* Barra Lateral de Filtros */}
        <aside className="shop-sidebar">
          <div className="shop-sidebar-box">
            <h3 className="shop-sidebar-title">
              <Filter size={18} /> Categorías
            </h3>
            <ul className="shop-category-list">
              {categories.map((cat) => (
                <li key={cat}>
                  <button
                    className={`shop-category-btn ${
                      (cat === "Todos" && activeCategory === "") || activeCategory === cat
                        ? "active"
                        : ""
                    }`}
                    onClick={() => onCategoryClick(cat)}
                  >
                    {cat}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Buscador de barra lateral (opcional) */}
          <div className="shop-sidebar-box">
            <h3 className="shop-sidebar-title">
              <Search size={18} /> Búsqueda
            </h3>
            <div className="shop-search-box">
              <input
                type="text"
                placeholder="Buscar producto..."
                value={searchKeyword}
                onChange={(e) => handleSearch(e.target.value)}
                className="shop-search-input"
              />
              {searchKeyword && (
                <button
                  className="shop-search-clear"
                  onClick={() => handleSearch("")}
                >
                  <X size={16} />
                </button>
              )}
            </div>
          </div>
        </aside>

        {/* Grid de Productos */}
        <main className="shop-main">
          {loading ? (
            <div className="shop-grid">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="product-skeleton">
                  <div className="skeleton-img"></div>
                  <div className="skeleton-text short"></div>
                  <div className="skeleton-text long"></div>
                  <div className="skeleton-text medium"></div>
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="shop-error">
              <h2>Ups...</h2>
              <p>{error}</p>
            </div>
          ) : products.length === 0 ? (
            <div className="shop-empty">
              <h2>No se encontraron productos</h2>
              <p>Intenta cambiar los filtros o los términos de búsqueda.</p>
              <button onClick={() => onCategoryClick("Todos")} className="btn-primary">
                Ver todo el catálogo
              </button>
            </div>
          ) : (
            <>
              <div className="shop-results-info">
                Mostrando {products.length} productos
                {searchKeyword && <span> para "{searchKeyword}"</span>}
                {activeCategory && <span> en {activeCategory}</span>}
              </div>
              
              <motion.div 
                className="shop-grid"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                <AnimatePresence>
                  {products.map((product) => (
                    <motion.div key={product._id} variants={itemVariants} layout>
                      <ProductCard product={product} />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default Shop;

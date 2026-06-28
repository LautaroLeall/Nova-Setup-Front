import { useContext } from "react";
import { ProductContext } from "../context/ProductContext";
import ProductCard from "../components/product/ProductCard";
import { ShopFilters } from "../components/shop/ShopFilters";
import Footer from "../components/layout/Footer";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import "../styles/shop/ShopLayout.css";

export const Shop = () => {
  const {
    products,
    loading,
    error,
    searchKeyword,
    handleCategoryFilter,
    page,
    totalPages,
    handlePageChange,
    totalProducts,
    filteredCount
  } = useContext(ProductContext);

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

  const renderPagination = () => {
    if (totalPages <= 1) return null;

    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
      pages.push(
        <button
          key={i}
          className={`shop-page-btn ${page === i ? "active" : ""}`}
          onClick={() => handlePageChange(i)}
        >
          {i}
        </button>
      );
    }

    return (
      <div className="shop-pagination">
        <button
          className="shop-page-btn prev-next"
          disabled={page === 1}
          onClick={() => handlePageChange(page - 1)}
        >
          <ChevronLeft size={18} />
        </button>
        {pages}
        <button
          className="shop-page-btn prev-next"
          disabled={page === totalPages}
          onClick={() => handlePageChange(page + 1)}
        >
          <ChevronRight size={18} />
        </button>
      </div>
    );
  };

  return (
    <div className="shop-page">
      <div className="shop-header">
        <h1 className="shop-title">Catálogo Nova</h1>
        <p className="shop-subtitle">Equipamiento premium para profesionales</p>
      </div>

      <div className="shop-container">
        {/* Componente de Filtros */}
        <ShopFilters />

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
              <button onClick={() => handleCategoryFilter("")} className="btn-primary">
                Ver todo el catálogo
              </button>
            </div>
          ) : (
            <>
              <div className="shop-results-info">
                Mostrando {products.length} de {filteredCount} productos
                {filteredCount !== totalProducts && (
                  <span className="total-catalog-info"> (de {totalProducts} en total)</span>
                )}
                {searchKeyword && <span> para "{searchKeyword}"</span>}
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

              {renderPagination()}
            </>
          )}
        </main>
      </div>

      {/* Footer General */}
      <Footer />
    </div>
  );
};

export default Shop;

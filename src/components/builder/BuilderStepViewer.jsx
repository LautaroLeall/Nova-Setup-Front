import { useState, useEffect, useContext, useMemo } from "react";
import { PCBuilderContext } from "../../context/PCBuilderContext";
import { motion, AnimatePresence } from "framer-motion";
import "../../styles/builder/BuilderStepViewer.css";
import api from "../../services/api";
import { CheckCircle2, ChevronRight, ChevronLeft, SkipForward } from "lucide-react";
import { BuilderFilters } from "./BuilderFilters";

export const BuilderStepViewer = () => {
  const {
    steps,
    currentStepIndex,
    selectedComponents,
    selectComponent,
    nextStep,
    prevStep
  } = useContext(PCBuilderContext);

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Estados de Filtros
  const [filters, setFilters] = useState({ brands: [], maxPrice: 0, features: {} });
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const currentStep = steps[currentStepIndex];
  const selectedProduct = selectedComponents[currentStep.id];

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        // Filtramos usando la API real
        const { data } = await api.get(`/api/products?category=${encodeURIComponent(currentStep.categoryFilter)}`);

        const fetchedProducts = data.products || [];
        setProducts(fetchedProducts);

        // Calcular precio máximo para resetear el filtro correctamente
        let maxP = 0;
        fetchedProducts.forEach(p => {
          const price = p.discountPrice || p.price || 0;
          if (price > maxP) maxP = price;
        });

        // Resetea todos los filtros, usando 0 para que BuilderFilters use el globalMaxPrice
        setFilters({ brands: [], maxPrice: 0, features: {} });

      } catch (err) {
        console.error("Error loading builder components:", err);
        setError("Error al cargar componentes. Intenta de nuevo.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [currentStep.categoryFilter]);

  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const price = p.discountPrice || p.price || 0;

      // Filtro Precio
      if (filters.maxPrice > 0 && price > filters.maxPrice) return false;

      // Filtro Marca
      if (filters.brands.length > 0 && !filters.brands.includes(p.brand)) return false;

      // Filtro Características
      const featureKeys = Object.keys(filters.features);
      for (let key of featureKeys) {
        const requiredValues = filters.features[key];
        if (requiredValues.length === 0) continue; // no hay filtros seleccionados para esta feature

        const prodFeature = p.features?.find(f => f.name === key);
        if (!prodFeature) return false; // si el producto no tiene la feature, lo descartamos
        if (!requiredValues.includes(prodFeature.value)) return false;
      }

      return true;
    });
  }, [products, filters]);

  const handleSelect = (product) => {
    selectComponent(currentStep.id, product);
    // Automáticamente avanza si elige uno (opcional, pero buena UX)
    setTimeout(() => {
      nextStep();
    }, 400);
  };

  return (
    <div className="builder-step-viewer-container">
      {/* Columna de Filtros (Oculta en móvil si no se clickea) */}
      <BuilderFilters
        products={products}
        filters={filters}
        setFilters={setFilters}
        isMobileOpen={isMobileOpen}
        setIsMobileOpen={setIsMobileOpen}
      />

      <div className="builder-step-viewer">
        <div className="viewer-header">
          <h2>Elige tu {currentStep.label}</h2>
          <p>Paso {currentStepIndex + 1} de {steps.length}</p>
        </div>

        <div className="viewer-content">
          {loading ? (
            <div className="viewer-loading">
              <div className="spinner"></div>
              <p>Buscando {currentStep.label}...</p>
            </div>
          ) : error ? (
            <div className="viewer-error">{error}</div>
          ) : products.length === 0 ? (
            <div className="viewer-empty">
              No hay {currentStep.label} disponibles en este momento.
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="viewer-empty">
              No hay productos que coincidan con los filtros.
            </div>
          ) : (
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep.id + filteredProducts.length}
                className="builder-grid"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                {filteredProducts.map(product => {
                  const isSelected = selectedProduct?._id === product._id;
                  const isOutOfStock = product.countInStock === 0;

                  return (
                    <div
                      key={product._id}
                      className={`builder-card ${isSelected ? "selected" : ""} ${isOutOfStock ? "out-of-stock" : ""}`}
                      onClick={() => !isOutOfStock && handleSelect(product)}
                    >
                      <div className="card-img-wrapper">
                        <img src={product.images[0]} alt={product.name} />
                        {isSelected && (
                          <div className="card-selected-badge">
                            <CheckCircle2 size={24} />
                          </div>
                        )}
                      </div>
                      <div className="card-info">
                        <span className="card-brand">{product.brand}</span>
                        <h4 className="card-name">{product.name}</h4>
                        <div className="card-price-row">
                          <span className="card-price">${product.discountPrice || product.price}</span>
                          {isOutOfStock && <span className="stock-badge">Agotado</span>}
                        </div>
                        {/* Mostrar las features abajo como badges pequeños */}
                        {product.features && product.features.length > 0 && (
                          <div className="card-features-badges">
                            {product.features.map(f => (
                              <span key={f.name} className="feature-badge" title={f.name}>{f.value}</span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </motion.div>
            </AnimatePresence>
          )}
        </div>

        <div className="viewer-actions">
          <button
            className="btn-prev"
            onClick={prevStep}
            disabled={currentStepIndex === 0}
          >
            <ChevronLeft size={20} /> Atrás
          </button>

          <div className="right-actions">
            {!currentStep.isRequired && !selectedProduct && (
              <button className="btn-skip" onClick={nextStep}>
                Saltar paso <SkipForward size={18} />
              </button>
            )}

            <button
              className="btn-next"
              onClick={nextStep}
              disabled={currentStep.isRequired && !selectedProduct}
            >
              Siguiente <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

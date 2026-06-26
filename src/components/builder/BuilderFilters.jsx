import { useMemo } from "react";
import { Filter, ChevronDown, ChevronUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export const BuilderFilters = ({
  products,
  filters,
  setFilters,
  isMobileOpen,
  setIsMobileOpen
}) => {
  // Extraer valores dinámicos
  const { availableBrands, globalMaxPrice, availableFeatures } = useMemo(() => {
    const brands = new Set();
    let maxP = 0;
    const featuresMap = {}; // { "Socket": new Set(["AM4", "AM5"]), ... }

    products.forEach(p => {
      if (p.brand) brands.add(p.brand);
      const price = p.discountPrice || p.price || 0;
      if (price > maxP) maxP = price;

      if (p.features && Array.isArray(p.features)) {
        p.features.forEach(f => {
          if (!featuresMap[f.name]) featuresMap[f.name] = new Set();
          featuresMap[f.name].add(f.value);
        });
      }
    });

    // Convertir Sets a Arrays ordenados
    const featuresArr = Object.keys(featuresMap).map(key => ({
      name: key,
      values: Array.from(featuresMap[key]).sort()
    }));

    return {
      availableBrands: Array.from(brands).sort(),
      globalMaxPrice: maxP,
      availableFeatures: featuresArr
    };
  }, [products]);

  const handleBrandChange = (brand) => {
    setFilters(prev => {
      const newBrands = prev.brands.includes(brand)
        ? prev.brands.filter(b => b !== brand)
        : [...prev.brands, brand];
      return { ...prev, brands: newBrands };
    });
  };

  const handlePriceChange = (e) => {
    setFilters(prev => ({ ...prev, maxPrice: Number(e.target.value) }));
  };

  const handleFeatureChange = (featureName, value) => {
    setFilters(prev => {
      const currentVals = prev.features[featureName] || [];
      const newVals = currentVals.includes(value)
        ? currentVals.filter(v => v !== value)
        : [...currentVals, value];

      return {
        ...prev,
        features: { ...prev.features, [featureName]: newVals }
      };
    });
  };

  const clearFilters = () => {
    setFilters({
      brands: [],
      maxPrice: globalMaxPrice,
      features: {}
    });
  };

  const hasActiveFilters = filters.brands.length > 0 ||
    filters.maxPrice < globalMaxPrice ||
    Object.values(filters.features).some(arr => arr.length > 0);

  return (
    <>
      {/* Botón Móvil para abrir filtros */}
      <button
        className="builder-mobile-filter-btn"
        onClick={() => setIsMobileOpen(!isMobileOpen)}
      >
        <Filter size={18} /> Filtros {hasActiveFilters && <span className="filter-badge">•</span>}
        {isMobileOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
      </button>

      <AnimatePresence>
        {(isMobileOpen || window.innerWidth >= 1024) && (
          <motion.div
            className={`builder-filters-sidebar ${isMobileOpen ? "mobile-open" : ""}`}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="filters-header">
              <h3><Filter size={18} /> Filtros</h3>
              {hasActiveFilters && (
                <button className="btn-clear-filters" onClick={clearFilters}>Limpiar</button>
              )}
            </div>

            {/* Filtro Precio */}
            <div className="filter-group">
              <h4>Precio Máximo: ${filters.maxPrice || globalMaxPrice}</h4>
              <input
                type="range"
                min="0"
                max={globalMaxPrice || 1000}
                step="10"
                value={filters.maxPrice || globalMaxPrice}
                onChange={handlePriceChange}
                className="filter-range-input"
              />
              <div className="range-labels">
                <span>$0</span>
                <span>${globalMaxPrice}</span>
              </div>
            </div>

            {/* Filtro Marcas */}
            {availableBrands.length > 0 && (
              <div className="filter-group">
                <h4>Marcas</h4>
                <div className="checkbox-list">
                  {availableBrands.map(brand => (
                    <label key={brand} className="checkbox-label">
                      <input
                        type="checkbox"
                        checked={filters.brands.includes(brand)}
                        onChange={() => handleBrandChange(brand)}
                      />
                      <span className="custom-checkbox"></span>
                      {brand}
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* Filtros Características (Dinámicos) */}
            {availableFeatures.map(feat => (
              <div key={feat.name} className="filter-group">
                <h4>{feat.name}</h4>
                <div className="checkbox-list">
                  {feat.values.map(val => {
                    const isChecked = (filters.features[feat.name] || []).includes(val);
                    return (
                      <label key={val} className="checkbox-label">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => handleFeatureChange(feat.name, val)}
                        />
                        <span className="custom-checkbox"></span>
                        {val}
                      </label>
                    );
                  })}
                </div>
              </div>
            ))}

            {isMobileOpen && (
              <button className="btn-close-mobile-filters" onClick={() => setIsMobileOpen(false)}>
                Ver Resultados
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

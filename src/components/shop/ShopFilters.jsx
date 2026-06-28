import { useMemo, useState, useContext } from "react";
import { ProductContext } from "../../context/ProductContext";
import { Filter, X, ChevronDown, ChevronUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import "../../styles/shop/ShopFilters.css";

const CollapsibleFilter = ({ title, children, defaultOpen = false }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  return (
    <div className="filter-group">
      <h4 onClick={() => setIsOpen(!isOpen)} className="collapsible-header">
        {title}
        {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
      </h4>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            style={{ overflow: "hidden" }}
          >
            <div className="collapsible-content">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export const ShopFilters = () => {
  const {
    allProducts,
    brands, setBrands,
    maxPrice, setMaxPrice,
    features, setFeatures,
    activeCategory, handleCategoryFilter,
    searchKeyword, handleSearch
  } = useContext(ProductContext);

  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // Extraer valores dinámicos
  const { availableBrands, globalMaxPrice, availableFeatures, availableCategories } = useMemo(() => {
    const brandSet = new Set();
    const categorySet = new Set();
    let maxP = 0;
    const featuresMap = {};

    allProducts.forEach(p => {
      if (p.brand) brandSet.add(p.brand);
      if (p.category) categorySet.add(p.category);

      const price = p.discountPrice || p.price || 0;
      if (price > maxP) maxP = price;

      if (!activeCategory || p.category === activeCategory) {
        if (p.features && Array.isArray(p.features)) {
          p.features.forEach(f => {
            if (!featuresMap[f.name]) featuresMap[f.name] = new Set();
            featuresMap[f.name].add(f.value);
          });
        }
      }
    });

    const featuresArr = Object.keys(featuresMap).map(key => ({
      name: key,
      values: Array.from(featuresMap[key]).sort()
    }));

    return {
      availableBrands: Array.from(brandSet).sort(),
      globalMaxPrice: maxP,
      availableFeatures: featuresArr,
      availableCategories: ["Todos", ...Array.from(categorySet).sort()]
    };
  }, [allProducts, activeCategory]);

  const handleBrandChange = (brand) => {
    setBrands(prev => {
      if (prev.includes(brand)) return prev.filter(b => b !== brand);
      return [...prev, brand];
    });
  };

  const handlePriceChange = (e) => {
    setMaxPrice(Number(e.target.value));
  };

  const handleFeatureChange = (featureName, value) => {
    setFeatures(prev => {
      const currentVals = prev[featureName] || [];
      const newVals = currentVals.includes(value)
        ? currentVals.filter(v => v !== value)
        : [...currentVals, value];

      return {
        ...prev,
        [featureName]: newVals
      };
    });
  };

  const clearFilters = () => {
    setBrands([]);
    setMaxPrice(0);
    setFeatures({});
    handleCategoryFilter("");
    handleSearch("");
  };

  const hasActiveFilters = brands.length > 0 ||
    (maxPrice > 0 && maxPrice < globalMaxPrice) ||
    Object.values(features).some(arr => arr.length > 0) ||
    activeCategory !== "" || searchKeyword !== "";

  const displayMaxPrice = maxPrice > 0 ? maxPrice : globalMaxPrice;

  return (
    <>
      <button
        className="builder-mobile-filter-btn shop-mobile-btn"
        onClick={() => setIsMobileOpen(!isMobileOpen)}
      >
        <Filter size={18} /> Filtros {hasActiveFilters && <span className="filter-badge">•</span>}
        {isMobileOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
      </button>

      <AnimatePresence>
        {(isMobileOpen || window.innerWidth >= 1024) && (
          <motion.aside
            className={`shop-sidebar ${isMobileOpen ? "mobile-open" : ""}`}
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

            {/* Búsqueda */}
            <div className="shop-sidebar-box filter-group">
              <h4>Buscar</h4>
              <div className="shop-search-box">
                <input
                  type="text"
                  placeholder="Buscar producto..."
                  value={searchKeyword}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="shop-search-input"
                />
                {searchKeyword && (
                  <button className="shop-search-clear" onClick={() => handleSearch("")}>
                    <X size={16} />
                  </button>
                )}
              </div>
            </div>

            {/* Categorías */}
            <div className="shop-sidebar-box filter-group">
              <CollapsibleFilter title="Categorías" defaultOpen={false}>
                <ul className="shop-category-list">
                  {availableCategories.map((cat) => (
                    <li key={cat}>
                      <button
                        className={`shop-category-btn ${(cat === "Todos" && activeCategory === "") || activeCategory === cat ? "active" : ""}`}
                        onClick={() => handleCategoryFilter(cat === "Todos" ? "" : cat)}
                      >
                        {cat}
                      </button>
                    </li>
                  ))}
                </ul>
              </CollapsibleFilter>
            </div>

            {/* Precio */}
            {globalMaxPrice > 0 && (
              <CollapsibleFilter title="Precio Máximo" defaultOpen={false}>
                <div className="filter-price-content">
                  <div className="price-display">${displayMaxPrice}</div>
                  <input
                    type="range"
                    min="0"
                    max={globalMaxPrice}
                    step="10"
                    value={displayMaxPrice}
                    onChange={handlePriceChange}
                    className="filter-range-input"
                  />
                  <div className="range-labels">
                    <span>$0</span>
                    <span>${globalMaxPrice}</span>
                  </div>
                </div>
              </CollapsibleFilter>
            )}

            {/* Marcas - SOLO SE MUESTRA SI HAY CATEGORÍA */}
            {activeCategory !== "" && availableBrands.length > 0 && (
              <CollapsibleFilter title="Marcas" defaultOpen={false}>
                <div className="checkbox-list">
                  {availableBrands.map(brand => (
                    <label key={brand} className="checkbox-label">
                      <input
                        type="checkbox"
                        checked={brands.includes(brand)}
                        onChange={() => handleBrandChange(brand)}
                      />
                      <span className="custom-checkbox"></span>
                      {brand}
                    </label>
                  ))}
                </div>
              </CollapsibleFilter>
            )}

            {/* Características (Dinámicas) - SOLO SE MUESTRAN SI HAY CATEGORÍA */}
            {activeCategory !== "" && availableFeatures.map(feat => (
              <CollapsibleFilter key={feat.name} title={feat.name} defaultOpen={false}>
                <div className="checkbox-list">
                  {feat.values.map(val => {
                    const isChecked = (features[feat.name] || []).includes(val);
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
              </CollapsibleFilter>
            ))}

            {isMobileOpen && (
              <button className="btn-close-mobile-filters" onClick={() => setIsMobileOpen(false)}>
                Ver Resultados
              </button>
            )}
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  );
};

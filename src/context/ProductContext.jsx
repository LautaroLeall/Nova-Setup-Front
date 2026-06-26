/* eslint-disable react-refresh/only-export-components */
import { createContext, useState, useEffect, useCallback, useMemo } from "react";
import api from "../services/api";

export const ProductContext = createContext();

export const ProductProvider = ({ children }) => {
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Metadatos de paginación
  const [page, setPage] = useState(1);
  const pageSize = 12;

  // Filtros activos
  const [searchKeyword, setSearchKeyword] = useState("");
  const [activeCategory, setActiveCategory] = useState("");
  const [brands, setBrands] = useState([]);
  const [maxPrice, setMaxPrice] = useState(0);
  const [features, setFeatures] = useState({});

  const fetchAllProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      // Fetchea todo el catálogo de una vez
      const { data } = await api.get('/api/products?pageSize=0');
      setAllProducts(data.products || []);
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Error al cargar productos");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchAllProducts();
  }, [fetchAllProducts]);

  // Filtrado Client-Side
  const filteredProducts = useMemo(() => {
    return allProducts.filter((p) => {
      // 1. Keyword (búsqueda por nombre)
      if (searchKeyword && !p.name.toLowerCase().includes(searchKeyword.toLowerCase())) return false;

      // 2. Category
      if (activeCategory && p.category !== activeCategory) return false;

      // 3. Brands
      if (brands.length > 0 && !brands.includes(p.brand)) return false;

      // 4. Max Price
      const price = p.discountPrice || p.price || 0;
      if (maxPrice > 0 && price > maxPrice) return false;

      // 5. Features
      const featureKeys = Object.keys(features);
      for (let key of featureKeys) {
        const requiredValues = features[key];
        if (requiredValues.length === 0) continue;
        const prodFeature = p.features?.find(f => f.name === key);
        if (!prodFeature) return false;
        if (!requiredValues.includes(prodFeature.value)) return false;
      }

      return true;
    });
  }, [allProducts, searchKeyword, activeCategory, brands, maxPrice, features]);

  // Paginación Client-Side
  const totalPages = Math.ceil(filteredProducts.length / pageSize) || 1;
  const paginatedProducts = useMemo(() => {
    const startIndex = (page - 1) * pageSize;
    return filteredProducts.slice(startIndex, startIndex + pageSize);
  }, [filteredProducts, page]);

  // Asegurar que si los filtros cambian y la página actual queda fuera de rango, volvemos a una válida
  useEffect(() => {
    if (page > totalPages && totalPages > 0) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setPage(1);
    }
  }, [totalPages, page]);

  // Funciones para manipular los filtros
  const handleSearch = useCallback((keyword) => {
    setSearchKeyword(keyword);
    setPage(1);
  }, []);

  const handleCategoryFilter = useCallback((category) => {
    setActiveCategory(category);
    setPage(1);
  }, []);

  const handlePageChange = useCallback((newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  }, [totalPages]);

  const value = useMemo(() => ({
    allProducts, // Útil para construir checkboxes dinámicos
    products: paginatedProducts,
    totalProducts: allProducts.length,
    filteredCount: filteredProducts.length,
    loading,
    error,
    page,
    totalPages,
    searchKeyword,
    activeCategory,
    brands,
    setBrands,
    maxPrice,
    setMaxPrice,
    features,
    setFeatures,
    handleSearch,
    handleCategoryFilter,
    handlePageChange,
  }), [
    allProducts, paginatedProducts, filteredProducts.length, loading, error,
    page, totalPages, searchKeyword, activeCategory, brands, maxPrice, features,
    handleSearch, handleCategoryFilter, handlePageChange
  ]);

  return (
    <ProductContext.Provider value={value}>
      {children}
    </ProductContext.Provider>
  );
};

/* eslint-disable react-refresh/only-export-components */
import { createContext, useState, useEffect, useCallback } from "react";
import axios from "axios";

export const ProductContext = createContext();

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Metadatos de paginación
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  
  // Filtros activos
  const [searchKeyword, setSearchKeyword] = useState("");
  const [activeCategory, setActiveCategory] = useState("");

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      let url = `${import.meta.env.VITE_BACKEND_URL}/api/products?pageNumber=${page}`;
      if (searchKeyword) url += `&keyword=${searchKeyword}`;
      if (activeCategory) url += `&category=${activeCategory}`;

      const { data } = await axios.get(url);
      
      setProducts(data.products);
      setPage(data.page);
      setTotalPages(data.pages);
      
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Error al cargar productos");
    } finally {
      setLoading(false);
    }
  }, [page, searchKeyword, activeCategory]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchProducts();
  }, [fetchProducts]);

  // Funciones para manipular los filtros
  const handleSearch = (keyword) => {
    setSearchKeyword(keyword);
    setPage(1); // Volver a la primera página al buscar
  };

  const handleCategoryFilter = (category) => {
    setActiveCategory(category);
    setPage(1);
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  return (
    <ProductContext.Provider
      value={{
        products,
        loading,
        error,
        page,
        totalPages,
        searchKeyword,
        activeCategory,
        handleSearch,
        handleCategoryFilter,
        handlePageChange,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};

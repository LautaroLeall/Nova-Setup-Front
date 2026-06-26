import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { Link } from "react-router";
import axios from "axios";
import ProductCard from "../components/product/ProductCard";
import { motion, AnimatePresence } from "framer-motion";
import "../styles/Shop.css";

const Favoritos = () => {
  const { user, favoriteIds } = useContext(AuthContext);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchFavorites = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/favorites`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setFavorites(data);
    } catch {
      setError("Error al cargar tus favoritos.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (user) fetchFavorites();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  // Sincronizar la lista local cuando cambia favoriteIds en el contexto
  // (cuando el usuario quita un favorito desde otra página)
  useEffect(() => {
    if (favorites.length > 0) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setFavorites(prev => prev.filter(p => favoriteIds.includes(p._id)));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [favoriteIds]);

  // Animaciones (iguales a Shop)
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 100, damping: 15 } },
  };

  if (!user) {
    return (
      <div className="shop-page" style={{ justifyContent: "center", alignItems: "center", display: "flex", flexDirection: "column", height: "70vh" }}>
        <h2>Inicia Sesión</h2>
        <p className="mb-6 text-white/60">Necesitas estar registrado para guardar tus productos favoritos.</p>
        <Link to="/login?redirect=/favoritos" className="btn-primary">
          Ir al Login
        </Link>
      </div>
    );
  }

  return (
    <div className="shop-page">
      <div className="shop-header">
        <h1 className="shop-title">Mis Favoritos</h1>
        <p className="shop-subtitle">Los productos que tienes en la mira</p>
      </div>

      <div className="shop-container" style={{ display: "block" }}>
        <main className="shop-main" style={{ width: "100%" }}>
          {loading ? (
            <div className="shop-grid">
              {[...Array(4)].map((_, i) => (
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
          ) : favorites.length === 0 ? (
            <div className="shop-empty" style={{ margin: "4rem auto" }}>
              <h2>Tu lista está vacía</h2>
              <p>Aún no has agregado ningún producto a tus favoritos.</p>
              <Link to="/shop" className="btn-primary mt-4">
                Explorar Catálogo
              </Link>
            </div>
          ) : (
            <motion.div
              className="shop-grid"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              <AnimatePresence>
                {favorites.map((product) => (
                  <motion.div key={product._id} variants={itemVariants} layout>
                    <ProductCard product={product} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Favoritos;

import { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import { Heart } from "lucide-react";
import api from "../../services/api";
import ProductCard from "../product/ProductCard";
import { motion, AnimatePresence } from "framer-motion";
import { AuthContext } from "../../context/AuthContext";
import "../../styles/profile/UserFavoritesList.css";

export const UserFavoritesList = () => {
  const { user, favoriteIds } = useContext(AuthContext);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const fetchFavorites = async () => {
    try {
      setLoading(true);
      const { data } = await api.get(`/api/favorites`);
      setFavorites(data);
    } catch {
      setError("Error al cargar tus favoritos.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) fetchFavorites();
  }, [user]);

  // Sincronizar la lista local cuando cambia favoriteIds en el contexto
  useEffect(() => {
    if (favorites.length > 0) {
      setFavorites(prev => prev.filter(p => favoriteIds.includes(p._id)));
    }
  }, [favoriteIds]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 100, damping: 15 } },
  };

  return (
    <>
      <h1 className="profile-title">Mis Favoritos</h1>
      <p className="profile-subtitle">Los productos que tienes en la mira</p>

      {loading ? (
        <div className="profile-loading">
          <div className="profile-spinner" />
          <p>Cargando tus favoritos...</p>
        </div>
      ) : error ? (
        <div className="profile-error">
          <p>{error}</p>
        </div>
      ) : favorites.length === 0 ? (
        <div className="profile-empty">
          <Heart size={48} />
          <h3>Aún no has agregado favoritos</h3>
          <button className="btn-shop-now" onClick={() => navigate("/shop")}>
            Ir a la Tienda
          </button>
        </div>
      ) : (
        <motion.div
          className="user-favorites-grid"
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
    </>
  );
};

export default UserFavoritesList;

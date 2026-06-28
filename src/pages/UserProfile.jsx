import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router";
import api from "../services/api";
import { motion } from "framer-motion";
import { showConfirmDialog } from "../utils/swalConfig";
import { sileo } from "sileo";
import ProfileSettingsForm from "../components/profile/ProfileSettingsForm";
import UserOrdersList from "../components/profile/UserOrdersList";
import UserFavoritesList from "../components/profile/UserFavoritesList";
import UserProfileSidebar from "../components/profile/UserProfileSidebar";
import ReviewFormModal from "../components/profile/ReviewFormModal";
import "../styles/profile/UserProfileLayout.css";

const UserProfile = () => {
  const { user, updateUserProfile } = useContext(AuthContext);
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("orders"); // "orders" | "settings"

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedOrderId, setExpandedOrderId] = useState(null);

  // Review Modal State
  const [reviewModal, setReviewModal] = useState({ isOpen: false, product: null });
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewedProducts, setReviewedProducts] = useState([]);

  // Profile Form State
  const [formData, setFormData] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    password: "",
    shippingAddress: {
      fullName: user?.shippingAddress?.fullName || "",
      address: user?.shippingAddress?.address || "",
      city: user?.shippingAddress?.city || "",
      postalCode: user?.shippingAddress?.postalCode || "",
      province: user?.shippingAddress?.province || "",
      phone: user?.shippingAddress?.phone || "",
    }
  });
  const [updatingProfile, setUpdatingProfile] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    const fetchMyOrders = async () => {
      try {
        setLoading(true);
        const { data } = await api.get(`/api/orders/myorders`);
        setOrders(data);
      } catch (err) {
        setError(err.response?.data?.message || "Error al obtener tus pedidos.");
      } finally {
        setLoading(false);
      }
    };

    fetchMyOrders();
  }, [user, navigate]);

  if (!user) return null;

  const toggleExpandOrder = (orderId) => {
    setExpandedOrderId(expandedOrderId === orderId ? null : orderId);
  };

  const handleConfirmDelivery = async (orderId) => {
    const result = await showConfirmDialog(
      "¿Confirmar Recepción?",
      "¿Confirmas que has recibido el producto en buen estado?",
      "Sí, confirmar",
      "Cancelar"
    );
    if (result.isConfirmed) {
      try {
        await api.put(`/api/orders/${orderId}/confirm-delivery`, {});
        // Refrescar órdenes
        const { data } = await api.get(`/api/orders/myorders`);
        setOrders(data);
        sileo.success({
          title: "¡Genial!",
          description: "Has confirmado la recepción del pedido.",
          position: "bottom-right",
        });
      } catch (err) {
        sileo.error({
          title: "Error",
          description: err.response?.data?.message || "Error al confirmar la entrega.",
          position: "bottom-right",
        });
      }
    }
  };

  const openReviewModal = (product) => {
    setRating(5);
    setComment("");
    setReviewModal({ isOpen: true, product });
  };

  const closeReviewModal = () => {
    setReviewModal({ isOpen: false, product: null });
  };

  const submitReviewHandler = async (e) => {
    e.preventDefault();
    if (!reviewModal.product) return;
    setSubmittingReview(true);
    try {
      await api.post(
        `/api/products/${reviewModal.product._id}/reviews`,
        { rating, comment, orderId: reviewModal.product.orderId }
      );
      sileo.success({
        title: "¡Gracias!",
        description: "Tu reseña ha sido publicada con éxito.",
        position: "bottom-right",
      });
      setReviewedProducts([...reviewedProducts, `${reviewModal.product.orderId}-${reviewModal.product._id}`]);
      closeReviewModal();
    } catch (err) {
      if (err.response?.status === 400 && err.response?.data?.message.includes("Ya has calificado")) {
        sileo.info({
          title: "Atención",
          description: "Ya has calificado este producto en esta compra anteriormente.",
          position: "bottom-right",
        });
        setReviewedProducts([...reviewedProducts, `${reviewModal.product.orderId}-${reviewModal.product._id}`]);
        closeReviewModal();
      } else {
        sileo.error({
          title: "Error",
          description: err.response?.data?.message || "Error al enviar la reseña.",
          position: "bottom-right",
        });
      }
    } finally {
      setSubmittingReview(false);
    }
  };

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith("shipping_")) {
      const field = name.replace("shipping_", "");
      setFormData(prev => ({
        ...prev,
        shippingAddress: { ...prev.shippingAddress, [field]: value }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const submitProfileUpdate = async (e) => {
    e.preventDefault();
    setUpdatingProfile(true);
    const result = await updateUserProfile(formData);
    setUpdatingProfile(false);

    if (result.success) {
      sileo.success({
        title: "Perfil Actualizado",
        description: "Tus datos se guardaron correctamente.",
        position: "bottom-right",
      });
      setFormData(prev => ({ ...prev, password: "" })); // Clear password field
    } else {
      sileo.error({
        title: "Error",
        description: result.error || "No se pudo actualizar el perfil.",
        position: "bottom-right",
      });
    }
  };

  return (
    <div className="profile-page">
      <div className="profile-container">

        {/* Columna Izquierda: Info de Usuario */}
        <UserProfileSidebar
          user={user}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />

        <motion.main
          className="profile-main"
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          {activeTab === "orders" && (
            <UserOrdersList
              loading={loading}
              error={error}
              orders={orders}
              navigate={navigate}
              expandedOrderId={expandedOrderId}
              toggleExpandOrder={toggleExpandOrder}
              reviewedProducts={reviewedProducts}
              openReviewModal={openReviewModal}
              handleConfirmDelivery={handleConfirmDelivery}
            />
          )}

          {activeTab === "favorites" && (
            <UserFavoritesList />
          )}

          {activeTab === "settings" && (
            <ProfileSettingsForm
              formData={formData}
              handleProfileChange={handleProfileChange}
              submitProfileUpdate={submitProfileUpdate}
              updatingProfile={updatingProfile}
            />
          )}
        </motion.main>
      </div>

      {/* Modal de Reseña */}
      <ReviewFormModal
        reviewModal={reviewModal}
        closeReviewModal={closeReviewModal}
        submitReviewHandler={submitReviewHandler}
        rating={rating}
        setRating={setRating}
        comment={comment}
        setComment={setComment}
        submittingReview={submittingReview}
      />
    </div>
  );
};

export default UserProfile;

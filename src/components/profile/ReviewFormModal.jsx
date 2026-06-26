import { motion } from "framer-motion";
import { Star, X } from "lucide-react";

export const ReviewFormModal = ({
  reviewModal,
  closeReviewModal,
  submitReviewHandler,
  rating,
  setRating,
  comment,
  setComment,
  submittingReview
}) => {
  if (!reviewModal.isOpen) return null;

  return (
    <div className="review-modal-overlay">
      <motion.div
        className="review-modal-content"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        <button className="review-modal-close" onClick={closeReviewModal}>
          <X size={24} />
        </button>
        <h3>Calificar {reviewModal.product?.name}</h3>
        <p>Comparte tu experiencia con este producto para ayudar a otros.</p>

        <form onSubmit={submitReviewHandler} className="review-modal-form">
          <div className="star-rating-input">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                size={32}
                style={{ cursor: "pointer", transition: "all 0.2s" }}
                fill={star <= rating ? "var(--color-nova-cyan)" : "none"}
                color={star <= rating ? "var(--color-nova-cyan)" : "rgba(255, 255, 255, 0.4)"}
                onClick={() => setRating(star)}
              />
            ))}
          </div>
          <textarea
            placeholder="Escribe tu reseña aquí (opcional)..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows="4"
          />
          <button type="submit" disabled={submittingReview} className="btn-submit-review">
            {submittingReview ? "Enviando..." : "Enviar Calificación"}
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default ReviewFormModal;

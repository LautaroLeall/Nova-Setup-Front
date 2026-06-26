import { Star } from "lucide-react";
import { motion } from "framer-motion";

export const ProductReviews = ({ reviews, canReview, daysLeft, rating, setRating, comment, setComment, submittingReview, submitReviewHandler }) => {
  return (
    <motion.div
      className="detail-reviews-section"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: 0.3 }}
    >
      <h2 className="specs-title">Reseñas de Clientes</h2>

      {reviews.length === 0 && !canReview && (
        <p style={{ color: "var(--color-text-dim)" }}>Aún no hay reseñas para este producto.</p>
      )}

      {reviews.length > 0 && (
        <div className="reviews-list">
          {reviews.map((review) => (
            <div key={review._id} className="review-card">
              <div className="review-header">
                <strong>{review.firstName}</strong>
                <span className="review-date">{new Date(review.createdAt).toLocaleDateString()}</span>
              </div>
              <div className="review-stars">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={14}
                    fill={i < review.rating ? "var(--color-nova-cyan)" : "none"}
                    color={i < review.rating ? "var(--color-nova-cyan)" : "rgba(255, 255, 255, 0.3)"}
                  />
                ))}
              </div>
              {review.comment && <p className="review-comment">{review.comment}</p>}
            </div>
          ))}
        </div>
      )}

      {canReview && (
        <div className="review-form-container">
          <h3>Calificar tu compra</h3>
          <p className="review-days-left">Te quedan {daysLeft} días para calificar.</p>
          <form onSubmit={submitReviewHandler} className="review-form">
            <div className="star-rating-input">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  size={24}
                  style={{ cursor: "pointer", transition: "all 0.2s" }}
                  fill={star <= rating ? "var(--color-nova-cyan)" : "none"}
                  color={star <= rating ? "var(--color-nova-cyan)" : "rgba(255, 255, 255, 0.4)"}
                  onClick={() => setRating(star)}
                />
              ))}
            </div>
            <textarea
              placeholder="Comparte tu experiencia (opcional)..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows="3"
            />
            <button type="submit" disabled={submittingReview} className="btn-primary">
              {submittingReview ? "Enviando..." : "Publicar Calificación"}
            </button>
          </form>
        </div>
      )}
    </motion.div>
  );
};

export default ProductReviews;

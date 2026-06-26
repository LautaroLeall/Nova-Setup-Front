import { useState } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

export const ProductGallery = ({ product }) => {
  const [currentImageIdx, setCurrentImageIdx] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const nextImage = (e) => {
    e.stopPropagation();
    setCurrentImageIdx((prev) => (prev + 1) % product.images.length);
  };

  const prevImage = (e) => {
    e.stopPropagation();
    setCurrentImageIdx((prev) => (prev - 1 + product.images.length) % product.images.length);
  };

  return (
    <>
      <div className="detail-carousel-container" onClick={() => setIsModalOpen(true)}>
        <img
          src={product.images[currentImageIdx]}
          alt={`${product.name} - Imagen ${currentImageIdx + 1}`}
          className="detail-carousel-main-img"
        />
        {product.images.length > 1 && (
          <>
            <button className="carousel-arrow left" onClick={prevImage}>
              <ChevronLeft size={24} />
            </button>
            <button className="carousel-arrow right" onClick={nextImage}>
              <ChevronRight size={24} />
            </button>
            <div className="carousel-dots">
              {product.images.map((_, idx) => (
                <span
                  key={idx}
                  className={`carousel-dot ${idx === currentImageIdx ? 'active' : ''}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    setCurrentImageIdx(idx);
                  }}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {isModalOpen && (
        <div className="fullscreen-image-modal" onClick={() => setIsModalOpen(false)}>
          <button className="close-modal-btn" onClick={() => setIsModalOpen(false)}>
            <X size={32} />
          </button>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <img
              src={product.images[currentImageIdx]}
              alt={`${product.name} - Zoom`}
              className="modal-main-img"
            />
            {product.images.length > 1 && (
              <>
                <button className="modal-arrow left" onClick={prevImage}>
                  <ChevronLeft size={36} />
                </button>
                <button className="modal-arrow right" onClick={nextImage}>
                  <ChevronRight size={36} />
                </button>
                <div className="modal-thumbnails">
                  {product.images.map((img, idx) => (
                    <img
                      key={idx}
                      src={img}
                      alt={`Miniatura ${idx + 1}`}
                      className={`modal-thumb ${idx === currentImageIdx ? 'active' : ''}`}
                      onClick={() => setCurrentImageIdx(idx)}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default ProductGallery;

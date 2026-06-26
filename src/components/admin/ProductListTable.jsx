import { motion } from "framer-motion";
import { Search, Edit, Trash2 } from "lucide-react";

const ProductListTable = ({
  products,
  loading,
  error,
  search,
  setSearch,
  page,
  setPage,
  pages,
  handleOpenEditForm,
  handleDeleteProduct
}) => {
  return (
    <motion.div
      key="product-table"
      className="admin-section-box"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="catalog-search-row">
        <div className="admin-search-wrapper">
          <Search size={16} />
          <input
            type="text"
            placeholder="Buscar producto..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />
        </div>
      </div>

      {loading ? (
        <div className="admin-loading">
          <div className="admin-spinner" />
          <p>Cargando productos...</p>
        </div>
      ) : error ? (
        <div className="admin-error">{error}</div>
      ) : products.length === 0 ? (
        <div className="admin-empty">No se encontraron productos en el catálogo.</div>
      ) : (
        <>
          <div className="table-wrapper">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Imagen</th>
                  <th>Nombre</th>
                  <th>Categoría</th>
                  <th>Precio Original</th>
                  <th>Descuento</th>
                  <th>Stock</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {products.map((prod) => (
                  <tr key={prod._id}>
                    <td>
                      <img
                        src={prod.images[0]}
                        alt={prod.name}
                        className="table-product-thumbnail"
                      />
                    </td>
                    <td className="font-bold">{prod.name}</td>
                    <td>{prod.category}</td>
                    <td>${prod.price.toFixed(2)}</td>
                    <td>{prod.discountPrice ? `$${prod.discountPrice.toFixed(2)}` : "-"}</td>
                    <td>
                      <span className={`stock-indicator ${prod.countInStock === 0 ? "out" : prod.countInStock < 5 ? "low" : "ok"}`}>
                        {prod.countInStock} u.
                      </span>
                    </td>
                    <td>
                      <div className="actions-cell-buttons">
                        <button
                          className="btn-action-edit"
                          onClick={() => handleOpenEditForm(prod)}
                        >
                          <Edit size={14} />
                        </button>
                        <button
                          className="btn-action-delete"
                          onClick={() => handleDeleteProduct(prod._id)}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {pages > 1 && (
            <div className="admin-pagination">
              {[...Array(pages).keys()].map((p) => (
                <button
                  key={p + 1}
                  className={`page-btn ${page === p + 1 ? "active" : ""}`}
                  onClick={() => setPage(p + 1)}
                >
                  {p + 1}
                </button>
              ))}
            </div>
          )}
        </>
      )}
    </motion.div>
  );
};

export default ProductListTable;

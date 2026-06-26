/* eslint-disable react-refresh/only-export-components */
import { createContext, useState, useEffect } from "react";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  // Inicializamos el estado leyendo de localStorage (si existe)
  const [cartItems, setCartItems] = useState(() => {
    try {
      const storedData = localStorage.getItem("nova_cart");
      return storedData ? JSON.parse(storedData) : [];
    } catch (error) {
      console.error("Error leyendo localStorage:", error);
      return [];
    }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);

  // Cada vez que cambien los cartItems, sincronizamos con localStorage
  useEffect(() => {
    try {
      localStorage.setItem("nova_cart", JSON.stringify(cartItems));
    } catch (error) {
      console.error("Error guardando en localStorage:", error);
    }
  }, [cartItems]);

  const toggleCart = () => setIsCartOpen((prev) => !prev);
  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);

  // Agregar producto al carrito
  const addToCart = (product, quantity = 1) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find((item) => item._id === product._id);
      
      if (existingItem) {
        // Actualizamos cantidad respetando el stock disponible
        return prevItems.map((item) =>
          item._id === product._id
            ? { ...item, qty: Math.min(item.qty + quantity, product.countInStock) }
            : item
        );
      } else {
        // Agregamos el nuevo producto
        return [...prevItems, { ...product, qty: quantity }];
      }
    });
  };

  // Remover un producto del carrito
  const removeFromCart = (id) => {
    setCartItems((prevItems) => prevItems.filter((item) => item._id !== id));
  };

  // Actualizar la cantidad (+ o -)
  const updateQuantity = (id, newQty, maxStock) => {
    if (newQty <= 0) return; // No bajar de 1
    if (newQty > maxStock) return; // No superar stock
    
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item._id === id ? { ...item, qty: newQty } : item
      )
    );
  };

  // Limpiar carrito completo (ej: después de pagar)
  const clearCart = () => {
    setCartItems([]);
  };

  // Calcular totales
  const totalItems = cartItems.reduce((acc, item) => acc + item.qty, 0);
  
  const subtotal = cartItems.reduce((acc, item) => {
    const price = item.discountPrice ? item.discountPrice : item.price;
    return acc + price * item.qty;
  }, 0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        isCartOpen,
        toggleCart,
        openCart,
        closeCart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItems,
        subtotal
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

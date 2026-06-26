/* eslint-disable react-refresh/only-export-components */
import { createContext, useState, useEffect, useCallback, useMemo } from "react";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
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

  useEffect(() => {
    try {
      localStorage.setItem("nova_cart", JSON.stringify(cartItems));
    } catch (error) {
      console.error("Error guardando en localStorage:", error);
    }
  }, [cartItems]);

  const toggleCart = useCallback(() => setIsCartOpen((prev) => !prev), []);
  const openCart = useCallback(() => setIsCartOpen(true), []);
  const closeCart = useCallback(() => setIsCartOpen(false), []);

  const addToCart = useCallback((product, quantity = 1) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find((item) => item._id === product._id);
      if (existingItem) {
        return prevItems.map((item) =>
          item._id === product._id
            ? { ...item, qty: Math.min(item.qty + quantity, product.countInStock) }
            : item
        );
      } else {
        return [...prevItems, { ...product, qty: quantity }];
      }
    });
  }, []);

  const removeFromCart = useCallback((id) => {
    setCartItems((prevItems) => prevItems.filter((item) => item._id !== id));
  }, []);

  const updateQuantity = useCallback((id, newQty, maxStock) => {
    if (newQty <= 0) return;
    if (newQty > maxStock) return;
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item._id === id ? { ...item, qty: newQty } : item
      )
    );
  }, []);

  const clearCart = useCallback(() => {
    setCartItems([]);
  }, []);

  const totalItems = useMemo(() => cartItems.reduce((acc, item) => acc + item.qty, 0), [cartItems]);

  const subtotal = useMemo(() => cartItems.reduce((acc, item) => {
    const price = item.discountPrice ? item.discountPrice : item.price;
    return acc + price * item.qty;
  }, 0), [cartItems]);

  const value = useMemo(() => ({
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
  }), [cartItems, isCartOpen, toggleCart, openCart, closeCart, addToCart, removeFromCart, updateQuantity, clearCart, totalItems, subtotal]);

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

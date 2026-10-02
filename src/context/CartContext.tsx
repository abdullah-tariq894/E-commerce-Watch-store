import React, { createContext, useContext, useEffect, useState } from 'react';
import { Product } from '../types';

export interface CartItem {
  product: Product;
  quantity: number;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  subtotal: number;
  totalCount: number;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  deliveryThreshold: number;
  flatDeliveryFee: number;
  deliveryFee: number;
  freeDeliveryRemaining: number;
  totalAmount: number;
  isFreeDelivery: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('ptc_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);

  // Delivery rules from store (defaults, synced with settings)
  const deliveryThreshold = 10000;
  const flatDeliveryFee = 250;

  useEffect(() => {
    try {
      localStorage.setItem('ptc_cart', JSON.stringify(cart));
    } catch (e) {
      console.error('Error saving cart:', e);
    }
  }, [cart]);

  const addToCart = (product: Product, quantity = 1) => {
    if (product.stockStatus === 'OUT_OF_STOCK' || product.stockStatus === 'OFF') {
      return;
    }
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { product, quantity }];
    });
    setIsCartOpen(true);
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart((prev) =>
      prev.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const clearCart = () => {
    setCart([]);
  };

  const subtotal = cart.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );
  const totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const isFreeDelivery = subtotal >= deliveryThreshold;
  const deliveryFee = subtotal > 0 ? (isFreeDelivery ? 0 : flatDeliveryFee) : 0;
  const freeDeliveryRemaining = Math.max(0, deliveryThreshold - subtotal);
  const totalAmount = subtotal + deliveryFee;

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        subtotal,
        totalCount,
        isCartOpen,
        setIsCartOpen,
        deliveryThreshold,
        flatDeliveryFee,
        deliveryFee,
        freeDeliveryRemaining,
        totalAmount,
        isFreeDelivery,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

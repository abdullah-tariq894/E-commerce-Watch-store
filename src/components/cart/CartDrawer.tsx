import React from 'react';
import { X, Trash2, ArrowRight, ShoppingBag, Truck } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useStore } from '../../context/StoreContext';

export const CartDrawer: React.FC = () => {
  const {
    cart,
    isCartOpen,
    setIsCartOpen,
    updateQuantity,
    removeFromCart,
    subtotal,
    deliveryFee,
    totalAmount,
    deliveryThreshold,
    freeDeliveryRemaining,
    isFreeDelivery,
  } = useCart();
  const { setCurrentView } = useStore();

  if (!isCartOpen) return null;

  const handleCheckoutClick = () => {
    setIsCartOpen(false);
    setCurrentView('checkout');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const progressPercent = Math.min(100, Math.round((subtotal / deliveryThreshold) * 100));

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
        onClick={() => setIsCartOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-neutral-950 border-l border-neutral-800 text-neutral-100 flex flex-col justify-between shadow-2xl">
          {/* Header */}
          <div className="p-6 border-b border-neutral-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-amber-500" />
              <h2 className="font-display font-bold text-base uppercase tracking-wider">
                Shopping Cart ({cart.reduce((sum, i) => sum + i.quantity, 0)})
              </h2>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-1.5 text-neutral-400 hover:text-white rounded-md hover:bg-neutral-900 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Delivery Progress Bar */}
          <div className="px-6 py-3.5 bg-neutral-900/60 border-b border-neutral-800/80">
            <div className="flex items-center gap-2 text-xs font-semibold mb-1.5">
              <Truck className="w-4 h-4 text-amber-400" />
              {isFreeDelivery ? (
                <span className="text-emerald-400">
                  You unlocked FREE Delivery all over Karachi!
                </span>
              ) : (
                <span className="text-neutral-300">
                  Add <strong className="text-amber-400">Rs. {freeDeliveryRemaining.toLocaleString()}</strong> more for FREE Karachi delivery
                </span>
              )}
            </div>
            <div className="w-full h-1.5 bg-neutral-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-amber-600 to-amber-400 transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Item List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-3">
                <div className="w-16 h-16 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center text-neutral-500">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <h3 className="font-display font-semibold text-base text-neutral-200 uppercase">
                  Your cart is empty
                </h3>
                <p className="text-xs text-neutral-500 max-w-xs">
                  Explore our luxury watch catalog and discover your next statement timepiece.
                </p>
                <button
                  onClick={() => {
                    setIsCartOpen(false);
                    setCurrentView('all-watches');
                  }}
                  className="mt-4 px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs uppercase tracking-wider rounded-lg transition-colors"
                >
                  Browse Watches
                </button>
              </div>
            ) : (
              cart.map((item) => (
                <div
                  key={item.product.id}
                  className="flex gap-4 p-3.5 rounded-xl bg-neutral-900/50 border border-neutral-800/80 group"
                >
                  <div className="w-20 h-20 rounded-lg overflow-hidden bg-neutral-950 shrink-0 border border-neutral-800">
                    <img
                      src={item.product.images[0]}
                      alt={item.product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="text-xs font-semibold text-neutral-200 line-clamp-1 group-hover:text-amber-400 transition-colors">
                          {item.product.name}
                        </h4>
                        <button
                          onClick={() => removeFromCart(item.product.id)}
                          className="text-neutral-500 hover:text-red-400 p-1 transition-colors"
                          title="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <div className="text-[11px] text-amber-500 font-medium uppercase mt-0.5">
                        {item.product.category}
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      <div className="flex items-center border border-neutral-700/80 rounded bg-neutral-950 overflow-hidden">
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                          className="px-2 py-0.5 text-neutral-400 hover:text-white hover:bg-neutral-800 text-xs"
                        >
                          -
                        </button>
                        <span className="px-2.5 py-0.5 text-xs font-bold text-neutral-200 tabular-nums">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                          className="px-2 py-0.5 text-neutral-400 hover:text-white hover:bg-neutral-800 text-xs"
                        >
                          +
                        </button>
                      </div>

                      <div className="text-xs font-bold text-neutral-100 tabular-nums">
                        Rs. {(item.product.price * item.quantity).toLocaleString()}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer & Checkout Trigger */}
          {cart.length > 0 && (
            <div className="p-6 border-t border-neutral-800 bg-neutral-950 space-y-4">
              <div className="space-y-2 text-xs">
                <div className="flex justify-between text-neutral-400">
                  <span>Subtotal</span>
                  <span className="text-neutral-200 font-semibold tabular-nums">
                    Rs. {subtotal.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between text-neutral-400">
                  <span>Delivery Charges</span>
                  <span
                    className={`font-semibold tabular-nums ${
                      isFreeDelivery ? 'text-emerald-400' : 'text-neutral-200'
                    }`}
                  >
                    {isFreeDelivery ? 'FREE (Karachi Promotion)' : `Rs. ${deliveryFee.toLocaleString()}`}
                  </span>
                </div>
                <div className="border-t border-neutral-800/80 pt-2 flex justify-between text-sm font-bold text-neutral-100">
                  <span>Total Payable</span>
                  <span className="text-amber-400 text-base tabular-nums">
                    Rs. {totalAmount.toLocaleString()}
                  </span>
                </div>
              </div>

              <button
                onClick={handleCheckoutClick}
                className="w-full py-4 px-6 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs uppercase tracking-widest rounded-xl transition-all shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 cursor-pointer transform hover:-translate-y-0.5"
              >
                <span>PROCEED TO CHECKOUT</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <div className="text-center text-[10px] text-neutral-500">
                Payment Method: Cash on Delivery (COD) across Pakistan
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

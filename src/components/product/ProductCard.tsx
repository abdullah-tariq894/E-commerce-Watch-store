import React from 'react';
import { ShoppingBag, Eye } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useStore } from '../../context/StoreContext';
import { Product } from '../../types';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useCart();
  const { navigateToProduct } = useStore();

  const isOutOfStock = product.stockStatus === 'OUT_OF_STOCK';
  const isOff = product.stockStatus === 'OFF';

  if (isOff) return null;

  const handleCardClick = () => {
    navigateToProduct(product);
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isOutOfStock) {
      addToCart(product, 1);
    }
  };

  return (
    <div
      onClick={handleCardClick}
      className="group relative flex flex-col justify-between bg-neutral-900/60 rounded-xl overflow-hidden border border-neutral-800/80 hover:border-amber-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-amber-500/5 cursor-pointer"
    >
      {/* Visual Image Container */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-neutral-950">
        <img
          src={product.images[0] || '/src/assets/images/hero_luxury_watch_slider_1_1790915310932.jpg'}
          alt={product.name}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
        />
        {/* Subtle Gradient Scrim */}
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-transparent to-transparent opacity-50" />

        {/* Status Badge */}
        <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded bg-neutral-950/85 backdrop-blur-sm border border-neutral-800">
          <span
            className={`w-2 h-2 rounded-full ${
              isOutOfStock ? 'bg-red-500' : 'bg-emerald-400 animate-pulse'
            }`}
          />
          <span
            className={`text-[10px] font-bold uppercase tracking-wider ${
              isOutOfStock ? 'text-red-400' : 'text-emerald-400'
            }`}
          >
            {isOutOfStock ? 'Out of Stock' : 'In Stock'}
          </span>
        </div>

        {/* Quick View Hover Icon */}
        <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <div className="w-8 h-8 rounded-full bg-neutral-900/90 text-neutral-200 flex items-center justify-center border border-neutral-700 shadow-md">
            <Eye className="w-4 h-4" />
          </div>
        </div>
      </div>

      {/* Product Details */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Brand Category Tag */}
          <div className="text-[11px] font-bold tracking-widest text-amber-500 uppercase mb-1">
            {product.category}
          </div>
          {/* Product Title */}
          <h3 className="font-display font-semibold text-sm sm:text-base text-neutral-100 group-hover:text-amber-400 transition-colors line-clamp-2 leading-snug">
            {product.name}
          </h3>
          {/* Brief specs highlight */}
          {product.specs?.movementType && (
            <p className="text-[11px] text-neutral-400 mt-1 line-clamp-1">
              {product.specs.movementType}
            </p>
          )}
        </div>

        {/* Pricing & CTA */}
        <div className="mt-4 pt-3 border-t border-neutral-800/80 flex items-center justify-between gap-3">
          <div>
            <div className="text-base sm:text-lg font-bold text-neutral-100 tabular-nums">
              Rs. {product.price.toLocaleString()}
            </div>
            {product.originalPrice && product.originalPrice > product.price && (
              <div className="text-xs text-neutral-500 line-through tabular-nums -mt-0.5">
                Rs. {product.originalPrice.toLocaleString()}
              </div>
            )}
          </div>
          <button
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            className={`p-2.5 rounded-lg flex items-center justify-center transition-all cursor-pointer ${
              isOutOfStock
                ? 'bg-neutral-800 text-neutral-500 cursor-not-allowed border border-neutral-700'
                : 'bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold shadow-md shadow-amber-500/20 active:scale-95'
            }`}
            title={isOutOfStock ? 'Currently Out of Stock' : 'Add to Shopping Cart'}
          >
            <ShoppingBag className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

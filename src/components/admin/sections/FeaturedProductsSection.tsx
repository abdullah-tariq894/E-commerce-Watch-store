import React from 'react';
import { Star } from 'lucide-react';
import { useStore } from '../../../context/StoreContext';
import { api } from '../../../services/api';
import { Product } from '../../../types';

export const FeaturedProductsSection: React.FC = () => {
  const { products, refreshData } = useStore();

  const handleToggle = async (product: Product) => {
    try {
      await api.updateProduct(product.id, { isFeatured: !product.isFeatured });
      await refreshData();
    } catch {
      alert('Failed to update featured flag');
    }
  };

  const featured = products.filter((p) => p.isFeatured);
  const nonFeatured = products.filter((p) => !p.isFeatured && p.stockStatus !== 'OFF');

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="pb-4 border-b border-neutral-800">
        <h1 className="text-2xl font-display font-bold text-neutral-100 uppercase tracking-tight">
          Featured Products
        </h1>
        <p className="text-xs text-neutral-400 mt-1">
          Pick which luxury watch models are showcased in the prime storefront spotlight on your homepage.
        </p>
      </div>

      {/* Currently Featured */}
      <div className="space-y-3">
        <h2 className="text-xs font-bold text-amber-500 uppercase tracking-wider flex items-center gap-1.5">
          <Star className="w-3.5 h-3.5 fill-amber-500" />
          <span>Active Featured Watches ({featured.length})</span>
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {featured.map((p) => (
            <div
              key={p.id}
              className="p-4 rounded-xl bg-neutral-900/60 border border-amber-500/40 flex items-center justify-between gap-3 shadow-lg shadow-amber-500/5"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-12 h-12 rounded-lg bg-neutral-950 overflow-hidden shrink-0">
                  <img src={p.images[0]} alt={p.name} className="w-full h-full object-cover" />
                </div>
                <div className="min-w-0">
                  <h4 className="text-xs font-semibold text-neutral-200 truncate">{p.name}</h4>
                  <div className="text-[11px] text-amber-400 font-bold tabular-nums">
                    Rs. {p.price.toLocaleString()}
                  </div>
                </div>
              </div>
              <button
                onClick={() => handleToggle(p)}
                className="px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-amber-400 text-xs font-bold uppercase rounded-lg border border-neutral-700 shrink-0 cursor-pointer"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Available to Feature */}
      <div className="space-y-3 pt-6 border-t border-neutral-800">
        <h2 className="text-xs font-bold text-neutral-400 uppercase tracking-wider">
          Other Catalog Watches ({nonFeatured.length})
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {nonFeatured.map((p) => (
            <div
              key={p.id}
              className="p-4 rounded-xl bg-neutral-900/40 border border-neutral-800 flex items-center justify-between gap-3"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-12 h-12 rounded-lg bg-neutral-950 overflow-hidden shrink-0">
                  <img src={p.images[0]} alt={p.name} className="w-full h-full object-cover" />
                </div>
                <div className="min-w-0">
                  <h4 className="text-xs font-semibold text-neutral-300 truncate">{p.name}</h4>
                  <div className="text-[11px] text-neutral-400 tabular-nums">
                    Rs. {p.price.toLocaleString()}
                  </div>
                </div>
              </div>
              <button
                onClick={() => handleToggle(p)}
                className="px-3 py-1.5 bg-neutral-900 hover:bg-amber-500 hover:text-neutral-950 text-neutral-300 text-xs font-bold uppercase rounded-lg border border-neutral-700 shrink-0 transition-colors cursor-pointer"
              >
                + Feature
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

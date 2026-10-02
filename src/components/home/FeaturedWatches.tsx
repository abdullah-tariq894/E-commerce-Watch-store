import React, { useState } from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { ProductCard } from '../product/ProductCard';

export const FeaturedWatches: React.FC = () => {
  const { products, categories, setCurrentView } = useStore();
  const [selectedFilter, setSelectedFilter] = useState('ALL');

  // Filter public items (exclude OFF)
  const publicProducts = products.filter((p) => p.stockStatus !== 'OFF');
  const filtered = publicProducts.filter((p) => {
    if (selectedFilter === 'ALL') return true;
    if (selectedFilter === 'FEATURED') return p.isFeatured;
    return p.category.toLowerCase() === selectedFilter.toLowerCase();
  });

  return (
    <section className="py-16 sm:py-24 bg-neutral-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 pb-4 border-b border-neutral-800">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-neutral-900 border border-amber-500/30 rounded-full text-[11px] font-semibold tracking-wider text-amber-400 uppercase mb-2">
              <Sparkles className="w-3 h-3 text-amber-500" />
              <span>Flagship Showcase</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-display font-bold text-neutral-100 uppercase tracking-tight">
              Featured Luxury Timepieces
            </h2>
          </div>

          {/* Interactive filter tabs */}
          <div className="mt-4 md:mt-0 flex items-center gap-1.5 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
            {['ALL', 'FEATURED', ...categories.slice(0, 5).map((c) => c.name)].map((tab) => (
              <button
                key={tab}
                onClick={() => setSelectedFilter(tab)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer ${
                  selectedFilter === tab
                    ? 'bg-amber-500 text-neutral-950 font-bold shadow-md shadow-amber-500/20'
                    : 'bg-neutral-900/80 text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800 border border-neutral-800'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Product Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filtered.slice(0, 8).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {/* View All Watches CTA */}
        <div className="mt-14 text-center">
          <button
            onClick={() => setCurrentView('all-watches')}
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-neutral-900 hover:bg-neutral-800 text-neutral-200 hover:text-amber-400 border border-neutral-700 font-semibold text-xs uppercase tracking-widest rounded-lg transition-all transform hover:-translate-y-0.5 cursor-pointer shadow-lg"
          >
            <span>EXPLORE ALL TIMEPIECES ({publicProducts.length})</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
};

import React, { useState } from 'react';
import { ArrowLeft, Search, SlidersHorizontal } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { ProductCard } from './ProductCard';

export const AllWatchesPage: React.FC = () => {
  const { products, categories, navigateToHome } = useStore();
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc'>('featured');

  let publicProducts = products.filter((p) => p.stockStatus !== 'OFF');

  if (selectedCategory !== 'ALL') {
    publicProducts = publicProducts.filter(
      (p) => p.category.toLowerCase() === selectedCategory.toLowerCase()
    );
  }

  if (searchQuery.trim()) {
    const q = searchQuery.toLowerCase();
    publicProducts = publicProducts.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q)
    );
  }

  if (sortBy === 'price-asc') {
    publicProducts = [...publicProducts].sort((a, b) => a.price - b.price);
  } else if (sortBy === 'price-desc') {
    publicProducts = [...publicProducts].sort((a, b) => b.price - a.price);
  }

  return (
    <div className="py-10 sm:py-16 bg-neutral-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <button
          onClick={navigateToHome}
          className="inline-flex items-center gap-2 text-xs text-neutral-400 hover:text-amber-400 transition-colors mb-6 cursor-pointer bg-transparent border-0 p-0"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </button>

        <div className="mb-10 pb-4 border-b border-neutral-800">
          <span className="text-[11px] font-bold uppercase tracking-widest text-amber-500 block mb-1">
            Complete Emporium
          </span>
          <h1 className="text-3xl sm:text-4xl font-display font-bold text-neutral-100 uppercase tracking-tight">
            All Luxury Watches
          </h1>
          <p className="text-xs text-neutral-400 mt-2">
            Explore our complete portfolio of original Edifice, Pagani Design, Citizen, Casio, and Curren timepieces.
          </p>
        </div>

        {/* Filter Bar */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-8">
          {/* Brand Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 lg:pb-0 scrollbar-none">
            {['ALL', ...categories.map((c) => c.name)].map((brand) => (
              <button
                key={brand}
                onClick={() => setSelectedCategory(brand)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer ${
                  selectedCategory === brand
                    ? 'bg-amber-500 text-neutral-950 font-bold shadow-md shadow-amber-500/20'
                    : 'bg-neutral-900/80 text-neutral-400 hover:text-neutral-200 border border-neutral-800'
                }`}
              >
                {brand}
              </button>
            ))}
          </div>

          {/* Search & Sort Controls */}
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-neutral-400" />
              <input
                type="text"
                placeholder="Search models..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-neutral-900 border border-neutral-700/80 rounded-lg pl-9 pr-3 py-1.5 text-xs text-neutral-200 placeholder-neutral-500 focus:outline-none focus:border-amber-500"
              />
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <SlidersHorizontal className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-neutral-900 border border-neutral-700/80 rounded-lg px-3 py-1.5 text-xs text-neutral-200 focus:outline-none focus:border-amber-500 cursor-pointer w-full sm:w-auto"
              >
                <option value="featured">Featured First</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
              </select>
            </div>
          </div>
        </div>

        {/* Product Grid */}
        {publicProducts.length === 0 ? (
          <div className="p-16 text-center bg-neutral-900/40 rounded-2xl border border-neutral-800 space-y-3">
            <h3 className="font-display font-semibold text-lg text-neutral-300 uppercase">
              No matching watches found
            </h3>
            <p className="text-xs text-neutral-500">
              Try adjusting your search criteria or brand filters.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {publicProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

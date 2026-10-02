import React, { useState } from 'react';
import { ArrowLeft, SlidersHorizontal } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { ProductCard } from '../product/ProductCard';

interface CategoryPageProps {
  categorySlug: string;
}

export const CategoryPage: React.FC<CategoryPageProps> = ({ categorySlug }) => {
  const { categories, products, navigateToHome } = useStore();
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc'>('featured');

  // Match category dynamically by slug, name or id
  const category =
    categories.find(
      (c) =>
        c.slug.toLowerCase() === categorySlug.toLowerCase() ||
        c.name.toLowerCase() === categorySlug.toLowerCase() ||
        c.id === categorySlug
    ) || {
      id: categorySlug,
      name: categorySlug.charAt(0).toUpperCase() + categorySlug.slice(1).replace('-', ' '),
      slug: categorySlug,
      description: `Curated collection of authentic ${categorySlug.replace('-', ' ')} timepieces.`,
      image: '/src/assets/images/hero_luxury_watch_slider_1_1790915310932.jpg',
      order: 0,
    };

  // Filter products by category (exclude OFF)
  let categoryProducts = products.filter(
    (p) =>
      (p.category.toLowerCase().replace(/[^a-z0-9]/g, '') ===
        category.name.toLowerCase().replace(/[^a-z0-9]/g, '') ||
        p.category.toLowerCase() === category.slug.toLowerCase()) &&
      p.stockStatus !== 'OFF'
  );

  // Sorting
  if (sortBy === 'price-asc') {
    categoryProducts = [...categoryProducts].sort((a, b) => a.price - b.price);
  } else if (sortBy === 'price-desc') {
    categoryProducts = [...categoryProducts].sort((a, b) => b.price - a.price);
  }

  return (
    <div className="py-10 sm:py-16 bg-neutral-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb / Back button */}
        <button
          onClick={navigateToHome}
          className="inline-flex items-center gap-2 text-xs text-neutral-400 hover:text-amber-400 transition-colors mb-6 cursor-pointer bg-transparent border-0 p-0"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </button>

        {/* Dynamic Category Hero Banner */}
        <div className="relative rounded-2xl overflow-hidden bg-neutral-900 border border-neutral-800 p-8 sm:p-12 mb-12 shadow-2xl min-h-[220px] flex items-center">
          <div className="absolute inset-0 z-0">
            <img
              key={category.image || category.id}
              src={category.image || '/src/assets/images/hero_luxury_watch_slider_1_1790915310932.jpg'}
              alt={category.name}
              className="w-full h-full object-cover opacity-35 filter"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-neutral-950 via-neutral-950/85 to-neutral-950/50" />
          </div>

          <div className="relative z-10 max-w-2xl space-y-3">
            <div className="text-[11px] font-bold uppercase tracking-widest text-amber-500">
              Master Horology Series
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-neutral-100 uppercase tracking-tight">
              {category.name} Watches
            </h1>
            <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed max-w-xl">
              {category.description || `Explore our hand-selected portfolio of authentic ${category.name} timepieces.`}
            </p>
          </div>
        </div>

        {/* Sort & Filter Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-4 border-b border-neutral-800">
          <div className="text-xs text-neutral-400">
            Showing <strong className="text-neutral-200">{categoryProducts.length}</strong> timepieces
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-xs text-neutral-400">
              <SlidersHorizontal className="w-3.5 h-3.5 text-amber-500" />
              <span>Sort By:</span>
            </div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-neutral-900 border border-neutral-700/80 rounded-lg px-3 py-1.5 text-xs text-neutral-200 focus:outline-none focus:border-amber-500 cursor-pointer"
            >
              <option value="featured">Featured First</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
            </select>
          </div>
        </div>

        {/* Product Grid */}
        {categoryProducts.length === 0 ? (
          <div className="p-16 text-center bg-neutral-900/40 rounded-2xl border border-neutral-800 space-y-3">
            <h3 className="font-display font-semibold text-lg text-neutral-300 uppercase">
              No products found in this category
            </h3>
            <p className="text-xs text-neutral-500">
              New models are being added from our Master Admin Dashboard. Please check back soon!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {categoryProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

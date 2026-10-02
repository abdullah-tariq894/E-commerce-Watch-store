import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export const CategoryShowcase: React.FC = () => {
  const { categories, products, navigateToCategory } = useStore();

  // Deduplicate categories by slug and ensure order
  const uniqueCategories = categories.filter(
    (c, idx, arr) => arr.findIndex((item) => item.slug.toLowerCase() === c.slug.toLowerCase()) === idx
  );

  return (
    <section className="py-16 sm:py-20 bg-neutral-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 pb-4 border-b border-neutral-800">
          <div>
            <span className="text-[11px] font-bold tracking-[0.25em] text-amber-500 uppercase block mb-1">
              Curated Collections
            </span>
            <h2 className="text-2xl sm:text-3xl font-display font-bold text-neutral-100 uppercase tracking-tight">
              Iconic Watch Brands
            </h2>
          </div>
          <p className="text-xs text-neutral-400 max-w-md mt-2 sm:mt-0">
            Hand-selected chronographs and automatic timepieces from world-renowned watchmakers.
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6">
          {uniqueCategories.map((cat) => {
            const count = products.filter(
              (p) => p.category.toLowerCase() === cat.name.toLowerCase() && p.stockStatus !== 'OFF'
            ).length;

            return (
              <button
                key={cat.id}
                onClick={() => navigateToCategory(cat.slug)}
                className="group relative flex flex-col text-left rounded-xl overflow-hidden bg-neutral-900/60 border border-neutral-800/80 hover:border-amber-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-amber-500/5 cursor-pointer"
              >
                {/* Dynamic Image Frame */}
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-neutral-950">
                  <img
                    key={cat.image || cat.id}
                    src={cat.image || '/src/assets/images/hero_luxury_watch_slider_1_1790915310932.jpg'}
                    alt={cat.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/40 to-transparent" />
                  <div className="absolute top-2.5 right-2.5 w-7 h-7 rounded-full bg-neutral-900/80 border border-neutral-700/60 flex items-center justify-center text-neutral-300 group-hover:text-amber-400 group-hover:border-amber-500/60 transition-colors">
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </div>
                </div>

                {/* Content */}
                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-display font-bold text-sm sm:text-base text-neutral-100 group-hover:text-amber-400 transition-colors uppercase tracking-wider">
                      {cat.name}
                    </h3>
                    <p className="text-[11px] text-neutral-400 mt-1 line-clamp-2 leading-relaxed">
                      {cat.description || `Explore authentic ${cat.name} collection.`}
                    </p>
                  </div>
                  <div className="mt-3 pt-2 border-t border-neutral-800/60 flex items-center justify-between text-[11px] text-neutral-400">
                    <span>{count} Timepieces</span>
                    <span className="text-amber-500 font-semibold group-hover:underline">Explore</span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
};

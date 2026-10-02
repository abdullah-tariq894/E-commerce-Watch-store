import React from 'react';
import { Sparkles, MessageCircle, ArrowRight } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export const WomensCollection: React.FC = () => {
  const { womensItems, settings, navigateToCategory } = useStore();
  const activeItems = womensItems.filter((i) => i.isEnabled).sort((a, b) => a.order - b.order);

  if (activeItems.length === 0) return null;

  // Format WhatsApp number
  const rawNumber = settings.whatsapp.number || '0330-2244486';
  let formattedNumber = rawNumber.replace(/[^0-9]/g, '');
  if (formattedNumber.startsWith('0')) {
    formattedNumber = '92' + formattedNumber.slice(1);
  }

  const handleWhatsAppInquiry = (item: (typeof activeItems)[0]) => {
    const text = `Hello! I am interested in ordering the Women's watch: "${item.title}" (Price: Rs. ${item.price.toLocaleString()}) from Perfect Time Collection. Please confirm availability.`;
    window.open(`https://wa.me/${formattedNumber}?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <section className="py-16 sm:py-20 bg-neutral-900/40 border-y border-neutral-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 pb-4 border-b border-rose-900/30">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-rose-950/40 border border-rose-500/30 rounded-full text-[11px] font-semibold tracking-wider text-rose-300 uppercase mb-2">
              <Sparkles className="w-3 h-3 text-rose-400" />
              <span>Dedicated Horology Series</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-display font-bold text-neutral-100 uppercase tracking-tight">
              Women's Luxury Collection
            </h2>
          </div>
          <p className="text-xs text-neutral-400 max-w-md mt-2 md:mt-0">
            Dainty dials, diamond accents, mother-of-pearl lusters, and polished bracelets crafted for enduring poise.
          </p>
        </div>

        {/* 4 to 5 Women's Watches Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {activeItems.slice(0, 5).map((item) => (
            <div
              key={item.id}
              className="group bg-neutral-950/80 rounded-xl overflow-hidden border border-neutral-800 hover:border-rose-500/40 transition-all duration-300 hover:shadow-xl hover:shadow-rose-950/20 flex flex-col justify-between"
            >
              {/* Product Photo */}
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-neutral-900">
                <img
                  src={item.image}
                  alt={item.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-transparent to-transparent opacity-60" />
                <span className="absolute top-3 left-3 text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 bg-neutral-950/80 border border-rose-500/30 text-rose-300 rounded-md">
                  Women's Edit
                </span>
              </div>

              {/* Details */}
              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-display font-semibold text-sm text-neutral-100 group-hover:text-rose-300 transition-colors line-clamp-1">
                    {item.title}
                  </h3>
                  <p className="text-[11px] text-neutral-400 mt-1 line-clamp-2 leading-relaxed">
                    {item.subtitle}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-neutral-800/80">
                  <div className="flex items-baseline gap-2 mb-3">
                    <span className="text-base font-bold text-rose-300 tabular-nums">
                      Rs. {item.price.toLocaleString()}
                    </span>
                    {item.originalPrice && item.originalPrice > item.price && (
                      <span className="text-xs text-neutral-500 line-through tabular-nums">
                        Rs. {item.originalPrice.toLocaleString()}
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => handleWhatsAppInquiry(item)}
                      className="flex items-center justify-center gap-1.5 py-2 px-2 text-[10px] font-bold uppercase tracking-wider bg-[#25D366]/20 hover:bg-[#25D366] text-emerald-400 hover:text-white border border-[#25D366]/40 rounded-md transition-colors cursor-pointer"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      <span>WhatsApp</span>
                    </button>
                    <button
                      onClick={() => {
                        if (item.link?.startsWith('/category/')) {
                          navigateToCategory(item.link.replace('/category/', ''));
                        } else {
                          navigateToCategory('curren');
                        }
                      }}
                      className="flex items-center justify-center gap-1 py-2 px-2 text-[10px] font-semibold uppercase tracking-wider bg-neutral-900 hover:bg-neutral-800 text-neutral-300 rounded-md border border-neutral-700/60 transition-colors cursor-pointer"
                    >
                      <span>Details</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

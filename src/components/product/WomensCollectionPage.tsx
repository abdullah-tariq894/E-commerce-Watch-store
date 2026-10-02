import React from 'react';
import { ArrowLeft, Sparkles, MessageCircle } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export const WomensCollectionPage: React.FC = () => {
  const { womensItems, settings, navigateToHome } = useStore();
  const activeItems = womensItems.filter((i) => i.isEnabled).sort((a, b) => a.order - b.order);

  const rawNumber = settings.whatsapp.number || '0330-2244486';
  let formattedNumber = rawNumber.replace(/[^0-9]/g, '');
  if (formattedNumber.startsWith('0')) {
    formattedNumber = '92' + formattedNumber.slice(1);
  }

  const handleWhatsAppOrder = (item: (typeof activeItems)[0]) => {
    const text = `Hello! I want to order the Women's watch: "${item.title}" (Price: Rs. ${item.price.toLocaleString()}) from Perfect Time Collection. Please confirm availability and delivery to Karachi.`;
    window.open(`https://wa.me/${formattedNumber}?text=${encodeURIComponent(text)}`, '_blank');
  };

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

        {/* Dedicated Banner */}
        <div className="relative rounded-2xl overflow-hidden bg-gradient-to-r from-rose-950/40 via-neutral-900 to-neutral-950 border border-rose-900/40 p-8 sm:p-12 mb-12 shadow-2xl">
          <div className="relative z-10 max-w-2xl space-y-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-rose-950/60 border border-rose-500/40 rounded-full text-[11px] font-semibold tracking-wider text-rose-300 uppercase">
              <Sparkles className="w-3.5 h-3.5 text-rose-400" />
              <span>Dedicated Collection</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-neutral-100 uppercase tracking-tight">
              Women's Luxury Timepieces
            </h1>
            <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed max-w-xl">
              Exquisite mother-of-pearl dials, Swarovski crystal encrusted bezels, and refined bracelets tailored for the sophisticated wrist.
            </p>
          </div>
        </div>

        {/* Items Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {activeItems.map((item) => (
            <div
              key={item.id}
              className="group bg-neutral-900/60 rounded-xl overflow-hidden border border-neutral-800 hover:border-rose-500/40 transition-all duration-300 flex flex-col justify-between"
            >
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-neutral-950">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-transparent to-transparent opacity-60" />
                <span className="absolute top-3 left-3 text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 bg-neutral-950/90 border border-rose-500/40 text-rose-300 rounded">
                  Women's Luxury
                </span>
              </div>
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-display font-semibold text-base text-neutral-100 group-hover:text-rose-300 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-xs text-neutral-400 mt-1 leading-relaxed">
                    {item.subtitle}
                  </p>
                </div>

                <div className="mt-5 pt-3 border-t border-neutral-800 space-y-3">
                  <div className="flex items-baseline gap-2">
                    <span className="text-lg font-bold text-rose-300 tabular-nums">
                      Rs. {item.price.toLocaleString()}
                    </span>
                    {item.originalPrice && item.originalPrice > item.price && (
                      <span className="text-xs text-neutral-500 line-through tabular-nums">
                        Rs. {item.originalPrice.toLocaleString()}
                      </span>
                    )}
                  </div>
                  <button
                    onClick={() => handleWhatsAppOrder(item)}
                    className="w-full py-3 px-4 rounded-lg flex items-center justify-center gap-2 font-bold text-xs uppercase tracking-wider bg-[#25D366] hover:bg-[#20ba5a] text-white transition-all shadow-md cursor-pointer"
                  >
                    <MessageCircle className="w-4 h-4 fill-white stroke-none" />
                    <span>Order on WhatsApp</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

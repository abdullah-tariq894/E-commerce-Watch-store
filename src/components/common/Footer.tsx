import React from 'react';
import { Mail, Phone, MapPin, Clock, ShieldCheck } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export const Footer: React.FC = () => {
  const { settings, categories, navigateToHome, navigateToCategory, setCurrentView, navigateToAdmin } =
    useStore();
  const { footer, branding, whatsapp, delivery } = settings;

  // Clean WhatsApp number
  const rawNumber = whatsapp.number || '0330-2244486';
  let formattedNumber = rawNumber.replace(/[^0-9]/g, '');
  if (formattedNumber.startsWith('0')) {
    formattedNumber = '92' + formattedNumber.slice(1);
  }

  return (
    <footer className="bg-neutral-950 border-t border-neutral-800/80 text-neutral-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-amber-500 text-neutral-950 flex items-center justify-center font-serif font-bold text-sm">
                P
              </div>
              <div>
                <span className="font-display font-bold text-base tracking-wider text-neutral-100 uppercase block">
                  {branding.siteTitle || 'PERFECT TIME'}
                </span>
                <span className="text-[9px] tracking-[0.25em] text-amber-500 font-medium block uppercase -mt-0.5">
                  COLLECTION
                </span>
              </div>
            </div>
            <p className="text-xs leading-relaxed text-neutral-400">
              {footer.description}
            </p>
            <div className="pt-2 text-[11px] text-amber-400/90 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" />
              <span>Free Delivery in Karachi on orders over Rs. {delivery.karachiFreeThreshold.toLocaleString()}</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display font-semibold text-xs uppercase tracking-widest text-neutral-200 mb-4 pb-1 border-b border-neutral-800/60 inline-block">
              Navigation
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <button
                  onClick={navigateToHome}
                  className="hover:text-amber-400 transition-colors cursor-pointer bg-transparent border-0 p-0 text-neutral-400"
                >
                  Store Homepage
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentView('all-watches')}
                  className="hover:text-amber-400 transition-colors cursor-pointer bg-transparent border-0 p-0 text-neutral-400"
                >
                  All Watch Models
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentView('womens')}
                  className="hover:text-rose-300 transition-colors cursor-pointer bg-transparent border-0 p-0 text-neutral-400"
                >
                  Women's Luxury Series
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentView('checkout')}
                  className="hover:text-amber-400 transition-colors cursor-pointer bg-transparent border-0 p-0 text-neutral-400"
                >
                  Cart & Cash on Delivery Checkout
                </button>
              </li>
            </ul>
          </div>

          {/* Watch Brands */}
          <div>
            <h4 className="font-display font-semibold text-xs uppercase tracking-widest text-neutral-200 mb-4 pb-1 border-b border-neutral-800/60 inline-block">
              Featured Brands
            </h4>
            <ul className="space-y-2.5 text-xs">
              {categories.slice(0, 5).map((cat) => (
                <li key={cat.id}>
                  <button
                    onClick={() => navigateToCategory(cat.slug)}
                    className="hover:text-amber-400 transition-colors cursor-pointer bg-transparent border-0 p-0 text-neutral-400"
                  >
                    {cat.name} Watches
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h4 className="font-display font-semibold text-xs uppercase tracking-widest text-neutral-200 mb-4 pb-1 border-b border-neutral-800/60 inline-block">
              Store Contact
            </h4>
            <ul className="space-y-3 text-xs">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                <span>{footer.address}</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-amber-500 shrink-0" />
                <a
                  href={`https://wa.me/${formattedNumber}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-amber-400 transition-colors"
                >
                  WhatsApp: {footer.phone || whatsapp.number}
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-amber-500 shrink-0" />
                <a
                  href={`mailto:${footer.email}`}
                  className="hover:text-amber-400 transition-colors"
                >
                  {footer.email}
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-neutral-800/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-neutral-500">
          <div>{footer.copyrightText}</div>
          <div className="flex items-center gap-4">
            <span className="text-neutral-600">Authentic Horology Guaranteed</span>
            <span className="text-neutral-700">|</span>
            <button
              onClick={navigateToAdmin}
              className="flex items-center gap-1 text-neutral-500 hover:text-amber-400 transition-colors cursor-pointer bg-transparent border-0"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-amber-500" />
              <span>Admin Portal</span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

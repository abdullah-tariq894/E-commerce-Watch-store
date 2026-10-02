import React from 'react';
import { MessageCircle } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export const FloatingWhatsApp: React.FC = () => {
  const { settings } = useStore();
  const { whatsapp } = settings;

  if (!whatsapp?.isFloatingEnabled) return null;

  // Clean WhatsApp number
  const rawNumber = whatsapp.number || '0330-2244486';
  let formattedNumber = rawNumber.replace(/[^0-9]/g, '');
  if (formattedNumber.startsWith('0')) {
    formattedNumber = '92' + formattedNumber.slice(1);
  }

  const welcomeMsg = encodeURIComponent(
    whatsapp.welcomeMessage || 'Hello! I am inquiring from Perfect Time Collection website.'
  );

  const waUrl = `https://wa.me/${formattedNumber}?text=${welcomeMsg}`;

  return (
    <a
      href={waUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-40 flex items-center gap-2.5 px-4 py-3 bg-[#25D366] hover:bg-[#20ba5a] text-white rounded-full shadow-2xl shadow-emerald-900/40 transition-all duration-300 transform hover:scale-105 group border border-emerald-400/30"
      aria-label="Chat on WhatsApp"
    >
      <div className="relative">
        <MessageCircle className="w-6 h-6 fill-white stroke-none" />
        <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-white rounded-full animate-ping" />
      </div>
      <span className="hidden sm:inline-block text-xs font-bold tracking-wider uppercase pr-1">
        {whatsapp.buttonText || 'Chat on WhatsApp'}
      </span>
    </a>
  );
};

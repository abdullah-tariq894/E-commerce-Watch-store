import React, { useState } from 'react';
import {
  ShoppingBag,
  MessageCircle,
  Truck,
  ShieldCheck,
  RotateCcw,
  ArrowLeft,
  Check,
  ChevronRight,
} from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useStore } from '../../context/StoreContext';
import { api } from '../../services/api';
import { Product } from '../../types';

interface ProductDetailPageProps {
  product: Product;
}

export const ProductDetailPage: React.FC<ProductDetailPageProps> = ({ product }) => {
  const { addToCart } = useCart();
  const { settings, navigateToHome, navigateToCategory, setCurrentView } = useStore();
  const [selectedImageIdx, setSelectedImageIdx] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isAddedToast, setIsAddedToast] = useState(false);

  const isOutOfStock = product.stockStatus === 'OUT_OF_STOCK';

  const rawNumber = settings.whatsapp.number || '0330-2244486';
  let formattedNumber = rawNumber.replace(/[^0-9]/g, '');
  if (formattedNumber.startsWith('0')) {
    formattedNumber = '92' + formattedNumber.slice(1);
  }

  const handleAddToCart = () => {
    if (isOutOfStock) return;
    addToCart(product, quantity);
    setIsAddedToast(true);
    setTimeout(() => setIsAddedToast(false), 2500);
  };

  const handleWhatsAppOrder = async () => {
    const mainImageUrl = window.location.origin + product.images[selectedImageIdx || 0];
    const pageUrl = window.location.href;
    const message = `Hello! I want to order this product from your website. Product Name: ${product.name} Price: Rs. ${product.price.toLocaleString()} Quantity: ${quantity} Description: ${product.description.slice(0, 140)}... Product Image: ${mainImageUrl} Product Link: ${pageUrl} Please confirm my order.`;
    const waLink = `https://wa.me/${formattedNumber}?text=${encodeURIComponent(message)}`;

    try {
      await api.recordWhatsAppInquiry({
        productId: product.id,
        quantity,
      });
    } catch (e) {
      console.warn('WhatsApp inquiry recording notice:', e);
    }

    window.open(waLink, '_blank');
  };

  return (
    <div className="bg-neutral-950 py-10 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb Navigation */}
        <div className="flex items-center gap-2 text-xs text-neutral-400 mb-8 overflow-x-auto whitespace-nowrap pb-2">
          <button
            onClick={navigateToHome}
            className="hover:text-amber-400 transition-colors flex items-center gap-1 cursor-pointer bg-transparent border-0 p-0 text-inherit"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Home</span>
          </button>
          <ChevronRight className="w-3.5 h-3.5 text-neutral-600" />
          <button
            onClick={() => navigateToCategory(product.category.toLowerCase())}
            className="hover:text-amber-400 transition-colors cursor-pointer bg-transparent border-0 p-0 text-inherit"
          >
            {product.category}
          </button>
          <ChevronRight className="w-3.5 h-3.5 text-neutral-600" />
          <span className="text-neutral-200 truncate max-w-xs">{product.name}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
          {/* Left Column: Image Gallery (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            {/* Main Stage Image */}
            <div className="relative aspect-[4/3] w-full rounded-2xl overflow-hidden bg-neutral-900 border border-neutral-800 shadow-2xl">
              <img
                src={product.images[selectedImageIdx] || product.images[0]}
                alt={product.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/40 via-transparent to-transparent pointer-events-none" />

              {/* Status Badge */}
              <div className="absolute top-4 left-4 flex items-center gap-2 px-3 py-1.5 rounded-md bg-neutral-950/90 backdrop-blur-md border border-neutral-800">
                <span
                  className={`w-2.5 h-2.5 rounded-full ${
                    isOutOfStock ? 'bg-red-500' : 'bg-emerald-400 animate-pulse'
                  }`}
                />
                <span
                  className={`text-xs font-bold uppercase tracking-wider ${
                    isOutOfStock ? 'text-red-400' : 'text-emerald-400'
                  }`}
                >
                  {isOutOfStock ? 'Out of Stock' : 'In Stock & Ready to Dispatch'}
                </span>
              </div>
            </div>

            {/* Thumbnails Gallery */}
            {product.images.length > 1 && (
              <div className="flex items-center gap-3 overflow-x-auto pb-2">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImageIdx(idx)}
                    className={`relative w-20 h-20 rounded-xl overflow-hidden border-2 transition-all shrink-0 cursor-pointer ${
                      selectedImageIdx === idx
                        ? 'border-amber-500 ring-2 ring-amber-500/20'
                        : 'border-neutral-800 hover:border-neutral-600 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img
                      src={img}
                      alt={`${product.name} thumb ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Purchase Module & Details (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div>
              <div className="flex items-center gap-3 text-xs uppercase tracking-widest font-semibold text-amber-500 mb-2">
                <span>{product.category} Horology</span>
                {product.sku && (
                  <>
                    <span className="text-neutral-600">•</span>
                    <span className="text-neutral-400">SKU: {product.sku}</span>
                  </>
                )}
              </div>

              <h1 className="text-2xl sm:text-3xl font-display font-bold text-neutral-100 leading-tight">
                {product.name}
              </h1>

              <div className="mt-4 flex items-baseline gap-3">
                <span className="text-3xl font-bold text-amber-400 tabular-nums">
                  Rs. {product.price.toLocaleString()}
                </span>
                {product.originalPrice && product.originalPrice > product.price && (
                  <span className="text-lg text-neutral-500 line-through tabular-nums">
                    Rs. {product.originalPrice.toLocaleString()}
                  </span>
                )}
                <span className="text-xs px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-semibold uppercase tracking-wider">
                  Cash on Delivery
                </span>
              </div>
            </div>

            {/* Description */}
            <div className="border-t border-neutral-800/80 pt-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-300 mb-2">
                Watchmaker Overview
              </h3>
              <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Action Bar (Quantity + Cart + WhatsApp) */}
            <div className="border-t border-neutral-800/80 pt-6 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-neutral-300 uppercase tracking-wider">
                  Select Quantity:
                </span>
                <div className="flex items-center border border-neutral-700 rounded-lg bg-neutral-900 overflow-hidden">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    disabled={isOutOfStock || quantity <= 1}
                    className="px-3.5 py-2 text-neutral-300 hover:text-white hover:bg-neutral-800 transition-colors disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                  >
                    -
                  </button>
                  <span className="px-4 py-2 text-xs font-bold text-neutral-100 min-w-10 text-center tabular-nums">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity((q) => q + 1)}
                    disabled={isOutOfStock}
                    className="px-3.5 py-2 text-neutral-300 hover:text-white hover:bg-neutral-800 transition-colors disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Primary Buttons */}
              <div className="space-y-3 pt-2">
                <button
                  onClick={handleAddToCart}
                  disabled={isOutOfStock}
                  className={`w-full py-4 px-6 rounded-xl flex items-center justify-center gap-2.5 font-bold text-xs uppercase tracking-widest transition-all cursor-pointer shadow-lg ${
                    isOutOfStock
                      ? 'bg-neutral-800 text-neutral-500 cursor-not-allowed border border-neutral-700'
                      : 'bg-amber-500 hover:bg-amber-400 text-neutral-950 shadow-amber-500/20 transform hover:-translate-y-0.5 active:scale-[0.99]'
                  }`}
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>{isOutOfStock ? 'OUT OF STOCK' : 'ADD TO CART'}</span>
                </button>

                <button
                  onClick={handleWhatsAppOrder}
                  className="w-full py-4 px-6 rounded-xl flex items-center justify-center gap-2.5 font-bold text-xs uppercase tracking-widest bg-[#25D366] hover:bg-[#20ba5a] text-white transition-all transform hover:-translate-y-0.5 active:scale-[0.99] cursor-pointer shadow-lg shadow-emerald-950/40"
                >
                  <MessageCircle className="w-4 h-4 fill-white stroke-none" />
                  <span>ORDER ON WHATSAPP</span>
                </button>
              </div>

              {isAddedToast && (
                <div className="p-3 bg-emerald-500/20 border border-emerald-500/40 rounded-lg flex items-center gap-2 text-xs text-emerald-300 animate-fade-in">
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span>Successfully added to your cart!</span>
                </div>
              )}
            </div>

            {/* Trust and Delivery Badges */}
            <div className="border-t border-neutral-800/80 pt-6 grid grid-cols-2 gap-4 text-xs">
              <div className="flex items-start gap-2.5 p-3 rounded-lg bg-neutral-900/60 border border-neutral-800">
                <Truck className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold text-neutral-200">Karachi Express</div>
                  <div className="text-[11px] text-neutral-400 mt-0.5">
                    Free over Rs. {settings.delivery.karachiFreeThreshold.toLocaleString()}
                  </div>
                </div>
              </div>
              <div className="flex items-start gap-2.5 p-3 rounded-lg bg-neutral-900/60 border border-neutral-800">
                <ShieldCheck className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold text-neutral-200">100% Original</div>
                  <div className="text-[11px] text-neutral-400 mt-0.5">Tested before dispatch</div>
                </div>
              </div>
              <div className="flex items-start gap-2.5 p-3 rounded-lg bg-neutral-900/60 border border-neutral-800">
                <RotateCcw className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold text-neutral-200">Open Parcel</div>
                  <div className="text-[11px] text-neutral-400 mt-0.5">Check before paying</div>
                </div>
              </div>
              <div className="flex items-start gap-2.5 p-3 rounded-lg bg-neutral-900/60 border border-neutral-800">
                <MessageCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold text-neutral-200">Direct Support</div>
                  <div className="text-[11px] text-neutral-400 mt-0.5">0330-2244486</div>
                </div>
              </div>
            </div>

            {/* Specifications Matrix */}
            {product.specs && (
              <div className="border-t border-neutral-800/80 pt-6">
                <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-300 mb-3">
                  Technical Specifications
                </h3>
                <div className="bg-neutral-900/40 rounded-xl border border-neutral-800 divide-y divide-neutral-800/80 text-xs">
                  {product.specs.caseDiameter && (
                    <div className="p-3 flex justify-between">
                      <span className="text-neutral-400">Case Diameter</span>
                      <span className="text-neutral-200 font-medium">{product.specs.caseDiameter}</span>
                    </div>
                  )}
                  {product.specs.caseThickness && (
                    <div className="p-3 flex justify-between">
                      <span className="text-neutral-400">Case Thickness</span>
                      <span className="text-neutral-200 font-medium">{product.specs.caseThickness}</span>
                    </div>
                  )}
                  {product.specs.strapMaterial && (
                    <div className="p-3 flex justify-between">
                      <span className="text-neutral-400">Strap / Bracelet</span>
                      <span className="text-neutral-200 font-medium">{product.specs.strapMaterial}</span>
                    </div>
                  )}
                  {product.specs.waterResistance && (
                    <div className="p-3 flex justify-between">
                      <span className="text-neutral-400">Water Resistance</span>
                      <span className="text-neutral-200 font-medium">{product.specs.waterResistance}</span>
                    </div>
                  )}
                  {product.specs.movementType && (
                    <div className="p-3 flex justify-between">
                      <span className="text-neutral-400">Movement Caliber</span>
                      <span className="text-neutral-200 font-medium">{product.specs.movementType}</span>
                    </div>
                  )}
                  {product.specs.warranty && (
                    <div className="p-3 flex justify-between">
                      <span className="text-neutral-400">Warranty</span>
                      <span className="text-neutral-200 font-medium text-amber-400">{product.specs.warranty}</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

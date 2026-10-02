import React, { useState } from 'react';
import {
  ShieldCheck,
  Truck,
  CheckCircle,
  AlertCircle,
  ShoppingBag,
  ArrowLeft,
  MessageCircle,
  Copy,
  Printer,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useCart } from '../../context/CartContext';
import { useStore } from '../../context/StoreContext';
import { api } from '../../services/api';
import { Order } from '../../types';

export const CheckoutPage: React.FC = () => {
  const { cart, subtotal, deliveryFee, totalAmount, isFreeDelivery, clearCart } = useCart();
  const { settings, navigateToHome, setCurrentView } = useStore();
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    address: '',
    city: 'Karachi',
    area: '',
    notes: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);
  const [copied, setCopied] = useState(false);

  // Karachi areas quick-selector helper
  const karachiAreas = [
    'DHA (Defence)',
    'Clifton',
    'Gulshan-e-Iqbal',
    'North Nazimabad',
    'PECHS',
    'Gulistan-e-Johar',
    'Bahria Town Karachi',
    'Saddar / Saddar Cantt',
    'Federal B Area',
    'Malir Cantt',
    'Other Karachi Area',
  ];

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setErrorMessage(null);
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // Form validations
    if (!formData.fullName.trim()) {
      setErrorMessage('Please enter your full name.');
      return;
    }
    if (!formData.phone.trim()) {
      setErrorMessage('Please enter your active WhatsApp or mobile phone number.');
      return;
    }
    if (!formData.address.trim()) {
      setErrorMessage('Please provide your complete delivery street address.');
      return;
    }
    if (!formData.area.trim()) {
      setErrorMessage('Please select or specify your area / locality.');
      return;
    }
    if (cart.length === 0) {
      setErrorMessage('Your cart is empty. Please add a watch before checking out.');
      return;
    }

    const outOfStockItems = cart.filter((i) => i.product.stockStatus === 'OUT_OF_STOCK');
    if (outOfStockItems.length > 0) {
      setErrorMessage(
        `"${outOfStockItems[0].product.name}" is currently Out of Stock. Please remove it from cart.`
      );
      return;
    }

    setIsSubmitting(true);
    try {
      const orderPayload = {
        customer: {
          fullName: formData.fullName,
          phone: formData.phone,
          email: formData.email,
          address: formData.address,
          city: formData.city,
          area: formData.area,
          notes: formData.notes,
        },
        items: cart.map((i) => ({
          productId: i.product.id,
          quantity: i.quantity,
        })),
      };

      const result = await api.createOrder(orderPayload);
      if (result.success && result.order) {
        setCompletedOrder(result.order);
        clearCart();
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#f59e0b', '#fbbf24', '#10b981', '#ffffff'],
        });
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to place order. Please try again or order on WhatsApp.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const rawNumber = settings.whatsapp.number || '0330-2244486';
  let formattedNumber = rawNumber.replace(/[^0-9]/g, '');
  if (formattedNumber.startsWith('0')) {
    formattedNumber = '92' + formattedNumber.slice(1);
  }

  const getWhatsAppReceiptLink = () => {
    if (!completedOrder) return '';
    const text = `Hello! I have placed Order #${completedOrder.orderNumber} on Perfect Time Collection website. Total: Rs. ${completedOrder.pricing.totalAmount.toLocaleString()} Customer Name: ${completedOrder.customer.fullName} Phone: ${completedOrder.customer.phone} Address: ${completedOrder.customer.address}, ${completedOrder.customer.city} Please confirm dispatch!`;
    return `https://wa.me/${formattedNumber}?text=${encodeURIComponent(text)}`;
  };

  const copyOrderNumber = () => {
    if (completedOrder) {
      navigator.clipboard.writeText(completedOrder.orderNumber);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (completedOrder) {
    return (
      <div className="py-16 sm:py-24 bg-neutral-950 min-h-[80vh]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-neutral-900/80 border border-neutral-800 rounded-2xl p-6 sm:p-10 shadow-2xl space-y-8 animate-fade-in">
            <div className="text-center space-y-3 pb-6 border-b border-neutral-800">
              <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mx-auto">
                <CheckCircle className="w-8 h-8" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-display font-bold text-neutral-100 uppercase tracking-tight">
                Order Confirmed!
              </h1>
              <p className="text-xs sm:text-sm text-neutral-400 max-w-md mx-auto">
                Thank you, <strong>{completedOrder.customer.fullName}</strong>. Your luxury timepiece order has been successfully recorded in our system.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between p-4 rounded-xl bg-neutral-950 border border-neutral-800 gap-3">
              <div>
                <span className="text-[11px] uppercase tracking-wider text-neutral-500 block">
                  Order Reference Number
                </span>
                <span className="text-lg font-mono font-bold text-amber-400 tracking-wider">
                  #{completedOrder.orderNumber}
                </span>
              </div>
              <button
                onClick={copyOrderNumber}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold uppercase tracking-wider bg-neutral-900 hover:bg-neutral-800 text-neutral-300 rounded-md border border-neutral-700 transition-colors cursor-pointer"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>{copied ? 'Copied!' : 'Copy Order ID'}</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
              <div className="bg-neutral-950/60 p-4 rounded-xl border border-neutral-800/80 space-y-2">
                <h3 className="font-bold text-neutral-200 uppercase tracking-wider text-[11px] mb-2 pb-1 border-b border-neutral-800">
                  Delivery Destination
                </h3>
                <p>
                  <strong>Customer:</strong> {completedOrder.customer.fullName}
                </p>
                <p>
                  <strong>Phone / WhatsApp:</strong> {completedOrder.customer.phone}
                </p>
                {completedOrder.customer.email && (
                  <p>
                    <strong>Email:</strong> {completedOrder.customer.email}
                  </p>
                )}
                <p>
                  <strong>Address:</strong> {completedOrder.customer.address}
                </p>
                <p>
                  <strong>Area & City:</strong> {completedOrder.customer.area},{' '}
                  {completedOrder.customer.city}
                </p>
                <p className="pt-2 text-amber-500 font-semibold">
                  Payment: Cash on Delivery (COD)
                </p>
              </div>

              <div className="bg-neutral-950/60 p-4 rounded-xl border border-neutral-800/80 space-y-2">
                <h3 className="font-bold text-neutral-200 uppercase tracking-wider text-[11px] mb-2 pb-1 border-b border-neutral-800">
                  Ordered Timepieces
                </h3>
                <div className="space-y-2 divide-y divide-neutral-800/60 max-h-40 overflow-y-auto">
                  {completedOrder.items.map((item, idx) => (
                    <div key={idx} className="pt-2 first:pt-0 flex justify-between gap-2">
                      <span className="text-neutral-300">
                        {item.quantity}x {item.name}
                      </span>
                      <span className="text-neutral-100 font-semibold tabular-nums shrink-0">
                        Rs. {(item.price * item.quantity).toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="pt-3 border-t border-neutral-800 space-y-1">
                  <div className="flex justify-between text-neutral-400">
                    <span>Subtotal:</span>
                    <span>Rs. {completedOrder.pricing.subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-neutral-400">
                    <span>Delivery:</span>
                    <span className={completedOrder.pricing.deliveryFee === 0 ? 'text-emerald-400' : ''}>
                      {completedOrder.pricing.deliveryFee === 0
                        ? 'FREE (Karachi Promotion)'
                        : `Rs. ${completedOrder.pricing.deliveryFee.toLocaleString()}`}
                    </span>
                  </div>
                  <div className="flex justify-between font-bold text-neutral-100 text-sm pt-1">
                    <span>Total Payable:</span>
                    <span className="text-amber-400">
                      Rs. {completedOrder.pricing.totalAmount.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-3 pt-4 border-t border-neutral-800">
              <a
                href={getWhatsAppReceiptLink()}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3.5 px-6 rounded-xl flex items-center justify-center gap-2.5 font-bold text-xs uppercase tracking-widest bg-[#25D366] hover:bg-[#20ba5a] text-white shadow-lg transition-all"
              >
                <MessageCircle className="w-4 h-4 fill-white stroke-none" />
                <span>Notify Store Owner on WhatsApp</span>
              </a>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => window.print()}
                  className="flex-1 py-3 px-4 rounded-xl flex items-center justify-center gap-2 font-semibold text-xs uppercase tracking-wider bg-neutral-950 hover:bg-neutral-800 text-neutral-300 border border-neutral-700 transition-colors"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print Receipt</span>
                </button>
                <button
                  onClick={navigateToHome}
                  className="flex-1 py-3 px-4 rounded-xl flex items-center justify-center font-semibold text-xs uppercase tracking-wider bg-amber-500 hover:bg-amber-400 text-neutral-950 transition-colors"
                >
                  <span>Continue Shopping</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-12 sm:py-20 bg-neutral-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <button
          onClick={navigateToHome}
          className="inline-flex items-center gap-2 text-xs text-neutral-400 hover:text-amber-400 transition-colors mb-6 cursor-pointer bg-transparent border-0 p-0"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Store</span>
        </button>

        <h1 className="text-2xl sm:text-3xl font-display font-bold text-neutral-100 uppercase tracking-tight mb-2">
          Checkout & Delivery
        </h1>
        <p className="text-xs text-neutral-400 mb-10">
          Fast Cash on Delivery across Karachi & all Pakistan cities. Open parcel before payment available.
        </p>

        {errorMessage && (
          <div className="mb-8 p-4 rounded-xl bg-red-950/40 border border-red-500/40 text-red-300 flex items-center gap-3 text-xs">
            <AlertCircle className="w-5 h-5 shrink-0 text-red-400" />
            <span>{errorMessage}</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
          <div className="lg:col-span-7">
            <form onSubmit={handlePlaceOrder} className="space-y-8">
              <div className="bg-neutral-900/60 p-6 sm:p-8 rounded-2xl border border-neutral-800 space-y-4">
                <h2 className="font-display font-bold text-sm uppercase tracking-wider text-neutral-200 border-b border-neutral-800 pb-3">
                  1. Customer Contact Details
                </h2>
                <div>
                  <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-1.5">
                    Full Name <span className="text-amber-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    required
                    placeholder="e.g. Tariq Khan"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    className="w-full bg-neutral-950 border border-neutral-700/80 rounded-lg px-4 py-2.5 text-sm text-neutral-100 placeholder-neutral-500 focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-1.5">
                      Phone Number (WhatsApp) <span className="text-amber-500">*</span>
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      required
                      placeholder="e.g. 0330-2244486"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full bg-neutral-950 border border-neutral-700/80 rounded-lg px-4 py-2.5 text-sm text-neutral-100 placeholder-neutral-500 focus:outline-none focus:border-amber-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-1.5">
                      Gmail / Email Address (Optional)
                    </label>
                    <input
                      type="email"
                      name="email"
                      placeholder="e.g. customer@gmail.com"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full bg-neutral-950 border border-neutral-700/80 rounded-lg px-4 py-2.5 text-sm text-neutral-100 placeholder-neutral-500 focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>
              </div>

              <div className="bg-neutral-900/60 p-6 sm:p-8 rounded-2xl border border-neutral-800 space-y-4">
                <h2 className="font-display font-bold text-sm uppercase tracking-wider text-neutral-200 border-b border-neutral-800 pb-3">
                  2. Delivery Address
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-1.5">
                      City <span className="text-amber-500">*</span>
                    </label>
                    <select
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      className="w-full bg-neutral-950 border border-neutral-700/80 rounded-lg px-4 py-2.5 text-sm text-neutral-100 focus:outline-none focus:border-amber-500 cursor-pointer"
                    >
                      <option value="Karachi">Karachi (Special Delivery Rates)</option>
                      <option value="Lahore">Lahore</option>
                      <option value="Islamabad">Islamabad</option>
                      <option value="Rawalpindi">Rawalpindi</option>
                      <option value="Faisalabad">Faisalabad</option>
                      <option value="Multan">Multan</option>
                      <option value="Peshawar">Peshawar</option>
                      <option value="Quetta">Quetta</option>
                      <option value="Hyderabad">Hyderabad</option>
                      <option value="Other Pakistan City">Other Pakistan City</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-1.5">
                      Area / Locality <span className="text-amber-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="area"
                      required
                      placeholder="e.g. DHA Phase 5, Zamzama"
                      list="karachi-areas"
                      value={formData.area}
                      onChange={handleInputChange}
                      className="w-full bg-neutral-950 border border-neutral-700/80 rounded-lg px-4 py-2.5 text-sm text-neutral-100 placeholder-neutral-500 focus:outline-none focus:border-amber-500"
                    />
                    <datalist id="karachi-areas">
                      {karachiAreas.map((a) => (
                        <option key={a} value={a} />
                      ))}
                    </datalist>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-1.5">
                    Complete Street Address (House / Shop #, Building, Street) <span className="text-amber-500">*</span>
                  </label>
                  <textarea
                    name="address"
                    required
                    rows={3}
                    placeholder="e.g. House 42-B, Street 7, Phase 5, DHA, near commercial area"
                    value={formData.address}
                    onChange={handleInputChange}
                    className="w-full bg-neutral-950 border border-neutral-700/80 rounded-lg px-4 py-2.5 text-sm text-neutral-100 placeholder-neutral-500 focus:outline-none focus:border-amber-500 resize-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-1.5">
                    Special Instructions (Optional)
                  </label>
                  <input
                    type="text"
                    name="notes"
                    placeholder="e.g. Call before arrival / Deliver after 4 PM"
                    value={formData.notes}
                    onChange={handleInputChange}
                    className="w-full bg-neutral-950 border border-neutral-700/80 rounded-lg px-4 py-2.5 text-sm text-neutral-100 placeholder-neutral-500 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="bg-neutral-900/60 p-6 sm:p-8 rounded-2xl border border-neutral-800 space-y-4">
                <h2 className="font-display font-bold text-sm uppercase tracking-wider text-neutral-200 border-b border-neutral-800 pb-3">
                  3. Payment Method
                </h2>
                <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 rounded-full border-4 border-amber-500 bg-neutral-950" />
                    <div>
                      <span className="text-sm font-bold text-neutral-100 block">
                        Cash on Delivery (COD)
                      </span>
                      <span className="text-xs text-neutral-400">
                        Pay cash to the rider when your watch is delivered to your doorstep.
                      </span>
                    </div>
                  </div>
                  <span className="text-xs font-semibold text-amber-400 bg-amber-500/20 px-2.5 py-1 rounded">
                    Default
                  </span>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting || cart.length === 0}
                className="w-full py-4 px-6 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs uppercase tracking-widest rounded-xl transition-all shadow-xl shadow-amber-500/20 flex items-center justify-center gap-2 cursor-pointer transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <span>RECORDING ORDER...</span>
                ) : (
                  <span>PLACE ORDER (RS. {totalAmount.toLocaleString()})</span>
                )}
              </button>
            </form>
          </div>

          <div className="lg:col-span-5 bg-neutral-900/60 p-6 sm:p-8 rounded-2xl border border-neutral-800 space-y-6">
            <h2 className="font-display font-bold text-sm uppercase tracking-wider text-neutral-200 border-b border-neutral-800 pb-3 flex items-center justify-between">
              <span>Order Summary</span>
              <span className="text-xs font-normal text-neutral-400">({cart.length} items)</span>
            </h2>

            <div className="space-y-4 max-h-72 overflow-y-auto pr-2 divide-y divide-neutral-800/80">
              {cart.map((item) => (
                <div key={item.product.id} className="pt-3 first:pt-0 flex gap-3.5 items-center">
                  <div className="w-14 h-14 rounded-lg overflow-hidden bg-neutral-950 shrink-0 border border-neutral-800">
                    <img
                      src={item.product.images[0]}
                      alt={item.product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-semibold text-neutral-200 truncate">
                      {item.product.name}
                    </h4>
                    <div className="text-[11px] text-neutral-400 mt-0.5">
                      Qty: {item.quantity} • Rs. {item.product.price.toLocaleString()}
                    </div>
                  </div>
                  <div className="text-xs font-bold text-neutral-100 tabular-nums shrink-0">
                    Rs. {(item.product.price * item.quantity).toLocaleString()}
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-neutral-800 pt-4 space-y-2.5 text-xs">
              <div className="flex justify-between text-neutral-400">
                <span>Subtotal</span>
                <span className="text-neutral-200 font-semibold tabular-nums">
                  Rs. {subtotal.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between text-neutral-400">
                <span>Karachi Delivery Charges</span>
                <span
                  className={`font-semibold tabular-nums ${
                    isFreeDelivery ? 'text-emerald-400' : 'text-neutral-200'
                  }`}
                >
                  {isFreeDelivery ? 'FREE (Karachi Promotion)' : `Rs. ${deliveryFee.toLocaleString()}`}
                </span>
              </div>
              <div className="border-t border-neutral-800 pt-3 flex justify-between text-base font-bold text-neutral-100">
                <span>Total Payable Amount</span>
                <span className="text-amber-400 text-lg tabular-nums">
                  Rs. {totalAmount.toLocaleString()}
                </span>
              </div>
            </div>

            {isFreeDelivery ? (
              <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-lg flex items-center gap-2.5 text-xs text-emerald-400">
                <Truck className="w-4 h-4 shrink-0" />
                <span>You have qualified for FREE delivery on this order!</span>
              </div>
            ) : (
              <div className="p-3 bg-neutral-950 border border-neutral-800 rounded-lg text-xs text-neutral-400">
                Tip: Karachi orders above Rs. {settings.delivery.karachiFreeThreshold.toLocaleString()} enjoy 100% Free Express Delivery.
              </div>
            )}

            <div className="pt-2 border-t border-neutral-800/80 space-y-2 text-[11px] text-neutral-400">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                <span>Original luxury warranty & inspection badge included</span>
              </div>
              <div className="flex items-center gap-2">
                <Truck className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                <span>Estimated dispatch: 2 - 4 business days</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

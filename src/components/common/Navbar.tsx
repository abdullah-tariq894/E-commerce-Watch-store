import React, { useState } from 'react';
import { Search, ShoppingBag, Menu, X, ShieldCheck, ChevronRight } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useStore } from '../../context/StoreContext';

export const Navbar: React.FC = () => {
  const { settings, categories, navigateToHome, navigateToCategory, setCurrentView, navigateToAdmin } =
    useStore();
  const { totalCount, setIsCartOpen } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchVal, setSearchVal] = useState('');

  const { branding } = settings;

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchVal.trim()) {
      setCurrentView('all-watches');
      setSearchOpen(false);
    }
  };

  const navCategories = categories.slice(0, 5);

  return (
    <>
      <header className="sticky top-0 z-40 bg-neutral-950/90 backdrop-blur-md border-b border-neutral-800/80 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Left: Mobile menu toggle */}
            <div className="flex items-center lg:hidden">
              <button
                type="button"
                onClick={() => setMobileMenuOpen(true)}
                className="p-2 text-neutral-400 hover:text-white focus:outline-none"
                aria-label="Open navigation menu"
              >
                <Menu className="w-6 h-6" />
              </button>
            </div>

            {/* Brand Logo Zone */}
            <div className="flex items-center">
              <button
                onClick={navigateToHome}
                className="flex items-center gap-3 text-left focus:outline-none group text-inherit bg-transparent border-0 p-0 cursor-pointer"
              >
                {branding.logoUrl ? (
                  <img
                    src={branding.logoUrl}
                    alt={branding.logoAlt || branding.siteTitle}
                    className="h-10 sm:h-12 w-auto object-contain"
                  />
                ) : (
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-amber-600 via-amber-400 to-amber-200 p-[1.5px] shadow-lg shadow-amber-500/10">
                      <div className="w-full h-full rounded-full bg-neutral-950 flex items-center justify-center">
                        <span className="text-amber-400 font-serif font-bold text-base">P</span>
                      </div>
                    </div>
                    <div>
                      <span className="font-display font-bold text-base sm:text-lg tracking-wider text-neutral-100 group-hover:text-amber-400 transition-colors uppercase block">
                        PERFECT TIME
                      </span>
                      <span className="text-[10px] tracking-[0.25em] text-amber-500/90 font-medium block uppercase -mt-0.5">
                        COLLECTION
                      </span>
                    </div>
                  </div>
                )}
              </button>
            </div>

            {/* Center: Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center space-x-7">
              <button
                onClick={navigateToHome}
                className="text-xs font-semibold uppercase tracking-wider text-neutral-300 hover:text-amber-400 transition-colors cursor-pointer bg-transparent border-0"
              >
                Home
              </button>
              <button
                onClick={() => setCurrentView('all-watches')}
                className="text-xs font-semibold uppercase tracking-wider text-neutral-300 hover:text-amber-400 transition-colors cursor-pointer bg-transparent border-0"
              >
                All Watches
              </button>
              {navCategories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => navigateToCategory(cat.slug)}
                  className="text-xs font-semibold uppercase tracking-wider text-neutral-300 hover:text-amber-400 transition-colors cursor-pointer bg-transparent border-0"
                >
                  {cat.name}
                </button>
              ))}
              <button
                onClick={() => setCurrentView('womens')}
                className="text-xs font-semibold uppercase tracking-wider text-rose-300/90 hover:text-rose-300 transition-colors cursor-pointer bg-transparent border-0"
              >
                Women's
              </button>
            </nav>

            {/* Right: Actions (Search, Admin, Cart) */}
            <div className="flex items-center space-x-3 sm:space-x-4">
              {/* Search Toggle */}
              <button
                onClick={() => setSearchOpen(!searchOpen)}
                className="p-2 text-neutral-400 hover:text-white transition-colors cursor-pointer bg-transparent border-0 rounded-full"
                aria-label="Search watches"
              >
                <Search className="w-5 h-5" />
              </button>

              {/* Master Admin Portal Trigger */}
              <button
                onClick={navigateToAdmin}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-medium tracking-wider uppercase bg-neutral-900 hover:bg-neutral-800 text-neutral-300 hover:text-amber-400 border border-neutral-700/60 rounded-md transition-colors cursor-pointer"
                title="Open Master Admin Dashboard"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-amber-500" />
                <span>Admin</span>
              </button>

              {/* Cart Icon & Counter */}
              <button
                onClick={() => setIsCartOpen(true)}
                className="relative p-2.5 text-neutral-200 hover:text-amber-400 transition-colors cursor-pointer bg-transparent border-0"
                aria-label="Shopping Cart"
              >
                <ShoppingBag className="w-5 h-5 sm:w-6 sm:h-6" />
                {totalCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-amber-500 text-neutral-950 text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-md animate-scale">
                    {totalCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Collapsible Search Input Row */}
        {searchOpen && (
          <div className="border-t border-neutral-800 bg-neutral-900/95 px-4 py-3 sm:px-6">
            <form onSubmit={handleSearchSubmit} className="max-w-3xl mx-auto flex items-center gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                <input
                  type="text"
                  placeholder="Search Casio, Edifice, Pagani Design, Citizen, Curren..."
                  value={searchVal}
                  onChange={(e) => setSearchVal(e.target.value)}
                  autoFocus
                  className="w-full bg-neutral-950 border border-neutral-700 rounded-md pl-10 pr-4 py-2 text-sm text-neutral-100 placeholder-neutral-500 focus:outline-none focus:border-amber-500"
                />
              </div>
              <button
                type="submit"
                className="px-4 py-2 text-xs font-semibold uppercase tracking-wider bg-amber-500 hover:bg-amber-400 text-neutral-950 rounded-md transition-colors"
              >
                Search
              </button>
              <button
                type="button"
                onClick={() => setSearchOpen(false)}
                className="p-2 text-neutral-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </form>
          </div>
        )}
      </header>

      {/* Mobile Sliding Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="fixed inset-y-0 left-0 w-full max-w-xs bg-neutral-950 border-r border-neutral-800 p-6 flex flex-col justify-between shadow-2xl">
            <div>
              {/* Header */}
              <div className="flex items-center justify-between pb-6 border-b border-neutral-800">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-amber-500 text-neutral-950 flex items-center justify-center font-serif font-bold text-sm">
                    P
                  </div>
                  <span className="font-display font-bold text-sm tracking-wider uppercase text-neutral-100">
                    PERFECT TIME
                  </span>
                </div>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1.5 text-neutral-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Navigation list */}
              <nav className="mt-6 space-y-2">
                <button
                  onClick={() => {
                    navigateToHome();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium text-neutral-200 hover:bg-neutral-900 hover:text-amber-400 transition-colors"
                >
                  <span>Home</span>
                  <ChevronRight className="w-4 h-4 text-neutral-600" />
                </button>
                <button
                  onClick={() => {
                    setCurrentView('all-watches');
                    setMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium text-neutral-200 hover:bg-neutral-900 hover:text-amber-400 transition-colors"
                >
                  <span>All Watches</span>
                  <ChevronRight className="w-4 h-4 text-neutral-600" />
                </button>

                <div className="pt-2 pb-1 px-3 text-[11px] font-semibold text-neutral-500 uppercase tracking-wider">
                  Brands & Categories
                </div>

                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => {
                      navigateToCategory(cat.slug);
                      setMobileMenuOpen(false);
                    }}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium text-neutral-300 hover:bg-neutral-900 hover:text-amber-400 transition-colors"
                  >
                    <span>{cat.name}</span>
                    <ChevronRight className="w-4 h-4 text-neutral-600" />
                  </button>
                ))}

                <button
                  onClick={() => {
                    setCurrentView('womens');
                    setMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium text-rose-300 hover:bg-neutral-900 transition-colors"
                >
                  <span>Women's Collection</span>
                  <ChevronRight className="w-4 h-4 text-rose-400/50" />
                </button>
              </nav>
            </div>

            {/* Bottom Actions */}
            <div className="pt-6 border-t border-neutral-800 space-y-3">
              <button
                onClick={() => {
                  navigateToAdmin();
                  setMobileMenuOpen(false);
                }}
                className="w-full flex items-center justify-center gap-2 py-2.5 text-xs font-semibold uppercase tracking-wider bg-neutral-900 border border-neutral-700 text-neutral-200 rounded-lg hover:bg-neutral-800"
              >
                <ShieldCheck className="w-4 h-4 text-amber-500" />
                <span>Master Admin Dashboard</span>
              </button>
              <div className="text-center text-[11px] text-neutral-500">
                WhatsApp: {settings.whatsapp.number}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

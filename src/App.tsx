import React from 'react';
import { AdminAuthProvider } from './context/AdminAuthContext';
import { CartProvider } from './context/CartContext';
import { StoreProvider, useStore } from './context/StoreContext';
import { AnnouncementBar } from './components/common/AnnouncementBar';
import { ScrollingAnnouncement } from './components/common/ScrollingAnnouncement';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { FloatingWhatsApp } from './components/common/FloatingWhatsApp';
import { HeroSlider } from './components/home/HeroSlider';
import { CategoryShowcase } from './components/home/CategoryShowcase';
import { WomensCollection } from './components/home/WomensCollection';
import { FeaturedWatches } from './components/home/FeaturedWatches';
import { CategoryPage } from './components/category/CategoryPage';
import { AllWatchesPage } from './components/product/AllWatchesPage';
import { WomensCollectionPage } from './components/product/WomensCollectionPage';
import { ProductDetailPage } from './components/product/ProductDetailPage';
import { CartDrawer } from './components/cart/CartDrawer';
import { CheckoutPage } from './components/checkout/CheckoutPage';
import { AdminDashboard } from './components/admin/AdminDashboard';

const StorefrontContent: React.FC = () => {
  const { currentView, selectedProduct, activeCategorySlug } = useStore();

  if (currentView === 'admin') {
    return <AdminDashboard />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-neutral-950 text-neutral-100 font-sans selection:bg-amber-500/30 selection:text-amber-200">
      {/* 1. Top Announcement Bar */}
      <AnnouncementBar />

      {/* 2. Header Navigation */}
      <Navbar />

      {/* Main Content Router */}
      <main className="flex-1">
        {currentView === 'home' && (
          <>
            <HeroSlider />
            <ScrollingAnnouncement />
            <CategoryShowcase />
            <WomensCollection />
            <FeaturedWatches />
          </>
        )}
        {currentView === 'category' && (
          <CategoryPage categorySlug={activeCategorySlug || 'edifice'} />
        )}
        {currentView === 'all-watches' && <AllWatchesPage />}
        {currentView === 'womens' && <WomensCollectionPage />}
        {currentView === 'product' && selectedProduct && (
          <ProductDetailPage product={selectedProduct} />
        )}
        {currentView === 'checkout' && <CheckoutPage />}
      </main>

      {/* Slide-over Cart Drawer */}
      <CartDrawer />

      {/* Fixed Sticky WhatsApp Floating Button */}
      <FloatingWhatsApp />

      {/* Premium Luxury Footer */}
      <Footer />
    </div>
  );
};

export default function App() {
  return (
    <AdminAuthProvider>
      <StoreProvider>
        <CartProvider>
          <StorefrontContent />
        </CartProvider>
      </StoreProvider>
    </AdminAuthProvider>
  );
}

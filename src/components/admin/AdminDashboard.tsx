import React, { useState } from 'react';
import {
  X,
  LayoutDashboard,
  Settings,
  Image as ImageIcon,
  Sliders,
  Sparkles,
  Layers,
  Watch,
  PlusCircle,
  Star,
  Boxes,
  FolderOpen,
  ShoppingBag,
  Bell,
  MessageCircle,
  Mail,
  PanelBottom,
  Truck,
  Key,
  LogOut,
  ExternalLink,
  Download,
} from 'lucide-react';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { useStore } from '../../context/StoreContext';
import { AdminLoginModal } from './AdminLoginModal';
import { OverviewSection } from './sections/OverviewSection';
import { WebsiteSettingsSection } from './sections/WebsiteSettingsSection';
import { LogoManagementSection } from './sections/LogoManagementSection';
import { SliderManagementSection } from './sections/SliderManagementSection';
import { WomensManagementSection } from './sections/WomensManagementSection';
import { CategoryManagementSection } from './sections/CategoryManagementSection';
import { ProductManagementSection } from './sections/ProductManagementSection';
import { AddProductSection } from './sections/AddProductSection';
import { FeaturedProductsSection } from './sections/FeaturedProductsSection';
import { StockManagementSection } from './sections/StockManagementSection';
import { ImageManagementSection } from './sections/ImageManagementSection';
import { OrdersManagementSection } from './sections/OrdersManagementSection';
import { AnnouncementBarSection } from './sections/AnnouncementBarSection';
import { WhatsAppSettingsSection } from './sections/WhatsAppSettingsSection';
import { EmailSettingsSection } from './sections/EmailSettingsSection';
import { FooterManagementSection } from './sections/FooterManagementSection';
import { DeliverySettingsSection } from './sections/DeliverySettingsSection';
import { PasswordSettingsSection } from './sections/PasswordSettingsSection';

export const AdminDashboard: React.FC = () => {
  const { isAuthenticated, logout } = useAdminAuth();
  const { navigateToHome } = useStore();

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  if (!isAuthenticated) {
    return <AdminLoginModal />;
  }

  const menuItems = [
    { id: 'overview', label: '1. Dashboard Overview', icon: LayoutDashboard },
    { id: 'website-settings', label: '2. Website Settings', icon: Settings },
    { id: 'logo-management', label: '3. Logo Management', icon: ImageIcon },
    { id: 'homepage-slider', label: '4. Homepage Slider', icon: Sliders },
    { id: 'womens-collection', label: '5. Women\'s Collection', icon: Sparkles },
    { id: 'category-management', label: '6. Category Management', icon: Layers },
    { id: 'product-management', label: '7. Product Management', icon: Watch },
    { id: 'add-product', label: '8. Add New Product', icon: PlusCircle },
    { id: 'featured-products', label: '9. Featured Products', icon: Star },
    { id: 'stock-management', label: '10. Stock Management', icon: Boxes },
    { id: 'image-management', label: '11. Image Management', icon: FolderOpen },
    { id: 'orders', label: '12. Orders Management', icon: ShoppingBag },
    { id: 'announcement-bar', label: '13. Announcement Bar', icon: Bell },
    { id: 'whatsapp-settings', label: '14. WhatsApp Settings', icon: MessageCircle },
    { id: 'email-settings', label: '15. Email Settings', icon: Mail },
    { id: 'footer-management', label: '16. Footer Management', icon: PanelBottom },
    { id: 'delivery-settings', label: '17. Delivery Settings', icon: Truck },
    { id: 'password-settings', label: '18. Password Settings', icon: Key },
    { id: 'logout', label: '19. Logout', icon: LogOut, isAction: true },
  ];

  const handleTabClick = (id: string, isAction?: boolean) => {
    if (id === 'logout') {
      logout();
      return;
    }
    setActiveTab(id);
    setMobileDrawerOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col">
      {/* Top Admin Bar */}
      <header className="sticky top-0 z-30 h-16 bg-neutral-900 border-b border-neutral-800 flex items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              setSidebarOpen(!sidebarOpen);
              setMobileDrawerOpen(!mobileDrawerOpen);
            }}
            className="p-2 text-neutral-300 hover:text-amber-400 hover:bg-neutral-800 rounded-lg transition-colors cursor-pointer border border-neutral-700/80"
            title="Toggle Sidebar"
            aria-label="Toggle navigation sidebar"
          >
            <span className="text-xl font-bold leading-none select-none">☰</span>
          </button>
          <div className="flex items-center gap-2">
            <span className="font-display font-bold text-sm sm:text-base tracking-wider text-neutral-100 uppercase">
              Master Admin Dashboard
            </span>
            <span className="hidden sm:inline-block px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 text-[10px] font-bold uppercase tracking-wider">
              Control Center
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <a
            href="/api/admin/export-zip"
            download
            className="hidden md:flex items-center gap-1.5 px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-semibold rounded-lg border border-neutral-700 transition-colors cursor-pointer"
            title="Download clean ZIP of full project without secrets"
          >
            <Download className="w-3.5 h-3.5 text-amber-400" />
            <span>Download Project ZIP</span>
          </a>
          <button
            onClick={navigateToHome}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 text-xs font-semibold rounded-lg border border-amber-500/30 transition-colors cursor-pointer"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Storefront</span>
          </button>
          <button
            onClick={logout}
            className="p-2 text-neutral-400 hover:text-red-400 hover:bg-neutral-800 rounded-lg transition-colors cursor-pointer"
            title="Logout"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Main Layout Container */}
      <div className="flex-1 flex overflow-hidden">
        {/* Desktop Collapsible Sidebar */}
        <aside
          className={`hidden lg:block bg-neutral-900 border-r border-neutral-800 transition-all duration-300 overflow-y-auto shrink-0 ${
            sidebarOpen ? 'w-64' : 'w-0 border-r-0'
          }`}
        >
          {sidebarOpen && (
            <div className="p-4 space-y-1">
              <div className="px-3 py-2 text-[10px] font-bold text-neutral-500 uppercase tracking-widest">
                Management Console
              </div>
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleTabClick(item.id, item.isAction)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition-all text-left cursor-pointer ${
                      item.id === 'logout'
                        ? 'text-neutral-400 hover:text-red-400 hover:bg-neutral-800/60 mt-4 border-t border-neutral-800 pt-3'
                        : isActive
                        ? 'bg-amber-500 text-neutral-950 font-bold shadow-md shadow-amber-500/10'
                        : 'text-neutral-400 hover:text-neutral-100 hover:bg-neutral-800/60'
                    }`}
                  >
                    <Icon className="w-4 h-4 shrink-0" />
                    <span className="truncate">{item.label}</span>
                  </button>
                );
              })}
            </div>
          )}
        </aside>

        {/* Mobile Slide-out Menu Drawer */}
        {mobileDrawerOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <div
              className="fixed inset-0 bg-black/80 backdrop-blur-sm"
              onClick={() => setMobileDrawerOpen(false)}
            />
            <div className="fixed inset-y-0 left-0 w-72 bg-neutral-900 border-r border-neutral-800 p-4 overflow-y-auto shadow-2xl flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-4 mb-2 border-b border-neutral-800">
                  <div className="font-display font-bold text-xs uppercase tracking-wider text-amber-500">
                    Dashboard Sections
                  </div>
                  <button
                    onClick={() => setMobileDrawerOpen(false)}
                    className="p-1 text-neutral-400 hover:text-white cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <div className="space-y-1">
                  {menuItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = activeTab === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => handleTabClick(item.id, item.isAction)}
                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition-all text-left cursor-pointer ${
                          item.id === 'logout'
                            ? 'text-neutral-400 hover:text-red-400 hover:bg-neutral-800/60 mt-4 border-t border-neutral-800 pt-3'
                            : isActive
                            ? 'bg-amber-500 text-neutral-950 font-bold'
                            : 'text-neutral-400 hover:text-neutral-100 hover:bg-neutral-800/60'
                        }`}
                      >
                        <Icon className="w-4 h-4 shrink-0" />
                        <span className="truncate">{item.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
              <div className="pt-4 border-t border-neutral-800">
                <a
                  href="/api/admin/export-zip"
                  download
                  className="w-full flex items-center justify-center gap-2 py-2 px-3 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-semibold rounded-lg cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5 text-amber-400" />
                  <span>Download Project ZIP</span>
                </a>
              </div>
            </div>
          </div>
        )}

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-8 lg:p-10 max-w-7xl">
          {activeTab === 'overview' && (
            <OverviewSection onNavigateTab={(tab) => setActiveTab(tab)} />
          )}
          {activeTab === 'website-settings' && <WebsiteSettingsSection />}
          {activeTab === 'logo-management' && <LogoManagementSection />}
          {activeTab === 'homepage-slider' && <SliderManagementSection />}
          {activeTab === 'womens-collection' && <WomensManagementSection />}
          {activeTab === 'category-management' && <CategoryManagementSection />}
          {activeTab === 'product-management' && (
            <ProductManagementSection onAddNewClick={() => setActiveTab('add-product')} />
          )}
          {activeTab === 'add-product' && (
            <AddProductSection
              onSuccess={() => setActiveTab('product-management')}
              onCancel={() => setActiveTab('product-management')}
            />
          )}
          {activeTab === 'featured-products' && <FeaturedProductsSection />}
          {activeTab === 'stock-management' && <StockManagementSection />}
          {activeTab === 'image-management' && <ImageManagementSection />}
          {activeTab === 'orders' && <OrdersManagementSection />}
          {activeTab === 'announcement-bar' && <AnnouncementBarSection />}
          {activeTab === 'whatsapp-settings' && <WhatsAppSettingsSection />}
          {activeTab === 'email-settings' && <EmailSettingsSection />}
          {activeTab === 'footer-management' && <FooterManagementSection />}
          {activeTab === 'delivery-settings' && <DeliverySettingsSection />}
          {activeTab === 'password-settings' && <PasswordSettingsSection />}
        </main>
      </div>
    </div>
  );
};

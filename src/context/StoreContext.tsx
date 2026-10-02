import React, { createContext, useContext, useEffect, useState } from 'react';
import { initialCategories, initialProducts, initialSiteSettings, initialSlides, initialWomensItems } from '../data/initialData';
import { api } from '../services/api';
import { Category, Order, Product, SiteSettings, Slide, WomensItem } from '../types';

export type AppView =
  | 'home'
  | 'category'
  | 'product'
  | 'all-watches'
  | 'womens'
  | 'checkout'
  | 'order-success'
  | 'admin';

interface StoreContextType {
  settings: SiteSettings;
  setSettings: React.Dispatch<React.SetStateAction<SiteSettings>>;
  slides: Slide[];
  categories: Category[];
  womensItems: WomensItem[];
  products: Product[];
  currentView: AppView;
  setCurrentView: (view: AppView) => void;
  selectedProduct: Product | null;
  setSelectedProduct: (product: Product | null) => void;
  activeCategorySlug: string | null;
  setActiveCategorySlug: (slug: string | null) => void;
  currentOrderReceipt: Order | null;
  setCurrentOrderReceipt: (order: Order | null) => void;
  isLoading: boolean;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  refreshData: () => Promise<void>;
  navigateToProduct: (product: Product) => void;
  navigateToCategory: (slug: string) => void;
  navigateToHome: () => void;
  navigateToCheckout: () => void;
  navigateToAdmin: () => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<SiteSettings>(initialSiteSettings);
  const [slides, setSlides] = useState<Slide[]>(initialSlides);
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [womensItems, setWomensItems] = useState<WomensItem[]>(initialWomensItems);
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [currentView, setCurrentView] = useState<AppView>('home');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [activeCategorySlug, setActiveCategorySlug] = useState<string | null>(null);
  const [currentOrderReceipt, setCurrentOrderReceipt] = useState<Order | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const refreshData = async () => {
    try {
      const [fetchedSettings, fetchedSlides, fetchedCategories, fetchedWomens, fetchedProducts] =
        await Promise.allSettled([
          api.getSettings(),
          api.getSlides(),
          api.getCategories(),
          api.getWomensCollection(),
          api.getProducts({ includeOff: true }),
        ]);

      if (fetchedSettings.status === 'fulfilled') setSettings(fetchedSettings.value);
      if (fetchedSlides.status === 'fulfilled') setSlides(fetchedSlides.value);
      if (fetchedCategories.status === 'fulfilled') setCategories(fetchedCategories.value);
      if (fetchedWomens.status === 'fulfilled') setWomensItems(fetchedWomens.value);
      if (fetchedProducts.status === 'fulfilled') setProducts(fetchedProducts.value);
    } catch (err) {
      console.warn('Backend fetch fallback to initial data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshData();
  }, []);

  const navigateToProduct = (product: Product) => {
    setSelectedProduct(product);
    setCurrentView('product');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateToCategory = (slug: string) => {
    setActiveCategorySlug(slug);
    setCurrentView('category');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateToHome = () => {
    setCurrentView('home');
    setSelectedProduct(null);
    setActiveCategorySlug(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateToCheckout = () => {
    setCurrentView('checkout');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateToAdmin = () => {
    setCurrentView('admin');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <StoreContext.Provider
      value={{
        settings,
        setSettings,
        slides,
        categories,
        womensItems,
        products,
        currentView,
        setCurrentView,
        selectedProduct,
        setSelectedProduct,
        activeCategorySlug,
        setActiveCategorySlug,
        currentOrderReceipt,
        setCurrentOrderReceipt,
        isLoading,
        searchQuery,
        setSearchQuery,
        refreshData,
        navigateToProduct,
        navigateToCategory,
        navigateToHome,
        navigateToCheckout,
        navigateToAdmin,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};

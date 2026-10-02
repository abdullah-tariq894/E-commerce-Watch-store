import { Category, Order, Product, SiteSettings, Slide, WomensItem } from '../types';

export const api = {
  // Settings
  async getSettings(): Promise<SiteSettings> {
    const res = await fetch('/api/settings');
    if (!res.ok) throw new Error('Failed to fetch settings');
    return res.json();
  },
  async updateSettings(settings: Partial<SiteSettings>): Promise<{ success: boolean; settings: SiteSettings }> {
    const res = await fetch('/api/settings', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(settings),
    });
    if (!res.ok) throw new Error('Failed to update settings');
    return res.json();
  },

  // Slides
  async getSlides(): Promise<Slide[]> {
    const res = await fetch('/api/slides');
    if (!res.ok) throw new Error('Failed to fetch slides');
    return res.json();
  },
  async addSlide(slide: Partial<Slide>): Promise<{ success: boolean; slide: Slide }> {
    const res = await fetch('/api/slides', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(slide),
    });
    if (!res.ok) throw new Error('Failed to add slide');
    return res.json();
  },
  async updateSlide(id: string, slide: Partial<Slide>): Promise<{ success: boolean; slide: Slide }> {
    const res = await fetch(`/api/slides/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(slide),
    });
    if (!res.ok) throw new Error('Failed to update slide');
    return res.json();
  },
  async deleteSlide(id: string): Promise<{ success: boolean }> {
    const res = await fetch(`/api/slides/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Failed to delete slide');
    return res.json();
  },

  // Women's Collection
  async getWomensCollection(): Promise<WomensItem[]> {
    const res = await fetch('/api/womens-collection');
    if (!res.ok) throw new Error('Failed to fetch womens collection');
    return res.json();
  },
  async addWomensItem(item: Partial<WomensItem>): Promise<{ success: boolean; item: WomensItem }> {
    const res = await fetch('/api/womens-collection', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(item),
    });
    if (!res.ok) throw new Error('Failed to add item');
    return res.json();
  },
  async updateWomensItem(id: string, item: Partial<WomensItem>): Promise<{ success: boolean; item: WomensItem }> {
    const res = await fetch(`/api/womens-collection/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(item),
    });
    if (!res.ok) throw new Error('Failed to update item');
    return res.json();
  },
  async deleteWomensItem(id: string): Promise<{ success: boolean }> {
    const res = await fetch(`/api/womens-collection/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Failed to delete item');
    return res.json();
  },

  // Categories
  async getCategories(): Promise<Category[]> {
    const res = await fetch('/api/categories');
    if (!res.ok) throw new Error('Failed to fetch categories');
    return res.json();
  },
  async addCategory(cat: Partial<Category>): Promise<{ success: boolean; category: Category }> {
    const res = await fetch('/api/categories', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(cat),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to add category');
    }
    return res.json();
  },
  async updateCategory(id: string, cat: Partial<Category>): Promise<{ success: boolean; category: Category }> {
    const res = await fetch(`/api/categories/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(cat),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to update category');
    }
    return res.json();
  },
  async deleteCategory(id: string): Promise<{ success: boolean }> {
    const res = await fetch(`/api/categories/${id}`, { method: 'DELETE' });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to delete category');
    }
    return res.json();
  },

  // Products
  async getProducts(params?: {
    category?: string;
    status?: string;
    featured?: boolean;
    search?: string;
    includeOff?: boolean;
  }): Promise<Product[]> {
    const query = new URLSearchParams();
    if (params?.category) query.append('category', params.category);
    if (params?.status) query.append('status', params.status);
    if (params?.featured) query.append('featured', 'true');
    if (params?.search) query.append('search', params.search);
    if (params?.includeOff) query.append('includeOff', 'true');

    const res = await fetch(`/api/products?${query.toString()}`);
    if (!res.ok) throw new Error('Failed to fetch products');
    return res.json();
  },
  async getProductById(id: string): Promise<Product> {
    const res = await fetch(`/api/products/${id}`);
    if (!res.ok) throw new Error('Product not found');
    return res.json();
  },
  async addProduct(product: Partial<Product>): Promise<{ success: boolean; product: Product }> {
    const res = await fetch('/api/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(product),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to add product');
    }
    return res.json();
  },
  async updateProduct(id: string, product: Partial<Product>): Promise<{ success: boolean; product: Product }> {
    const res = await fetch(`/api/products/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(product),
    });
    if (!res.ok) throw new Error('Failed to update product');
    return res.json();
  },
  async updateProductStatus(id: string, stockStatus: string): Promise<{ success: boolean }> {
    const res = await fetch(`/api/products/${id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ stockStatus }),
    });
    if (!res.ok) throw new Error('Failed to update status');
    return res.json();
  },
  async deleteProduct(id: string): Promise<{ success: boolean }> {
    const res = await fetch(`/api/products/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Failed to delete product');
    return res.json();
  },

  // Orders
  async createOrder(data: {
    customer: any;
    items: { productId: string; quantity: number }[];
  }): Promise<{ success: boolean; order: Order; emailSent: boolean; emailMessage?: string }> {
    const res = await fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to place order');
    }
    return res.json();
  },
  async recordWhatsAppInquiry(data: {
    productId: string;
    quantity: number;
    customerName?: string;
    customerPhone?: string;
  }): Promise<{ success: boolean; order: Order }> {
    const res = await fetch('/api/orders/whatsapp-inquiry', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to record WhatsApp inquiry');
    return res.json();
  },
  async getOrders(params?: { status?: string; type?: string; search?: string }): Promise<Order[]> {
    const query = new URLSearchParams();
    if (params?.status) query.append('status', params.status);
    if (params?.type) query.append('type', params.type);
    if (params?.search) query.append('search', params.search);

    const res = await fetch(`/api/orders?${query.toString()}`);
    if (!res.ok) throw new Error('Failed to fetch orders');
    return res.json();
  },
  async updateOrderStatus(id: string, status: string): Promise<{ success: boolean }> {
    const res = await fetch(`/api/orders/${id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    if (!res.ok) throw new Error('Failed to update order status');
    return res.json();
  },
  async deleteOrder(id: string): Promise<{ success: boolean }> {
    const res = await fetch(`/api/orders/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Failed to delete order');
    return res.json();
  },

  // Stats
  async getStats(): Promise<any> {
    const res = await fetch('/api/stats');
    if (!res.ok) throw new Error('Failed to fetch stats');
    return res.json();
  },

  // Upload image file
  async uploadImage(file: File): Promise<{ url: string; filename: string }> {
    const formData = new FormData();
    formData.append('image', file);
    const res = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });
    if (!res.ok) throw new Error('Image upload failed');
    return res.json();
  },

  // Upload multiple images
  async uploadMultipleImages(files: File[]): Promise<{ urls: string[] }> {
    const formData = new FormData();
    files.forEach((f) => formData.append('images', f));
    const res = await fetch('/api/upload-multiple', {
      method: 'POST',
      body: formData,
    });
    if (!res.ok) throw new Error('Multiple image upload failed');
    return res.json();
  },

  // Test Email
  async testEmail(): Promise<{ success: boolean; error?: string }> {
    const res = await fetch('/api/admin/test-email', { method: 'POST' });
    return res.json();
  },
};

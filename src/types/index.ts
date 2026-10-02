export type StockStatus = 'IN_STOCK' | 'OUT_OF_STOCK' | 'OFF';

export interface ProductSpecs {
  caseDiameter?: string;
  caseThickness?: string;
  strapMaterial?: string;
  waterResistance?: string;
  movementType?: string;
  warranty?: string;
}

export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  originalPrice?: number;
  description: string;
  images: string[];
  stockStatus: StockStatus;
  isFeatured: boolean;
  specs?: ProductSpecs;
  sku?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  order: number;
  isCustom?: boolean;
}

export interface Slide {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  buttonText: string;
  buttonLink: string;
  order: number;
  isEnabled: boolean;
}

export interface WomensItem {
  id: string;
  title: string;
  subtitle: string;
  price: number;
  originalPrice?: number;
  image: string;
  link: string;
  isEnabled: boolean;
  order: number;
}

export interface TopAnnouncementSettings {
  enabled: boolean;
  text: string;
  bgColor: string;
  textColor: string;
  deliveryThreshold: number;
}

export interface ScrollingAnnouncementSettings {
  enabled: boolean;
  text: string;
  speed: number; // seconds
  bgColor: string;
  textColor: string;
}

export interface BrandingSettings {
  siteTitle: string;
  siteTagline: string;
  logoUrl: string;
  logoAlt: string;
}

export interface DeliverySettings {
  karachiFreeThreshold: number;
  flatDeliveryFee: number;
  estimatedDays: string;
}

export interface WhatsAppSettings {
  number: string;
  formattedNumber: string;
  buttonText: string;
  isFloatingEnabled: boolean;
  welcomeMessage: string;
}

export interface EmailSettings {
  ownerEmail: string;
  isConfigured: boolean;
  senderName: string;
  lastTestedAt?: string;
}

export interface FooterSettings {
  description: string;
  address: string;
  phone: string;
  email: string;
  copyrightText: string;
}

export interface SiteSettings {
  topAnnouncement: TopAnnouncementSettings;
  scrollingAnnouncement: ScrollingAnnouncementSettings;
  branding: BrandingSettings;
  delivery: DeliverySettings;
  whatsapp: WhatsAppSettings;
  email: EmailSettings;
  footer: FooterSettings;
}

export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  category?: string;
}

export interface CustomerInfo {
  fullName: string;
  phone: string;
  email?: string;
  address: string;
  city: string;
  area: string;
  notes?: string;
}

export interface OrderPricing {
  subtotal: number;
  deliveryFee: number;
  totalAmount: number;
  freeDeliveryApplied: boolean;
}

export type OrderStatus =
  | 'pending'
  | 'confirmed'
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'cancelled';

export interface Order {
  id: string;
  orderNumber: string;
  type: 'website' | 'whatsapp';
  customer: CustomerInfo;
  items: OrderItem[];
  pricing: OrderPricing;
  status: OrderStatus;
  emailNotificationStatus: 'sent' | 'pending_credentials' | 'failed' | 'not_attempted';
  notes?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface DashboardStats {
  totalOrders: number;
  websiteOrders: number;
  whatsappOrders: number;
  pendingOrders: number;
  confirmedOrders: number;
  deliveredOrders: number;
  totalRevenue: number;
  websiteRevenue: number;
  whatsappRevenue: number;
  recentOrders: Order[];
  isMongoConnected?: boolean;
}

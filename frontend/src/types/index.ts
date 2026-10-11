// ============================================================================
// DAMODAR JEWELLERS — Core Type Definitions
// ============================================================================

/** Product availability status */
export type AvailabilityStatus = 'in_stock' | 'out_of_stock' | 'made_to_order' | 'coming_soon';

/** Currency code */
export type CurrencyCode = 'INR' | 'USD' | 'GBP' | 'EUR';

/** Product image */
export interface ProductImage {
  id: string;
  url: string;
  alt: string;
  width?: number;
  height?: number;
  isPrimary?: boolean;
}

/** Configurable product attribute (e.g., size, finish) */
export interface ProductAttribute {
  name: string;
  values: string[];
}

/** Core product model */
export interface Product {
  id: string;
  slug: string;
  name: string;
  description: string;
  price: number;
  compareAtPrice?: number;
  currency: CurrencyCode;
  images: ProductImage[];
  collection: string;
  collectionSlug: string;
  availability: AvailabilityStatus;
  modelUrl?: string;
  attributes?: ProductAttribute[];
  tags?: string[];
  material?: string;
  weight?: string;
  createdAt?: string;
  updatedAt?: string;
}

/** Collection */
export interface Collection {
  id: string;
  slug: string;
  name: string;
  description: string;
  image: ProductImage;
  productCount?: number;
}

/** Cart item */
export interface CartItem {
  product: Product;
  quantity: number;
  selectedAttributes?: Record<string, string>;
}

/** Cart state */
export interface CartState {
  items: CartItem[];
  isOpen: boolean;
}

/** API response wrapper */
export interface ApiResponse<T> {
  data: T;
  message?: string;
  pagination?: PaginationInfo;
}

/** Pagination */
export interface PaginationInfo {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

/** Search params for product queries */
export interface ProductSearchParams {
  q?: string;
  collection?: string;
  material?: string;
  minPrice?: number;
  maxPrice?: number;
  sort?: 'price_asc' | 'price_desc' | 'name_asc' | 'name_desc' | 'newest';
  page?: number;
  pageSize?: number;
}

/** Auth types */
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData extends LoginCredentials {
  name: string;
  phone?: string;
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
}

export interface AuthState {
  user: AuthUser | null;
  token: string | null;
  isLoading: boolean;
}

/** Order */
export interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
  currency: CurrencyCode;
}

export interface Order {
  id: string;
  items: OrderItem[];
  total: number;
  currency: CurrencyCode;
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  createdAt: string;
}

/** Toast notification */
export interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
  duration?: number;
}

/** Site configuration — all brand details are configurable */
export interface SiteConfig {
  brandName: string;
  tagline: string;
  secondaryMessage: string;
  contactEmail?: string;
  contactPhone?: string;
  address?: string;
  socialLinks?: {
    instagram?: string;
    facebook?: string;
    twitter?: string;
    pinterest?: string;
    youtube?: string;
  };
}

// ============================================================================
// DAMODAR JEWELLERS — API Client
// ============================================================================
// Typed API client for FastAPI REST endpoints.
// Falls back to demo data when NEXT_PUBLIC_API_BASE_URL is not configured.

import type {
  Product,
  Collection,
  ProductSearchParams,
  ApiResponse,
  LoginCredentials,
  RegisterData,
  AuthUser,
  Order,
  CartItem,
} from '@/types';
import { API_BASE_URL, IS_DEMO_MODE } from '@/lib/config';
import { demoProducts, demoCollections } from '@/lib/demo-data';

// ─── HTTP Helpers ────────────────────────────────────────────────────────────

class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

async function fetchApi<T>(
  endpoint: string,
  options: RequestInit = {},
  signal?: AbortSignal,
): Promise<T> {
  if (!API_BASE_URL) {
    throw new ApiError(0, 'API base URL is not configured. Running in demo mode.');
  }

  const url = `${API_BASE_URL}${endpoint}`;
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  // Attach auth token if available
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('auth_token');
    if (token) {
      (headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
    }
  }

  const response = await fetch(url, {
    ...options,
    headers,
    signal,
  });

  if (!response.ok) {
    const errorBody = await response.text().catch(() => 'Unknown error');
    throw new ApiError(response.status, errorBody);
  }

  return response.json() as Promise<T>;
}

// ─── Demo Data Helpers ───────────────────────────────────────────────────────

function filterDemoProducts(params?: ProductSearchParams): Product[] {
  let filtered = [...demoProducts];

  if (params?.q) {
    const query = params.q.toLowerCase();
    filtered = filtered.filter(
      (p) =>
        p.name.toLowerCase().includes(query) ||
        p.description.toLowerCase().includes(query) ||
        p.tags?.some((t) => t.toLowerCase().includes(query)),
    );
  }

  if (params?.collection) {
    filtered = filtered.filter((p) => p.collectionSlug === params.collection);
  }

  if (params?.material) {
    filtered = filtered.filter(
      (p) => p.material?.toLowerCase().includes(params.material!.toLowerCase()),
    );
  }

  if (params?.minPrice !== undefined) {
    filtered = filtered.filter((p) => p.price >= params.minPrice!);
  }

  if (params?.maxPrice !== undefined) {
    filtered = filtered.filter((p) => p.price <= params.maxPrice!);
  }

  if (params?.sort) {
    switch (params.sort) {
      case 'price_asc':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price_desc':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'name_asc':
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'name_desc':
        filtered.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case 'newest':
        // Demo data doesn't have real timestamps
        break;
    }
  }

  return filtered;
}

// ─── Public API ──────────────────────────────────────────────────────────────

/** Fetch all products with optional filtering */
export async function getProducts(
  params?: ProductSearchParams,
  signal?: AbortSignal,
): Promise<ApiResponse<Product[]>> {
  if (IS_DEMO_MODE) {
    const data = filterDemoProducts(params);
    return { data, pagination: { page: 1, pageSize: data.length, total: data.length, totalPages: 1 } };
  }

  const searchParams = new URLSearchParams();
  if (params?.q) searchParams.set('q', params.q);
  if (params?.collection) searchParams.set('collection', params.collection);
  if (params?.material) searchParams.set('material', params.material);
  if (params?.minPrice !== undefined) searchParams.set('min_price', String(params.minPrice));
  if (params?.maxPrice !== undefined) searchParams.set('max_price', String(params.maxPrice));
  if (params?.sort) searchParams.set('sort', params.sort);
  if (params?.page) searchParams.set('page', String(params.page));
  if (params?.pageSize) searchParams.set('page_size', String(params.pageSize));

  const qs = searchParams.toString();
  return fetchApi<ApiResponse<Product[]>>(`/api/products${qs ? `?${qs}` : ''}`, {}, signal);
}

/** Fetch a single product by slug */
export async function getProduct(slug: string, signal?: AbortSignal): Promise<Product> {
  if (IS_DEMO_MODE) {
    const product = demoProducts.find((p) => p.slug === slug);
    if (!product) throw new ApiError(404, `Product "${slug}" not found`);
    return product;
  }

  return fetchApi<Product>(`/api/products/${slug}`, {}, signal);
}

/** Fetch all collections */
export async function getCollections(signal?: AbortSignal): Promise<Collection[]> {
  if (IS_DEMO_MODE) {
    return demoCollections;
  }

  return fetchApi<Collection[]>('/api/collections', {}, signal);
}

/** Fetch a single collection by slug */
export async function getCollection(slug: string, signal?: AbortSignal): Promise<Collection> {
  if (IS_DEMO_MODE) {
    const collection = demoCollections.find((c) => c.slug === slug);
    if (!collection) throw new ApiError(404, `Collection "${slug}" not found`);
    return collection;
  }

  return fetchApi<Collection>(`/api/collections/${slug}`, {}, signal);
}

/** Search products */
export async function searchProducts(
  query: string,
  signal?: AbortSignal,
): Promise<ApiResponse<Product[]>> {
  return getProducts({ q: query }, signal);
}

/** Auth: Login */
export async function login(
  credentials: LoginCredentials,
  signal?: AbortSignal,
): Promise<{ user: AuthUser; token: string }> {
  if (IS_DEMO_MODE) {
    throw new ApiError(0, 'Authentication is not available in demo mode.');
  }

  return fetchApi<{ user: AuthUser; token: string }>(
    '/api/auth/login',
    { method: 'POST', body: JSON.stringify(credentials) },
    signal,
  );
}

/** Auth: Register */
export async function register(
  data: RegisterData,
  signal?: AbortSignal,
): Promise<{ user: AuthUser; token: string }> {
  if (IS_DEMO_MODE) {
    throw new ApiError(0, 'Registration is not available in demo mode.');
  }

  return fetchApi<{ user: AuthUser; token: string }>(
    '/api/auth/register',
    { method: 'POST', body: JSON.stringify(data) },
    signal,
  );
}

/** Submit order */
export async function submitOrder(
  items: CartItem[],
  signal?: AbortSignal,
): Promise<Order> {
  if (IS_DEMO_MODE) {
    throw new ApiError(0, 'Order submission is not available in demo mode. This is a demonstration only.');
  }

  return fetchApi<Order>(
    '/api/orders',
    {
      method: 'POST',
      body: JSON.stringify({
        items: items.map((item) => ({
          productId: item.product.id,
          quantity: item.quantity,
          selectedAttributes: item.selectedAttributes,
        })),
      }),
    },
    signal,
  );
}

export const apiClient = {
  getProducts,
  getProduct,
  getProductBySlug: getProduct,
  getCollections,
  getCollection,
  getCollectionBySlug: getCollection,
  searchProducts,
  login,
  register,
  createOrder: submitOrder,
  submitOrder,
};

/**
 * Shared TypeScript types for the whole app.
 * Import from here instead of redefining interfaces in every page
 * (previously `Category` was duplicated in 2 different files).
 */

export interface Category {
  _id: string;
  name: string;
  description: string;
  userId?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface ProductCategoryRef {
  _id: string;
  name: string;
}

export interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  imageUrl: string;
  categoryId: ProductCategoryRef | null;
  userId?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface TransactionItem {
  productId: string;
  productName: string;
  qty: number;
  price: number;
  subtotal: number;
}

export interface Transaction {
  _id: string;
  invoiceNumber: string;
  items: TransactionItem[];
  totalPrice: number;
  userId?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface DashboardStats {
  totalProducts: number;
  totalCategories: number;
  totalUsers: number;
  totalValue: number;
  lowStockProducts: number;
  recentProducts: Product[];
  totalTransactions: number;
  totalRevenue: number;
  todayRevenue: number;
}

/** Standard shape returned by every API route in this app: { success, data?, message? } */
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
}

export type ToastType = "success" | "error";

export interface ToastState {
  message: string;
  type: ToastType;
}

export interface ProductFormState {
  name: string;
  description: string;
  price: string;
  stock: string;
  imageUrl: string;
  categoryId: string;
}

export interface CategoryFormState {
  name: string;
  description: string;
}

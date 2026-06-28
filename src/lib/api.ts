import type {
  ApiResponse,
  Category,
  Product,
  Transaction,
  TransactionItem,
  DashboardStats,
} from "@/types";

async function apiFetch<T>(
  url: string,
  options?: RequestInit
): Promise<ApiResponse<T>> {
  try {
    const res = await fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(options?.headers || {}),
      },
    });
    return (await res.json()) as ApiResponse<T>;
  } catch (error) {
    console.error(`[api] ${options?.method || "GET"} ${url} failed:`, error);
    return { success: false, message: "Tidak dapat terhubung ke server" };
  }
}

/* ---------------------------------- Products ---------------------------------- */

export interface ProductPayload {
  name: string;
  description: string;
  price: number;
  stock: number;
  imageUrl: string;
  categoryId?: string;
}

export const productsApi = {
  list: () => apiFetch<Product[]>("/api/products"),
  create: (body: ProductPayload) =>
    apiFetch<Product>("/api/products", {
      method: "POST",
      body: JSON.stringify(body),
    }),
  update: (id: string, body: ProductPayload) =>
    apiFetch<Product>(`/api/products/${id}`, {
      method: "PUT",
      body: JSON.stringify(body),
    }),
  remove: (id: string) =>
    apiFetch<null>(`/api/products/${id}`, { method: "DELETE" }),
};

/* --------------------------------- Categories --------------------------------- */

export interface CategoryPayload {
  name: string;
  description: string;
}

export const categoriesApi = {
  list: () => apiFetch<Category[]>("/api/categories"),
  create: (body: CategoryPayload) =>
    apiFetch<Category>("/api/categories", {
      method: "POST",
      body: JSON.stringify(body),
    }),
  update: (id: string, body: CategoryPayload) =>
    apiFetch<Category>(`/api/categories/${id}`, {
      method: "PUT",
      body: JSON.stringify(body),
    }),
  remove: (id: string) =>
    apiFetch<null>(`/api/categories/${id}`, { method: "DELETE" }),
};

/* -------------------------------- Transactions --------------------------------- */

export interface TransactionPayload {
  items: TransactionItem[];
  totalPrice: number;
}

export const transactionsApi = {
  list: () => apiFetch<Transaction[]>("/api/transactions"),
  create: (body: TransactionPayload) =>
    apiFetch<Transaction>("/api/transactions", {
      method: "POST",
      body: JSON.stringify(body),
    }),
};

/* --------------------------------- Dashboard ----------------------------------- */

export const dashboardApi = {
  stats: () => apiFetch<DashboardStats>("/api/dashboard"),
};

/* ----------------------------------- Auth -------------------------------------- */

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
}

export const authApi = {
  register: (body: RegisterPayload) =>
    apiFetch<null>("/api/auth/register", {
      method: "POST",
      body: JSON.stringify(body),
    }),
};

/* ----------------------------------- Upload ------------------------------------ */

export interface UploadResult {
  success: boolean;
  url?: string;
  message?: string;
}

export async function uploadImage(file: File): Promise<UploadResult> {
  try {
    const formData = new FormData();
    formData.append("file", file);
    const res = await fetch("/api/upload", { method: "POST", body: formData });
    return (await res.json()) as UploadResult;
  } catch (error) {
    console.error("[api] upload failed:", error);
    return { success: false, message: "Gagal mengunggah gambar" };
  }
}

export interface CartItem {
  products: Product[];
  total: number;
}
 
export type PaymentMethod = "mpesa" | "credit" | "cash";
 
export interface CartTotals {
  total: number;
}
  
export interface Category {
  id: number;
  name: string;
  description: string;
  created_at: string;
  updated_at: string;
}

export interface StockProduct {
  products: Product[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  Category?: Category;
  description: string;
  image: string;
  created_at: string;
  updated_at: string;
}
 
export interface CartItem {
    products: SaleProduct[];
    payment_method: string;
    phone_number: string;
    customer_name: string;
    discount: number;
    total: number;
    tax: number;
    subtotal: number;
    total_discount: number;
    total_tax: number;
    total_subtotal: number;
    total_payment: number;
  }
 
export type PaymentMethod = "mpesa" | "credit" | "cash";

export interface SaleProduct {
    product_id: string;
    quantity: number;
    name?: string;
    unit_price?: number;
    vat_rate?: number;
    vat_amount?: number;
    available_quantity?: number;
    original_price?: number;
    discount_type?: "percentage" | "flat";
    discount_value?: number;
    discount_amount?: number;
  }

export interface CreateSalePayload {
    products: Array<{
      product_id: string;
      quantity: number;
    }>;
    payment_method: PaymentMethod;
    phone_number?: string;
    customer_name?: string;
    subtotal?: number;
    tax?: number;
    total?: number;
}

export interface CartTotals {
    discount: number;
    subtotal: number;
    tax: number;
    total: number;
    total_discount: number;
    total_tax: number;
    total_subtotal: number;
    total_payment: number;
}


  export interface Product {
    id: string;
    sku: string;
    vat: string | number;
    name: string;
    price: number;
    stock: number;
    discounts: Discount[];
    category: Category;
    category_id?: number;
    created_at: string;
    updated_at: string;
 }

 export interface Discount {
    id: string
    percentage: number
    flat_amount: number
    is_active: boolean
    created_at: Date
    updated_at: Date
  }
  
   export interface Category {
     id: number;
     name: string;
     description: string;
     created_at: string;
     updated_at: string;
   }



export interface StoreStock {
  id: string;
  product: Product;
  quantity: number;
  remarks: string | null;
  created_at: string;
}

export type ProductStock = StoreStock;

export interface ProductStockResponse {
  stock: ProductStock[];
  total: number;
  page: number;
  limit: number;
  pages: number;
}
 


export interface GeneralSale {
  id: string; 
  store: Store;
  cashier: Cashier | null;
  total_amount: string;
  discount_amount: string;
  payable_amount: string;
  items: SaleItem[];
  payments: Payment[];
  status: string;
  customer_name: string | null;
  created_at: string;
}
 

export interface Store {
  id: string;
  name: string;
  location: string;
  created_at: string;
  updated_at: string;
}

export interface Cashier {
  id: string;
  name: string;
  email: string; 
  phone_number: string;
  created_at: string;
  updated_at: string;
}
  
export interface SaleItem {
  id: number;
  quantity: number;
  price: string;
  total: string;
}
  

export interface Payment {
  id: string;
  payment_method: string;
  amount: string;
  status: string;
  mpesa_checkout_request_id: string | null;
  mpesa_receipt_number: string | null;
  mpesa_phone_number: string;
  mpesa_merchant_request_id: string | null;
  card_transaction_id: string | null;
  card_holder_name: string | null;
  card_last4: string | null;
  card_transaction_date: string | null;
  created_at: string;
  updated_at: string;
}




export interface Staff {
  id: string;
  name: string;
  email: string;
  password: string;
  role: string;
  store: Store;
  is_active: boolean;
  last_login: string | null;
  created_at: string;
  updated_at: string;
}


export interface Product {
  id: string;
  sku: string;
  name: string;
  price: number;
  stock: number;
  vat: string | number;
  discounts: Discount[];
  category: Category;
  category_id?: number;
  created_at: string;
  updated_at: string;
}

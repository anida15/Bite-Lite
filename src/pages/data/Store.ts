import { create } from "zustand";
import { persist } from "zustand/middleware";
import { UniversalEncryptedStorage } from "@/lib/encypted-storage";
import { CartItem, CartTotals, Product } from "./types";

interface StoreInterface {
  cartItems: CartItem[];
  setCartItems: (cartItems: CartItem[]) => void;
  resetStore: () => void;
}

const initialCartState: Pick<StoreInterface, "cartItems"> = {
  cartItems: [] as CartItem[],
};

// Cart product extends Product with quantity for cart operations
export interface CartProduct extends Product {
  quantity: number;
}

export const computeCartTotals = (products: (Product | CartProduct)[]): CartTotals => {
  const accumulator = products.reduce(
    (acc, item) => {
      const unitPrice = item.price ?? 0;
      const quantity = 'quantity' in item ? item.quantity : 1;
      const lineSubtotal = unitPrice * quantity;
      acc.subtotal += lineSubtotal;
      return acc;
    },
    {
      subtotal: 0,
    },
  );
  const total = accumulator.subtotal;
  return {
    total,
  };
};

const useStore = create<StoreInterface>()(
  persist(
    (set) => ({
      ...initialCartState,
      setCartItems: (cartItems: CartItem[]) => set({ cartItems }),
      resetStore: () => set(initialCartState),
    }),
    {
      name: "cart-store",
      storage: UniversalEncryptedStorage,
      partialize: (state) => ({
        cartItems: state.cartItems,
      }),
    },
  ),
);

export default useStore;

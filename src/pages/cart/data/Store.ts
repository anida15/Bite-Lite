import { create } from "zustand";
import { persist } from "zustand/middleware";
import { UniversalEncryptedStorage } from "@/lib/encypted-storage";
import { CartItem, CartTotals, SaleProduct } from "./types";

interface StoreInterface {
  cartItems: CartItem[];
  setCartItems: (cartItems: CartItem[]) => void;
  resetStore: () => void;
}

const initialCartState: Pick<StoreInterface, "cartItems"> = {
  cartItems: [] as CartItem[],
};

export const computeCartTotals = (products: SaleProduct[]): CartTotals => {
  const accumulator = products.reduce(
    (acc, item) => {
      const unitPrice = item.unit_price ?? 0;
      const quantity = item.quantity ?? 0;
      const vatRate = item.vat_rate ?? 0;
      const vatDecimal = vatRate / 100;
      const originalUnitPrice = item.original_price ?? unitPrice;
      const perUnitDiscount = Math.max(originalUnitPrice - unitPrice, 0);

      const lineSubtotal = unitPrice * quantity;
      const originalLineSubtotal = originalUnitPrice * quantity;
      const lineDiscount = perUnitDiscount * quantity;
      const lineTax = lineSubtotal * vatDecimal;

      acc.subtotal += lineSubtotal;
      acc.originalSubtotal += originalLineSubtotal;
      acc.tax += lineTax;
      acc.discount += lineDiscount;
      return acc;
    },
    {
      subtotal: 0,
      tax: 0,
      discount: 0,
      originalSubtotal: 0,
    },
  );

  const total = accumulator.subtotal + accumulator.tax;

  return {
    discount: accumulator.discount,
    subtotal: accumulator.subtotal,
    tax: accumulator.tax,
    total,
    total_discount: accumulator.discount,
    total_tax: accumulator.tax,
    total_subtotal: accumulator.originalSubtotal,
    total_payment: total,
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
      name: "sale-store",
      storage: UniversalEncryptedStorage,
      partialize: (state) => ({
        cartItems: state.cartItems,
      }),
    },
  ),
);

export default useStore;

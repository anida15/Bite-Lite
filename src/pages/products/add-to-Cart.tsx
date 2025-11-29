"use client";

import { useEffect, useMemo, useState } from "react";
import { Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from "@heroui/modal";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { Divider } from "@heroui/react";
import { ShoppingCart, X } from "lucide-react";

import { useMessage } from "@/contexts/message-context";
import useStore, { computeCartTotals, type CartProduct } from "@/pages/data/Store";
import type { CartItem, Product } from "@/pages/data/types";

interface AddToCartProps {
  isOpen: boolean;
  onClose: () => void;
  productStock: Product;
}

const AddToCart = ({ isOpen, onClose, productStock }: AddToCartProps) => {
  const { showMessage } = useMessage();
  const { cartItems, setCartItems } = useStore();

  const [quantity, setQuantity] = useState<number>(1);

  useEffect(() => {
    if (isOpen) {
      setQuantity(1);
    }
  }, [isOpen, productStock]);

  const formatCurrency = useMemo(
    () =>
      new Intl.NumberFormat("en-NG", {
        style: "currency",
        currency: "KES",
        minimumFractionDigits: 0,
      }),
    [],
  );

 

  const unitPrice = useMemo(() => {
    return productStock.price;
  }, [productStock.price]);

  const originalUnitPrice = productStock.price;
  const perUnitDiscount = Math.max(originalUnitPrice - unitPrice, 0);
 
  const vatRate = 0;
  const unitVatAmount = unitPrice * (vatRate / 100);
  const subtotalAmount = unitPrice * quantity;
  const vatAmount = unitVatAmount * quantity;
  const totalAmount = subtotalAmount + vatAmount;

  const availableStock = 999;  

  const handleQuantityChange = (nextValue: number) => {
    if (!Number.isFinite(nextValue)) return;
    const boundedValue = Math.max(1, Math.min(availableStock, Math.floor(nextValue)));
    setQuantity(boundedValue);
  };

  const handleAddToCart = () => {
    if (quantity < 1) {
      showMessage("Please enter a valid quantity.", "warning");
      return;
    }

    if (quantity > availableStock) {
      showMessage("Quantity exceeds available stock.", "warning");
      return;
    }

    const existingCart = cartItems[0];
    const existingProducts = existingCart ? [...existingCart.products] : [];
    const existingProductIndex = existingProducts.findIndex(
      (item) => item.id === productStock.id,
    );
    const existingQuantity =
      existingProductIndex !== -1 ? (existingProducts[existingProductIndex] as CartProduct).quantity : 0;

    if (quantity + existingQuantity > availableStock) {
      const remaining = Math.max(availableStock - existingQuantity, 0);
      showMessage(
        remaining > 0
          ? `Only ${remaining} more unit${remaining === 1 ? "" : "s"} available for ${
              productStock.name
            }.`
          : "You already have the maximum available quantity for this product in your cart.",
        "warning",
      );
      return;
    }

    const cartProduct: CartProduct = {
      ...productStock,
      quantity,
    };

    if (existingCart) {
      if (existingProductIndex !== -1) {
        const updatedQuantity = existingQuantity + cartProduct.quantity;
        existingProducts[existingProductIndex] = {
          ...existingProducts[existingProductIndex],
          quantity: updatedQuantity,
        } as CartProduct;
      } else {
        existingProducts.push(cartProduct);
      }

      const totals = computeCartTotals(existingProducts);

      const updatedCart: CartItem = {
        products: existingProducts,
        total: totals.total,
      };

      setCartItems([updatedCart, ...cartItems.slice(1)]);
    } else {
      const totals = computeCartTotals([cartProduct]);

      const newCart: CartItem = {
        products: [cartProduct],
        total: totals.total,
      };

      setCartItems([newCart]);
    }

    showMessage(`${productStock.name} added to cart.`, "success");
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={(open) => {
        if (!open) {
          onClose();
        }
      }}
      size="md"
      classNames={{ base: "max-h-[90vh]" }}
    >
      <ModalContent>
        {(modalClose) => (
          <>
            <ModalHeader className="flex items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold text-foreground">Add to Cart</h2>
                <p className="text-xs sm:text-sm text-default-500">
                  Enter the quantity you want to add for this product.
                </p>
              </div>
              <Button
                isIconOnly
                variant="light"
                radius="full"
                onPress={() => {
                  onClose();
                  modalClose();
                }}
              >
                <X className="h-5 w-5" />
              </Button>
            </ModalHeader>

            <ModalBody className="space-y-5">
              <div className="rounded-lg border border-default-200 bg-default-50 p-4">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                  <div className="space-y-1">
                    <p className="text-sm sm:text-base font-semibold text-foreground">
                      {productStock.name}
                    </p>
                    <p className="text-xs text-default-500">
                      ID: {productStock.id}
                    </p>
                  </div>
                  <span className="self-start rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                    In stock: {availableStock}
                  </span>
                </div>
                <Divider className="my-3" />
                <div className="flex flex-wrap items-center gap-3 text-xs sm:text-sm text-default-500">
                  <span>
                    Unit price:{" "}
                    <span className="font-semibold text-foreground">
                      {formatCurrency.format(unitPrice)}
                    </span>
                  </span>
                  {perUnitDiscount > 0 && (
                    <span className="text-default-400 line-through">
                      {formatCurrency.format(originalUnitPrice)}
                    </span>
                  )}
                  <span>
                    VAT rate:{" "}
                    <span className="font-semibold text-foreground">
                      {vatRate ? `${vatRate}%` : "0%"}
                    </span>
                  </span>
                </div>
              </div>

              <div className="grid gap-3">
                <Input
                  type="number"
                  label="Quantity"
                  labelPlacement="outside"
                  placeholder="Enter quantity"
                  classNames={{ inputWrapper: "border border-default-200" }}
                  value={quantity ? String(quantity) : ""}
                  min={1}
                  max={availableStock}
                  onChange={(event) => handleQuantityChange(Number(event.target.value))}
                />

                <div className="rounded-lg border border-default-200 bg-background px-4 py-3 space-y-2">
                  <div className="flex items-center justify-between text-sm text-default-500">
                    <span>Subtotal</span>
                    <span className="text-foreground font-medium">
                      {formatCurrency.format(subtotalAmount || 0)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm text-default-500">
                    <span>VAT ({vatRate || 0}%)</span>
                    <span className="text-foreground font-medium">
                      {formatCurrency.format(vatAmount || 0)}
                    </span>
                  </div>
                  <Divider className="my-1" />
                  <div className="flex items-center justify-between text-base font-semibold text-foreground">
                    <span>Total</span>
                    <span>{formatCurrency.format(totalAmount || 0)}</span>
                  </div>
                </div>
              </div>
            </ModalBody>

            <ModalFooter className="flex items-center justify-end gap-3">
              <Button
                variant="light"
                onPress={() => {
                  onClose();
                  modalClose();
                }}
              >
                Cancel
              </Button>
              <Button
                color="primary"
                className="min-w-28"
                endContent={<ShoppingCart className="h-4 w-4" />}
                onPress={handleAddToCart}
                isDisabled={quantity < 1 || quantity > availableStock}
              >
                Add
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default AddToCart;
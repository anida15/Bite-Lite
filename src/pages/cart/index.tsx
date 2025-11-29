"use client";

import { useEffect, useMemo } from "react";
import { Button } from "@heroui/button";
import { Divider } from "@heroui/react";
import { Input } from "@heroui/input";
import { Link, useNavigate } from "react-router-dom";
import { Minus, Plus, ShoppingCart, Trash2 } from "lucide-react";

import useStore, { computeCartTotals, type CartProduct } from "@/pages/data/Store";
import { useBreadcrumb } from "@/contexts/breadcrumb-context";
import { useMessage } from "@/contexts/message-context";

const breadcrumbItems = [
  { label: "Orders", href: "/sales/orders" },
  { label: "Cart", href: "/sales/cart" },
];

const Cart = () => {
  const { setItems } = useBreadcrumb();
  const { showMessage } = useMessage();
  const { cartItems, setCartItems, resetStore } = useStore();
  const navigate = useNavigate();
  const cart = cartItems[0];
  const products = cart?.products ?? [];

  useEffect(() => {
    setItems(breadcrumbItems);
  }, [setItems]);

  const currencyFormatter = useMemo(
    () =>
      new Intl.NumberFormat("en-NG", {
        style: "currency",
        currency: "KES",
        minimumFractionDigits: 0,
      }),
    [],
  );

  const computedTotals = useMemo(() => computeCartTotals(products), [products]);

  const subtotal = computedTotals.total;
  const vatTotal = 0; // VAT removed in simplified version
  const discountTotal = 0; // Discount removed in simplified version
  const originalSubtotal = subtotal;
  const grandTotal = subtotal + vatTotal;

  const totalItems = useMemo(
    () => products.reduce((count, item) => count + ((item as CartProduct).quantity ?? 1), 0),
    [products],
  );

  const applyCartUpdate = (updatedProducts: typeof products) => {
    if (!cart) return;
    if (updatedProducts.length === 0) {
      setCartItems(cartItems.slice(1));
      return;
    }
    const totals = computeCartTotals(updatedProducts);
    setCartItems([
      {
        products: updatedProducts,
        total: totals.total,
      },
      ...cartItems.slice(1),
    ]);
  };

  const handleRemoveProduct = (productId: string) => {
    if (!cart) return;
    const filteredProducts = cart.products.filter(
      (product) => product.id !== productId,
    );
    applyCartUpdate(filteredProducts);
  };

  const handleSetQuantity = (productId: string, nextQuantity: number) => {
    if (!cart) return;
    const productIndex = cart.products.findIndex((item) => item.id === productId);
    if (productIndex === -1) return;

    const product = cart.products[productIndex] as CartProduct;
    const maxQuantity = Number.MAX_SAFE_INTEGER; // Stock check removed in simplified version

    if (!Number.isFinite(nextQuantity)) {
      return;
    }

    const clampedQuantity = Math.floor(nextQuantity);

    if (clampedQuantity <= 0) {
      handleRemoveProduct(productId);
      return;
    }

    if (clampedQuantity > maxQuantity) {
      showMessage(
        `Only ${maxQuantity} unit${maxQuantity === 1 ? "" : "s"} available for ${
          product.name || "this product"
        }.`,
        "warning",
      );
      applyCartUpdate(
        cart.products.map((item, index) =>
          index === productIndex ? { ...item, quantity: maxQuantity } as CartProduct : item,
        ),
      );
      return;
    }

    const updatedProducts = cart.products.map((item, index) =>
      index === productIndex ? { ...item, quantity: clampedQuantity } as CartProduct : item,
    );

    applyCartUpdate(updatedProducts);
  };

  const handleIncrement = (productId: string) => {
    if (!cart) return;
    const product = cart.products.find((item) => item.id === productId) as CartProduct;
    if (!product) return;
    handleSetQuantity(productId, (product.quantity ?? 1) + 1);
  };

  const handleDecrement = (productId: string) => {
    if (!cart) return;
    const product = cart.products.find((item) => item.id === productId) as CartProduct;
    if (!product) return;
    handleSetQuantity(productId, (product.quantity ?? 1) - 1);
  };

  const handleClearCart = () => {
    resetStore();
  };

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-8">
      <header className="flex flex-col gap-1">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
            <ShoppingCart className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-sm font-semibold text-foreground  ">
              Shopping Cart
            </h1>
            <p className="text-xs text-default-500">
              {totalItems > 0
                ? `${totalItems} item${totalItems > 1 ? "s" : ""} in your cart`
                : "Review items you’ve added to your cart."}
            </p>
          </div>
        </div>
        {products.length > 0 && (
          <div className="flex flex-wrap gap-2">
            <Button
              variant="light"
              size="sm"
              onPress={handleClearCart}
              className="text-danger"
            >
              Clear cart
            </Button>
            <Link to="/sales/orders">
              <Button variant="flat" size="sm">
                Continue shopping
              </Button>
            </Link>
          </div>
        )}
      </header>

      {products.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-default-200 bg-default-50 px-4 py-4 text-center">
          <ShoppingCart className="mb-4 h-12 w-12 text-default-300" />
          <h2 className="text-lg font-semibold text-foreground">
            Your cart is empty
          </h2>
          <p className="mt-2 max-w-sm text-sm text-default-500">
            Explore our products and find something that catches your eye.
          </p>
          <Link to="/" className="mt-6">
            <Button color="primary" variant="solid">
              Browse products
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
          <div className="space-y-2">
            {products.map((product) => {
              const cartProduct = product as CartProduct;
              const unitPrice = cartProduct.price ?? 0;
              const quantity = cartProduct.quantity ?? 1;
              const productTotal = unitPrice * quantity;

              return (
                <div
                  key={cartProduct.id}
                  className="rounded-xl border border-default-200 bg-background p-4 shadow-sm"
                >
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div className="space-y-1">
                      <h3 className="text-base font-semibold text-foreground sm:text-lg">
                        {cartProduct.name || "Unnamed product"}
                      </h3>
                      <p className="text-xs uppercase tracking-widest text-default-400">
                        ID: {cartProduct.id}
                      </p>
                    </div>

                    <Button
                      variant="light"
                      size="sm"
                      className="self-start text-danger"
                      startContent={<Trash2 className="h-4 w-4" />}
                      onPress={() => handleRemoveProduct(cartProduct.id)}
                    >
                      Remove
                    </Button>
                  </div>

                  <Divider className="my-3" />

                  <div className="flex flex-wrap items-center gap-4 text-sm text-default-500">
                    <div className="flex items-center gap-2">
                      <Button
                        isIconOnly
                        size="sm"
                        variant="light"
                        aria-label="Decrease quantity"
                        onPress={() => handleDecrement(cartProduct.id)}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <Input
                        type="number"
                        value={String(quantity)}
                        onChange={(event) =>
                          handleSetQuantity(
                            cartProduct.id,
                            Number(event.target.value),
                          )
                        }
                        className="w-20"
                        min={1}
                      />
                      <Button
                        isIconOnly
                        size="sm"
                        variant="light"
                        aria-label="Increase quantity"
                        onPress={() => handleIncrement(cartProduct.id)}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    <span>
                      Unit price:{" "}
                      <span className="font-medium text-foreground">
                        {currencyFormatter.format(unitPrice)}
                      </span>
                    </span>
                    <span className="ml-auto text-base font-semibold text-foreground">
                      {currencyFormatter.format(productTotal)}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          <aside className="h-full rounded-xl border border-default-200 bg-background p-5 shadow-md">
            <h2 className="text-lg font-semibold text-foreground">Order Summary</h2>
            <Divider className="my-4" />
            <div className="space-y-3 text-sm text-default-500">
              <div className="flex items-center justify-between">
                <span>Subtotal</span>
                <span className="font-semibold text-foreground">
                  {currencyFormatter.format(subtotal)}
                </span>
              </div>
              {discountTotal > 0 && (
                <div className="flex items-center justify-between text-success">
                  <span>Discount</span>
                  <span className="font-semibold">
                    -{currencyFormatter.format(discountTotal)}
                  </span>
                </div>
              )}
              <div className="flex items-center justify-between">
                <span>VAT</span>
                <span className="font-semibold text-foreground">
                  {currencyFormatter.format(vatTotal)}
                </span>
              </div>
            </div>
            <Divider className="my-4" />
            <div className="flex items-center justify-between text-base font-semibold text-foreground">
              <span>Total (incl. VAT)</span>
              <span>{currencyFormatter.format(grandTotal)}</span>
            </div>
            {discountTotal > 0 && (
              <p className="mt-2 text-xs text-default-400">
                You saved {currencyFormatter.format(discountTotal)} off the original total of {currencyFormatter.format(originalSubtotal)}.
              </p>
            )}
            <Button
              color="success"
              variant="solid"
              className="mt-5 w-full"
              isDisabled={products.length === 0}
              onPress={() => navigate("/sales/checkout")}
            >
              Proceed to checkout
            </Button>
          </aside>
        </div>
      )}
    </div>
  );
};

export default Cart;